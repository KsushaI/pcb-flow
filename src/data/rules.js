// src/data/rules.js

// ============================================================
// БАЗА ЗНАНИЙ — ПРАВИЛА ДЛЯ ВЕРИФИКАЦИИ ТЕХПРОЦЕССОВ
// ============================================================

export const rulesDatabase = [
  // ============================================================
  // 1. ОБЯЗАТЕЛЬНЫЕ ОПЕРАЦИИ (mandatory)
  // ============================================================

  {
    id: "man-001",
    category: "mandatory",
    description: "В любом техпроцессе обязателен контроль качества",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "must_exist", operation: "Контроль" },
    source: "ГОСТ 3.1428-91",
    severity: "error",
    recommendation: "Добавьте операцию контроля качества в конец техпроцесса."
  },
  {
    id: "man-002",
    category: "mandatory",
    description: "В техпроцессе ОПП обязательно сверление",
    condition: { boardType: "ОПП" },
    check: { type: "must_exist", operation: "Сверление" },
    source: "ГОСТ 3.1428-91",
    severity: "error",
    recommendation: "Добавьте сверление отверстий."
  },
  {
    id: "man-003",
    category: "mandatory",
    description: "В техпроцессе ОПП обязательно травление",
    condition: { boardType: "ОПП" },
    check: { type: "must_exist", operation: "Травление" },
    source: "ГОСТ 3.1428-91",
    severity: "error",
    recommendation: "Добавьте травление меди."
  },
  {
    id: "man-004",
    category: "mandatory",
    description: "В техпроцессе ДПП обязательно химическое осаждение меди",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Химическое осаждение" },
    source: "Резонит",
    severity: "error",
    recommendation: "Добавьте химическое осаждение меди."
  },
  {
    id: "man-005",
    category: "mandatory",
    description: "В техпроцессе ДПП обязательно гальваническое осаждение меди",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Гальваническое осаждение" },
    source: "Резонит",
    severity: "error",
    recommendation: "Добавьте гальваническое осаждение меди."
  },
  {
    id: "man-006",
    category: "mandatory",
    description: "В техпроцессе ДПП обязателен металлорезист",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Металлорезист" },
    source: "Резонит",
    severity: "error",
    recommendation: "Добавьте металлорезист для защиты проводников."
  },
  {
    id: "man-007",
    category: "mandatory",
    description: "В техпроцессе МПП обязательно прессование",
    condition: { boardType: "МПП" },
    check: { type: "must_exist", operation: "Прессование" },
    source: "Резонит",
    severity: "error",
    recommendation: "Добавьте операцию прессования."
  },
  {
    id: "man-008",
    category: "mandatory",
    description: "В любом техпроцессе обязательна пайка",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "must_exist", operation: "Пайка" },
    source: "Логика",
    severity: "error",
    recommendation: "Добавьте операцию пайки компонентов."
  },
  {
    id: "man-009",
    category: "mandatory",
    description: "Рекомендуется автоматическая оптическая инспекция после травления",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Травление", second: "Инспекция" },
    source: "Резонит",
    severity: "warning",
    recommendation: "Добавьте оптическую инспекцию для выявления дефектов травления."
  },

  // ============================================================
  // 2. ПОСЛЕДОВАТЕЛЬНОСТЬ ОПЕРАЦИЙ (sequence)
  // ============================================================

  {
    id: "seq-001",
    category: "sequence",
    description: "Сверление должно выполняться до нанесения фоторезиста",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Сверление", second: "Фоторезист" },
    source: "ГОСТ 3.1428-91, Резонит",
    severity: "error",
    recommendation: "Сначала выполните сверление, затем наносите фоторезист."
  },
  {
    id: "seq-002",
    category: "sequence",
    description: "Экспонирование должно быть до проявления фоторезиста",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Экспонирование", second: "Проявление" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала экспонирование, затем проявление."
  },
  {
    id: "seq-003",
    category: "sequence",
    description: "Проявление должно быть до травления",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Проявление", second: "Травление" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала проявление фоторезиста, затем травление."
  },
  {
    id: "seq-004",
    category: "sequence",
    description: "Травление должно быть до удаления фоторезиста",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Травление", second: "Удаление фоторезиста" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала вытравите медь, затем удалите фоторезист."
  },
  {
    id: "seq-005",
    category: "sequence",
    description: "Удаление фоторезиста должно быть до пайки",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "order", first: "Удаление фоторезиста", second: "Пайка" },
    source: "Медведев А.М.",
    severity: "error",
    recommendation: "Остатки фоторезиста ухудшают пайку. Удалите его перед пайкой."
  },
  {
    id: "seq-006",
    category: "sequence",
    description: "Химическое осаждение должно быть после сверления (ДПП)",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Сверление", second: "Химическое осаждение" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала сверление, затем химическое осаждение."
  },
  {
    id: "seq-007",
    category: "sequence",
    description: "Гальваническое осаждение должно быть после химического",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Химическое осаждение", second: "Гальваническое осаждение" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала химическое осаждение, затем гальваническое."
  },
  {
    id: "seq-008",
    category: "sequence",
    description: "Металлорезист осаждается после гальванической меди",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Гальваническое осаждение меди", second: "Металлорезист" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала гальваническая медь, затем металлорезист."
  },
  {
    id: "seq-009",
    category: "sequence",
    description: "Травление меди выполняется после нанесения металлорезиста",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Металлорезист", second: "Травление меди" },
    source: "Резонит",
    severity: "error",
    recommendation: "Металлорезист защищает проводники. Травите медь после него."
  },
  {
    id: "seq-010",
    category: "sequence",
    description: "Прессование должно быть до сверления (для МПП)",
    condition: { boardType: "МПП" },
    check: { type: "order", first: "Прессование", second: "Сверление" },
    source: "Резонит",
    severity: "error",
    recommendation: "Сначала спрессуйте пакет слоёв, затем сверлите отверстия."
  },
  {
    id: "seq-011",
    category: "sequence",
    description: "Пайка должна быть после травления",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Травление", second: "Пайка" },
    source: "Логика",
    severity: "error",
    recommendation: "Пайка — финальная операция после всех химических процессов."
  },

  // ============================================================
  // 3. ПАРАМЕТРИЧЕСКИЕ ПРАВИЛА (parameter)
  // ============================================================

  {
    id: "param-001",
    category: "parameter",
    description: "Температура пайки для FR-4 не должна превышать 260°C",
    condition: { material: "FR-4", operationLabel: "Пайка" },
    check: { type: "node_param", param: "temperature", max: 260, unit: "°C" },
    source: "Медведев А.М., стр. 41",
    severity: "warning",
    recommendation: "Для FR-4 рекомендуемая температура пайки 240-260°C."
  },
  {
    id: "param-002",
    category: "parameter",
    description: "Температура травления меди должна быть 40-50°C",
    condition: { operationLabel: "Травление" },
    check: { type: "node_param", param: "temperature", min: 40, max: 50, unit: "°C" },
    source: "Черник А.А., стр. 10",
    severity: "warning",
    recommendation: "Оптимальная температура травильного раствора 40-50°C."
  },
  {
    id: "param-003",
    category: "parameter",
    description: "Толщина гальванической меди для ДПП должна быть не менее 20 мкм",
    condition: { boardType: "ДПП", operationLabel: "Гальваническое осаждение" },
    check: { type: "node_param", param: "thickness", min: 20, unit: "мкм" },
    source: "ГОСТ 23752-79",
    severity: "error",
    recommendation: "Увеличьте время осаждения для достижения толщины 20 мкм."
  },
  {
    id: "param-004",
    category: "parameter",
    description: "Толщина гальванической меди для МПП должна быть не менее 25 мкм",
    condition: { boardType: "МПП", operationLabel: "Гальваническое осаждение" },
    check: { type: "node_param", param: "thickness", min: 25, unit: "мкм" },
    source: "ГОСТ 23752-79",
    severity: "error",
    recommendation: "Для многослойных плат требуется толщина не менее 25 мкм."
  },
  {
    id: "param-005",
    category: "parameter",
    description: "Диаметр сверла должен быть в диапазоне 0.3-3.0 мм",
    condition: { operationLabel: "Сверление" },
    check: { type: "node_param", param: "diameter", min: 0.3, max: 3.0, unit: "мм" },
    source: "ГОСТ 3.1428-91",
    severity: "warning",
    recommendation: "Используйте стандартные диаметры: 0.3-3.0 мм."
  },
  {
    id: "param-006",
    category: "parameter",
    description: "pH раствора химического меднения должен быть 12-13",
    condition: { operationLabel: "Химическое осаждение" },
    check: { type: "node_param", param: "ph", min: 12, max: 13 },
    source: "Черник А.А., стр. 18",
    severity: "error",
    recommendation: "Контролируйте pH раствора. Отклонение приведёт к прекращению реакции."
  },

  // ============================================================
  // 4. ЗАПРЕЩЁННЫЕ ОПЕРАЦИИ (forbidden)
  // ============================================================

  {
    id: "for-001",
    category: "forbidden",
    description: "Для плат выше 3 класса точности сухая паяльная маска не применяется",
    condition: { accuracyClass: { gt: 3 } },
    check: { type: "forbidden", operation: "Сухая маска" },
    source: "Резонит",
    severity: "error",
    recommendation: "Для высоких классов точности используйте жидкую маску."
  },
  {
    id: "for-002",
    category: "forbidden",
    description: "Для односторонних плат (ОПП) не требуется гальваническое осаждение",
    condition: { boardType: "ОПП" },
    check: { type: "forbidden", operation: "Гальваническое осаждение" },
    source: "Логика",
    severity: "warning",
    recommendation: "Удалите гальваническое осаждение — оно не нужно для ОПП."
  },

  // ============================================================
  // 5. ЦИКЛЫ (cycle)
  // ============================================================

  {
    id: "cycle-001",
    category: "cycle",
    description: "В графе обнаружен цикл",
    condition: { cycleDetected: true },
    check: { type: "cycle" },
    source: "Логическое ограничение",
    severity: "error",
    recommendation: "Удалите лишние связи, образующие цикл."
  },
  // ============================================================
  // 6. ДОПОЛНИТЕЛЬНЫЕ ПАРАМЕТРИЧЕСКИЕ ПРАВИЛА (parameter)
  // ============================================================

  {
    id: "param-007",
    category: "parameter",
    description: "Скорость сверления должна быть 8000-15000 об/мин",
    condition: { operationLabel: "Сверление" },
    check: { type: "node_param", param: "speed", min: 8000, max: 15000, unit: "об/мин" },
    source: "Практические рекомендации",
    severity: "warning",
    recommendation: "Оптимальная скорость для FR-4 — 10000-12000 об/мин."
  },
  {
    id: "param-008",
    category: "parameter",
    description: "Подача сверла должна быть 0.01-0.2 мм/об",
    condition: { operationLabel: "Сверление" },
    check: { type: "node_param", param: "feed", min: 0.01, max: 0.2, unit: "мм/об" },
    source: "Практические рекомендации",
    severity: "warning",
    recommendation: "При высокой подаче сверло может сломаться."
  },
  {
    id: "param-009",
    category: "parameter",
    description: "Время проявления фоторезиста должно быть 1-3 минуты",
    condition: { operationLabel: "Проявление" },
    check: { type: "node_param", param: "time", min: 1, max: 3, unit: "мин" },
    source: "ГОСТ 3.1428-91",
    severity: "warning",
    recommendation: "Оптимальное время проявления — 2 минуты."
  },
  {
    id: "param-010",
    category: "parameter",
    description: "Время экспонирования должно быть 20-40 секунд",
    condition: { operationLabel: "Экспонирование" },
    check: { type: "node_param", param: "time", min: 20, max: 40, unit: "с" },
    source: "Практические рекомендации",
    severity: "warning",
    recommendation: "Недодержка и передержка приводят к дефектам."
  },
  {
    id: "param-011",
    category: "parameter",
    description: "Температура пайки для PTFE не должна превышать 300°C",
    condition: { material: "PTFE", operationLabel: "Пайка" },
    check: { type: "node_param", param: "temperature", max: 300, unit: "°C" },
    source: "Медведев А.М.",
    severity: "warning",
    recommendation: "PTFE выдерживает более высокие температуры, чем FR-4."
  },
  {
    id: "param-012",
    category: "parameter",
    description: "Температура пайки для керамики не должна превышать 350°C",
    condition: { material: "Керамика", operationLabel: "Пайка" },
    check: { type: "node_param", param: "temperature", max: 350, unit: "°C" },
    source: "Медведев А.М.",
    severity: "warning",
    recommendation: "Керамические платы более термостойкие."
  },

  // ============================================================
  // 7. ДОПОЛНИТЕЛЬНЫЕ ОБЯЗАТЕЛЬНЫЕ ОПЕРАЦИИ
  // ============================================================

  {
    id: "man-010",
    category: "mandatory",
    description: "Для ДПП рекомендуется предварительное гальваническое осаждение",
    condition: { boardType: "ДПП" },
    check: { type: "must_exist", operation: "Предварительное гальваническое" },
    source: "Резонит",
    severity: "info",
    recommendation: "Предварительная гальваника улучшает качество металлизации."
  },
  {
    id: "man-011",
    category: "mandatory",
    description: "Рекомендуется отмывка после травления",
    condition: { boardType: ["ОПП", "ДПП"] },
    check: { type: "must_exist", operation: "Отмывка" },
    source: "Практика",
    severity: "info",
    recommendation: "Отмывка удаляет остатки травильных растворов."
  },

  // ============================================================
  // 8. СОВМЕСТИМОСТЬ ОПЕРАЦИЙ
  // ============================================================

  {
    id: "com-001",
    category: "compatibility",
    description: "Пайка не должна выполняться до сверления",
    condition: { boardType: ["ОПП", "ДПП", "МПП"] },
    check: { type: "order", first: "Сверление", second: "Пайка" },  // ← Сверление ДО Пайки
    source: "Логика",
    severity: "error",
    recommendation: "Сначала сверление отверстий, потом пайка."
  },
  {
    id: "com-002",
    category: "compatibility",
    description: "Для ДПП пайка должна быть после удаления металлорезиста",
    condition: { boardType: "ДПП" },
    check: { type: "order", first: "Удаление металлорезиста", second: "Пайка" },
    source: "Резонит",
    severity: "warning",
    recommendation: "Сначала удалите металлорезист, потом выполняйте пайку."
  },

];

