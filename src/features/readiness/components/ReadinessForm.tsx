import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReadinessFormData } from "../types";
import { GraduationCap, Globe, DollarSign, BookOpen, Trophy, Loader2 } from "lucide-react";

interface ReadinessFormProps {
  onSubmit: (data: ReadinessFormData) => void;
  isLoading: boolean;
  language: string;
}

const translations = {
  ru: {
    title: "Оценка готовности к поступлению",
    subtitle: "Заполните информацию о себе для персональной оценки",
    gpa: "GPA (из 5.0)",
    gpaPlaceholder: "4.5",
    grade: "Текущий класс",
    gradePlaceholder: "11",
    age: "Возраст",
    agePlaceholder: "17",
    englishLevel: "Уровень английского",
    englishLevelPlaceholder: "B2 / Upper-Intermediate",
    ielts: "IELTS балл (если есть)",
    ieltsPlaceholder: "7.0",
    countries: "Целевые страны",
    countriesPlaceholder: "США, Великобритания, Германия",
    budget: "Годовой бюджет (USD)",
    budgetPlaceholder: "30000",
    major: "Желаемая специальность",
    majorPlaceholder: "Computer Science",
    extracurriculars: "Внеклассная деятельность",
    extracurricularsPlaceholder: "Опишите ваши проекты, олимпиады, волонтерство, лидерские позиции...",
    submit: "Оценить готовность",
    analyzing: "Анализируем профиль..."
  },
  en: {
    title: "Admission Readiness Assessment",
    subtitle: "Fill in your information for a personalized assessment",
    gpa: "GPA (out of 5.0)",
    gpaPlaceholder: "4.5",
    grade: "Current Grade",
    gradePlaceholder: "11",
    age: "Age",
    agePlaceholder: "17",
    englishLevel: "English Level",
    englishLevelPlaceholder: "B2 / Upper-Intermediate",
    ielts: "IELTS Score (if available)",
    ieltsPlaceholder: "7.0",
    countries: "Target Countries",
    countriesPlaceholder: "USA, UK, Germany",
    budget: "Annual Budget (USD)",
    budgetPlaceholder: "30000",
    major: "Intended Major",
    majorPlaceholder: "Computer Science",
    extracurriculars: "Extracurricular Activities",
    extracurricularsPlaceholder: "Describe your projects, olympiads, volunteering, leadership positions...",
    submit: "Assess Readiness",
    analyzing: "Analyzing profile..."
  },
  kk: {
    title: "Түсуге дайындықты бағалау",
    subtitle: "Жеке бағалау үшін өз ақпаратыңызды толтырыңыз",
    gpa: "GPA (5.0-ден)",
    gpaPlaceholder: "4.5",
    grade: "Қазіргі сынып",
    gradePlaceholder: "11",
    age: "Жасы",
    agePlaceholder: "17",
    englishLevel: "Ағылшын тілі деңгейі",
    englishLevelPlaceholder: "B2 / Upper-Intermediate",
    ielts: "IELTS балы (бар болса)",
    ieltsPlaceholder: "7.0",
    countries: "Мақсатты елдер",
    countriesPlaceholder: "АҚШ, Ұлыбритания, Германия",
    budget: "Жылдық бюджет (USD)",
    budgetPlaceholder: "30000",
    major: "Қалаған мамандық",
    majorPlaceholder: "Computer Science",
    extracurriculars: "Сыныптан тыс іс-әрекеттер",
    extracurricularsPlaceholder: "Жобаларыңызды, олимпиадаларды, еріктілікті, көшбасшылық позицияларды сипаттаңыз...",
    submit: "Дайындықты бағалау",
    analyzing: "Профильді талдау..."
  }
};

export function ReadinessForm({ onSubmit, isLoading, language }: ReadinessFormProps) {
  const t = translations[language as keyof typeof translations] || translations.ru;
  
  const [formData, setFormData] = useState<ReadinessFormData>({
    gpa: "",
    englishLevel: "",
    ieltsScore: "",
    targetCountries: [],
    annualBudget: "",
    intendedMajor: "",
    extracurriculars: "",
    grade: "",
    age: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCountriesChange = (value: string) => {
    const countries = value.split(",").map(c => c.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, targetCountries: countries }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t.gpa}
          </Label>
          <Input
            type="number"
            step="0.1"
            max="5"
            min="0"
            placeholder={t.gpaPlaceholder}
            value={formData.gpa}
            onChange={e => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>{t.grade}</Label>
          <Input
            type="number"
            placeholder={t.gradePlaceholder}
            value={formData.grade}
            onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>{t.age}</Label>
          <Input
            type="number"
            placeholder={t.agePlaceholder}
            value={formData.age}
            onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t.englishLevel}
          </Label>
          <Input
            placeholder={t.englishLevelPlaceholder}
            value={formData.englishLevel}
            onChange={e => setFormData(prev => ({ ...prev, englishLevel: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>{t.ielts}</Label>
          <Input
            type="number"
            step="0.5"
            max="9"
            min="0"
            placeholder={t.ieltsPlaceholder}
            value={formData.ieltsScore}
            onChange={e => setFormData(prev => ({ ...prev, ieltsScore: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t.countries}
        </Label>
        <Input
          placeholder={t.countriesPlaceholder}
          value={formData.targetCountries.join(", ")}
          onChange={e => handleCountriesChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t.budget}
          </Label>
          <Input
            type="number"
            placeholder={t.budgetPlaceholder}
            value={formData.annualBudget}
            onChange={e => setFormData(prev => ({ ...prev, annualBudget: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t.major}
          </Label>
          <Input
            placeholder={t.majorPlaceholder}
            value={formData.intendedMajor}
            onChange={e => setFormData(prev => ({ ...prev, intendedMajor: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          {t.extracurriculars}
        </Label>
        <Textarea
          placeholder={t.extracurricularsPlaceholder}
          rows={4}
          value={formData.extracurriculars}
          onChange={e => setFormData(prev => ({ ...prev, extracurriculars: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.analyzing}
          </>
        ) : (
          t.submit
        )}
      </Button>
    </motion.form>
  );
}
