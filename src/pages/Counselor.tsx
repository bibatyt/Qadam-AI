import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const Counselor = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const suggestedQueries = [
    t("howToWriteEssay"),
    t("ieltsOrToefl"),
    t("howToApply"),
    t("deadlines"),
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Set initial greeting
  useEffect(() => {
    if (!currentConversationId && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: t("aiGreeting"),
      }]);
    }
  }, [language, currentConversationId]);

  const loadConversations = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
  };

  const loadConversation = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })));
      setCurrentConversationId(conversationId);
      setShowHistory(false);
    }
  };

  const createNewConversation = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      await loadConversations();
      return data.id;
    }
    return null;
  };

  const saveMessage = async (conversationId: string, role: "user" | "assistant", content: string) => {
    if (!user) return;

    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
    });

    // Update conversation title if first user message
    if (role === "user") {
      const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
      await supabase
        .from('chat_conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    await supabase.from('chat_conversations').delete().eq('id', conversationId);
    await loadConversations();
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: t("aiGreeting"),
      }]);
    }
  };

  const startNewChat = () => {
    setCurrentConversationId(null);
    setMessages([{
      id: "greeting",
      role: "assistant",
      content: t("aiGreeting"),
    }]);
    setShowHistory(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create conversation if needed
      let convId = currentConversationId;
      if (!convId) {
        convId = await createNewConversation();
        if (!convId) throw new Error("Failed to create conversation");
        setCurrentConversationId(convId);
      }

      // Save user message
      await saveMessage(convId, "user", messageText);

      // Get conversation history (excluding greeting)
      const history = messages
        .filter(m => m.id !== "greeting")
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke('ai-counselor', {
        body: { 
          message: messageText,
          conversationHistory: history,
          language: language,
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Save AI response
      await saveMessage(convId, "assistant", data.response);
      await loadConversations();

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
        <div className="container max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              className="relative"
            >
              <MessageSquare className="w-5 h-5" />
              {conversations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {conversations.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={startNewChat}>
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
          <div className="container max-w-lg mx-auto px-4 py-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {language === "ru" ? "История чатов" : language === "kk" ? "Чат тарихы" : "Chat History"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {language === "ru" ? "Нет сохранённых чатов" : language === "kk" ? "Сақталған чаттар жоқ" : "No saved chats"}
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      currentConversationId === conv.id 
                        ? "bg-primary/10 border-primary" 
                        : "bg-card border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex-1 min-w-0" onClick={() => loadConversation(conv.id)}>
                      <p className="font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <Button onClick={startNewChat} className="mt-4 w-full">
              <Plus className="w-4 h-4 mr-2" />
              {language === "ru" ? "Новый чат" : language === "kk" ? "Жаңа чат" : "New Chat"}
            </Button>
          </div>
        </div>
      )}

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