// ============================================================
// ФУНКЦИЯ ВЕРИФИКАЦИИ
// ============================================================

function findExactOperation(operationNames, substring) {
  if (!substring) return null;
  return operationNames.find(op => op && op.toLowerCase().includes(substring.toLowerCase()));
}

function isBefore(operationNames, nextOperations, op1Substring, op2Substring) {
  if (!op1Substring || !op2Substring) return false;

  const exactOp1 = findExactOperation(operationNames, op1Substring);
  const exactOp2 = findExactOperation(operationNames, op2Substring);
  if (!exactOp1 || !exactOp2) return false;

  if (nextOperations[exactOp1]?.includes(exactOp2)) return true;

  const visited = new Set();
  const queue = [exactOp1];
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const next = nextOperations[current] || [];
    if (next.includes(exactOp2)) return true;
    queue.push(...next);
  }
  return false;
}

function isFirstOperation(nodes, edges, operationNames, opSubstring) {
  if (!opSubstring) return false;
  const exactOp = findExactOperation(operationNames, opSubstring);
  if (!exactOp) return false;
  const nodeId = nodes.find(n => n.data?.label === exactOp)?.id;
  if (!nodeId) return false;
  const incoming = edges.filter(e => e.target === nodeId);
  return incoming.length === 0;
}

