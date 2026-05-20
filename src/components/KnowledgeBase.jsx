// src/data/knowledgeBase.js

// ============================================================
// 1. БАЗА ЗНАНИЙ — 44 правила
// ============================================================

// src/data/knowledgeBase.js

// ============================================================
// БАЗА ЗНАНИЙ — 50+ ПРАВИЛ ДЛЯ ВЕРИФИКАЦИИ ТЕХПРОЦЕССОВ
// ============================================================

export const rulesDatabase = [
  // ============================================================
  // 1. ОБЯЗАТЕЛЬНЫЕ ОПЕРАЦИИ (mandatory)
  // ============================================================
  
  // ----- Для всех типов плат -----
  {
    id: "man-001",
    category: "mandatory",
    description: "В любом техпроцессе обязателен контроль качества",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "must_exist", operation: "Контроль" },
    source: "ГОСТ 3.1428",
    severity: "error",
    recommendation: "Добавьте операцию контроля качества в конец техпроцесса. Это финальная проверка, которая гарантирует соответствие платы проектным спецификациям."
  },
  {
    id: "man-002",
    category: "mandatory",
    description: "В любом техпроцессе обязательна маркировка",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "must_exist", operation: "Маркировка" },
    source: "ГОСТ 3.1428",
    severity: "warning",
    recommendation: "Добавьте операцию маркировки. Она необходима для идентификации платы и монтируемых компонентов."
  },

  // ----- Для ОПП -----
  {
    id: "man-003",
    category: "mandatory",
    description: "В техпроцессе ОПП обязательно сверление",
    condition: { boardType: "ОПП" },
    check: { type: "must_exist", operation: "Сверление" },
    source: "ГОСТ 3.1428",
    severity: "error",
    recommendation: "ОПП требует сверления отверстий для монтажа компонентов. Добавьте операцию 'Сверление сквозных отверстий'."
  },
  {
    id: "man-004",
    category: "mandatory",
    description: "В техпроцессе ОПП обязательно травление",
    condition: { boardType: "ОПП" },
    check: { type: "must_exist", operation: "Травление" },
    source: "ГОСТ 3.1428",
    severity: "error",
    recommendation: "Без травления невозможно сформировать проводящий рисунок. Добавьте операцию 'Травление меди'."
  },

  // ----- Для ДПП -----
  {
    id: "man-005",
    category: "mandatory",
    description: "В техпроцессе ДПП обязательно химическое осаждение меди",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Химическое осаждение" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Для двусторонней платы необходимо создать проводящий слой в отверстиях. Добавьте операцию 'Химическое осаждение меди'."
  },
  {
    id: "man-006",
    category: "mandatory",
    description: "В техпроцессе ДПП обязательно гальваническое осаждение меди",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Гальваническое осаждение" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Химическая медь имеет рыхлую структуру. Добавьте операцию 'Гальваническое осаждение меди' для упрочнения покрытия."
  },
  {
    id: "man-007",
    category: "mandatory",
    description: "В техпроцессе ДПП обязателен металлорезист",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Металлорезист" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Металлорезист (олово) защищает проводники при травлении. Добавьте операцию 'Гальваническое осаждение металлорезиста'."
  },

  // ----- Для МПП -----
  {
    id: "man-008",
    category: "mandatory",
    description: "В техпроцессе МПП обязательно формирование внутренних слоёв",
    condition: { boardType: "МПП" },
    check: { type: "must_exist", operation: "Внутренние слои" },
    source: "Резонит, технология МПП",
    severity: "error",
    recommendation: "Многослойная плата требует предварительного формирования внутренних слоёв. Добавьте соответствующие операции."
  },
  {
    id: "man-009",
    category: "mandatory",
    description: "В техпроцессе МПП обязательно прессование",
    condition: { boardType: "МПП" },
    check: { type: "must_exist", operation: "Прессование" },
    source: "Резонит, технология МПП",
    severity: "error",
    recommendation: "Для соединения слоёв многослойной платы необходимо прессование. Добавьте эту операцию."
  },

  // ----- Рекомендательные операции -----
  {
    id: "man-010",
    category: "mandatory",
    description: "Рекомендуется оптическая инспекция после травления",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "must_exist", operation: "Инспекция" },
    source: "Резонит",
    severity: "warning",
    recommendation: "Оптическая инспекция помогает выявить дефекты травления на раннем этапе. Рекомендуем добавить эту операцию."
  },

  // ============================================================
  // 2. ПОСЛЕДОВАТЕЛЬНОСТЬ ОПЕРАЦИЙ (sequence)
  // ============================================================

  // ----- Базовая последовательность -----
  {
    id: "seq-001",
    category: "sequence",
    description: "Сверление должно выполняться до нанесения фоторезиста",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Сверление", second: "Фоторезист" },
    source: "ГОСТ 3.1428, Резонит",
    severity: "error",
    recommendation: "Измените порядок: сначала выполните сверление всех отверстий, затем наносите фоторезист. Это защитит резист от повреждений."
  },
  {
    id: "seq-002",
    category: "sequence",
    description: "Экспонирование должно быть до проявления фоторезиста",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Экспонирование", second: "Проявление" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала выполните экспонирование (засветку) фоторезиста, затем проявление для удаления незасвеченных участков."
  },
  {
    id: "seq-003",
    category: "sequence",
    description: "Проявление должно быть до травления",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Проявление", second: "Травление" },
    source: "Резонит",
    severity: "error",
    recommendation: "Проявление формирует защитную маску из фоторезиста. Без него травление уничтожит все проводники. Поменяйте порядок операций."
  },
  {
    id: "seq-004",
    category: "sequence",
    description: "Травление должно быть до удаления фоторезиста",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Травление", second: "Удаление фоторезиста" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала вытравите незащищённую медь, затем удалите оставшийся фоторезист. Именно в таком порядке."
  },
  {
    id: "seq-005",
    category: "sequence",
    description: "Пайка должна быть после удаления резиста",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Удаление фоторезиста", second: "Пайка" },
    source: "Медведев А.М., стр. 78",
    severity: "error",
    recommendation: "Остатки фоторезиста ухудшают смачиваемость припоя и могут вызвать дефекты пайки. Удалите резист перед пайкой."
  },

  // ----- Последовательность для ДПП -----
  {
    id: "seq-006",
    category: "sequence",
    description: "Химическое осаждение должно быть после сверления (для ДПП)",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Сверление", second: "Химическое осаждение" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Сначала просверлите отверстия, затем выполните химическое осаждение меди для создания проводящего слоя в отверстиях."
  },
  {
    id: "seq-007",
    category: "sequence",
    description: "Гальваническое осаждение должно быть после химического",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Химическое осаждение", second: "Гальваническое осаждение" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Химическая медь создаёт базовый слой, гальваническая — упрочняет его. Соблюдайте эту последовательность."
  },
  {
    id: "seq-008",
    category: "sequence",
    description: "Металлорезист осаждается после гальванической меди",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Гальваническое осаждение меди", second: "Металлорезист" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Сначала нарастите слой гальванической меди, затем осаждайте металлорезист (олово) для защиты проводников при травлении."
  },
  {
    id: "seq-009",
    category: "sequence",
    description: "Травление меди выполняется после нанесения металлорезиста",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Металлорезист", second: "Травление меди" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Металлорезист защищает проводники. Травите медь только после того, как металлорезист нанесён."
  },
  {
    id: "seq-010",
    category: "sequence",
    description: "Удаление металлорезиста после травления меди",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Травление меди", second: "Удаление металлорезиста" },
    source: "Резонит, технология ДПП",
    severity: "error",
    recommendation: "Сначала вытравите незащищённую медь, затем удалите металлорезист. Не наоборот."
  },

  // ----- Последовательность для МПП -----
  {
    id: "seq-011",
    category: "sequence",
    description: "Формирование внутренних слоёв до прессования (для МПП)",
    condition: { boardType: "МПП" },
    check: { type: "order", first: "Внутренние слои", second: "Прессование" },
    source: "Резонит, технология МПП",
    severity: "error",
    recommendation: "Сначала сформируйте рисунок на внутренних слоях, затем скрепите их в единый пакет прессованием."
  },
  {
    id: "seq-012",
    category: "sequence",
    description: "Прессование должно быть до сверления (для МПП)",
    condition: { boardType: "МПП" },
    check: { type: "order", first: "Прессование", second: "Сверление" },
    source: "Резонит, технология МПП",
    severity: "error",
    recommendation: "Сначала спрессуйте пакет слоёв, затем сверлите отверстия. Только так можно получить точные переходные отверстия."
  },

  // ============================================================
  // 3. ЗАПРЕЩЁННЫЕ ОПЕРАЦИИ (forbidden)
  // ============================================================
  {
    id: "for-001",
    category: "forbidden",
    description: "Для ОПП не требуется гальваническое осаждение",
    condition: { boardType: "ОПП" },
    check: { type: "forbidden", operation: "Гальваническое осаждение" },
    source: "Логика",
    severity: "warning",
    recommendation: "Односторонние платы не требуют гальванической металлизации. Удалите эту операцию из техпроцесса."
  },
  {
    id: "for-002",
    category: "forbidden",
    description: "Для плат выше 3 класса точности сухая маска не применяется",
    condition: { accuracyClass: { gt: 3 } },
    check: { type: "forbidden", operation: "Сухая маска" },
    source: "Резонит",
    severity: "error",
    recommendation: "Для высоких классов точности используйте жидкую фоторезистивную маску. Сухая плёночная маска не обеспечит нужного разрешения."
  },
  {
    id: "for-003",
    category: "forbidden",
    description: "Для ОПП не требуется прессование",
    condition: { boardType: "ОПП" },
    check: { type: "forbidden", operation: "Прессование" },
    source: "Логика",
    severity: "info",
    recommendation: "Прессование необходимо только для многослойных плат. Односторонняя плата не требует этой операции."
  },

  // ============================================================
  // 4. ЦИКЛЫ (cycle detection)
  // ============================================================
  {
    id: "cycle-001",
    category: "cycle",
    description: "В графе обнаружен цикл",
    condition: { cycleDetected: true },
    check: { type: "cycle" },
    source: "Логическое ограничение",
    severity: "error",
    recommendation: "Технологический процесс не должен содержать зацикливаний. Удалите лишние связи, образующие цикл. Техпроцесс — это направленный граф от начала к концу."
  },

  // ============================================================
  // 5. ПАРАМЕТРЫ И ХИМИЧЕСКИЕ ПРОЦЕССЫ (parameter)
  // ============================================================
  {
    id: "param-001",
    category: "parameter",
    description: "Максимальная температура пайки для FR-4 не должна превышать 260°C",
    condition: { material: "FR-4", operationLabel: "Пайка" },
    check: { type: "parameter", param: "temperature", max: 260, unit: "°C" },
    source: "Медведев А.М., стр. 41",
    severity: "warning",
    recommendation: "При пайке плат из FR-4 контролируйте температуру. Превышение 260°C может привести к расслоению и короблению материала."
  },
  {
    id: "param-002",
    category: "parameter",
    description: "pH раствора химического меднения должен быть в диапазоне 12-13",
    condition: { operationLabel: "Химическое меднение" },
    check: { type: "parameter", param: "ph", min: 12, max: 13 },
    source: "Черник А.А., стр. 18",
    severity: "error",
    recommendation: "Контролируйте pH раствора. Отклонение может привести к прекращению реакции осаждения или разложению раствора."
  },
  {
    id: "param-003",
    category: "parameter",
    description: "Температура раствора химического меднения должна быть 20-25°C",
    condition: { operationLabel: "Химическое меднение" },
    check: { type: "parameter", param: "temperature", min: 20, max: 25, unit: "°C" },
    source: "Черник А.А., стр. 18",
    severity: "warning",
    recommendation: "Поддерживайте температуру раствора в указанном диапазоне для стабильного протекания реакции."
  },
  {
    id: "param-004",
    category: "parameter",
    description: "Толщина металлизации для ДПП должна быть не менее 20 мкм",
    condition: { boardType: "ДПП", operationLabel: "Гальваническое осаждение меди" },
    check: { type: "parameter", param: "plating_thickness", min: 20, unit: "мкм" },
    source: "ГОСТ 23752-79",
    severity: "error",
    recommendation: "Увеличьте время осаждения, чтобы достичь толщины меди в отверстиях не менее 20 мкм."
  },
  {
    id: "param-005",
    category: "parameter",
    description: "Толщина металлизации для МПП должна быть не менее 25 мкм",
    condition: { boardType: "МПП", operationLabel: "Гальваническое осаждение меди" },
    check: { type: "parameter", param: "plating_thickness", min: 25, unit: "мкм" },
    source: "ГОСТ 23752-79",
    severity: "error",
    recommendation: "Для многослойных плат требования выше. Обеспечьте толщину меди в отверстиях не менее 25 мкм."
  },

  // ============================================================
  // 6. СОВМЕСТИМОСТЬ (compatibility)
  // ============================================================
  {
    id: "com-001",
    category: "compatibility",
    description: "Покрытие SnPb несовместимо с бессвинцовой пайкой",
    condition: { finish: "SnPb", solderType: "lead-free" },
    check: { type: "incompatible" },
    source: "Медведев А.М., стр. 36",
    severity: "error",
    recommendation: "При использовании бессвинцовой пайки выбирайте финишное покрытие, совместимое с ней (ENIG, ImAg, OSP). SnPb только для свинцовой пайки."
  },
  {
    id: "com-002",
    category: "compatibility",
    description: "Для СВЧ плат требуется PTFE или керамический материал",
    condition: { boardType: "СВЧ" },
    check: { type: "compatible", material: ["PTFE", "Керамика"] },
    source: "Резонит",
    severity: "error",
    recommendation: "Стандартный FR-4 не подходит для высокочастотных плат. Используйте специализированные материалы с низкими диэлектрическими потерями."
  },

  // ============================================================
  // 7. ДИАГНОСТИКА ДЕФЕКТОВ (diagnostic)
  // ============================================================
  {
    id: "diag-001",
    category: "diagnostic",
    description: "Эффект 'надгробного камня' возникает при несимметричном нагреве",
    condition: { defect: "tombstoning" },
    check: { type: "diagnostic" },
    source: "Медведев А.М., стр. 86",
    severity: "info",
    recommendation: "Для устранения эффекта обеспечьте симметричный нагрев, одинаковые контактные площадки и равномерное нанесение пасты."
  },
  {
    id: "diag-002",
    category: "diagnostic",
    description: "Холодные пайки возникают при недостаточной температуре нагрева",
    condition: { defect: "cold_solder" },
    check: { type: "diagnostic" },
    source: "Медведев А.М., стр. 78",
    severity: "info",
    recommendation: "Проверьте температуру пайки. Для Sn63/Pb37 нужно 220-230°C, для бессвинцовых припоев — выше."
  },
  {
    id: "diag-003",
    category: "diagnostic",
    description: "Подтравливание проводников увеличивается в растворах без диффузионного контроля",
    condition: { defect: "undercut" },
    check: { type: "diagnostic" },
    source: "Черник А.А., стр. 9",
    severity: "info",
    recommendation: "Используйте травильные растворы с диффузионным контролем (меднохлоридные, пероксидные) для уменьшения подтравливания."
  },
  {
    id: "diag-004",
    category: "diagnostic",
    description: "Образование шариков припоя может быть вызвано влажностью пасты",
    condition: { defect: "solder_balls" },
    check: { type: "diagnostic" },
    source: "Медведев А.М., стр. 94",
    severity: "info",
    recommendation: "Проверьте условия хранения паяльной пасты. Используйте температурный профиль с предварительной сушкой."
  },

  // ============================================================
  // 8. КЛАССЫ ТОЧНОСТИ (accuracy)
  // ============================================================
  {
    id: "acc-001",
    category: "accuracy",
    description: "Минимальная ширина проводника для класса 1 — 0.75 мм",
    condition: { accuracyClass: 1, operationLabel: "Травление" },
    check: { type: "parameter", param: "track_width", min: 0.75, unit: "мм" },
    source: "ГОСТ 23751-86",
    severity: "error",
    recommendation: "Для класса точности 1 проектируйте проводники шириной не менее 0.75 мм."
  },
  {
    id: "acc-002",
    category: "accuracy",
    description: "Минимальная ширина проводника для класса 2 — 0.45 мм",
    condition: { accuracyClass: 2, operationLabel: "Травление" },
    check: { type: "parameter", param: "track_width", min: 0.45, unit: "мм" },
    source: "ГОСТ 23751-86",
    severity: "error",
    recommendation: "Для класса точности 2 проектируйте проводники шириной не менее 0.45 мм."
  },
  {
    id: "acc-003",
    category: "accuracy",
    description: "Минимальная ширина проводника для класса 3 — 0.25 мм",
    condition: { accuracyClass: 3, operationLabel: "Травление" },
    check: { type: "parameter", param: "track_width", min: 0.25, unit: "мм" },
    source: "ГОСТ 23751-86",
    severity: "error",
    recommendation: "Для класса точности 3 проектируйте проводники шириной не менее 0.25 мм."
  },
  {
    id: "acc-004",
    category: "accuracy",
    description: "Минимальная ширина проводника для класса 4 — 0.15 мм",
    condition: { accuracyClass: 4, operationLabel: "Травление" },
    check: { type: "parameter", param: "track_width", min: 0.15, unit: "мм" },
    source: "ГОСТ 23751-86",
    severity: "error",
    recommendation: "Для класса точности 4 требуется высокоточное оборудование. Проектируйте проводники шириной не менее 0.15 мм."
  },
  {
    id: "acc-005",
    category: "accuracy",
    description: "Минимальная ширина проводника для класса 5 — 0.10 мм",
    condition: { accuracyClass: 5, operationLabel: "Травление" },
    check: { type: "parameter", param: "track_width", min: 0.10, unit: "мм" },
    source: "ГОСТ 23751-86",
    severity: "error",
    recommendation: "Класс 5 требует прецизионного оборудования и специальных материалов. Проектируйте проводники шириной не менее 0.10 мм."
  },

  // ============================================================
  // 9. СТАНДАРТЫ КАЧЕСТВА (standards)
  // ============================================================
  {
    id: "std-001",
    category: "standard",
    description: "По IPC Class 2 средняя толщина металлизации должна быть не менее 20 мкм",
    condition: { standard: "IPC-6012B Class 2", operationLabel: "Гальваническое осаждение меди" },
    check: { type: "parameter", param: "plating_thickness", min: 20, unit: "мкм" },
    source: "IPC-6012B",
    severity: "warning",
    recommendation: "Для IPC Class 2 обеспечьте среднюю толщину металлизации не менее 20 мкм."
  },
  {
    id: "std-002",
    category: "standard",
    description: "По IPC Class 3 средняя толщина металлизации должна быть не менее 25 мкм",
    condition: { standard: "IPC-6012B Class 3", operationLabel: "Гальваническое осаждение меди" },
    check: { type: "parameter", param: "plating_thickness", min: 25, unit: "мкм" },
    source: "IPC-6012B",
    severity: "warning",
    recommendation: "Для IPC Class 3 (высоконадёжная техника) обеспечьте толщину металлизации не менее 25 мкм."
  },
  {
    id: "std-003",
    category: "standard",
    description: "По IPC Class 3 требуется 100% контроль качества",
    condition: { standard: "IPC-6012B Class 3" },
    check: { type: "must_exist", operation: "Контроль качества" },
    source: "IPC-6012B",
    severity: "warning",
    recommendation: "Для Class 3 обязателен 100% контроль качества. Добавьте соответствующие операции."
  }
];

