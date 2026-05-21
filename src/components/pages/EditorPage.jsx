import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { toPng } from 'html-to-image';

import CustomNode from '../CustomNode';
import KnowledgeBase from '../KnowledgeBase';
import { operationTemplates, processTemplates } from '../../data/templates';
// Стало:
import { validateProject, rulesDatabase } from '../../data/rules';
import { getDefaultParams } from '../../data/templates';

const nodeTypes = {
    custom: CustomNode
};

function EditorPage({ projects, updateProject }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showCustomModal, setShowCustomModal] = useState(false);
    const [showParamsModal, setShowParamsModal] = useState(false);
    const [customOpName, setCustomOpName] = useState('');
    const [customOpCategory, setCustomOpCategory] = useState('Пользовательские');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [warnings, setWarnings] = useState([]);
    const [hasValidated, setHasValidated] = useState(false);
    const [customParamsText, setCustomParamsText] = useState('');
    const project = projects.find(p => p.id === id);
    const [nodes, setNodes, onNodesChange] = useNodesState(project?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(project?.edges || []);

    const [editParams, setEditParams] = useState({
        name: '',
        type: 'ОПП',
        accuracyClass: 3,
        material: 'FR-4',
        foil: 35,
        standard: 'ГОСТ 23752-79',
        ipcClass: 'none'
    });

    const openParamsModal = useCallback(() => {
        if (project) {
            setEditParams({
                name: project.name,
                type: project.type,
                accuracyClass: project.accuracyClass,
                material: project.material,
                foil: project.foil,
                standard: project.standard || 'ГОСТ 23752-79',
                ipcClass: project.ipcClass || 'none'
            });
            setShowParamsModal(true);
        }
    }, [project]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
        [setEdges]
    );

    const addNode = useCallback((template) => {
        const newNode = {
            id: `node-${uuidv4()}`,
            type: 'custom',
            data: {
                label: template.label,
                category: template.category,
                params: getDefaultParams(template.label)  // ← добавляем параметры
            },
            position: { x: Math.random() * 400, y: Math.random() * 400 }
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const addCustomNode = useCallback(() => {
        if (customOpName.trim()) {
            // Парсим кастомные параметры из текста
            const customParams = {};
            const lines = customParamsText.split('\n');
            for (const line of lines) {
                const [key, value] = line.split('=');
                if (key && value) {
                    const trimmedKey = key.trim();
                    const trimmedValue = parseFloat(value.trim());
                    customParams[trimmedKey] = isNaN(trimmedValue) ? value.trim() : trimmedValue;
                }
            }

            const newNode = {
                id: `node-${uuidv4()}`,
                type: 'custom',
                data: {
                    label: customOpName,
                    category: customOpCategory,
                    params: customParams,
                    isCustom: true   // ← ВАЖНО: метка кастомной операции
                },
                position: { x: Math.random() * 400, y: Math.random() * 400 }
            };
            setNodes((nds) => nds.concat(newNode));
            setCustomOpName('');
            setCustomParamsText('');
            setShowCustomModal(false);
        }
    }, [customOpName, customOpCategory, customParamsText, setNodes]);

    const doSaveProject = useCallback((updatedProject) => {
        updateProject(updatedProject);
    }, [updateProject]);

    const doValidate = useCallback((proj) => {
        const validationWarnings = validateProject(proj, nodes, edges);
        setWarnings(validationWarnings);
        return validationWarnings;
    }, [nodes, edges]);

    const saveAndValidate = useCallback(() => {
        if (!project) return;

        const updatedProject = {
            ...project,
            nodes,
            edges,
            lastEdited: new Date().toISOString()
        };
        doSaveProject(updatedProject);
        doValidate(updatedProject);
        setHasValidated(true);
    }, [project, nodes, edges, doSaveProject, doValidate]);

    const saveProjectParams = useCallback(() => {
        if (!project) return;

        const updatedProject = {
            ...project,
            name: editParams.name,
            type: editParams.type,
            accuracyClass: editParams.accuracyClass,
            material: editParams.material,
            foil: editParams.foil,
            standard: editParams.standard,
            ipcClass: editParams.ipcClass,
            lastEdited: new Date().toISOString()
        };

        doSaveProject(updatedProject);
        doValidate(updatedProject);
        setShowParamsModal(false);
    }, [project, editParams, doSaveProject, doValidate]);

    const downloadAsPNG = useCallback(async () => {
        if (!project) return;

        const flowElement = document.querySelector('.react-flow');
        const viewportElement = document.querySelector('.react-flow__viewport');
        const nodesElements = document.querySelectorAll('.react-flow__node');

        if (!flowElement || !viewportElement) return;

        // Сохраняем исходные стили
        const originalTransform = viewportElement.style.transform;
        const originalOverflow = flowElement.style.overflow;
        const originalWidth = flowElement.style.width;
        const originalHeight = flowElement.style.height;

        // Временно фиксируем ширину узлов, чтобы они не сжимались
        const originalNodeStyles = [];
        nodesElements.forEach((nodeEl, idx) => {
            originalNodeStyles[idx] = nodeEl.style.width;
            nodeEl.style.width = 'auto';
            nodeEl.style.minWidth = '260px';
            nodeEl.style.maxWidth = '350px';
        });

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        nodes.forEach(node => {
            const x = node.position.x;
            const y = node.position.y;
            const width = 220;
            const height = 80;

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
        });

        const padding = 50;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        flowElement.style.overflow = 'visible';
        flowElement.style.width = `${contentWidth}px`;
        flowElement.style.height = `${contentHeight}px`;
        viewportElement.style.transform = `translate(${-minX}px, ${-minY}px) scale(1)`;

        await new Promise(resolve => setTimeout(resolve, 150));

        try {
            const dataUrl = await toPng(flowElement, {
                backgroundColor: '#ffffff',
                quality: 1,
                pixelRatio: 3,
                filter: (node) => {
                    const className = node?.classList?.toString() || '';
                    return !className.includes('react-flow__controls') &&
                        !className.includes('react-flow__minimap') &&
                        !className.includes('react-flow__panel');
                },
                style: {
                    transform: 'none',
                    left: '0',
                    top: '0',
                    fontSize: '14px',
                    fontFamily: 'Tahoma, Geneva, sans-serif'
                }
            });

            const link = document.createElement('a');
            link.download = `${project.name || 'process'}_${new Date().toISOString().slice(0, 10)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Ошибка при сохранении PNG:', error);
        } finally {
            // Восстанавливаем стили узлов
            nodesElements.forEach((nodeEl, idx) => {
                nodeEl.style.width = originalNodeStyles[idx];
            });
            flowElement.style.overflow = originalOverflow;
            flowElement.style.width = originalWidth;
            flowElement.style.height = originalHeight;
            viewportElement.style.transform = originalTransform;
        }
    }, [project, nodes]);

    useEffect(() => {
        if (!project) return;
        const timer = setTimeout(() => {
            const updatedProject = {
                ...project,
                nodes,
                edges,
                lastEdited: new Date().toISOString()
            };
            updateProject(updatedProject);
        }, 1000);
        return () => clearTimeout(timer);
    }, [nodes, edges, project, updateProject]);

    if (!project) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <h2>Проект не найден</h2>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Вернуться к проектам
                </button>
            </div>
        );
    }

    const filteredOperations = () => {
        let operations = operationTemplates.common;
        if (project.type !== 'common') {
            operations = [...operations, ...(operationTemplates[project.type] || [])];
        }
        return operations.filter(op =>
            (selectedCategory === 'all' || op.category === selectedCategory) &&
            op.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const categories = [...new Set(filteredOperations().map(op => op.category))];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Верхняя панель */}
            <div style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ← К проектам
                    </button>
                    <h2 style={{ margin: 0 }}>{project.name}</h2>
                    <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        {project.type} | Кл.{project.accuracyClass} | {project.material}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={openParamsModal}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#0084ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ⚙️ Параметры
                    </button>

                    <button
                        onClick={saveAndValidate}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        💾 Сохранить
                    </button>

                    <button
                        onClick={downloadAsPNG}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#f39821',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >

                        🖼️ PNG
                    </button>
                </div>
            </div>

            {/* Основная область */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Левая панель */}
                <div style={{
                    width: '300px',
                    borderRight: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '15px',
                        borderBottom: '1px solid #ddd',
                        flexShrink: 0
                    }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>Библиотека операций</h3>

                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                marginBottom: '10px',
                                boxSizing: 'border-box'
                            }}
                        />

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                marginBottom: '10px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="all">Все категории</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowCustomModal(true)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                boxSizing: 'border-box'
                            }}
                        >
                            Создать операцию
                        </button>
                    </div>

                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '15px'
                    }}>
                        {filteredOperations().map(op => (
                            <div
                                key={op.id}
                                onClick={() => addNode(op)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    cursor: 'grab',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    wordBreak: 'break-word'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{op.label}</div>
                                <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                                    {op.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Холст */}
                <div style={{ flex: 2, position: 'relative' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background />
                        <Panel position="top-right" style={{ background: 'white', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div>Узлов: {nodes.length} | Связей: {edges.length}</div>
                        </Panel>
                    </ReactFlow>
                </div>

                {/* Правая панель */}
                <div style={{
                    width: '390px',
                    borderLeft: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    overflow: 'auto',
                    flexShrink: 0
                }}>
                    <KnowledgeBase
                        warnings={warnings}
                        hasValidated={hasValidated}
                    />
                </div>
            </div>

            {/* Модальные окна... */}
            {showCustomModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        width: '450px',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Создание кастомной операции</h3>

                        {/* Название операции */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Название операции
                            </label>
                            <input
                                type="text"
                                value={customOpName}
                                onChange={(e) => setCustomOpName(e.target.value)}
                                placeholder="Например: Ультразвуковая очистка"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                                autoFocus
                            />
                        </div>

                        {/* Категория */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Категория
                            </label>
                            <select
                                value={customOpCategory}
                                onChange={(e) => setCustomOpCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                            >
                                <option>Подготовка</option>
                                <option>Механика</option>
                                <option>Химия</option>
                                <option>Гальваника</option>
                                <option>Фотолитография</option>
                                <option>Маскирование</option>
                                <option>Контроль</option>
                                <option>Финиш</option>
                                <option>Пользовательские</option>
                            </select>
                        </div>

                        {/* Кастомные параметры — можно добавлять свои */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Параметры (необязательно)
                            </label>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                Добавьте параметры в формате: название=значение (по одному на строку)
                            </div>
                            <textarea
                                value={customParamsText}
                                onChange={(e) => setCustomParamsText(e.target.value)}
                                placeholder="Пример:&#10;температура=50&#10;время=10&#10;скорость=1.5"
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Кнопки */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowCustomModal(false);
                                    setCustomOpName('');
                                    setCustomParamsText('');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={addCustomNode}
                                disabled={!customOpName.trim()}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: customOpName.trim() ? '#4CAF50' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: customOpName.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '14px'
                                }}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для редактирования параметров проекта */}
            {showParamsModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '480px',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '500' }}>Параметры проекта</h3>

                        {/* Название проекта */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                Название
                            </label>
                            <input
                                type="text"
                                value={editParams.name}
                                onChange={(e) => setEditParams(prev => ({ ...prev, name: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Тип платы */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                Тип платы
                            </label>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                {['ОПП', 'ДПП', 'МПП'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                        <input
                                            type="radio"
                                            value={type}
                                            checked={editParams.type === type}
                                            onChange={(e) => setEditParams(prev => ({ ...prev, type: e.target.value }))}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Два столбца */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Класс точности
                                </label>
                                <select
                                    value={editParams.accuracyClass}
                                    onChange={(e) => setEditParams(prev => ({ ...prev, accuracyClass: parseInt(e.target.value) }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px',
                                        background: 'white'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map(cls => (
                                        <option key={cls} value={cls}>Класс {cls}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Материал
                                </label>
                                <select
                                    value={editParams.material}
                                    onChange={(e) => setEditParams(prev => ({ ...prev, material: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px',
                                        background: 'white'
                                    }}
                                >
                                    <option>FR-4</option>
                                    <option>PTFE</option>
                                    <option>Керамика</option>
                                    <option>Полиимид</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Толщина фольги (мкм)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    value={editParams.foil}
                                    onChange={(e) => setEditParams(prev => ({ ...prev, foil: parseFloat(e.target.value) }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Стандарт
                                </label>
                                <select
                                    value={editParams.standard}
                                    onChange={(e) => {
                                        const newStandard = e.target.value;
                                        setEditParams(prev => ({
                                            ...prev,
                                            standard: newStandard,
                                            ipcClass: newStandard.includes('IPC') ? '2' : 'none'
                                        }));
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px',
                                        background: 'white'
                                    }}
                                >
                                    <option value="ГОСТ 23752-79">ГОСТ 23752-79</option>
                                    <option value="IPC-6012B Class 2">IPC-6012B Class 2</option>
                                    <option value="IPC-6012B Class 3">IPC-6012B Class 3</option>
                                </select>
                            </div>
                        </div>

                        {/* IPC Class */}
                        {editParams.standard.includes('IPC') && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    IPC Class
                                </label>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                        <input
                                            type="radio"
                                            value="2"
                                            checked={editParams.ipcClass === '2'}
                                            onChange={(e) => setEditParams(prev => ({ ...prev, ipcClass: e.target.value }))}
                                        />
                                        Class 2
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                        <input
                                            type="radio"
                                            value="3"
                                            checked={editParams.ipcClass === '3'}
                                            onChange={(e) => setEditParams(prev => ({ ...prev, ipcClass: e.target.value }))}
                                        />
                                        Class 3
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Кнопки */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowParamsModal(false)}
                                style={{
                                    padding: '8px 20px',
                                    background: 'none',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={saveProjectParams}
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditorPage;