import { Quote, Star } from "lucide-react";
import { useLandingLanguage, landingTranslations } from "@/hooks/useLandingLanguage";

export function TestimonialsSection() {
  const { language } = useLandingLanguage();
  const t = landingTranslations[language];

  const testimonials = [
    {
      quote: t.testimonial1Quote,
      author: t.testimonial1Author,
      university: t.testimonial1Uni,
    },
    {
      quote: t.testimonial2Quote,
      author: t.testimonial2Author,
      university: t.testimonial2Uni,
    },
  ];

  return (
    <section className="py-20 px-4 bg-secondary/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/10 rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-accent/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 animate-fade-in">
          {t.successStories}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-in hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-primary">
                  {testimonial.author[0]}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-xp text-xp" />
                    {testimonial.university}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
