import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQueries = [
  "Как писать эссе?",
  "IELTS или TOEFL?",
  "Как поступить в MIT?",
  "Сроки подачи",
];

const Counselor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Привет! Я Qadam AI 🎓 Чем могу помочь с поступлением в университет? Спрашивай о любых вопросах — от выбора вуза до написания эссе!",
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
    if (lowerQuery.includes("эссе")) {
      return "Эссе — это ваш шанс показать себя! Вот главные советы:\n\n1. **Будьте искренними** — приёмная комиссия ценит подлинность\n2. **Расскажите историю** — конкретный пример лучше общих слов\n3. **Покажите рост** — как вы изменились и что узнали\n\nХотите разобрать структуру эссе подробнее?";
    }
    if (lowerQuery.includes("ielts") || lowerQuery.includes("toefl")) {
      return "Оба теста принимаются большинством университетов! \n\n**IELTS** популярнее в UK, Европе и Австралии\n**TOEFL** — традиционно выбор для США\n\nВыбирайте тот, формат которого вам ближе. Нужен план подготовки?";
    }
    if (lowerQuery.includes("mit")) {
      return "MIT — одна из самых престижных школ! Для поступления важно:\n\n• GPA 3.9+ и сильные AP/IB курсы\n• SAT 1550+ или ACT 35+\n• Олимпиады, исследования, проекты\n• Уникальные эссе и рекомендации\n\nШанс поступления ~4%, но с Qadam всё возможно! 💪";
    }
    return "Отличный вопрос! Чтобы дать максимально полезный ответ, расскажите подробнее:\n\n• В какую страну планируете поступать?\n• На какую специальность?\n• Какой у вас текущий уровень (класс, оценки)?\n\nТак я смогу составить персональный план именно для вас!";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex-shrink-0">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold">AI Counselor</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
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
              className={`flex gap-3 animate-slide-up ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-muted"
                    : "gradient-primary"
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
                  className="chip bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
              placeholder="Спроси об университетах..."
              className="flex-1 h-12 rounded-full px-5"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-full"
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
