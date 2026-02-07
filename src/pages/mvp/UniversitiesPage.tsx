import { useState } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, MapPin, Calendar, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { AppLanguageSwitcher } from "@/components/ui/AppLanguageSwitcher";
// Sample universities with matching data
const sampleUniversities = [
  {
    id: "nazarbayev",
    name: "Назарбаев Университет",
    country: "Казахстан",
    city: "Астана",
    matchPercent: 92,
    deadline: "2026-03-01",
    scholarshipAvailable: true,
    minSAT: 1300,
    minIELTS: 6.5,
    annualCost: "$0 (грант)",
    ranking: 1,
    region: "kazakhstan",
  },
  {
    id: "harvard",
    name: "Harvard University",
    country: "США",
    city: "Cambridge, MA",
    matchPercent: 45,
    deadline: "2026-01-01",
    scholarshipAvailable: true,
    minSAT: 1500,
    minIELTS: 7.0,
    annualCost: "$55,000",
    ranking: 3,
    region: "usa",
  },
  {
    id: "oxford",
    name: "Oxford University",
    country: "Великобритания",
    city: "Oxford",
    matchPercent: 58,
    deadline: "2025-10-15",
    scholarshipAvailable: true,
    minSAT: 1450,
    minIELTS: 7.0,
    annualCost: "£28,000",
    ranking: 1,
    region: "europe",
  },
  {
    id: "kimep",
    name: "КИМЭП",
    country: "Казахстан",
    city: "Алматы",
    matchPercent: 88,
    deadline: "2026-04-15",
    scholarshipAvailable: true,
    minSAT: 1100,
    minIELTS: 5.5,
    annualCost: "$8,000",
    ranking: 2,
    region: "kazakhstan",
  },
  {
    id: "nus",
    name: "National University of Singapore",
    country: "Сингапур",
    city: "Сингапур",
    matchPercent: 72,
    deadline: "2026-02-28",
    scholarshipAvailable: true,
    minSAT: 1400,
    minIELTS: 6.5,
    annualCost: "$15,000",
    ranking: 1,
    region: "asia",
  },
  {
    id: "sdu",
    name: "SDU University",
    country: "Казахстан",
    city: "Алматы",
    matchPercent: 85,
    deadline: "2026-05-01",
    scholarshipAvailable: true,
    minSAT: 1150,
    minIELTS: 6.0,
    annualCost: "$5,000",
    ranking: 5,
    region: "kazakhstan",
  },
];

const translations = {
  ru: {
    title: "Университеты",
    search: "Поиск университетов...",
    match: "Совпадение",
    deadline: "Дедлайн",
    scholarship: "Грант",
    all: "Все",
    kazakhstan: "Казахстан",
    usa: "США",
    europe: "Европа",
    asia: "Азия",
    minSAT: "Мин. SAT",
    minIELTS: "Мин. IELTS",
    cost: "Стоимость",
    daysLeft: "дней",
    apply: "Подать",
  },
  kk: {
    title: "Университеттер",
    search: "Университеттерді іздеу...",
    match: "Сәйкестік",
    deadline: "Мерзім",
    scholarship: "Грант",
    all: "Барлығы",
    kazakhstan: "Қазақстан",
    usa: "АҚШ",
    europe: "Еуропа",
    asia: "Азия",
    minSAT: "Мин. SAT",
    minIELTS: "Мин. IELTS",
    cost: "Құны",
    daysLeft: "күн",
    apply: "Өтініш",
  },
  en: {
    title: "Universities",
    search: "Search universities...",
    match: "Match",
    deadline: "Deadline",
    scholarship: "Scholarship",
    all: "All",
    kazakhstan: "Kazakhstan",
    usa: "USA",
    europe: "Europe",
    asia: "Asia",
    minSAT: "Min SAT",
    minIELTS: "Min IELTS",
    cost: "Cost",
    daysLeft: "days",
    apply: "Apply",
  },
};

type Region = "all" | "kazakhstan" | "usa" | "europe" | "asia";

export default function UniversitiesPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region>("all");

  const filteredUniversities = sampleUniversities
    .filter((uni) => {
      const matchesSearch = uni.name.toLowerCase().includes(search.toLowerCase()) ||
        uni.country.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegion === "all" || uni.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMatchColor = (percent: number) => {
    if (percent >= 80) return "text-success";
    if (percent >= 60) return "text-primary";
    if (percent >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  const getMatchBgColor = (percent: number) => {
    if (percent >= 80) return "bg-success/10";
    if (percent >= 60) return "bg-primary/10";
    if (percent >= 40) return "bg-accent/10";
    return "bg-muted";
  };

  const regions: { key: Region; label: string }[] = [
    { key: "all", label: t.all },
    { key: "kazakhstan", label: t.kazakhstan },
    { key: "usa", label: t.usa },
    { key: "europe", label: t.europe },
    { key: "asia", label: t.asia },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <MobileHeader
        userName={user?.email?.split("@")[0] || "User"}
        greeting={t.title}
      />

      <div className="container max-w-lg mx-auto px-4 pt-4">
        {/* Language switcher */}
        <div className="flex justify-end mb-4">
          <AppLanguageSwitcher />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="h-12 pl-12 pr-4 rounded-2xl bg-muted border-0 text-base"
          />
        </div>

        {/* Region filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {regions.map((region) => (
            <Button
              key={region.key}
              variant={selectedRegion === region.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region.key)}
              className={cn(
                "rounded-xl whitespace-nowrap",
                selectedRegion === region.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border-border"
              )}
            >
              {region.label}
            </Button>
          ))}
        </div>

        {/* University cards */}
        <div className="space-y-4">
          {filteredUniversities.map((uni, index) => {
            const daysLeft = getDaysUntilDeadline(uni.deadline);
            const isUrgent = daysLeft <= 30 && daysLeft > 0;
            const isPast = daysLeft <= 0;

            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-3xl p-5 border border-border shadow-card"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg leading-tight mb-1">
                      {uni.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{uni.city}, {uni.country}</span>
                    </div>
                  </div>

                  {/* Match percentage */}
                  <div className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 rounded-2xl",
                    getMatchBgColor(uni.matchPercent)
                  )}>
                    <span className={cn("text-xl font-bold", getMatchColor(uni.matchPercent))}>
                      {uni.matchPercent}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.match}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.minSAT}</p>
                    <p className="font-bold text-foreground">{uni.minSAT}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.minIELTS}</p>
                    <p className="font-bold text-foreground">{uni.minIELTS}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.cost}</p>
                    <p className="font-bold text-foreground text-xs">{uni.annualCost}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Deadline */}
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm",
                      isPast ? "bg-destructive/10 text-destructive" :
                      isUrgent ? "bg-accent/20 text-accent-foreground" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isPast ? "Закрыто" : `${daysLeft} ${t.daysLeft}`}
                      </span>
                    </div>

                    {/* Scholarship badge */}
                    {uni.scholarshipAvailable && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-xl">
                        <Star className="w-3 h-3 mr-1" />
                        {t.scholarship}
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="rounded-xl h-9 px-4"
                    disabled={isPast}
                  >
                    {t.apply}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === "ru" ? "Университеты не найдены" :
               language === "kk" ? "Университеттер табылмады" :
               "No universities found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
