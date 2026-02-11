// University database for Kazakhstan, USA, Europe, and Asia

export interface University {
  id: string;
  name: string;
  country: string;
  region: "kazakhstan" | "usa" | "europe" | "asia";
  ranking?: number;
  scholarshipAvailable: boolean;
  minGPA?: number;
  requiredExams: string[];
  website?: string;
}

export const universities: University[] = [
  // Kazakhstan
  { id: "nazarbayev", name: "Назарбаев Университет", country: "Казахстан", region: "kazakhstan", ranking: 1, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "IELTS"] },
  { id: "kimep", name: "КИМЭП", country: "Казахстан", region: "kazakhstan", ranking: 2, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["SAT", "IELTS"] },
  { id: "kbtu", name: "КБТУ", country: "Казахстан", region: "kazakhstan", ranking: 3, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["ЕНТ"] },
  { id: "kaznu", name: "КазНУ им. аль-Фараби", country: "Казахстан", region: "kazakhstan", ranking: 4, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },
  { id: "sdu", name: "SDU University", country: "Казахстан", region: "kazakhstan", ranking: 5, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["SAT", "IELTS"] },
  { id: "aitu", name: "AITU", country: "Казахстан", region: "kazakhstan", ranking: 6, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["ЕНТ", "IELTS"] },
  { id: "satbayev", name: "Satbayev University", country: "Казахстан", region: "kazakhstan", ranking: 7, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },
  { id: "narxoz", name: "Narxoz University", country: "Казахстан", region: "kazakhstan", ranking: 8, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },

  // USA
  { id: "mit", name: "MIT", country: "США", region: "usa", ranking: 1, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["SAT", "TOEFL"] },
  { id: "stanford", name: "Stanford University", country: "США", region: "usa", ranking: 2, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["SAT", "TOEFL"] },
  { id: "harvard", name: "Harvard University", country: "США", region: "usa", ranking: 3, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["SAT", "TOEFL"] },
  { id: "caltech", name: "Caltech", country: "США", region: "usa", ranking: 4, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["SAT", "TOEFL"] },
  { id: "uchicago", name: "University of Chicago", country: "США", region: "usa", ranking: 5, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "TOEFL"] },
  { id: "columbia", name: "Columbia University", country: "США", region: "usa", ranking: 6, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "TOEFL"] },
  { id: "yale", name: "Yale University", country: "США", region: "usa", ranking: 7, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "TOEFL"] },
  { id: "princeton", name: "Princeton University", country: "США", region: "usa", ranking: 8, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "TOEFL"] },
  { id: "upenn", name: "University of Pennsylvania", country: "США", region: "usa", ranking: 9, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "TOEFL"] },
  { id: "duke", name: "Duke University", country: "США", region: "usa", ranking: 10, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "TOEFL"] },

  // Europe
  { id: "oxford", name: "Oxford University", country: "Великобритания", region: "europe", ranking: 1, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["IELTS"] },
  { id: "cambridge", name: "Cambridge University", country: "Великобритания", region: "europe", ranking: 2, scholarshipAvailable: true, minGPA: 4.5, requiredExams: ["IELTS"] },
  { id: "eth", name: "ETH Zurich", country: "Швейцария", region: "europe", ranking: 3, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["IELTS"] },
  { id: "imperial", name: "Imperial College London", country: "Великобритания", region: "europe", ranking: 4, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["IELTS"] },
  { id: "ucl", name: "UCL", country: "Великобритания", region: "europe", ranking: 5, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["IELTS"] },
  { id: "lse", name: "LSE", country: "Великобритания", region: "europe", ranking: 6, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["IELTS"] },
  { id: "tu_munich", name: "TU Munich", country: "Германия", region: "europe", ranking: 7, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["IELTS", "TestDAF"] },
  { id: "heidelberg", name: "Heidelberg University", country: "Германия", region: "europe", ranking: 8, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "sorbonne", name: "Sorbonne University", country: "Франция", region: "europe", ranking: 9, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS", "DELF"] },
  { id: "amsterdam", name: "University of Amsterdam", country: "Нидерланды", region: "europe", ranking: 10, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },

  // Asia
  { id: "nus", name: "National University of Singapore", country: "Сингапур", region: "asia", ranking: 1, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "IELTS"] },
  { id: "ntu", name: "Nanyang Technological University", country: "Сингапур", region: "asia", ranking: 2, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "IELTS"] },
  { id: "tsinghua", name: "Tsinghua University", country: "Китай", region: "asia", ranking: 3, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["HSK", "SAT"] },
  { id: "peking", name: "Peking University", country: "Китай", region: "asia", ranking: 4, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["HSK", "SAT"] },
  { id: "tokyo", name: "University of Tokyo", country: "Япония", region: "asia", ranking: 5, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["JLPT", "IELTS"] },
  { id: "hku", name: "University of Hong Kong", country: "Гонконг", region: "asia", ranking: 6, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "IELTS"] },
  { id: "kaist", name: "KAIST", country: "Южная Корея", region: "asia", ranking: 7, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOPIK"] },
  { id: "seoul", name: "Seoul National University", country: "Южная Корея", region: "asia", ranking: 8, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["TOPIK", "IELTS"] },
];

export const specialties = [
  { id: "cs", name: "Computer Science / IT", nameRu: "IT / Компьютеры", nameKk: "IT / Компьютерлер", icon: "💻" },
  { id: "engineering", name: "Engineering", nameRu: "Инженерия", nameKk: "Инженерия", icon: "⚙️" },
  { id: "business", name: "Business / Management", nameRu: "Бизнес", nameKk: "Бизнес", icon: "📊" },
  { id: "medicine", name: "Medicine", nameRu: "Медицина", nameKk: "Медицина", icon: "🏥" },
  { id: "law", name: "Law", nameRu: "Право", nameKk: "Құқық", icon: "⚖️" },
  { id: "economics", name: "Economics / Finance", nameRu: "Финансы", nameKk: "Қаржы", icon: "💰" },
  { id: "arts", name: "Arts / Design", nameRu: "Дизайн", nameKk: "Дизайн", icon: "🎨" },
  { id: "science", name: "Natural Sciences", nameRu: "Науки", nameKk: "Ғылымдар", icon: "🔬" },
  { id: "other", name: "Other", nameRu: "Другое", nameKk: "Басқа", icon: "✏️" },
];

export const englishLevels = [
  { id: "beginner", name: "Beginner (A1-A2)", nameRu: "Начинающий (A1-A2)", nameKk: "Бастауыш (A1-A2)" },
  { id: "intermediate", name: "Intermediate (B1-B2)", nameRu: "Средний (B1-B2)", nameKk: "Орташа (B1-B2)" },
  { id: "advanced", name: "Advanced (C1-C2)", nameRu: "Продвинутый (C1-C2)", nameKk: "Жоғары (C1-C2)" },
];