function isLastOperation(nodes, edges, operationNames, opSubstring) {
  if (!opSubstring) return false;
  const exactOp = findExactOperation(operationNames, opSubstring);
  if (!exactOp) return false;
  const nodeId = nodes.find(n => n.data?.label === exactOp)?.id;
  if (!nodeId) return false;
  const outgoing = edges.filter(e => e.source === nodeId);
  return outgoing.length === 0;
}

export function validateProject(project, nodes, edges) {
  const warnings = [];
  const boardType = project.type;
  const accuracyClass = project.accuracyClass;
  const operationNames = nodes.map(node => node.data?.label || "");
  const material = project.material;

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

  for (const rule of rulesDatabase) {
    let conditionMet = true;

    // Проверка условий
    if (rule.condition?.boardType) {
      const types = Array.isArray(rule.condition.boardType) ? rule.condition.boardType : [rule.condition.boardType];
      if (!types.includes(boardType)) conditionMet = false;
    }
    if (rule.condition?.accuracyClass?.gt) {
      if (!accuracyClass || accuracyClass <= rule.condition.accuracyClass.gt) conditionMet = false;
    }
    if (rule.condition?.material && rule.condition.material !== material) conditionMet = false;
    if (rule.condition?.operationLabel && !operationNames.some(op => op && op.toLowerCase().includes(rule.condition.operationLabel.toLowerCase()))) {
      conditionMet = false;
    }

    if (!conditionMet) continue;

    // Проверка типа правила
    if (rule.check?.type === "must_exist") {
      const found = operationNames.some(op => op && op.toLowerCase().includes(rule.check.operation.toLowerCase()));
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

    else if (rule.check?.type === "forbidden") {
      const found = operationNames.some(op => op && op.toLowerCase().includes(rule.check.operation.toLowerCase()));
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

    else if (rule.check?.type === "order") {
      const { first, second } = rule.check;
      if (first && second) {
        const hasFirst = operationNames.some(op => op && op.toLowerCase().includes(first.toLowerCase()));
        const hasSecond = operationNames.some(op => op && op.toLowerCase().includes(second.toLowerCase()));
        if (hasFirst && hasSecond && !isBefore(operationNames, nextOperations, first, second)) {
          warnings.push({
            ruleId: rule.id,
            description: rule.description,
            source: rule.source,
            severity: rule.severity,
            recommendation: rule.recommendation,
            details: `Операция "${first}" должна быть ДО "${second}"`
          });
        }
      }
    }

    else if (rule.check?.type === "is_first") {
      const { operation } = rule.check;
      const hasOp = operationNames.some(op => op && op.toLowerCase().includes(operation.toLowerCase()));
      if (hasOp && !isFirstOperation(nodes, edges, operationNames, operation)) {
        warnings.push({
          ruleId: rule.id,
          description: rule.description,
          source: rule.source,
          severity: rule.severity,
          recommendation: rule.recommendation,
          details: `Операция "${operation}" должна быть первой в техпроцессе`
        });
      }
    }

    else if (rule.check?.type === "is_last") {
      const { operation } = rule.check;
      const hasOp = operationNames.some(op => op && op.toLowerCase().includes(operation.toLowerCase()));
      if (hasOp && !isLastOperation(nodes, edges, operationNames, operation)) {
        warnings.push({
          ruleId: rule.id,
          description: rule.description,
          source: rule.source,
          severity: rule.severity,
          recommendation: rule.recommendation,
          details: `Операция "${operation}" должна быть последней в техпроцессе`
        });
      }
    }

    else if (rule.check?.type === "node_param") {
      console.log('Проверка параметрического правила:', rule.id, rule.description);
      console.log('  - материал проекта:', material);
      console.log('  - ожидаемый материал в правиле:', rule.condition?.material);
      console.log('  - ожидаемая операция:', rule.condition?.operationLabel);
      console.log('  - операции на холсте:', operationNames);

      const targetNodes = nodes.filter(node =>
        node.data.label && rule.condition?.operationLabel &&
        node.data.label.toLowerCase().includes(rule.condition.operationLabel.toLowerCase())
      );

      console.log('  - найдено узлов для проверки:', targetNodes.length);

      for (const node of targetNodes) {
        const params = node.data.params || {};
        const paramValue = params[rule.check.param];
        console.log(`  - узел "${node.data.label}" param.${rule.check.param} =`, paramValue, typeof paramValue);

        if (paramValue !== undefined) {
          // Преобразуем в число, если это строка
          const numValue = typeof paramValue === 'number' ? paramValue : parseFloat(paramValue);
          console.log(`  - преобразованное значение:`, numValue);

          if (!isNaN(numValue)) {
            if (rule.check.min !== undefined && numValue < rule.check.min) {
              warnings.push({
                ruleId: rule.id,
                description: rule.description,
                source: rule.source,
                severity: rule.severity,
                recommendation: rule.recommendation,
                details: `${rule.check.param} = ${numValue} ${rule.check.unit || ''} (минимум ${rule.check.min} ${rule.check.unit || ''})`
              });
            }
            if (rule.check.max !== undefined && numValue > rule.check.max) {
              warnings.push({
                ruleId: rule.id,
                description: rule.description,
                source: rule.source,
                severity: rule.severity,
                recommendation: rule.recommendation,
                details: `${rule.check.param} = ${numValue} ${rule.check.unit || ''} (максимум ${rule.check.max} ${rule.check.unit || ''})`
              });
            }
          }
        }
      }
    }
  }

  // Проверка циклов
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
      recommendation: "Удалите лишние связи, образующие цикл.",
      details: "Обнаружена циклическая зависимость"
    });
  }

  return warnings;
}