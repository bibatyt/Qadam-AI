import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Благодаря Qadam я подготовил идеальное эссе и получил стипендию в НИШ. AI-советник помог на каждом шаге!",
    author: "Алмас М.",
    university: "NU",
  },
  {
    quote: "Раньше я не знала с чего начать. Qadam дал мне чёткий план и уверенность. И сейчас учусь на гранте в столице Турции",
    author: "Дана К.",
    university: "Bilkent",
  },
  {
    quote: "Система геймификации мотивировала меня готовиться каждый день. Серия в 90 дней помогла мне набрать 1500+ на SAT!",
    author: "Тимур А.",
    university: "MIT",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Истории успеха
        </h2>
        
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="bg-card rounded-2xl p-6 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
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
