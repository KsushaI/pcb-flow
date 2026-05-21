// src/data/templates.js

// ============================================================
// ПАРАМЕТРЫ ПО УМОЛЧАНИЮ ДЛЯ ОПЕРАЦИЙ (только числовые)
// ============================================================

export const defaultParamsByOperation = {
  // Сверление
  'Сверление сквозных отверстий': {
    diameter: 0.8,
    speed: 12000,
    feed: 0.05
  },
  'Сверление': {
    diameter: 0.8,
    speed: 12000,
    feed: 0.05
  },

  // Травление
  'Травление меди': {
    temperature: 45,
    speed: 1.2
  },
  'Травление': {
    temperature: 45,
    speed: 1.2
  },
  'Травление внутренних слоев': {
    temperature: 45,
    time: 4
  },
  'Травление наружных слоев': {
    temperature: 45,
    time: 5
  },

  // Химическое осаждение
  'Химическое осаждение меди': {
    temperature: 22,
    time: 20,
    ph: 12.5,
    thickness: 0.5
  },
  'Химическое осаждение': {
    temperature: 22,
    time: 20,
    ph: 12.5,
    thickness: 0.5
  },

  // Гальваническое осаждение
  'Гальваническое осаждение меди': {
    thickness: 25,
    current_density: 2.0,
    temperature: 25,
    time: 45
  },
  'Гальваническое осаждение металлорезиста': {
    thickness: 8,
    current_density: 1.2
  },
  'Гальваническое меднение': {
    thickness: 25,
    current_density: 2.0,
    temperature: 25,
    time: 45
  },
  'Предварительное гальваническое осаждение': {
    thickness: 3,
    current_density: 1.5,
    temperature: 25,
    time: 15
  },

  // Прессование
  'Прессование пакета': {
    temperature: 185,
    pressure: 25,
    time: 90
  },
  'Прессование': {
    temperature: 185,
    pressure: 25,
    time: 90
  },

  // Пайка
  'Пайка': {
    temperature: 240
  },

  // Финишные покрытия
  'Финишное покрытие HASL': {
    temperature: 260,
    time: 3
  },
  'Финишное покрытие ENIG': {
    temperature: 85
  },
  'Финишное покрытие': {
    temperature: 260
  },

  // Фотолитография
  'Нанесение фоторезиста': {
    temperature: 110,
    speed: 0.5
  },
  'Экспонирование фоторезиста': {
    time: 30,
    power: 500
  },
  'Проявление фоторезиста': {
    temperature: 25,
    time: 2
  },

  // Паяльная маска
  'Нанесение паяльной маски': {
    thickness: 25
  },
  'Экспонирование паяльной маски': {
    time: 40,
    power: 600
  },
  'Проявление паяльной маски': {
    temperature: 30,
    time: 1.5
  }
};

// Функция получения параметров по умолчанию для операции
export const getDefaultParams = (label) => {
  // Точное совпадение
  if (defaultParamsByOperation[label]) {
    return { ...defaultParamsByOperation[label] };
  }
  // Поиск по вхождению
  for (const [key, params] of Object.entries(defaultParamsByOperation)) {
    if (label.includes(key) || key.includes(label)) {
      return { ...params };
    }
  }
  return {};
};

// Операции, для которых нужна шестерёнка (есть параметры)
export const operationsWithParams = [
  'Сверление', 'Травление', 'Химическое осаждение',
  'Гальваническое осаждение', 'Прессование', 'Пайка',
  'Финишное покрытие', 'Нанесение фоторезиста',
  'Экспонирование', 'Проявление', 'Нанесение паяльной маски'
];

// ============================================================
// ШАБЛОНЫ ОПЕРАЦИЙ ДЛЯ РАЗНЫХ ТИПОВ ПЛАТ
// ============================================================

