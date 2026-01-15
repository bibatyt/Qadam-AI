import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  type: 'verification' | 'welcome' | 'password_reset';
  name?: string;
  verificationCode?: string;
  resetLink?: string;
  language?: 'en' | 'ru' | 'kk' | 'kz';
}

const translations = {
  en: {
    verification: {
      subject: "Verify your email - Qadam",
      title: "Email Verification",
      greeting: (name: string) => `Hello${name ? `, ${name}` : ''}!`,
      message: "Thank you for signing up with Qadam. Please use the following code to verify your email:",
      codeLabel: "Your verification code:",
      expiry: "This code will expire in 1 hour.",
      ignore: "If you didn't create an account, you can safely ignore this email.",
      footer: "Qadam - Your Path to Study Abroad"
    },
    welcome: {
      subject: "Welcome to Qadam!",
      title: "Welcome to Qadam!",
      greeting: (name: string) => `Hello${name ? `, ${name}` : ''}!`,
      message: "Your account has been successfully verified. Start your journey to study abroad today!",
      cta: "Get Started",
      footer: "Qadam - Your Path to Study Abroad"
    },
    passwordReset: {
      subject: "Reset your password - Qadam",
      title: "Password Reset",
      greeting: (name: string) => `Hello${name ? `, ${name}` : ''}!`,
      message: "We received a request to reset your password. Click the button below to set a new password:",
      cta: "Reset Password",
      expiry: "This link will expire in 1 hour.",
      ignore: "If you didn't request this, you can safely ignore this email.",
      footer: "Qadam - Your Path to Study Abroad"
    }
  },
  ru: {
    verification: {
      subject: "Подтвердите email - Qadam",
      title: "Подтверждение Email",
      greeting: (name: string) => `Привет${name ? `, ${name}` : ''}!`,
      message: "Спасибо за регистрацию в Qadam. Используйте этот код для подтверждения email:",
      codeLabel: "Ваш код подтверждения:",
      expiry: "Код действителен 1 час.",
      ignore: "Если вы не создавали аккаунт, просто проигнорируйте это письмо.",
      footer: "Qadam - Твой путь к обучению за рубежом"
    },
    welcome: {
      subject: "Добро пожаловать в Qadam!",
      title: "Добро пожаловать в Qadam!",
      greeting: (name: string) => `Привет${name ? `, ${name}` : ''}!`,
      message: "Ваш email успешно подтверждён. Начните свой путь к обучению за рубежом уже сегодня!",
      cta: "Начать",
      footer: "Qadam - Твой путь к обучению за рубежом"
    },
    passwordReset: {
      subject: "Сброс пароля - Qadam",
      title: "Сброс пароля",
      greeting: (name: string) => `Привет${name ? `, ${name}` : ''}!`,
      message: "Мы получили запрос на сброс пароля. Нажмите кнопку ниже чтобы установить новый пароль:",
      cta: "Сбросить пароль",
      expiry: "Ссылка действительна 1 час.",
      ignore: "Если вы не запрашивали сброс, просто проигнорируйте это письмо.",
      footer: "Qadam - Твой путь к обучению за рубежом"
    }
  },
  kk: {
    verification: {
      subject: "Email-ді растаңыз - Qadam",
      title: "Email растау",
      greeting: (name: string) => `Сәлем${name ? `, ${name}` : ''}!`,
      message: "Qadam-ға тіркелгеніңіз үшін рахмет. Email-ді растау үшін осы кодты пайдаланыңыз:",
      codeLabel: "Сіздің растау кодыңыз:",
      expiry: "Код 1 сағат жарамды.",
      ignore: "Егер сіз тіркелмеген болсаңыз, бұл хатты елемеңіз.",
      footer: "Qadam - Шетелде оқуға жолыңыз"
    },
    welcome: {
      subject: "Qadam-ға қош келдіңіз!",
      title: "Qadam-ға қош келдіңіз!",
      greeting: (name: string) => `Сәлем${name ? `, ${name}` : ''}!`,
      message: "Email-іңіз сәтті расталды. Шетелде оқуға жолыңызды бүгін бастаңыз!",
      cta: "Бастау",
      footer: "Qadam - Шетелде оқуға жолыңыз"
    },
    passwordReset: {
      subject: "Құпия сөзді қалпына келтіру - Qadam",
      title: "Құпия сөзді қалпына келтіру",
      greeting: (name: string) => `Сәлем${name ? `, ${name}` : ''}!`,
      message: "Құпия сөзді қалпына келтіру сұрауын алдық. Жаңа құпия сөз орнату үшін төмендегі батырманы басыңыз:",
      cta: "Құпия сөзді қалпына келтіру",
      expiry: "Сілтеме 1 сағат жарамды.",
      ignore: "Егер сіз сұрау жасамаған болсаңыз, бұл хатты елемеңіз.",
      footer: "Qadam - Шетелде оқуға жолыңыз"
    }
  }
};

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateVerificationEmail(t: typeof translations.en.verification, name: string, code: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Qadam</h1>
        </div>
        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">${t.title}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            ${t.greeting(name)}
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            ${t.message}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">${t.codeLabel}</p>
          <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #6366f1; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px 0;">${t.expiry}</p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">${t.ignore}</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          ${t.footer}
        </p>
      </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmail(t: typeof translations.en.welcome, name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Qadam</h1>
        </div>
        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">${t.title}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            ${t.greeting(name)}
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            ${t.message}
          </p>
          <div style="text-align: center;">
            <a href="https://rkggdunciqrvzepwhrzc.lovableproject.com/path" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              ${t.cta}
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          ${t.footer}
        </p>
      </div>
    </body>
    </html>
  `;
}

function generatePasswordResetEmail(t: typeof translations.en.passwordReset, name: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Qadam</h1>
        </div>
        <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">${t.title}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            ${t.greeting(name)}
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            ${t.message}
          </p>
          <div style="text-align: center; margin: 0 0 24px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              ${t.cta}
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px 0;">${t.expiry}</p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">${t.ignore}</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          ${t.footer}
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, name = '', verificationCode, resetLink, language = 'en' }: EmailRequest = await req.json();

    // Support both 'kk' and 'kz' language codes for Kazakh
    const langKey = language === 'kz' ? 'kk' : language;
    const t = translations[langKey as keyof typeof translations] || translations.en;
    let subject: string;
    let html: string;
    let code = verificationCode;

    // For verification emails, generate and store code
    if (type === 'verification') {
      code = generateVerificationCode();
      
      // Store code in database
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Delete any existing codes for this email
      await supabase
        .from('email_verification_codes')
        .delete()
        .eq('email', to);
      
      // Insert new code
      const { error: insertError } = await supabase
        .from('email_verification_codes')
        .insert({
          email: to,
          code: code,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        });
      
      if (insertError) {
        console.error("Error storing verification code:", insertError);
        throw new Error("Failed to create verification code");
      }
    }

    switch (type) {
      case 'verification':
        subject = t.verification.subject;
        html = generateVerificationEmail(t.verification, name, code!);
        break;
      case 'welcome':
        subject = t.welcome.subject;
        html = generateWelcomeEmail(t.welcome, name);
        break;
      case 'password_reset':
        subject = t.passwordReset.subject;
        html = generatePasswordResetEmail(t.passwordReset, name, resetLink || '');
        break;
      default:
        throw new Error('Invalid email type');
    }

    console.log(`Sending ${type} email to ${to}`);

    const { data, error } = await resend.emails.send({
      from: "Qadam <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
