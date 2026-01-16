import { PhaseDefinition } from "./types";

type Language = "ru" | "kk" | "en";

export const getPhaseDefinitions = (language: Language): PhaseDefinition[] => {
  const definitions: Record<Language, PhaseDefinition[]> = {
    ru: [
      {
        id: "foundation",
        number: 1,
        name: "Foundation",
        subtitle: "Строим базу",
        description: "Создание академического фундамента для топ-университетов",
        color: "from-blue-500 to-indigo-600",
        icon: "foundation",
        requirements: [
          {
            key: "sat_diagnostic_1350",
            label: "SAT диагностика ≥1350",
            description: "Пройдите SAT диагностику и получите ≥1350 баллов",
            submissionType: "sat_diagnostic",
            fields: [
              { name: "score", label: "Ваш балл SAT", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofType", label: "Источник", type: "select", required: true, options: [
                { value: "bluebook", label: "College Board Bluebook" },
                { value: "khan", label: "Khan Academy" },
              ]},
              { name: "proofLink", label: "Ссылка на результат", type: "url", required: true, placeholder: "https://..." },
            ],
          },
          {
            key: "project_topic",
            label: "Тема долгосрочного проекта",
            description: "Выберите и начните работу над долгосрочным проектом",
            submissionType: "project_topic",
            fields: [
              { name: "topicName", label: "Название проекта", type: "text", required: true },
              { name: "description", label: "Краткое описание", type: "textarea", required: true, placeholder: "Опишите суть проекта в 2-3 предложениях" },
              { name: "platform", label: "Платформа", type: "select", required: true, options: [
                { value: "github", label: "GitHub" },
                { value: "notion", label: "Notion" },
                { value: "gdocs", label: "Google Docs" },
              ]},
              { name: "proofLink", label: "Ссылка на проект", type: "url", required: true },
            ],
          },
          {
            key: "mock_sat_3x",
            label: "3 пробных SAT",
            description: "Пройдите минимум 3 полных пробных теста SAT",
            submissionType: "mock_sat_completion",
            fields: [
              { name: "attemptCount", label: "Количество попыток", type: "number", required: true, validation: { min: 3 } },
              { name: "bestScore", label: "Лучший балл", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofLinks", label: "Ссылки на результаты (через запятую)", type: "textarea", required: true },
            ],
          },
          {
            key: "mock_sat_1450",
            label: "Лучший балл ≥1450",
            description: "Достигните минимум 1450 баллов в пробном SAT",
            submissionType: "mock_sat_completion",
            fields: [],
          },
          {
            key: "self_analysis",
            label: "Структурированный самоанализ",
            description: "Проанализируйте свои сильные и слабые стороны",
            submissionType: "self_analysis",
            fields: [
              { name: "strengths", label: "Сильные стороны (минимум 2)", type: "textarea", required: true, placeholder: "Перечислите через запятую" },
              { name: "weaknesses", label: "Слабые стороны (минимум 2)", type: "textarea", required: true, placeholder: "Перечислите через запятую" },
              { name: "improvementPlan", label: "План улучшений", type: "textarea", required: true, placeholder: "Конкретные шаги для работы над слабыми сторонами" },
            ],
          },
        ],
        unlockConditions: [
          "SAT диагностика ≥1350 с верифицированным доказательством",
          "Тема проекта выбрана и работа начата",
          "3 пробных SAT с лучшим баллом ≥1450",
          "Структурированный самоанализ заполнен",
        ],
      },
      {
        id: "differentiation",
        number: 2,
        name: "Differentiation",
        subtitle: "Выделяемся",
        description: "Станьте неординарным кандидатом через реальные достижения",
        color: "from-purple-500 to-pink-600",
        icon: "differentiation",
        requirements: [
          {
            key: "track_selection",
            label: "Выбор направления",
            description: "Выберите ОДНО направление: Research, Startup, Olympiad, или Social Impact",
            submissionType: "track_selection",
            fields: [
              { name: "track", label: "Направление", type: "select", required: true, options: [
                { value: "research", label: "Research — Исследования" },
                { value: "startup", label: "Startup — Предпринимательство" },
                { value: "olympiad", label: "Olympiad — Олимпиады" },
                { value: "social_impact", label: "Social Impact — Социальное влияние" },
              ]},
            ],
          },
          {
            key: "public_artifact",
            label: "Публичный артефакт",
            description: "Создайте публично доступный результат вашей работы",
            submissionType: "public_artifact",
            fields: [
              { name: "artifactType", label: "Тип артефакта", type: "text", required: true, placeholder: "Например: репозиторий, статья, продукт" },
              { name: "artifactLink", label: "Ссылка на артефакт", type: "url", required: true },
              { name: "description", label: "Описание", type: "textarea", required: true },
            ],
          },
          {
            key: "measurable_metric",
            label: "Измеримая метрика",
            description: "Предоставьте конкретную числовую метрику результата",
            submissionType: "measurable_metric",
            fields: [
              { name: "metricType", label: "Тип метрики", type: "text", required: true, placeholder: "Например: пользователи, просмотры, место" },
              { name: "metricValue", label: "Значение", type: "number", required: true },
              { name: "metricUnit", label: "Единица измерения", type: "text", required: false, placeholder: "Например: человек, %" },
              { name: "proofLink", label: "Ссылка на доказательство", type: "url", required: true },
            ],
          },
          {
            key: "external_validation",
            label: "Внешняя валидация",
            description: "Получите подтверждение от ментора, соревнования или пользователей",
            submissionType: "external_validation",
            fields: [
              { name: "validationType", label: "Тип валидации", type: "select", required: true, options: [
                { value: "mentor", label: "Ментор / Эксперт" },
                { value: "competition", label: "Соревнование / Конкурс" },
                { value: "users", label: "Пользователи / Аудитория" },
              ]},
              { name: "evidence", label: "Описание подтверждения", type: "textarea", required: true },
              { name: "proofLink", label: "Ссылка на доказательство", type: "url", required: true },
            ],
          },
        ],
        unlockConditions: [
          "Минимум 1 завершённый проект с измеримым результатом",
          "Публично верифицируемое доказательство",
        ],
      },
      {
        id: "proof",
        number: 3,
        name: "Proof",
        subtitle: "Доказываем",
        description: "Конвертируйте достижения в убедительные аргументы для admission",
        color: "from-emerald-500 to-teal-600",
        icon: "proof",
        requirements: [
          {
            key: "recommender_1",
            label: "Рекомендатель 1",
            description: "Определите первого рекомендателя",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender1.name", label: "Имя рекомендателя", type: "text", required: true },
              { name: "recommender1.role", label: "Должность", type: "text", required: true },
              { name: "recommender1.affiliation", label: "Организация", type: "text", required: true },
            ],
          },
          {
            key: "recommender_2",
            label: "Рекомендатель 2",
            description: "Определите второго рекомендателя",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender2.name", label: "Имя рекомендателя", type: "text", required: true },
              { name: "recommender2.role", label: "Должность", type: "text", required: true },
              { name: "recommender2.affiliation", label: "Организация", type: "text", required: true },
            ],
          },
          {
            key: "honors_recognition",
            label: "Награды и признание",
            description: "Загрузите доказательства наград и признания",
            submissionType: "honors_recognition",
            fields: [
              { name: "honorName", label: "Название награды", type: "text", required: true },
              { name: "level", label: "Уровень", type: "select", required: true, options: [
                { value: "school", label: "Школьный" },
                { value: "regional", label: "Региональный" },
                { value: "national", label: "Национальный" },
                { value: "international", label: "Международный" },
              ]},
              { name: "issuingOrg", label: "Организация-учредитель", type: "text", required: true },
              { name: "proofLink", label: "Ссылка на сертификат/результаты", type: "url", required: true },
            ],
          },
          {
            key: "narrative_approved",
            label: "Нарратив одобрен AI",
            description: "Структура: Кто я → Что я создал → Почему это важно",
            submissionType: "narrative_structure",
            fields: [
              { name: "whoIAm", label: "Кто я (2-4 предложения)", type: "textarea", required: true },
              { name: "whatIBuilt", label: "Что я создал (2-4 предложения)", type: "textarea", required: true },
              { name: "whyItMatters", label: "Почему это важно (2-4 предложения)", type: "textarea", required: true },
            ],
          },
        ],
        unlockConditions: [
          "2 подтверждённых рекомендателя",
          "Минимум 1 награда национального/международного уровня",
        ],
      },
      {
        id: "leverage",
        number: 4,
        name: "Leverage",
        subtitle: "Конвертируем",
        description: "Превратите профиль в предложения о поступлении",
        color: "from-amber-500 to-orange-600",
        icon: "leverage",
        requirements: [
          {
            key: "university_list",
            label: "Список университетов",
            description: "Сформируйте сбалансированный список: Reach / Match / Safety",
            submissionType: "university_list",
            fields: [
              { name: "reachSchools", label: "Reach (мечта) — минимум 2", type: "textarea", required: true, placeholder: "Университеты через запятую" },
              { name: "matchSchools", label: "Match (реалистичные) — минимум 3", type: "textarea", required: true, placeholder: "Университеты через запятую" },
              { name: "safetySchools", label: "Safety (запасные) — минимум 2", type: "textarea", required: true, placeholder: "Университеты через запятую" },
            ],
          },
          {
            key: "scholarship_strategy",
            label: "Стратегия стипендий",
            description: "Определите целевые стипендии и финансовую стратегию",
            submissionType: "scholarship_strategy",
            fields: [
              { name: "scholarships", label: "Целевые стипендии (минимум 3)", type: "textarea", required: true, placeholder: "Названия через запятую" },
              { name: "aidStrategy", label: "Стратегия финансовой помощи", type: "textarea", required: true },
              { name: "financialNeedDocs", label: "Документы о финансовой потребности готовы?", type: "select", required: true, options: [
                { value: "yes", label: "Да" },
                { value: "no", label: "Нет" },
                { value: "partial", label: "Частично" },
              ]},
            ],
          },
        ],
        unlockConditions: [
          "Завершение всех предыдущих фаз",
        ],
      },
    ],
    kk: [
      {
        id: "foundation",
        number: 1,
        name: "Foundation",
        subtitle: "Негіз құру",
        description: "Топ университеттер үшін академиялық негіз құру",
        color: "from-blue-500 to-indigo-600",
        icon: "foundation",
        requirements: [
          {
            key: "sat_diagnostic_1350",
            label: "SAT диагностикасы ≥1350",
            description: "SAT диагностикасынан өтіп, ≥1350 балл алыңыз",
            submissionType: "sat_diagnostic",
            fields: [
              { name: "score", label: "SAT балыңыз", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofType", label: "Дереккөз", type: "select", required: true, options: [
                { value: "bluebook", label: "College Board Bluebook" },
                { value: "khan", label: "Khan Academy" },
              ]},
              { name: "proofLink", label: "Нәтижеге сілтеме", type: "url", required: true, placeholder: "https://..." },
            ],
          },
          {
            key: "project_topic",
            label: "Ұзақ мерзімді жоба тақырыбы",
            description: "Ұзақ мерзімді жобаны таңдап, жұмысты бастаңыз",
            submissionType: "project_topic",
            fields: [
              { name: "topicName", label: "Жоба атауы", type: "text", required: true },
              { name: "description", label: "Қысқаша сипаттама", type: "textarea", required: true },
              { name: "platform", label: "Платформа", type: "select", required: true, options: [
                { value: "github", label: "GitHub" },
                { value: "notion", label: "Notion" },
                { value: "gdocs", label: "Google Docs" },
              ]},
              { name: "proofLink", label: "Жобаға сілтеме", type: "url", required: true },
            ],
          },
          {
            key: "mock_sat_3x",
            label: "3 сынақ SAT",
            description: "Кемінде 3 толық сынақ SAT тесттерінен өтіңіз",
            submissionType: "mock_sat_completion",
            fields: [
              { name: "attemptCount", label: "Әрекеттер саны", type: "number", required: true, validation: { min: 3 } },
              { name: "bestScore", label: "Үздік балл", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofLinks", label: "Нәтижелерге сілтемелер", type: "textarea", required: true },
            ],
          },
          {
            key: "mock_sat_1450",
            label: "Үздік балл ≥1450",
            description: "Сынақ SAT-та кемінде 1450 балл алыңыз",
            submissionType: "mock_sat_completion",
            fields: [],
          },
          {
            key: "self_analysis",
            label: "Құрылымды өзін-өзі талдау",
            description: "Күшті және әлсіз жақтарыңызды талдаңыз",
            submissionType: "self_analysis",
            fields: [
              { name: "strengths", label: "Күшті жақтары (кемінде 2)", type: "textarea", required: true },
              { name: "weaknesses", label: "Әлсіз жақтары (кемінде 2)", type: "textarea", required: true },
              { name: "improvementPlan", label: "Жақсарту жоспары", type: "textarea", required: true },
            ],
          },
        ],
        unlockConditions: [
          "SAT диагностикасы ≥1350 дәлелденген",
          "Жоба тақырыбы таңдалды және жұмыс басталды",
          "3 сынақ SAT, үздік балл ≥1450",
          "Құрылымды өзін-өзі талдау толтырылды",
        ],
      },
      {
        id: "differentiation",
        number: 2,
        name: "Differentiation",
        subtitle: "Ерекшелену",
        description: "Нақты жетістіктер арқылы ерекше үміткерге айналыңыз",
        color: "from-purple-500 to-pink-600",
        icon: "differentiation",
        requirements: [
          {
            key: "track_selection",
            label: "Бағыт таңдау",
            description: "БІР бағыт таңдаңыз: Research, Startup, Olympiad немесе Social Impact",
            submissionType: "track_selection",
            fields: [
              { name: "track", label: "Бағыт", type: "select", required: true, options: [
                { value: "research", label: "Research — Зерттеу" },
                { value: "startup", label: "Startup — Кәсіпкерлік" },
                { value: "olympiad", label: "Olympiad — Олимпиадалар" },
                { value: "social_impact", label: "Social Impact — Әлеуметтік әсер" },
              ]},
            ],
          },
          {
            key: "public_artifact",
            label: "Жария артефакт",
            description: "Жұмысыңыздың жария қолжетімді нәтижесін жасаңыз",
            submissionType: "public_artifact",
            fields: [
              { name: "artifactType", label: "Артефакт түрі", type: "text", required: true },
              { name: "artifactLink", label: "Артефактқа сілтеме", type: "url", required: true },
              { name: "description", label: "Сипаттама", type: "textarea", required: true },
            ],
          },
          {
            key: "measurable_metric",
            label: "Өлшенетін метрика",
            description: "Нәтиженің нақты сандық көрсеткішін беріңіз",
            submissionType: "measurable_metric",
            fields: [
              { name: "metricType", label: "Метрика түрі", type: "text", required: true },
              { name: "metricValue", label: "Мәні", type: "number", required: true },
              { name: "metricUnit", label: "Өлшем бірлігі", type: "text", required: false },
              { name: "proofLink", label: "Дәлелге сілтеме", type: "url", required: true },
            ],
          },
          {
            key: "external_validation",
            label: "Сыртқы валидация",
            description: "Тәлімгерден, жарыстан немесе пайдаланушылардан растау алыңыз",
            submissionType: "external_validation",
            fields: [
              { name: "validationType", label: "Валидация түрі", type: "select", required: true, options: [
                { value: "mentor", label: "Тәлімгер / Сарапшы" },
                { value: "competition", label: "Жарыс / Конкурс" },
                { value: "users", label: "Пайдаланушылар / Аудитория" },
              ]},
              { name: "evidence", label: "Растау сипаттамасы", type: "textarea", required: true },
              { name: "proofLink", label: "Дәлелге сілтеме", type: "url", required: true },
            ],
          },
        ],
        unlockConditions: [
          "Кемінде 1 аяқталған жоба өлшенетін нәтижемен",
          "Жария тексерілетін дәлел",
        ],
      },
      {
        id: "proof",
        number: 3,
        name: "Proof",
        subtitle: "Дәлелдеу",
        description: "Жетістіктерді admission үшін сенімді дәлелдерге айналдырыңыз",
        color: "from-emerald-500 to-teal-600",
        icon: "proof",
        requirements: [
          {
            key: "recommender_1",
            label: "Ұсынушы 1",
            description: "Бірінші ұсынушыны анықтаңыз",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender1.name", label: "Ұсынушы аты", type: "text", required: true },
              { name: "recommender1.role", label: "Лауазымы", type: "text", required: true },
              { name: "recommender1.affiliation", label: "Ұйым", type: "text", required: true },
            ],
          },
          {
            key: "recommender_2",
            label: "Ұсынушы 2",
            description: "Екінші ұсынушыны анықтаңыз",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender2.name", label: "Ұсынушы аты", type: "text", required: true },
              { name: "recommender2.role", label: "Лауазымы", type: "text", required: true },
              { name: "recommender2.affiliation", label: "Ұйым", type: "text", required: true },
            ],
          },
          {
            key: "honors_recognition",
            label: "Марапаттар мен мойындау",
            description: "Марапаттар мен мойындаудың дәлелдерін жүктеңіз",
            submissionType: "honors_recognition",
            fields: [
              { name: "honorName", label: "Марапат атауы", type: "text", required: true },
              { name: "level", label: "Деңгей", type: "select", required: true, options: [
                { value: "school", label: "Мектеп" },
                { value: "regional", label: "Аймақтық" },
                { value: "national", label: "Ұлттық" },
                { value: "international", label: "Халықаралық" },
              ]},
              { name: "issuingOrg", label: "Ұйымдастырушы ұйым", type: "text", required: true },
              { name: "proofLink", label: "Сертификатқа сілтеме", type: "url", required: true },
            ],
          },
          {
            key: "narrative_approved",
            label: "Баяндама AI мақұлдады",
            description: "Құрылым: Мен кіммін → Не құрдым → Неге маңызды",
            submissionType: "narrative_structure",
            fields: [
              { name: "whoIAm", label: "Мен кіммін (2-4 сөйлем)", type: "textarea", required: true },
              { name: "whatIBuilt", label: "Не құрдым (2-4 сөйлем)", type: "textarea", required: true },
              { name: "whyItMatters", label: "Неге маңызды (2-4 сөйлем)", type: "textarea", required: true },
            ],
          },
        ],
        unlockConditions: [
          "2 расталған ұсынушы",
          "Кемінде 1 ұлттық/халықаралық деңгейдегі марапат",
        ],
      },
      {
        id: "leverage",
        number: 4,
        name: "Leverage",
        subtitle: "Түрлендіру",
        description: "Профильді қабылдау туралы ұсыныстарға айналдырыңыз",
        color: "from-amber-500 to-orange-600",
        icon: "leverage",
        requirements: [
          {
            key: "university_list",
            label: "Университеттер тізімі",
            description: "Теңгерімді тізім құрыңыз: Reach / Match / Safety",
            submissionType: "university_list",
            fields: [
              { name: "reachSchools", label: "Reach (арман) — кемінде 2", type: "textarea", required: true },
              { name: "matchSchools", label: "Match (шынайы) — кемінде 3", type: "textarea", required: true },
              { name: "safetySchools", label: "Safety (қосалқы) — кемінде 2", type: "textarea", required: true },
            ],
          },
          {
            key: "scholarship_strategy",
            label: "Стипендия стратегиясы",
            description: "Мақсатты стипендиялар мен қаржылық стратегияны анықтаңыз",
            submissionType: "scholarship_strategy",
            fields: [
              { name: "scholarships", label: "Мақсатты стипендиялар (кемінде 3)", type: "textarea", required: true },
              { name: "aidStrategy", label: "Қаржылық көмек стратегиясы", type: "textarea", required: true },
              { name: "financialNeedDocs", label: "Қаржылық қажеттілік құжаттары дайын ба?", type: "select", required: true, options: [
                { value: "yes", label: "Иә" },
                { value: "no", label: "Жоқ" },
                { value: "partial", label: "Жартылай" },
              ]},
            ],
          },
        ],
        unlockConditions: [
          "Барлық алдыңғы фазалардың аяқталуы",
        ],
      },
    ],
    en: [
      {
        id: "foundation",
        number: 1,
        name: "Foundation",
        subtitle: "Build the Base",
        description: "Create the academic foundation for top universities",
        color: "from-blue-500 to-indigo-600",
        icon: "foundation",
        requirements: [
          {
            key: "sat_diagnostic_1350",
            label: "SAT Diagnostic ≥1350",
            description: "Complete SAT diagnostic and score ≥1350",
            submissionType: "sat_diagnostic",
            fields: [
              { name: "score", label: "Your SAT Score", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofType", label: "Source", type: "select", required: true, options: [
                { value: "bluebook", label: "College Board Bluebook" },
                { value: "khan", label: "Khan Academy" },
              ]},
              { name: "proofLink", label: "Link to Result", type: "url", required: true, placeholder: "https://..." },
            ],
          },
          {
            key: "project_topic",
            label: "Long-term Project Topic",
            description: "Choose and start working on a long-term project",
            submissionType: "project_topic",
            fields: [
              { name: "topicName", label: "Project Name", type: "text", required: true },
              { name: "description", label: "Brief Description", type: "textarea", required: true },
              { name: "platform", label: "Platform", type: "select", required: true, options: [
                { value: "github", label: "GitHub" },
                { value: "notion", label: "Notion" },
                { value: "gdocs", label: "Google Docs" },
              ]},
              { name: "proofLink", label: "Link to Project", type: "url", required: true },
            ],
          },
          {
            key: "mock_sat_3x",
            label: "3 Mock SAT Attempts",
            description: "Complete at least 3 full mock SAT tests",
            submissionType: "mock_sat_completion",
            fields: [
              { name: "attemptCount", label: "Number of Attempts", type: "number", required: true, validation: { min: 3 } },
              { name: "bestScore", label: "Best Score", type: "number", required: true, validation: { min: 400, max: 1600 } },
              { name: "proofLinks", label: "Links to Results (comma-separated)", type: "textarea", required: true },
            ],
          },
          {
            key: "mock_sat_1450",
            label: "Best Score ≥1450",
            description: "Achieve at least 1450 on a mock SAT",
            submissionType: "mock_sat_completion",
            fields: [],
          },
          {
            key: "self_analysis",
            label: "Structured Self-Analysis",
            description: "Analyze your strengths and weaknesses",
            submissionType: "self_analysis",
            fields: [
              { name: "strengths", label: "Strengths (at least 2)", type: "textarea", required: true },
              { name: "weaknesses", label: "Weaknesses (at least 2)", type: "textarea", required: true },
              { name: "improvementPlan", label: "Improvement Plan", type: "textarea", required: true },
            ],
          },
        ],
        unlockConditions: [
          "SAT diagnostic ≥1350 with verified proof",
          "Project topic chosen and work started",
          "3 mock SATs with best score ≥1450",
          "Structured self-analysis completed",
        ],
      },
      {
        id: "differentiation",
        number: 2,
        name: "Differentiation",
        subtitle: "Stand Out",
        description: "Become a non-generic candidate through real achievements",
        color: "from-purple-500 to-pink-600",
        icon: "differentiation",
        requirements: [
          {
            key: "track_selection",
            label: "Track Selection",
            description: "Choose ONE track: Research, Startup, Olympiad, or Social Impact",
            submissionType: "track_selection",
            fields: [
              { name: "track", label: "Track", type: "select", required: true, options: [
                { value: "research", label: "Research" },
                { value: "startup", label: "Startup" },
                { value: "olympiad", label: "Olympiad" },
                { value: "social_impact", label: "Social Impact" },
              ]},
            ],
          },
          {
            key: "public_artifact",
            label: "Public Artifact",
            description: "Create a publicly accessible result of your work",
            submissionType: "public_artifact",
            fields: [
              { name: "artifactType", label: "Artifact Type", type: "text", required: true },
              { name: "artifactLink", label: "Link to Artifact", type: "url", required: true },
              { name: "description", label: "Description", type: "textarea", required: true },
            ],
          },
          {
            key: "measurable_metric",
            label: "Measurable Metric",
            description: "Provide a specific numerical metric of your result",
            submissionType: "measurable_metric",
            fields: [
              { name: "metricType", label: "Metric Type", type: "text", required: true },
              { name: "metricValue", label: "Value", type: "number", required: true },
              { name: "metricUnit", label: "Unit", type: "text", required: false },
              { name: "proofLink", label: "Link to Proof", type: "url", required: true },
            ],
          },
          {
            key: "external_validation",
            label: "External Validation",
            description: "Get confirmation from mentor, competition, or users",
            submissionType: "external_validation",
            fields: [
              { name: "validationType", label: "Validation Type", type: "select", required: true, options: [
                { value: "mentor", label: "Mentor / Expert" },
                { value: "competition", label: "Competition / Contest" },
                { value: "users", label: "Users / Audience" },
              ]},
              { name: "evidence", label: "Evidence Description", type: "textarea", required: true },
              { name: "proofLink", label: "Link to Proof", type: "url", required: true },
            ],
          },
        ],
        unlockConditions: [
          "At least 1 completed project with measurable impact",
          "Publicly verifiable evidence",
        ],
      },
      {
        id: "proof",
        number: 3,
        name: "Proof",
        subtitle: "Prove It",
        description: "Convert achievements into admissions-ready credibility",
        color: "from-emerald-500 to-teal-600",
        icon: "proof",
        requirements: [
          {
            key: "recommender_1",
            label: "Recommender 1",
            description: "Identify your first recommender",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender1.name", label: "Recommender Name", type: "text", required: true },
              { name: "recommender1.role", label: "Position", type: "text", required: true },
              { name: "recommender1.affiliation", label: "Organization", type: "text", required: true },
            ],
          },
          {
            key: "recommender_2",
            label: "Recommender 2",
            description: "Identify your second recommender",
            submissionType: "recommender_identification",
            fields: [
              { name: "recommender2.name", label: "Recommender Name", type: "text", required: true },
              { name: "recommender2.role", label: "Position", type: "text", required: true },
              { name: "recommender2.affiliation", label: "Organization", type: "text", required: true },
            ],
          },
          {
            key: "honors_recognition",
            label: "Honors & Recognition",
            description: "Upload proof of honors and recognition",
            submissionType: "honors_recognition",
            fields: [
              { name: "honorName", label: "Honor Name", type: "text", required: true },
              { name: "level", label: "Level", type: "select", required: true, options: [
                { value: "school", label: "School" },
                { value: "regional", label: "Regional" },
                { value: "national", label: "National" },
                { value: "international", label: "International" },
              ]},
              { name: "issuingOrg", label: "Issuing Organization", type: "text", required: true },
              { name: "proofLink", label: "Link to Certificate/Results", type: "url", required: true },
            ],
          },
          {
            key: "narrative_approved",
            label: "Narrative Approved by AI",
            description: "Structure: Who I am → What I built → Why it matters",
            submissionType: "narrative_structure",
            fields: [
              { name: "whoIAm", label: "Who I Am (2-4 sentences)", type: "textarea", required: true },
              { name: "whatIBuilt", label: "What I Built (2-4 sentences)", type: "textarea", required: true },
              { name: "whyItMatters", label: "Why It Matters (2-4 sentences)", type: "textarea", required: true },
            ],
          },
        ],
        unlockConditions: [
          "2 confirmed recommenders",
          "At least 1 national/international level recognition",
        ],
      },
      {
        id: "leverage",
        number: 4,
        name: "Leverage",
        subtitle: "Convert",
        description: "Turn your profile into admission offers",
        color: "from-amber-500 to-orange-600",
        icon: "leverage",
        requirements: [
          {
            key: "university_list",
            label: "University List",
            description: "Build a balanced list: Reach / Match / Safety",
            submissionType: "university_list",
            fields: [
              { name: "reachSchools", label: "Reach (dream) — at least 2", type: "textarea", required: true },
              { name: "matchSchools", label: "Match (realistic) — at least 3", type: "textarea", required: true },
              { name: "safetySchools", label: "Safety (backup) — at least 2", type: "textarea", required: true },
            ],
          },
          {
            key: "scholarship_strategy",
            label: "Scholarship Strategy",
            description: "Define target scholarships and financial strategy",
            submissionType: "scholarship_strategy",
            fields: [
              { name: "scholarships", label: "Target Scholarships (at least 3)", type: "textarea", required: true },
              { name: "aidStrategy", label: "Financial Aid Strategy", type: "textarea", required: true },
              { name: "financialNeedDocs", label: "Financial need documents ready?", type: "select", required: true, options: [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "partial", label: "Partial" },
              ]},
            ],
          },
        ],
        unlockConditions: [
          "Completion of all previous phases",
        ],
      },
    ],
  };

  return definitions[language] || definitions.en;
};