export const operationTemplates = {
  common: [
    { id: 'common-1', label: 'Входной контроль материала', category: 'Подготовка' },
    { id: 'common-2', label: 'Сверление сквозных отверстий', category: 'Механика' },
    { id: 'common-3', label: 'Контроль качества', category: 'Контроль' },
    { id: 'common-4', label: 'Маркировка', category: 'Финиш' },
    { id: 'common-5', label: 'Упаковка', category: 'Финиш' }
  ],

  ОПП: [
    { id: 'opp-1', label: 'Подготовка заготовки', category: 'Подготовка' },
    { id: 'opp-2', label: 'Нанесение фоторезиста', category: 'Фотолитография' },
    { id: 'opp-3', label: 'Экспонирование фоторезиста', category: 'Фотолитография' },
    { id: 'opp-4', label: 'Проявление фоторезиста', category: 'Фотолитография' },
    { id: 'opp-5', label: 'Травление меди', category: 'Химия' },
    { id: 'opp-6', label: 'Удаление фоторезиста', category: 'Химия' },
    { id: 'opp-7', label: 'Автоматическая оптическая инспекция', category: 'Контроль' },
    { id: 'opp-8', label: 'Нанесение паяльной маски', category: 'Маскирование' },
    { id: 'opp-9', label: 'Экспонирование паяльной маски', category: 'Маскирование' },
    { id: 'opp-10', label: 'Проявление паяльной маски', category: 'Маскирование' },
    { id: 'opp-11', label: 'Пайка', category: 'Сборка' },
    { id: 'opp-12', label: 'Финишное покрытие HASL', category: 'Финиш' }
  ],

  ДПП: [
    { id: 'dpp-1', label: 'Подготовка заготовки', category: 'Подготовка' },
    { id: 'dpp-2', label: 'Сверление', category: 'Механика' },
    { id: 'dpp-3', label: 'Химическое осаждение меди', category: 'Химия' },
    { id: 'dpp-4', label: 'Предварительное гальваническое осаждение', category: 'Гальваника' },
    { id: 'dpp-5', label: 'Нанесение фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-6', label: 'Экспонирование фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-7', label: 'Проявление фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-8', label: 'Гальваническое осаждение меди', category: 'Гальваника' },
    { id: 'dpp-9', label: 'Гальваническое осаждение металлорезиста', category: 'Гальваника' },
    { id: 'dpp-10', label: 'Удаление фоторезиста', category: 'Химия' },
    { id: 'dpp-11', label: 'Травление меди', category: 'Химия' },
    { id: 'dpp-12', label: 'Удаление металлорезиста', category: 'Химия' },
    { id: 'dpp-13', label: 'Автоматическая оптическая инспекция', category: 'Контроль' },
    { id: 'dpp-14', label: 'Нанесение паяльной маски', category: 'Маскирование' },
    { id: 'dpp-15', label: 'Экспонирование паяльной маски', category: 'Маскирование' },
    { id: 'dpp-16', label: 'Проявление паяльной маски', category: 'Маскирование' },
    { id: 'dpp-17', label: 'Пайка', category: 'Сборка' },
    { id: 'dpp-18', label: 'Финишное покрытие ENIG', category: 'Финиш' }
  ],

  МПП: [
    { id: 'mpp-1', label: 'Подготовка заготовок', category: 'Подготовка' },
    { id: 'mpp-2', label: 'Формирование внутренних слоев', category: 'Фотолитография' },
    { id: 'mpp-3', label: 'Травление внутренних слоев', category: 'Химия' },
    { id: 'mpp-4', label: 'Оксидирование внутренних слоев', category: 'Химия' },
    { id: 'mpp-5', label: 'Прессование пакета', category: 'Прессование' },
    { id: 'mpp-6', label: 'Сверление', category: 'Механика' },
    { id: 'mpp-7', label: 'Химическое осаждение меди', category: 'Химия' },
    { id: 'mpp-8', label: 'Гальваническое осаждение меди', category: 'Гальваника' },
    { id: 'mpp-9', label: 'Формирование наружных слоев', category: 'Фотолитография' },
    { id: 'mpp-10', label: 'Травление наружных слоев', category: 'Химия' },
    { id: 'mpp-11', label: 'Нанесение паяльной маски', category: 'Маскирование' },
    { id: 'mpp-12', label: 'Пайка', category: 'Сборка' },
    { id: 'mpp-13', label: 'Финишное покрытие', category: 'Финиш' }
  ]
};

// ============================================================
// ШАБЛОНЫ ГОТОВЫХ ТЕХПРОЦЕССОВ
// ============================================================

