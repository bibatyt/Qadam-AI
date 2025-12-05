import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Counselor = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
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
  const [threadId, setThreadId] = useState<string | null>(null);
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
    // Reset thread when language changes for fresh context
    setThreadId(null);
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

    try {
      const { data, error } = await supabase.functions.invoke('ai-counselor', {
        body: { 
          message: messageText,
          threadId: threadId,
          language: language,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Save thread ID for conversation continuity
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error calling AI counselor:', error);
      toast({
        title: language === "ru" ? "Ошибка" : language === "kk" ? "Қате" : "Error",
        description: language === "ru" 
          ? "Не удалось получить ответ. Попробуйте позже." 
          : language === "kk"
          ? "Жауап алу мүмкін болмады. Кейінірек көріңіз."
          : "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "ru" 
          ? "Извините, произошла ошибка. Пожалуйста, попробуйте ещё раз через несколько секунд."
          : language === "kk"
          ? "Кешіріңіз, қате орын алды. Бірнеше секундтан кейін қайталап көріңіз."
          : "Sorry, an error occurred. Please try again in a few seconds.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
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
