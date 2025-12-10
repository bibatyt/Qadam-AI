import { motion } from "framer-motion";
import { GRADES, COUNTRIES } from "../types";

interface ProfileStepProps {
  grade: string;
  country: string;
  onGradeSelect: (grade: string) => void;
  onCountrySelect: (country: string) => void;
  language: 'ru' | 'en' | 'kk';
}

export function ProfileStep({ 
  grade, 
  country, 
  onGradeSelect, 
  onCountrySelect,
  language 
}: ProfileStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold text-foreground"
        >
          {language === 'ru' ? 'Расскажи о себе' :
           language === 'kk' ? 'Өзің туралы айтып бер' :
           'Tell us about yourself'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          {language === 'ru' ? 'Это поможет создать точный план' :
           language === 'kk' ? 'Бұл дәл жоспар құруға көмектеседі' :
           'This helps create an accurate plan'}
        </motion.p>
      </div>

      {/* Grade Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {language === 'ru' ? 'Класс обучения' :
           language === 'kk' ? 'Оқу сыныбы' :
           'Current grade'}
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGradeSelect(g.id)}
              className={`
                px-5 py-3 rounded-xl font-semibold transition-all duration-200
                ${grade === g.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              {g.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Country Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {language === 'ru' ? 'Куда хочешь поступить?' :
           language === 'kk' ? 'Қайда түскің келеді?' :
           'Where do you want to study?'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COUNTRIES.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCountrySelect(c.id)}
              className={`
                p-4 rounded-xl font-semibold transition-all duration-200 text-left
                flex items-center gap-3
                ${country === c.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="text-sm">{c.label.replace(c.flag + ' ', '')}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
