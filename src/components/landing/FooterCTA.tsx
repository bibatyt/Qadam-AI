import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function FooterCTA() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Готов начать свой путь?
        </h2>
        <p className="text-muted-foreground mb-8">
          Присоединяйся к тысячам студентов, которые уже на пути к университету мечты
        </p>
        <Link to="/auth">
          <Button variant="hero" size="lg">
            Начать бесплатно
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
