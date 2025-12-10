import { motion } from "framer-motion";

interface ParentQuestionsStepProps {
  childGrade: string;
  childGoal: string;
  involvementLevel: string;
  onChildGradeSelect: (grade: string) => void;
  onChildGoalSelect: (goal: string) => void;
  onInvolvementSelect: (level: string) => void;
  language: 'ru' | 'en' | 'kk';
}

const CHILD_GRADES = [
  { id: '9', label: { ru: '9 класс', en: '9th grade', kk: '9 сынып' } },
  { id: '10', label: { ru: '10 класс', en: '10th grade', kk: '10 сынып' } },
  { id: '11', label: { ru: '11 класс', en: '11th grade', kk: '11 сынып' } },
  { id: '12', label: { ru: '12 класс / Gap Year', en: '12th grade / Gap Year', kk: '12 сынып / Gap Year' } },
] as const;

const CHILD_GOALS = [
  { id: 'top_uni', label: { ru: 'Поступить в топовый ВУЗ', en: 'Get into top university', kk: 'Үздік ЖОО-ға түсу' }, icon: '🏛️' },
  { id: 'scholarship', label: { ru: 'Получить грант/стипендию', en: 'Get scholarship', kk: 'Грант алу' }, icon: '💰' },
  { id: 'abroad', label: { ru: 'Отправить учиться за рубеж', en: 'Study abroad', kk: 'Шетелде оқыту' }, icon: '✈️' },
  { id: 'best_future', label: { ru: 'Обеспечить лучшее будущее', en: 'Secure best future', kk: 'Жақсы болашақ' }, icon: '⭐' },
] as const;

const INVOLVEMENT_LEVELS = [
  { 
    id: 'active', 
    label: { ru: 'Активно помогаю', en: 'Actively helping', kk: 'Белсенді көмектесемін' },
    description: { ru: 'Участвую в процессе подготовки', en: 'Involved in preparation', kk: 'Дайындыққа қатысамын' }
  },
  { 
    id: 'support', 
    label: { ru: 'Поддерживаю', en: 'Supporting', kk: 'Қолдаймын' },
    description: { ru: 'Помогаю финансово и морально', en: 'Financial and moral support', kk: 'Қаржылай және рухани көмек' }
  },
  { 
    id: 'explore', 
    label: { ru: 'Изучаю варианты', en: 'Exploring options', kk: 'Нұсқаларды зерттеймін' },
    description: { ru: 'Хочу понять возможности', en: 'Want to understand options', kk: 'Мүмкіндіктерді түсінгім келеді' }
  },
] as const;

export function ParentQuestionsStep({
  childGrade,
  childGoal,
  involvementLevel,
  onChildGradeSelect,
  onChildGoalSelect,
  onInvolvementSelect,
  language
}: ParentQuestionsStepProps) {
  const titles = {
    ru: 'Расскажите о вашем ребёнке',
    en: 'Tell us about your child',
    kk: 'Балаңыз туралы айтыңыз'
  };

  const subtitles = {
    ru: 'Это поможет создать персональный план',
    en: 'This will help create a personalized plan',
    kk: 'Бұл жеке жоспар жасауға көмектеседі'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-4 sm:py-6"
    >
      <div className="text-center mb-6 sm:mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2 sm:mb-3"
        >
          {titles[language]}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg"
        >
          {subtitles[language]}
        </motion.p>
      </div>

      {/* Child's Grade */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-3">
          {language === 'ru' ? 'В каком классе ваш ребёнок?' :
           language === 'kk' ? 'Балаңыз нешінші сыныпта?' :
           'What grade is your child in?'}
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {CHILD_GRADES.map((grade, index) => (
            <motion.button
              key={grade.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={() => onChildGradeSelect(grade.id)}
              className={`
                p-3 sm:p-4 rounded-xl border-2 text-center transition-all duration-200
                ${childGrade === grade.id 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <span className="text-sm sm:text-base font-medium text-foreground">
                {grade.label[language]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Child's Goal */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-3">
          {language === 'ru' ? 'Какова ваша цель для ребёнка?' :
           language === 'kk' ? 'Балаңыз үшін мақсатыңыз қандай?' :
           'What is your goal for your child?'}
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {CHILD_GOALS.map((goal, index) => (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => onChildGoalSelect(goal.id)}
              className={`
                p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200
                ${childGoal === goal.id 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <span className="text-xl sm:text-2xl mb-1 block">{goal.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {goal.label[language]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Involvement Level */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          {language === 'ru' ? 'Ваша роль в процессе?' :
           language === 'kk' ? 'Процестегі рөліңіз?' :
           'Your role in the process?'}
        </label>
        <div className="space-y-2 sm:space-y-3">
          {INVOLVEMENT_LEVELS.map((level, index) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => onInvolvementSelect(level.id)}
              className={`
                w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200
                ${involvementLevel === level.id 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm sm:text-base font-semibold text-foreground block">
                    {level.label[language]}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {level.description[language]}
                  </span>
                </div>
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${involvementLevel === level.id 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground/30'
                  }
                `}>
                  {involvementLevel === level.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary-foreground rounded-full"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