// ============================================================
// ФУНКЦИЯ ВЕРИФИКАЦИИ
// ============================================================

export function validateProject(project, nodes, edges) {
  const warnings = [];

  const boardType = project.type;
  const accuracyClass = project.accuracyClass;
  const material = project.material;
  const standard = project.standard;
  const operationNames = nodes.map(node => node.data?.label || "");

  // Строим граф связей
  const nextOperations = {};
  edges.forEach(edge => {
    const sourceOp = nodes.find(n => n.id === edge.source)?.data?.label;
    const targetOp = nodes.find(n => n.id === edge.target)?.data?.label;
    if (sourceOp && targetOp) {
      if (!nextOperations[sourceOp]) nextOperations[sourceOp] = [];
      nextOperations[sourceOp].push(targetOp);
    }
  });

  function isBefore(op1, op2) {
    if (nextOperations[op1]?.includes(op2)) return true;
    const visited = new Set();
    const queue = [op1];
    while (queue.length) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      const next = nextOperations[current] || [];
      if (next.includes(op2)) return true;
      queue.push(...next);
    }
    return false;
  }

  // Проверяем каждое правило
  for (const rule of rulesDatabase) {
    let conditionMet = true;

    // Проверка условий правила
    if (rule.condition?.boardType) {
      const requiredTypes = Array.isArray(rule.condition.boardType) 
        ? rule.condition.boardType 
        : [rule.condition.boardType];
      if (!requiredTypes.includes(boardType)) conditionMet = false;
    }

    if (rule.condition?.accuracyClass && rule.condition.accuracyClass.gt) {
      if (!accuracyClass || accuracyClass <= rule.condition.accuracyClass.gt) conditionMet = false;
    }

    if (rule.condition?.accuracyClass && !rule.condition.accuracyClass.gt) {
      if (accuracyClass !== rule.condition.accuracyClass) conditionMet = false;
    }

    if (rule.condition?.material && rule.condition.material !== material) conditionMet = false;

    if (rule.condition?.standard && rule.condition.standard !== standard) conditionMet = false;

    // Проверка типа правила
    if (conditionMet && rule.check?.type === "must_exist") {
      const found = operationNames.some(op => 
        op.toLowerCase().includes(rule.check.operation.toLowerCase())
      );
      if (!found) {
        warnings.push({
          ruleId: rule.id,
          description: rule.description,
          source: rule.source,
          severity: rule.severity,
          recommendation: rule.recommendation,
          details: `Отсутствует операция: "${rule.check.operation}"`
        });
      }
    }

    else if (conditionMet && rule.check?.type === "forbidden") {
      const found = operationNames.some(op => 
        op.toLowerCase().includes(rule.check.operation.toLowerCase())
      );
      if (found) {
        warnings.push({
          ruleId: rule.id,
          description: rule.description,
          source: rule.source,
          severity: rule.severity,
          recommendation: rule.recommendation,
          details: `Обнаружена запрещённая операция: "${rule.check.operation}"`
        });
      }
    }

    else if (conditionMet && rule.check?.type === "order") {
      const hasFirst = operationNames.some(op => 
        op.toLowerCase().includes(rule.check.first.toLowerCase())
      );
      const hasSecond = operationNames.some(op => 
        op.toLowerCase().includes(rule.check.second.toLowerCase())
      );
      if (hasFirst && hasSecond && !isBefore(rule.check.first, rule.check.second)) {
        warnings.push({
          ruleId: rule.id,
          description: rule.description,
          source: rule.source,
          severity: rule.severity,
          recommendation: rule.recommendation,
          details: `Операция "${rule.check.first}" должна быть ДО "${rule.check.second}"`
        });
      }
    }

    else if (conditionMet && rule.check?.type === "cycle") {
      // Проверка циклов выполняется отдельно
    }
  }

  // Проверка на циклы (отдельно)
  function hasCycle() {
    const visited = new Set();
    const recStack = new Set();
    function dfs(nodeId) {
      visited.add(nodeId);
      recStack.add(nodeId);
      const outgoing = edges.filter(e => e.source === nodeId);
      for (const edge of outgoing) {
        if (!visited.has(edge.target)) {
          if (dfs(edge.target)) return true;
        } else if (recStack.has(edge.target)) {
          return true;
        }
      }
      recStack.delete(nodeId);
      return false;
    }
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }
    return false;
  }

  if (hasCycle() && nodes.length > 1) {
    warnings.push({
      ruleId: "cycle-001",
      description: "В графе обнаружен цикл",
      source: "Логическое ограничение",
      severity: "error",
      recommendation: "Удалите лишние связи, образующие цикл. Техпроцесс — это направленный граф от начала к концу.",
      details: "Обнаружена циклическая зависимость между операциями"
    });
  }

  return warnings;
}


