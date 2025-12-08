import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center h-14 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Оставить отзыв</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Оставить отзыв</h2>
            <p className="text-muted-foreground">Ваше мнение помогает нам стать лучше</p>
          </div>

          {/* Embedded Google Form */}
          <div className="w-full overflow-hidden rounded-xl bg-card border border-border/50">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSe4grrh1NRN59JXJElnW2ROqk2KlCHdfCerqHPNTNSGyd6jGg/viewform?embedded=true"
              width="100%"
              height="1100"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              style={{ border: "none", maxWidth: "100%", minHeight: "600px" }}
              title="Форма отзыва"
            >
              Загрузка…
            </iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
