import { motion } from "framer-motion";
import { BookOpen, Clock, Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ENGLISH_LEVELS, DEADLINES, MAJORS } from "../types";

interface AcademicStepProps {
  satScore: string;
  ieltsScore: string;
  gpa: string;
  englishLevel: string;
  deadline: string;
  desiredMajor: string;
  onSatChange: (value: string) => void;
  onIeltsChange: (value: string) => void;
  onGpaChange: (value: string) => void;
  onEnglishLevelSelect: (level: string) => void;
  onDeadlineSelect: (deadline: string) => void;
  onMajorSelect: (major: string) => void;
  language: 'ru' | 'en' | 'kk';
}

export function AcademicStep({
  satScore,
  ieltsScore,
  gpa,
  englishLevel,
  deadline,
  desiredMajor,
  onSatChange,
  onIeltsChange,
  onGpaChange,
  onEnglishLevelSelect,
  onDeadlineSelect,
  onMajorSelect,
  language
}: AcademicStepProps) {
  const t = {
    title: { ru: 'Академические данные', en: 'Academic Info', kk: 'Академиялық деректер' },
    sat: { ru: 'SAT балл (опционально)', en: 'SAT Score (optional)', kk: 'SAT ұпайы (қосымша)' },
    ielts: { ru: 'IELTS балл (опционально)', en: 'IELTS Score (optional)', kk: 'IELTS ұпайы (қосымша)' },
    gpa: { ru: 'GPA (из 4.0)', en: 'GPA (out of 4.0)', kk: 'GPA (4.0-ден)' },
    english: { ru: 'Уровень английского', en: 'English Level', kk: 'Ағылшын деңгейі' },
    deadline: { ru: 'Планируемый год поступления', en: 'Target Admission Year', kk: 'Жоспарланған жыл' },
    major: { ru: 'Желаемая специальность', en: 'Desired Major', kk: 'Қалаған мамандық' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-extrabold text-foreground"
        >
          {t.title[language]}
        </motion.h1>
      </div>

      {/* SAT, IELTS & GPA Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            SAT
          </label>
          <Input
            type="number"
            placeholder="400-1600"
            value={satScore}
            onChange={(e) => onSatChange(e.target.value)}
            min={400}
            max={1600}
            className="h-11 text-sm font-semibold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            IELTS
          </label>
          <Input
            type="number"
            placeholder="0-9"
            value={ieltsScore}
            onChange={(e) => onIeltsChange(e.target.value)}
            min={0}
            max={9}
            step={0.5}
            className="h-11 text-sm font-semibold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            GPA
          </label>
          <Input
            type="number"
            placeholder="0-4.0"
            value={gpa}
            onChange={(e) => onGpaChange(e.target.value)}
            min={0}
            max={4}
            step={0.1}
            className="h-11 text-sm font-semibold"
          />
        </div>
      </motion.div>

      {/* English Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {t.english[language]}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ENGLISH_LEVELS.map((level) => (
            <motion.button
              key={level.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEnglishLevelSelect(level.id)}
              className={`
                px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${englishLevel === level.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              {level.label[language]}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Deadline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {t.deadline[language]}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {DEADLINES.map((d) => (
            <motion.button
              key={d.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeadlineSelect(d.id)}
              className={`
                px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${deadline === d.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              {d.label[language]}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Major/Profession */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          {t.major[language]}
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {MAJORS.map((major) => (
            <motion.button
              key={major.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMajorSelect(major.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 text-left
                ${desiredMajor === major.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              <span className="text-base">{major.icon}</span>
              <span className="truncate">{major.label[language]}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
