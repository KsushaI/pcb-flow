import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNodesBounds, getViewportForBounds } from 'reactflow';

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

const nodeTypes = {
    custom: CustomNode
};

function EditorPage({ projects, updateProject }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Все хуки ДО условного рендеринга!
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customOpName, setCustomOpName] = useState('');
    const [customOpCategory, setCustomOpCategory] = useState('Пользовательские');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Находим проект после всех хуков
    const project = projects.find(p => p.id === id);

    // Инициализация узлов и связей (тоже до условного рендера)
    const [nodes, setNodes, onNodesChange] = useNodesState(project?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(project?.edges || []);

    // useCallback тоже ДО условного рендера
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
                category: template.category
            },
            position: { x: Math.random() * 400, y: Math.random() * 400 }
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const addCustomNode = useCallback(() => {
        if (customOpName.trim()) {
            addNode({ label: customOpName, category: customOpCategory });
            setCustomOpName('');
            setShowCustomModal(false);
        }
    }, [customOpName, customOpCategory, addNode]);

    const saveProject = useCallback(() => {
        if (!project) return;

        const updatedProject = {
            ...project,
            nodes,
            edges,
            lastEdited: new Date().toISOString()
        };
        updateProject(updatedProject);
        alert('Проект сохранен');
    }, [project, nodes, edges, updateProject]);




const downloadAsPNG = useCallback(() => {
  // ✅ Правильный селектор для React Flow
  const flowElement = document.querySelector('.react-flow__viewport');
  
  if (flowElement) {
    toPng(flowElement, {
      backgroundColor: '#ffffff',
      // ❌ Не задавайте width/height вручную — пусть библиотека определит сама
      quality: 1,
      pixelRatio: 2,
      // ✅ Исключите элементы управления из скриншота
      filter: (node) => {
        const className = node?.classList?.toString() || '';
        return !className.includes('react-flow__controls') && 
               !className.includes('react-flow__minimap');
      },
      // ✅ Важно для SVG-элементов
      style: {
        transform: 'none', // сброс трансформаций
        left: '0',
        top: '0',
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${project.name || 'process'}_${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Ошибка при сохранении PNG:', error);
        alert('Не удалось сохранить изображение');
      });
  } else {
    alert('Элемент графа не найден');
  }
}, [project]);
    // Автосохранение
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

    // ТЕПЕРЬ можно делать условный рендеринг
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
                <h2>❌ Проект не найден</h2>
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

    // Фильтрация операций
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
                        onClick={saveProject}
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
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        🖼️ PNG
                    </button>
                </div>
            </div>
            {/* Основная область */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Левая панель - библиотека операций */}
                <div style={{
                    width: '300px',
                    borderRight: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>📋 Библиотека операций</h3>

                        <input
                            type="text"
                            placeholder="🔍 Поиск..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                marginBottom: '10px'
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
                                marginBottom: '10px'
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
                                cursor: 'pointer'
                            }}
                        >
                            ✚ Создать кастомную операцию
                        </button>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', padding: '15px' }}>
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
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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

                {/* Правая панель - база знаний */}
                <div style={{
                    width: '350px',
                    borderLeft: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    overflow: 'auto'
                }}>
                    <KnowledgeBase
                        boardType={project.type}
                        accuracyClass={project.accuracyClass}
                    />
                </div>
            </div>

            {/* Модальное окно для кастомной операции */}
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
                        width: '400px',
                        maxWidth: '90%'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Создание кастомной операции</h3>

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

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowCustomModal(false)}
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
        </div>
    );
}

export default EditorPage;