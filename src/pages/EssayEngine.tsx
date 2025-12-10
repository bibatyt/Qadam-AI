import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EssayUploader, EssayAnalysisResult, type EssayAnalysis } from "@/features/essay-engine";
import { supabase } from "@/integrations/supabase/client";

const EssayEngine = () => {
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [essayTitle, setEssayTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (content: string, title: string) => {
    setLoading(true);
    setEssayTitle(title);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-essay', {
        body: { content, title }
      });
      
      if (error) {
        console.error("Analysis error:", error);
        toast.error("Ошибка анализа. Попробуй ещё раз.");
        return;
      }
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      setAnalysis(data as EssayAnalysis);
      toast.success("Анализ завершён!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Не удалось проанализировать эссе");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Keep analysis but allow viewing uploader
  };

  const handleNewEssay = () => {
    setAnalysis(null);
    setEssayTitle("");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="container max-w-lg mx-auto px-4 py-6">
        {analysis ? (
          <EssayAnalysisResult
            analysis={analysis}
            essayTitle={essayTitle}
            onBack={handleBack}
            onNewEssay={handleNewEssay}
          />
        ) : (
          <EssayUploader
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default EssayEngine;