// src/components/KnowledgeBase.jsx


function KnowledgeBase({ boardType, accuracyClass, warnings = [], rulesDatabase = [], hasValidated = false }) {
  // Если верификация ещё не запускалась — показываем пустую панель
  if (!hasValidated) {
    return (
      <div style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>💾</div>
        <div style={{ fontSize: '14px' }}>Нажмите «Сохранить» для верификации и сохранения техпроцесса</div>
      </div>
    );
  }

  // Если есть реальные предупреждения — показываем их
  if (warnings && warnings.length > 0) {
    return (
      <div style={{ padding: '15px' }}>
        <h3 style={{ marginTop: 0, color: '#f44336' }}>⚠️ Предупреждения ({warnings.length})</h3>
        {warnings.map((w, idx) => (
          <div key={idx} style={{
            borderLeft: `4px solid ${w.severity === 'error' ? '#f44336' : '#ff9800'}`,
            marginBottom: '12px',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}>
            <div style={{ fontWeight: 'bold' }}>{w.description}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>📖 {w.source}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{w.details}</div>
          </div>
        ))}
      </div>
    );
  }

  // Если предупреждений нет — показываем успех
  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ marginTop: 5,  textAlign: 'center', color: '#4CAF50' }}>Нарушений не найдено ✔ </h3>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
      </div>
    </div>
  );
}

export default KnowledgeBase;