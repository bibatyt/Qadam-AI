// Dynamic Roadmap Logic - центр логики для пересчёта плана

export interface UserProfile {
  level: number;
  xp: number;
  streak: number;
  currentGrade: string;
  targetCountry: string;
  targetUniversities: string[];
  gpa?: number;
  satScore?: number;
  ieltsScore?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  xpReward: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  impactScore: number; // 1-100, влияние на поступление
  estimatedMinutes: number;
  deadline?: string;
}

export interface Month {
  month: string;
  monthIndex: number;
  theme: string;
  tasks: Task[];
}

export interface RoadmapState {
  id: string;
  months: Month[];
  lastUpdated: string;
  totalProgress: number;
}

export interface PlanUpdate {
  type: 'task_completed' | 'stress_mode' | 'profile_change' | 'deadline_approaching' | 'chat_request';
  payload?: any;
}

export interface DailyTask {
  task: Task;
  monthIndex: number;
  reason: string;
}

// Чистая функция для пересчёта приоритетов задач
export function calculateTaskPriority(task: Task, daysUntilDeadline?: number): 'high' | 'medium' | 'low' {
  if (task.completed) return 'low';
  
  // Дедлайн скоро - высокий приоритет
  if (daysUntilDeadline !== undefined && daysUntilDeadline <= 7) {
    return 'high';
  }
  
  // Высокий Impact Score - высокий приоритет
  if (task.impactScore >= 80) {
    return 'high';
  }
  
  if (task.impactScore >= 50 || (daysUntilDeadline !== undefined && daysUntilDeadline <= 14)) {
    return 'medium';
  }
  
  return 'low';
}

// Найти лучшую 12-минутную задачу на сегодня
export function findDailyTask(roadmap: RoadmapState): DailyTask | null {
  const allTasks: { task: Task; monthIndex: number }[] = [];
  
  roadmap.months.forEach((month, monthIndex) => {
    month.tasks.forEach(task => {
      if (!task.completed) {
        allTasks.push({ task, monthIndex });
      }
    });
  });
  
  if (allTasks.length === 0) return null;
  
  // Сортировка: высокий Impact Score + короткое время = лучшая задача
  const sorted = allTasks.sort((a, b) => {
    // Приоритет по Impact Score
    const impactDiff = b.task.impactScore - a.task.impactScore;
    if (impactDiff !== 0) return impactDiff;
    
    // При равном Impact - короче время лучше
    return a.task.estimatedMinutes - b.task.estimatedMinutes;
  });
  
  const best = sorted[0];
  
  // Определяем причину выбора
  let reason = 'Максимальный эффект за минимальное время';
  if (best.task.impactScore >= 80) {
    reason = 'Высокий Impact Score — критически важно для поступления';
  } else if (best.task.estimatedMinutes <= 15) {
    reason = 'Быстрая задача с хорошим эффектом';
  }
  
  return { ...best, reason };
}

// Найти стресс-задачу (максимальный эффект за 12 минут)
export function findStressTask(roadmap: RoadmapState): DailyTask | null {
  const quickTasks: { task: Task; monthIndex: number }[] = [];
  
  roadmap.months.forEach((month, monthIndex) => {
    month.tasks.forEach(task => {
      if (!task.completed && task.estimatedMinutes <= 15) {
        quickTasks.push({ task, monthIndex });
      }
    });
  });
  
  if (quickTasks.length === 0) return null;
  
  // Сортируем по Impact Score
  const best = quickTasks.sort((a, b) => b.task.impactScore - a.task.impactScore)[0];
  
  return {
    ...best,
    reason: 'Всего 12 минут — но максимальный эффект на твоё поступление 💪'
  };
}

