import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EssayUploaderProps {
  onSubmit: (content: string, title: string) => void;
  loading?: boolean;
}

export function EssayUploader({ onSubmit, loading = false }: EssayUploaderProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"paste" | "type">("paste");

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = () => {
    if (content.trim().length < 50) return;
    onSubmit(content.trim(), title || "Мое эссе");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4"
        >
          <FileText className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">
          Загрузи своё эссе
        </h2>
        <p className="text-muted-foreground">
          Получи Impact Score и рекомендации
        </p>
      </div>

      {/* Title input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Название (опционально)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Personal Statement для Harvard"
          className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Essay content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Текст эссе
          </label>
          <span className={`text-sm font-medium ${wordCount > 650 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {wordCount} слов
          </span>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Вставь текст своего эссе сюда..."
          className="min-h-[250px] resize-none rounded-xl bg-muted border-0 p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Submit button */}
      <Button
        variant="hero"
        size="lg"
        className="w-full h-14 text-lg"
        onClick={handleSubmit}
        disabled={content.trim().length < 50 || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Анализирую...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Получить Impact Score
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Минимум 50 символов для анализа
      </p>
    </motion.div>
  );
}
