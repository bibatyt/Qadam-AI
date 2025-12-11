import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, X, GraduationCap } from "lucide-react";
import { TOP_UNIVERSITIES, GRADES, COUNTRIES, type University } from "../types";

interface ProfileStepProps {
  grade: string;
  country: string;
  universities: string[];
  onGradeSelect: (grade: string) => void;
  onCountrySelect: (country: string) => void;
  onUniversitiesChange: (universities: string[]) => void;
  language: 'ru' | 'en' | 'kk';
}

export function ProfileStep({ 
  grade, 
  country, 
  universities,
  onGradeSelect, 
  onCountrySelect,
  onUniversitiesChange,
  language 
}: ProfileStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter universities by selected country and search
  const filteredUniversities = TOP_UNIVERSITIES.filter(uni => {
    const matchesCountry = !country || uni.country === country;
    const matchesSearch = !searchQuery || 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const toggleUniversity = (uniId: string) => {
    if (universities.includes(uniId)) {
      onUniversitiesChange(universities.filter(id => id !== uniId));
    } else if (universities.length < 5) {
      onUniversitiesChange([...universities, uniId]);
    }
  };

  const selectedUnis = TOP_UNIVERSITIES.filter(u => universities.includes(u.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-extrabold text-foreground"
        >
          {language === 'ru' ? 'Расскажи о себе' :
           language === 'kk' ? 'Өзің туралы айтып бер' :
           'Tell us about yourself'}
        </motion.h1>
      </div>

      {/* Grade Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {language === 'ru' ? 'Класс' : language === 'kk' ? 'Сынып' : 'Grade'}
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGradeSelect(g.id)}
              className={`
                px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${grade === g.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              {g.label[language]}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Country Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {language === 'ru' ? 'Страна' : language === 'kk' ? 'Ел' : 'Country'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {COUNTRIES.map((c) => (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCountrySelect(c.id)}
              className={`
                p-3 rounded-xl font-semibold text-sm transition-all duration-200
                flex flex-col items-center gap-1
                ${country === c.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              <span className="text-xl">{c.flag}</span>
              <span className="text-xs">{c.label[language].replace(c.flag + ' ', '')}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* University Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4" />
            {language === 'ru' ? 'Университеты мечты' : 
             language === 'kk' ? 'Арман университеттері' : 
             'Dream universities'}
          </label>
          <span className="text-xs text-muted-foreground">
            {universities.length}/5
          </span>
        </div>

        {/* Selected Universities */}
        {selectedUnis.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUnis.map(uni => (
              <motion.div
                key={uni.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                <span>{uni.logo}</span>
                <span>{uni.name}</span>
                <button 
                  onClick={() => toggleUniversity(uni.id)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ru' ? "Найти университет..." : "Search..."}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* University List */}
        <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl">
          {filteredUniversities.slice(0, 10).map((uni) => {
            const isSelected = universities.includes(uni.id);
            return (
              <motion.button
                key={uni.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleUniversity(uni.id)}
                disabled={!isSelected && universities.length >= 5}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                  ${isSelected 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                  }
                  ${!isSelected && universities.length >= 5 ? "opacity-50" : ""}
                `}
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-xl">
                  {uni.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{uni.name}</p>
                  <p className="text-xs text-muted-foreground">
                    #{uni.rank} {language === 'ru' ? 'в мире' : language === 'kk' ? 'әлемде' : 'in the world'}
                  </p>
                </div>
                {isSelected && (
                  <Star className="w-5 h-5 text-primary fill-primary" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