// Главная функция обновления плана
export function updateDynamicPlan(
  currentRoadmap: RoadmapState,
  update: PlanUpdate,
  profile?: UserProfile
): { roadmap: RoadmapState; notification?: string; dailyTask?: DailyTask } {
  const updatedRoadmap = { ...currentRoadmap, lastUpdated: new Date().toISOString() };
  let notification: string | undefined;
  let dailyTask: DailyTask | null = null;
  
  switch (update.type) {
    case 'task_completed':
      // Пересчитать прогресс и приоритеты
      const allTasks = updatedRoadmap.months.flatMap(m => m.tasks);
      const completed = allTasks.filter(t => t.completed).length;
      updatedRoadmap.totalProgress = (completed / allTasks.length) * 100;
      
      // Пересчитать приоритеты оставшихся задач
      updatedRoadmap.months = updatedRoadmap.months.map(month => ({
        ...month,
        tasks: month.tasks.map(task => ({
          ...task,
          priority: calculateTaskPriority(task)
        }))
      }));
      
      dailyTask = findDailyTask(updatedRoadmap);
      break;
      
    case 'stress_mode':
      // В стресс-режиме даём ОДНУ простую задачу
      dailyTask = findStressTask(updatedRoadmap);
      notification = 'Приоритет изменён: одна простая задача на 12 минут';
      break;
      
    case 'profile_change':
      // При изменении профиля пересчитать Impact Scores
      updatedRoadmap.months = updatedRoadmap.months.map(month => ({
        ...month,
        tasks: month.tasks.map(task => ({
          ...task,
          impactScore: recalculateImpactScore(task, profile),
          priority: calculateTaskPriority(task)
        }))
      }));
      notification = 'План обновлён под твой профиль';
      dailyTask = findDailyTask(updatedRoadmap);
      break;
      
    case 'deadline_approaching':
      const urgentTasks = findUrgentTasks(updatedRoadmap, update.payload?.days || 7);
      if (urgentTasks.length > 0) {
        notification = `⚠️ ${urgentTasks.length} задач близко к дедлайну`;
      }
      break;
      
    case 'chat_request':
      // AI чат запросил обновление плана
      dailyTask = findDailyTask(updatedRoadmap);
      break;
  }
  
  return {
    roadmap: updatedRoadmap,
    notification,
    dailyTask: dailyTask || undefined
  };
}

// Пересчёт Impact Score на основе профиля
function recalculateImpactScore(task: Task, profile?: UserProfile): number {
  let baseScore = task.impactScore;
  
  if (!profile) return baseScore;
  
  // Эссе важнее для топовых университетов
  if (task.category === 'essay' && profile.targetUniversities?.length > 0) {
    baseScore = Math.min(100, baseScore + 15);
  }
  
  // SAT важен для США
  if (task.category === 'test' && profile.targetCountry === 'usa') {
    baseScore = Math.min(100, baseScore + 10);
  }
  
  // IELTS важен для UK
  if (task.category === 'test' && profile.targetCountry === 'uk') {
    baseScore = Math.min(100, baseScore + 10);
  }
  
  return baseScore;
}

// Найти срочные задачи
function findUrgentTasks(roadmap: RoadmapState, daysThreshold: number): Task[] {
  const now = new Date();
  const urgent: Task[] = [];
  
  roadmap.months.forEach(month => {
    month.tasks.forEach(task => {
      if (task.completed || !task.deadline) return;
      
      const deadline = new Date(task.deadline);
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= daysThreshold) {
        urgent.push(task);
      }
    });
  });
  
  return urgent;
}

// Рассчитать эмоциональный прогресс
export function getEmotionalProgress(roadmap: RoadmapState, streak: number): { text: string; emoji: string } {
  const progress = roadmap.totalProgress;
  
  if (progress >= 100) {
    return { text: 'Ты супергерой! Все задачи выполнены!', emoji: '🦸‍♂️' };
  }
  if (progress >= 80) {
    return { text: 'Финишная прямая! Ещё чуть-чуть!', emoji: '🏁' };
  }
  if (progress >= 60) {
    return { text: 'Больше половины позади! Отлично!', emoji: '🔥' };
  }
  if (streak >= 7) {
    return { text: `${streak} дней подряд! Ты легенда!`, emoji: '⭐' };
  }
  if (streak >= 3) {
    return { text: `${streak} дня в ударе! Продолжай!`, emoji: '⚡' };
  }
  if (progress >= 30) {
    return { text: 'Хороший темп! Не останавливайся!', emoji: '💪' };
  }
  
  return { text: 'Начни с малого — одна задача за раз', emoji: '🎯' };
}
