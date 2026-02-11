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
  { id: "iitu", name: "МУИТ (IITU)", country: "Казахстан", region: "kazakhstan", ranking: 9, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },
  { id: "kazguu", name: "Университет КАЗГЮУ", country: "Казахстан", region: "kazakhstan", ranking: 10, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },
  { id: "karaganda_buketov", name: "КарУ им. Букетова", country: "Казахстан", region: "kazakhstan", ranking: 11, scholarshipAvailable: true, minGPA: 2.8, requiredExams: ["ЕНТ"] },
  { id: "eurasian", name: "ЕНУ им. Гумилёва", country: "Казахстан", region: "kazakhstan", ranking: 12, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["ЕНТ"] },
  { id: "almau", name: "AlmaU", country: "Казахстан", region: "kazakhstan", ranking: 13, scholarshipAvailable: true, minGPA: 3.2, requiredExams: ["ЕНТ", "IELTS"] },
  { id: "turan", name: "Университет Туран", country: "Казахстан", region: "kazakhstan", ranking: 14, scholarshipAvailable: true, minGPA: 2.8, requiredExams: ["ЕНТ"] },

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
  { id: "northwestern", name: "Northwestern University", country: "США", region: "usa", ranking: 11, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "TOEFL"] },
  { id: "jhu", name: "Johns Hopkins University", country: "США", region: "usa", ranking: 12, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "TOEFL"] },
  { id: "cornell", name: "Cornell University", country: "США", region: "usa", ranking: 13, scholarshipAvailable: true, minGPA: 4.1, requiredExams: ["SAT", "TOEFL"] },
  { id: "brown", name: "Brown University", country: "США", region: "usa", ranking: 14, scholarshipAvailable: true, minGPA: 4.1, requiredExams: ["SAT", "TOEFL"] },
  { id: "rice", name: "Rice University", country: "США", region: "usa", ranking: 15, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "vanderbilt", name: "Vanderbilt University", country: "США", region: "usa", ranking: 16, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "notre_dame", name: "University of Notre Dame", country: "США", region: "usa", ranking: 17, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "cmu", name: "Carnegie Mellon University", country: "США", region: "usa", ranking: 18, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "TOEFL"] },
  { id: "georgetown", name: "Georgetown University", country: "США", region: "usa", ranking: 19, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "nyu", name: "New York University", country: "США", region: "usa", ranking: 20, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["SAT", "TOEFL"] },
  { id: "umich", name: "University of Michigan", country: "США", region: "usa", ranking: 21, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["SAT", "TOEFL"] },
  { id: "usc", name: "University of Southern California", country: "США", region: "usa", ranking: 22, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["SAT", "TOEFL"] },
  { id: "ucla", name: "UCLA", country: "США", region: "usa", ranking: 23, scholarshipAvailable: false, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "berkeley", name: "UC Berkeley", country: "США", region: "usa", ranking: 24, scholarshipAvailable: false, minGPA: 4.0, requiredExams: ["SAT", "TOEFL"] },
  { id: "gatech", name: "Georgia Tech", country: "США", region: "usa", ranking: 25, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["SAT", "TOEFL"] },
  { id: "uiuc", name: "UIUC", country: "США", region: "usa", ranking: 26, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["SAT", "TOEFL"] },
  { id: "uw", name: "University of Washington", country: "США", region: "usa", ranking: 27, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["SAT", "TOEFL"] },
  { id: "bu", name: "Boston University", country: "США", region: "usa", ranking: 28, scholarshipAvailable: true, minGPA: 3.6, requiredExams: ["SAT", "TOEFL"] },
  { id: "purdue", name: "Purdue University", country: "США", region: "usa", ranking: 29, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["SAT", "TOEFL"] },
  { id: "utaustin", name: "UT Austin", country: "США", region: "usa", ranking: 30, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["SAT", "TOEFL"] },

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
  { id: "edinburgh", name: "University of Edinburgh", country: "Великобритания", region: "europe", ranking: 11, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["IELTS"] },
  { id: "kings", name: "King's College London", country: "Великобритания", region: "europe", ranking: 12, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["IELTS"] },
  { id: "epfl", name: "EPFL", country: "Швейцария", region: "europe", ranking: 13, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["IELTS"] },
  { id: "lmu", name: "LMU Munich", country: "Германия", region: "europe", ranking: 14, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS", "TestDAF"] },
  { id: "delft", name: "TU Delft", country: "Нидерланды", region: "europe", ranking: 15, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "wageningen", name: "Wageningen University", country: "Нидерланды", region: "europe", ranking: 16, scholarshipAvailable: true, minGPA: 3.3, requiredExams: ["IELTS"] },
  { id: "milan_polimi", name: "Politecnico di Milano", country: "Италия", region: "europe", ranking: 17, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "bocconi", name: "Bocconi University", country: "Италия", region: "europe", ranking: 18, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["IELTS"] },
  { id: "warwick", name: "University of Warwick", country: "Великобритания", region: "europe", ranking: 19, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["IELTS"] },
  { id: "bristol", name: "University of Bristol", country: "Великобритания", region: "europe", ranking: 20, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "manchester", name: "University of Manchester", country: "Великобритания", region: "europe", ranking: 21, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "prague_charles", name: "Charles University", country: "Чехия", region: "europe", ranking: 22, scholarshipAvailable: true, minGPA: 3.2, requiredExams: ["IELTS"] },
  { id: "vienna", name: "University of Vienna", country: "Австрия", region: "europe", ranking: 23, scholarshipAvailable: true, minGPA: 3.3, requiredExams: ["IELTS"] },
  { id: "copenhagen", name: "University of Copenhagen", country: "Дания", region: "europe", ranking: 24, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "helsinki", name: "University of Helsinki", country: "Финляндия", region: "europe", ranking: 25, scholarshipAvailable: true, minGPA: 3.3, requiredExams: ["IELTS"] },

  // Asia & Middle East
  { id: "nus", name: "National University of Singapore", country: "Сингапур", region: "asia", ranking: 1, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["SAT", "IELTS"] },
  { id: "ntu", name: "Nanyang Technological University", country: "Сингапур", region: "asia", ranking: 2, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["SAT", "IELTS"] },
  { id: "tsinghua", name: "Tsinghua University", country: "Китай", region: "asia", ranking: 3, scholarshipAvailable: true, minGPA: 4.3, requiredExams: ["HSK", "SAT"] },
  { id: "peking", name: "Peking University", country: "Китай", region: "asia", ranking: 4, scholarshipAvailable: true, minGPA: 4.2, requiredExams: ["HSK", "SAT"] },
  { id: "tokyo", name: "University of Tokyo", country: "Япония", region: "asia", ranking: 5, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["JLPT", "IELTS"] },
  { id: "hku", name: "University of Hong Kong", country: "Гонконг", region: "asia", ranking: 6, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "IELTS"] },
  { id: "kaist", name: "KAIST", country: "Южная Корея", region: "asia", ranking: 7, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["SAT", "TOPIK"] },
  { id: "seoul", name: "Seoul National University", country: "Южная Корея", region: "asia", ranking: 8, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["TOPIK", "IELTS"] },
  { id: "kyoto", name: "Kyoto University", country: "Япония", region: "asia", ranking: 9, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["JLPT", "IELTS"] },
  { id: "hkust", name: "HKUST", country: "Гонконг", region: "asia", ranking: 10, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["SAT", "IELTS"] },
  { id: "yonsei", name: "Yonsei University", country: "Южная Корея", region: "asia", ranking: 11, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["TOPIK", "IELTS"] },
  { id: "korea_u", name: "Korea University", country: "Южная Корея", region: "asia", ranking: 12, scholarshipAvailable: true, minGPA: 3.7, requiredExams: ["TOPIK", "IELTS"] },
  { id: "fudan", name: "Fudan University", country: "Китай", region: "asia", ranking: 13, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["HSK"] },
  { id: "zhejiang", name: "Zhejiang University", country: "Китай", region: "asia", ranking: 14, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["HSK"] },
  { id: "kaust", name: "KAUST", country: "Саудовская Аравия", region: "asia", ranking: 15, scholarshipAvailable: true, minGPA: 3.8, requiredExams: ["IELTS", "GRE"] },
  { id: "khalifa", name: "Khalifa University", country: "ОАЭ", region: "asia", ranking: 16, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["IELTS"] },
  { id: "qatar", name: "Qatar University", country: "Катар", region: "asia", ranking: 17, scholarshipAvailable: true, minGPA: 3.3, requiredExams: ["IELTS"] },
  { id: "aud", name: "American University of Dubai", country: "ОАЭ", region: "asia", ranking: 18, scholarshipAvailable: true, minGPA: 3.0, requiredExams: ["IELTS", "SAT"] },
  { id: "osaka", name: "Osaka University", country: "Япония", region: "asia", ranking: 19, scholarshipAvailable: true, minGPA: 3.5, requiredExams: ["JLPT", "IELTS"] },
  { id: "iit_bombay", name: "IIT Bombay", country: "Индия", region: "asia", ranking: 20, scholarshipAvailable: true, minGPA: 4.0, requiredExams: ["JEE"] },
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
