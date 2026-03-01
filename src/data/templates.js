// Шаблоны операций для разных типов плат
export const operationTemplates = {
  // Базовые операции (для всех типов)
  common: [
    { id: 'common-1', label: 'Входной контроль материала', category: 'Подготовка' },
    { id: 'common-2', label: 'Сверление сквозных отверстий', category: 'Механика' },
    { id: 'common-3', label: 'Контроль качества', category: 'Контроль' },
    { id: 'common-4', label: 'Маркировка', category: 'Финиш' },
    { id: 'common-5', label: 'Упаковка', category: 'Финиш' }
  ],
  
  // Односторонние платы
  ОПП: [
    { id: 'opp-1', label: 'Подготовка заготовки', category: 'Подготовка' },
    { id: 'opp-2', label: 'Нанесение фоторезиста', category: 'Фотолитография' },
    { id: 'opp-3', label: 'Экспонирование фоторезиста', category: 'Фотолитография' },
    { id: 'opp-4', label: 'Проявление фоторезиста', category: 'Фотолитография' },
    { id: 'opp-5', label: 'Травление меди', category: 'Химия' },
    { id: 'opp-6', label: 'Удаление фоторезиста', category: 'Химия' },
    { id: 'opp-7', label: 'Автоматическая оптическая инспекция', category: 'Контроль' },
    { id: 'opp-8', label: 'Нанесение паяльной маски', category: 'Маскирование' },
    { id: 'opp-9', label: 'Экспонирование маски', category: 'Маскирование' },
    { id: 'opp-10', label: 'Проявление маски', category: 'Маскирование' },
    { id: 'opp-11', label: 'Финишное покрытие HASL', category: 'Финиш' }
  ],
  
  // Двусторонние платы
  ДПП: [
    { id: 'dpp-1', label: 'Подготовка заготовки', category: 'Подготовка' },
    { id: 'dpp-2', label: 'Химическое осаждение меди', category: 'Химия' },
    { id: 'dpp-3', label: 'Предварительное гальваническое осаждение', category: 'Гальваника' },
    { id: 'dpp-4', label: 'Нанесение фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-5', label: 'Экспонирование фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-6', label: 'Проявление фоторезиста', category: 'Фотолитография' },
    { id: 'dpp-7', label: 'Гальваническое осаждение меди', category: 'Гальваника' },
    { id: 'dpp-8', label: 'Гальваническое осаждение металлорезиста', category: 'Гальваника' },
    { id: 'dpp-9', label: 'Удаление фоторезиста', category: 'Химия' },
    { id: 'dpp-10', label: 'Травление меди', category: 'Химия' },
    { id: 'dpp-11', label: 'Удаление металлорезиста', category: 'Химия' },
    { id: 'dpp-12', label: 'Автоматическая оптическая инспекция', category: 'Контроль' },
    { id: 'dpp-13', label: 'Нанесение паяльной маски', category: 'Маскирование' },
    { id: 'dpp-14', label: 'Экспонирование маски', category: 'Маскирование' },
    { id: 'dpp-15', label: 'Проявление маски', category: 'Маскирование' },
    { id: 'dpp-16', label: 'Финишное покрытие ENIG', category: 'Финиш' }
  ],
  
  // Многослойные платы
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
    { id: 'mpp-11', label: 'Нанесение маски', category: 'Маскирование' },
    { id: 'mpp-12', label: 'Финишное покрытие', category: 'Финиш' }
  ]
};

// Шаблоны готовых техпроцессов
export const processTemplates = {
  ОПП: {
    nodes: [
      { id: 'opp-1', type: 'custom', data: { label: 'Подготовка заготовки' }, position: { x: 100, y: 50 } },
      { id: 'opp-2', type: 'custom', data: { label: 'Сверление сквозных отверстий' }, position: { x: 100, y: 150 } },
      { id: 'opp-3', type: 'custom', data: { label: 'Нанесение фоторезиста' }, position: { x: 100, y: 250 } },
      { id: 'opp-4', type: 'custom', data: { label: 'Экспонирование фоторезиста' }, position: { x: 100, y: 350 } },
      { id: 'opp-5', type: 'custom', data: { label: 'Проявление фоторезиста' }, position: { x: 100, y: 450 } },
      { id: 'opp-6', type: 'custom', data: { label: 'Травление меди' }, position: { x: 100, y: 550 } },
      { id: 'opp-7', type: 'custom', data: { label: 'Удаление фоторезиста' }, position: { x: 100, y: 650 } },
      { id: 'opp-8', type: 'custom', data: { label: 'Оптическая инспекция' }, position: { x: 100, y: 750 } }
    ],
    edges: [
      { id: 'e1', source: 'opp-1', target: 'opp-2' },
      { id: 'e2', source: 'opp-2', target: 'opp-3' },
      { id: 'e3', source: 'opp-3', target: 'opp-4' },
      { id: 'e4', source: 'opp-4', target: 'opp-5' },
      { id: 'e5', source: 'opp-5', target: 'opp-6' },
      { id: 'e6', source: 'opp-6', target: 'opp-7' },
      { id: 'e7', source: 'opp-7', target: 'opp-8' }
    ]
  },
  
  ДПП: {
    nodes: [
      { id: 'dpp-1', type: 'custom', data: { label: 'Подготовка заготовки' }, position: { x: 100, y: 50 } },
      { id: 'dpp-2', type: 'custom', data: { label: 'Сверление отверстий' }, position: { x: 100, y: 150 } },
      { id: 'dpp-3', type: 'custom', data: { label: 'Химическое осаждение' }, position: { x: 100, y: 250 } },
      { id: 'dpp-4', type: 'custom', data: { label: 'Предварительная гальваника' }, position: { x: 100, y: 350 } },
      { id: 'dpp-5', type: 'custom', data: { label: 'Нанесение фоторезиста' }, position: { x: 100, y: 450 } },
      { id: 'dpp-6', type: 'custom', data: { label: 'Экспонирование' }, position: { x: 100, y: 550 } },
      { id: 'dpp-7', type: 'custom', data: { label: 'Проявление' }, position: { x: 100, y: 650 } },
      { id: 'dpp-8', type: 'custom', data: { label: 'Гальваническое меднение' }, position: { x: 100, y: 750 } },
      { id: 'dpp-9', type: 'custom', data: { label: 'Металлорезист' }, position: { x: 100, y: 850 } }
    ],
    edges: [
      { id: 'e1', source: 'dpp-1', target: 'dpp-2' },
      { id: 'e2', source: 'dpp-2', target: 'dpp-3' },
      { id: 'e3', source: 'dpp-3', target: 'dpp-4' },
      { id: 'e4', source: 'dpp-4', target: 'dpp-5' },
      { id: 'e5', source: 'dpp-5', target: 'dpp-6' },
      { id: 'e6', source: 'dpp-6', target: 'dpp-7' },
      { id: 'e7', source: 'dpp-7', target: 'dpp-8' },
      { id: 'e8', source: 'dpp-8', target: 'dpp-9' }
    ]
  }
};