export const processTemplates = {
  ОПП: {
    nodes: [
      { id: 'opp-1', type: 'custom', data: { label: 'Подготовка заготовки', params: {} }, position: { x: 100, y: 50 } },
      { id: 'opp-2', type: 'custom', data: { label: 'Сверление сквозных отверстий', params: getDefaultParams('Сверление сквозных отверстий') }, position: { x: 100, y: 150 } },
      { id: 'opp-3', type: 'custom', data: { label: 'Нанесение фоторезиста', params: getDefaultParams('Нанесение фоторезиста') }, position: { x: 100, y: 250 } },
      { id: 'opp-4', type: 'custom', data: { label: 'Экспонирование фоторезиста', params: getDefaultParams('Экспонирование фоторезиста') }, position: { x: 100, y: 350 } },
      { id: 'opp-5', type: 'custom', data: { label: 'Проявление фоторезиста', params: getDefaultParams('Проявление фоторезиста') }, position: { x: 100, y: 450 } },
      { id: 'opp-6', type: 'custom', data: { label: 'Травление меди', params: getDefaultParams('Травление меди') }, position: { x: 100, y: 550 } },
      { id: 'opp-7', type: 'custom', data: { label: 'Удаление фоторезиста', params: {} }, position: { x: 100, y: 650 } },
      { id: 'opp-8', type: 'custom', data: { label: 'Автоматическая оптическая инспекция', params: {} }, position: { x: 100, y: 750 } },
      { id: 'opp-9', type: 'custom', data: { label: 'Нанесение паяльной маски', params: getDefaultParams('Нанесение паяльной маски') }, position: { x: 100, y: 850 } },
      { id: 'opp-10', type: 'custom', data: { label: 'Пайка', params: getDefaultParams('Пайка') }, position: { x: 100, y: 950 } },
      { id: 'opp-11', type: 'custom', data: { label: 'Финишное покрытие HASL', params: getDefaultParams('Финишное покрытие HASL') }, position: { x: 100, y: 1050 } }
    ],
    edges: [
      { id: 'e1', source: 'opp-1', target: 'opp-2' }, { id: 'e2', source: 'opp-2', target: 'opp-3' },
      { id: 'e3', source: 'opp-3', target: 'opp-4' }, { id: 'e4', source: 'opp-4', target: 'opp-5' },
      { id: 'e5', source: 'opp-5', target: 'opp-6' }, { id: 'e6', source: 'opp-6', target: 'opp-7' },
      { id: 'e7', source: 'opp-7', target: 'opp-8' }, { id: 'e8', source: 'opp-8', target: 'opp-9' },
      { id: 'e9', source: 'opp-9', target: 'opp-10' }, { id: 'e10', source: 'opp-10', target: 'opp-11' }
    ]
  },

  ДПП: {
    nodes: [
      { id: 'dpp-1', type: 'custom', data: { label: 'Подготовка заготовки', params: {} }, position: { x: 100, y: 50 } },
      { id: 'dpp-2', type: 'custom', data: { label: 'Сверление', params: getDefaultParams('Сверление') }, position: { x: 100, y: 150 } },
      { id: 'dpp-3', type: 'custom', data: { label: 'Химическое осаждение меди', params: getDefaultParams('Химическое осаждение меди') }, position: { x: 100, y: 250 } },
      { id: 'dpp-4', type: 'custom', data: { label: 'Предварительное гальваническое осаждение', params: getDefaultParams('Предварительное гальваническое осаждение') }, position: { x: 100, y: 350 } },
      { id: 'dpp-5', type: 'custom', data: { label: 'Нанесение фоторезиста', params: getDefaultParams('Нанесение фоторезиста') }, position: { x: 100, y: 450 } },
      { id: 'dpp-6', type: 'custom', data: { label: 'Экспонирование фоторезиста', params: getDefaultParams('Экспонирование фоторезиста') }, position: { x: 100, y: 550 } },
      { id: 'dpp-7', type: 'custom', data: { label: 'Проявление фоторезиста', params: getDefaultParams('Проявление фоторезиста') }, position: { x: 100, y: 650 } },
      { id: 'dpp-8', type: 'custom', data: { label: 'Гальваническое осаждение меди', params: getDefaultParams('Гальваническое осаждение меди') }, position: { x: 100, y: 750 } },
      { id: 'dpp-9', type: 'custom', data: { label: 'Гальваническое осаждение металлорезиста', params: getDefaultParams('Гальваническое осаждение металлорезиста') }, position: { x: 100, y: 850 } },
      { id: 'dpp-10', type: 'custom', data: { label: 'Удаление фоторезиста', params: {} }, position: { x: 100, y: 950 } },
      { id: 'dpp-11', type: 'custom', data: { label: 'Травление меди', params: getDefaultParams('Травление меди') }, position: { x: 100, y: 1050 } },
      { id: 'dpp-12', type: 'custom', data: { label: 'Удаление металлорезиста', params: {} }, position: { x: 100, y: 1150 } },
      { id: 'dpp-13', type: 'custom', data: { label: 'Автоматическая оптическая инспекция', params: {} }, position: { x: 100, y: 1250 } },
      { id: 'dpp-14', type: 'custom', data: { label: 'Нанесение паяльной маски', params: getDefaultParams('Нанесение паяльной маски') }, position: { x: 100, y: 1350 } },
      { id: 'dpp-15', type: 'custom', data: { label: 'Пайка', params: getDefaultParams('Пайка') }, position: { x: 100, y: 1450 } },
      { id: 'dpp-16', type: 'custom', data: { label: 'Финишное покрытие ENIG', params: getDefaultParams('Финишное покрытие ENIG') }, position: { x: 100, y: 1550 } }
    ],
    edges: [
      { id: 'e1', source: 'dpp-1', target: 'dpp-2' }, { id: 'e2', source: 'dpp-2', target: 'dpp-3' },
      { id: 'e3', source: 'dpp-3', target: 'dpp-4' }, { id: 'e4', source: 'dpp-4', target: 'dpp-5' },
      { id: 'e5', source: 'dpp-5', target: 'dpp-6' }, { id: 'e6', source: 'dpp-6', target: 'dpp-7' },
      { id: 'e7', source: 'dpp-7', target: 'dpp-8' }, { id: 'e8', source: 'dpp-8', target: 'dpp-9' },
      { id: 'e9', source: 'dpp-9', target: 'dpp-10' }, { id: 'e10', source: 'dpp-10', target: 'dpp-11' },
      { id: 'e11', source: 'dpp-11', target: 'dpp-12' }, { id: 'e12', source: 'dpp-12', target: 'dpp-13' },
      { id: 'e13', source: 'dpp-13', target: 'dpp-14' }, { id: 'e14', source: 'dpp-14', target: 'dpp-15' },
      { id: 'e15', source: 'dpp-15', target: 'dpp-16' }
    ]
  }
};