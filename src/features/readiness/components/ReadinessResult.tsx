import { motion } from "framer-motion";
import { ReadinessEvaluation } from "../types";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Target, 
  Calendar,
  ChevronRight,
  Shield,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReadinessResultProps {
  evaluation: ReadinessEvaluation;
  onReset: () => void;
  language: string;
}

const translations = {
  ru: {
    score: "Балл готовности",
    breakdown: "Разбор оценки",
    gpa: "GPA",
    english: "Английский",
    extracurriculars: "Внеклассная деятельность",
    budget: "Бюджет",
    profile: "Профиль",
    strengths: "Сильные стороны",
    weaknesses: "Области для улучшения",
    risk: "Уровень риска",
    strategies: "Рекомендуемые стратегии",
    roadmap: "План на 6-12 месяцев",
    newEvaluation: "Новая оценка",
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
  },
  en: {
    score: "Readiness Score",
    breakdown: "Score Breakdown",
    gpa: "GPA",
    english: "English",
    extracurriculars: "Extracurriculars",
    budget: "Budget",
    profile: "Profile",
    strengths: "Strengths",
    weaknesses: "Areas for Improvement",
    risk: "Risk Level",
    strategies: "Recommended Strategies",
    roadmap: "6-12 Month Roadmap",
    newEvaluation: "New Evaluation",
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  kk: {
    score: "Дайындық балы",
    breakdown: "Баллды талдау",
    gpa: "GPA",
    english: "Ағылшын",
    extracurriculars: "Сыныптан тыс",
    budget: "Бюджет",
    profile: "Профиль",
    strengths: "Күшті жақтары",
    weaknesses: "Жақсарту салалары",
    risk: "Тәуекел деңгейі",
    strategies: "Ұсынылған стратегиялар",
    roadmap: "6-12 айлық жоспар",
    newEvaluation: "Жаңа бағалау",
    low: "Төмен",
    medium: "Орташа",
    high: "Жоғары"
  }
};

export function ReadinessResult({ evaluation, onReset, language }: ReadinessResultProps) {
  const t = translations[language as keyof typeof translations] || translations.ru;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "High":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  const translateRisk = (risk: string) => {
    switch (risk) {
      case "Low":
        return t.low;
      case "Medium":
        return t.medium;
      case "High":
        return t.high;
      default:
        return risk;
    }
  };

  const breakdownItems = [
    { key: "gpa", label: t.gpa, value: evaluation.scoreBreakdown.gpa, max: 30 },
    { key: "english", label: t.english, value: evaluation.scoreBreakdown.english, max: 25 },
    { key: "extracurriculars", label: t.extracurriculars, value: evaluation.scoreBreakdown.extracurriculars, max: 20 },
    { key: "budgetMatch", label: t.budget, value: evaluation.scoreBreakdown.budgetMatch, max: 15 },
    { key: "profileClarity", label: t.profile, value: evaluation.scoreBreakdown.profileClarity, max: 10 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Score Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center">
          <p className="text-muted-foreground mb-2">{t.score}</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`text-7xl font-bold ${getScoreColor(evaluation.readinessScore)}`}
          >
            {evaluation.readinessScore}
          </motion.div>
          <p className="text-muted-foreground mt-2">/ 100</p>
        </div>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t.breakdown}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdownItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-medium">{item.value}/{item.max}</span>
              </div>
              <Progress value={(item.value / item.max) * 100} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              {t.strengths}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <ChevronRight className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              {t.weaknesses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <ChevronRight className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t.risk}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={`text-lg px-4 py-2 ${getRiskColor(evaluation.riskLevel)}`}>
              {getRiskIcon(evaluation.riskLevel)}
              <span className="ml-2">{translateRisk(evaluation.riskLevel)}</span>
            </Badge>
            <p className="text-muted-foreground text-sm">{evaluation.riskExplanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t.strategies}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluation.strategies.map((strategy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">{strategy.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t.roadmap}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluation.roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-4 border-l-2 border-primary/20 last:border-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                <Badge variant="secondary" className="mb-2">{item.month}</Badge>
                <h4 className="font-medium mb-2">{item.focus}</h4>
                <ul className="space-y-1">
                  {item.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-3 w-3 mt-1 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onReset} variant="outline" className="w-full">
        {t.newEvaluation}
      </Button>
    </motion.div>
  );
}
