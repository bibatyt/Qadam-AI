import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, MessageSquare, Plus, Trash2, Mic, Paperclip, FileText, Lightbulb, HelpCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

// Quick action cards data
const quickActions = {
  ru: [
    { icon: FileText, label: "Объясни процесс поступления", query: "Объясни мне процесс поступления в США" },
    { icon: Lightbulb, label: "Помоги с эссе", query: "Как написать personal statement для топ университета?" },
    { icon: GraduationCap, label: "Найди гранты", query: "Какие гранты доступны для казахстанских студентов?" },
    { icon: HelpCircle, label: "План подготовки", query: "Составь мне план подготовки к IELTS на 2 месяца" },
  ],
  kk: [
    { icon: FileText, label: "Түсу процесін түсіндір", query: "АҚШ-қа түсу процесін түсіндір" },
    { icon: Lightbulb, label: "Эссемен көмектес", query: "Топ университетке personal statement қалай жазу керек?" },
    { icon: GraduationCap, label: "Грант тап", query: "Қазақстандық студенттерге қандай гранттар бар?" },
    { icon: HelpCircle, label: "Дайындық жоспары", query: "IELTS-ке 2 айға дайындық жоспарын құр" },
  ],
  en: [
    { icon: FileText, label: "Explain admission process", query: "Explain the admission process to US universities" },
    { icon: Lightbulb, label: "Help with essay", query: "How to write a personal statement for a top university?" },
    { icon: GraduationCap, label: "Find grants", query: "What grants are available for Kazakhstani students?" },
    { icon: HelpCircle, label: "Prep plan", query: "Create a 2-month IELTS preparation plan for me" },
  ],
};

const Counselor = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const actions = quickActions[language as keyof typeof quickActions] || quickActions.en;

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

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

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
      let convId = currentConversationId;
      if (!convId) {
        convId = await createNewConversation();
        if (!convId) throw new Error("Failed to create conversation");
        setCurrentConversationId(convId);
      }

      await saveMessage(convId, "user", messageText);

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

  const showQuickActions = messages.length <= 2;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <MobileHeader 
        userName={user?.email?.split("@")[0] || "User"}
        greeting={t("aiCounselor")}
      />

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
                    className={cn(
                      "p-4 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between",
                      currentConversationId === conv.id 
                        ? "bg-primary/10 border-primary" 
                        : "bg-card border-border hover:bg-muted"
                    )}
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
            <Button onClick={startNewChat} className="mt-4 w-full rounded-2xl h-12">
              <Plus className="w-4 h-4 mr-2" />
              {language === "ru" ? "Новый чат" : language === "kk" ? "Жаңа чат" : "New Chat"}
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-lg mx-auto px-4 py-4">
          {/* Quick Action Cards - Only show when conversation is fresh */}
          {showQuickActions && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              {actions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleSend(action.query)}
                  className="quick-action-card flex flex-col items-center gap-3 py-5"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <action.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.25, 
                  delay: index === messages.length - 1 ? 0.05 : 0,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center",
                    message.role === "user"
                      ? "bg-muted"
                      : "bg-primary"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.2 }}
                  className={cn(
                    "max-w-[80%] rounded-3xl px-5 py-4",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  )}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                </motion.div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center"
                >
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <div className="bg-card rounded-3xl px-5 py-4 border border-border">
                  <div className="flex gap-1.5">
                    <motion.span 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full" 
                    />
                    <motion.span 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full" 
                    />
                    <motion.span 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full" 
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Clean minimal design */}
      <div className="bg-card border-t border-border px-4 py-4 pb-24">
        <div className="container max-w-lg mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === "ru" ? "Напишите сообщение..." : language === "kk" ? "Хабарлама жазыңыз..." : "Write a message..."}
              className="h-14 rounded-2xl pl-5 pr-28 text-base bg-muted border-0"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* History button */}
          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-muted-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {language === "ru" ? "История" : language === "kk" ? "Тарих" : "History"}
              {conversations.length > 0 && ` (${conversations.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counselor;
