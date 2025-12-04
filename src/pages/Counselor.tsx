import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Counselor = () => {
  const { t, language } = useLanguage();
  
  const suggestedQueries = [
    t("howToWriteEssay"),
    t("ieltsOrToefl"),
    t("howToApply"),
    t("deadlines"),
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t("aiGreeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: t("aiGreeting"),
    }]);
  }, [language]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response - replace with real Gemini API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(messageText),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("эссе") || lowerQuery.includes("essay")) {
      return language === "ru" 
        ? "Эссе — это ваш шанс показать себя! Вот главные советы:\n\n1. **Будьте искренними** — приёмная комиссия ценит подлинность\n2. **Расскажите историю** — конкретный пример лучше общих слов\n3. **Покажите рост** — как вы изменились и что узнали\n\nХотите разобрать структуру эссе подробнее?"
        : language === "kk"
        ? "Эссе — өзіңізді көрсету мүмкіндігі! Міне басты кеңестер:\n\n1. **Шынайы болыңыз** — комиссия шынайылықты бағалайды\n2. **Әңгіме айтыңыз** — нақты мысал жалпы сөздерден жақсы\n3. **Өсіміңізді көрсетіңіз** — қалай өзгердіңіз және не үйрендіңіз"
        : "Essay is your chance to show yourself! Here are key tips:\n\n1. **Be authentic** — admissions committees value authenticity\n2. **Tell a story** — specific examples beat general statements\n3. **Show growth** — how you changed and what you learned\n\nWant me to break down essay structure in detail?";
    }
    if (lowerQuery.includes("ielts") || lowerQuery.includes("toefl")) {
      return language === "ru"
        ? "Оба теста принимаются большинством университетов! \n\n**IELTS** популярнее в UK, Европе и Австралии\n**TOEFL** — традиционно выбор для США\n\nВыбирайте тот, формат которого вам ближе. Нужен план подготовки?"
        : language === "kk"
        ? "Екі тест те көптеген университеттерде қабылданады!\n\n**IELTS** UK, Еуропа және Австралияда танымал\n**TOEFL** — АҚШ үшін дәстүрлі таңдау\n\nСізге жақын форматты таңдаңыз. Дайындық жоспары қажет пе?"
        : "Both tests are accepted by most universities!\n\n**IELTS** is more popular in UK, Europe, and Australia\n**TOEFL** is traditionally the choice for the USA\n\nChoose the one whose format suits you better. Need a preparation plan?";
    }
    if (lowerQuery.includes("mit") || lowerQuery.includes("harvard") || lowerQuery.includes("поступить") || lowerQuery.includes("apply")) {
      return language === "ru"
        ? "Для поступления в топовые университеты важно:\n\n• GPA 3.9+ и сильные AP/IB курсы\n• SAT 1550+ или ACT 35+\n• Олимпиады, исследования, проекты\n• Уникальные эссе и рекомендации\n\nШанс поступления ~4-6%, но с Qadam всё возможно! 💪"
        : language === "kk"
        ? "Үздік университеттерге түсу үшін маңызды:\n\n• GPA 3.9+ және күшті AP/IB курстар\n• SAT 1550+ немесе ACT 35+\n• Олимпиадалар, зерттеулер, жобалар\n• Бірегей эссе және ұсыныстар\n\nТүсу мүмкіндігі ~4-6%, бірақ Qadam-мен бәрі мүмкін! 💪"
        : "For admission to top universities, it's important:\n\n• GPA 3.9+ and strong AP/IB courses\n• SAT 1550+ or ACT 35+\n• Olympiads, research, projects\n• Unique essays and recommendations\n\nAcceptance rate is ~4-6%, but with Qadam everything is possible! 💪";
    }
    return language === "ru"
      ? "Отличный вопрос! Чтобы дать максимально полезный ответ, расскажите подробнее:\n\n• В какую страну планируете поступать?\n• На какую специальность?\n• Какой у вас текущий уровень?\n\nТак я смогу составить персональный план именно для вас!"
      : language === "kk"
      ? "Керемет сұрақ! Ең пайдалы жауап беру үшін толығырақ айтыңыз:\n\n• Қай елге түсуді жоспарлайсыз?\n• Қандай мамандыққа?\n• Қазіргі деңгейіңіз қандай?\n\nОсылайша мен сізге жеке жоспар құра аламын!"
      : "Great question! To give you the most helpful answer, tell me more:\n\n• Which country are you planning to apply to?\n• What major?\n• What's your current level?\n\nThis way I can create a personalized plan just for you!";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex-shrink-0">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-extrabold">{t("aiCounselor")}</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">{t("online")}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="container max-w-lg mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-muted"
                    : "gradient-primary shadow-primary"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "bg-muted border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-line font-medium">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 border border-border">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Queries */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="container max-w-lg mx-auto">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => handleSend(query)}
                  className="chip bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-card border-t border-border px-4 py-4 flex-shrink-0 mb-16">
        <div className="container max-w-lg mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("askAboutUniversities")}
              className="flex-1 h-12 rounded-full px-5 font-medium"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-full shadow-primary"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Counselor;