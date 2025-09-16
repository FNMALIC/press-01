'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Edit3, Image, Type, Move, Save, Download, Plus, Trash2, Bold, Italic, Copy, Layers, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Maximize, Minimize, AlignLeft, AlignCenter, AlignRight, Underline, FileText, Palette, Grid, Zap, Eye, EyeOff, Lock, Unlock, Search, Filter, Columns, Square, Circle, Triangle, Star, Heart, Hexagon, ArrowUp, ArrowDown, MousePointer, Hand, ZoomIn, ZoomOut, RefreshCw, Settings, Home, FileImage, Upload, Folder, FolderOpen, BookOpen, Bookmark, Tag, Layout, Newspaper, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const NewspaperEditor = () => {
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [showRulers, setShowRulers] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(20);
    const [clipboardElement, setClipboardElement] = useState(null);
    const [clipboardElements, setClipboardElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tool, setTool] = useState('select');
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
    const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
    const [showLayersPanel, setShowLayersPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const canvasRef = useRef(null);

    const [pages, setPages] = useState([
        {
            id: 'page-1',
            name: 'Page 1',
            thumbnail: null,
            locked: false,
            visible: true,
            backgroundColor: '#ffffff',
            elements: [
                {
                    id: 'header',
                    type: 'header',
                    content: 'Hebdo Meyomessala',
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 80,
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#8B0000',
                    backgroundColor: '#FFF8DC',
                    textAlign: 'center',
                    zIndex: 1,
                    editable: true,
                    locked: false,
                    visible: true,
                    rotation: 0,
                    opacity: 1,
                    borderWidth: 0,
                    borderColor: '#000000',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    shadow: false
                },
                {
                    id: 'main-title',
                    type: 'title',
                    content: 'DES SOUTIENS à la pelle',
                    x: 50,
                    y: 120,
                    width: 400,
                    height: 120,
                    fontSize: 36,
                    fontWeight: 'bold',
                    color: '#8B0000',
                    textAlign: 'left',
                    zIndex: 2,
                    editable: true,
                    locked: false,
                    visible: true,
                    rotation: 0,
                    opacity: 1,
                    borderWidth: 0,
                    borderColor: '#000000',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    shadow: false
                },
                {
                    id: 'main-image',
                    type: 'image',
                    content: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Image+Principale',
                    x: 450,
                    y: 120,
                    width: 300,
                    height: 200,
                    zIndex: 1,
                    editable: true,
                    locked: false,
                    visible: true,
                    rotation: 0,
                    opacity: 1,
                    borderWidth: 0,
                    borderColor: '#000000',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    shadow: false
                },
                {
                    id: 'article-1',
                    type: 'article',
                    content: 'La dynamique de rassemblement en faveur du porte-étendard du Rassemblement démocratique du peuple camerounais à l\'élection présidentielle du 12 octobre 2025 connaît l\'adhésion de diverses couches de la société, de plusieurs corps de métiers, et de nombreuses formations politiques.',
                    x: 50,
                    y: 260,
                    width: 380,
                    height: 200,
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'justify',
                    zIndex: 1,
                    editable: true,
                    locked: false,
                    visible: true,
                    rotation: 0,
                    opacity: 1,
                    borderWidth: 0,
                    borderColor: '#000000',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    shadow: false,
                    columnCount: 1,
                    columnGap: 20
                }
            ]
        }
    ]);

    const [draggedElement, setDraggedElement] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [viewMode, setViewMode] = useState('design');
    const [showProperties, setShowProperties] = useState(true);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [saveTimeout, setSaveTimeout] = useState(null);

    const fontFamilies = [
        'Arial, sans-serif',
        'Georgia, serif',
        'Times New Roman, serif',
        'Helvetica, sans-serif',
        'Courier New, monospace',
        'Verdana, sans-serif',
        'Trebuchet MS, sans-serif',
        'Impact, sans-serif',
        'Comic Sans MS, cursive',
        'Palatino, serif'
    ];

    const templates = [
        { id: 'news', name: 'Article de presse', icon: FileText },
        { id: 'column', name: 'Colonne', icon: Columns },
        { id: 'header', name: 'En-tête', icon: Type },
        { id: 'sidebar', name: 'Encadré', icon: Square }
    ];

    const newspaperTemplates = [
        {
            id: 'classic-front',
            name: 'Une Classique',
            icon: Newspaper,
            description: 'Layout de première page traditionnel',
            elements: [
                {
                    id: 'masthead',
                    type: 'header',
                    content: 'LE QUOTIDIEN',
                    x: 0, y: 0, width: 800, height: 80,
                    fontSize: 36, fontWeight: 'bold', color: '#1a1a1a',
                    backgroundColor: '#f8f9fa', textAlign: 'center',
                    borderWidth: 2, borderColor: '#1a1a1a'
                },
                {
                    id: 'headline',
                    type: 'title',
                    content: 'TITRE PRINCIPAL DE L\'ACTUALITÉ',
                    x: 50, y: 100, width: 700, height: 80,
                    fontSize: 28, fontWeight: 'bold', color: '#1a1a1a',
                    textAlign: 'center'
                },
                {
                    id: 'main-story',
                    type: 'article',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
                    x: 50, y: 200, width: 350, height: 200,
                    fontSize: 14, color: '#333', textAlign: 'justify'
                },
                {
                    id: 'main-image',
                    type: 'image',
                    content: 'https://via.placeholder.com/350x200/e9ecef/495057?text=Image+Principale',
                    x: 420, y: 200, width: 330, height: 200
                }
            ]
        },
        {
            id: 'modern-layout',
            name: 'Layout Moderne',
            icon: Layout,
            description: 'Design contemporain avec colonnes',
            elements: [
                {
                    id: 'modern-header',
                    type: 'header',
                    content: 'HEBDO MODERNE',
                    x: 0, y: 0, width: 800, height: 60,
                    fontSize: 32, fontWeight: 'bold', color: '#ffffff',
                    backgroundColor: '#2c3e50', textAlign: 'center'
                },
                {
                    id: 'featured-title',
                    type: 'title',
                    content: 'Article Vedette',
                    x: 50, y: 80, width: 300, height: 50,
                    fontSize: 24, fontWeight: 'bold', color: '#2c3e50'
                },
                {
                    id: 'column-1',
                    type: 'article',
                    content: 'Premier article en colonne. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    x: 50, y: 150, width: 230, height: 300,
                    fontSize: 12, columnCount: 1, textAlign: 'justify'
                },
                {
                    id: 'column-2',
                    type: 'article',
                    content: 'Deuxième article en colonne. Ut enim ad minim veniam, quis nostrud exercitation.',
                    x: 300, y: 150, width: 230, height: 300,
                    fontSize: 12, columnCount: 1, textAlign: 'justify'
                },
                {
                    id: 'sidebar-box',
                    type: 'article',
                    content: 'ENCADRÉ SPÉCIAL\n\nInformation importante mise en valeur.',
                    x: 550, y: 150, width: 200, height: 150,
                    fontSize: 11, backgroundColor: '#ecf0f1', textAlign: 'center',
                    borderWidth: 1, borderColor: '#bdc3c7'
                }
            ]
        },
        {
            id: 'sports-layout',
            name: 'Page Sport',
            icon: Circle,
            description: 'Layout spécialisé pour les actualités sportives',
            elements: [
                {
                    id: 'sports-header',
                    type: 'header',
                    content: 'SPORTS',
                    x: 0, y: 0, width: 800, height: 70,
                    fontSize: 40, fontWeight: 'bold', color: '#ffffff',
                    backgroundColor: '#e74c3c', textAlign: 'center'
                },
                {
                    id: 'match-result',
                    type: 'title',
                    content: 'RÉSULTATS DU MATCH',
                    x: 50, y: 90, width: 700, height: 60,
                    fontSize: 26, fontWeight: 'bold', color: '#e74c3c',
                    textAlign: 'center', backgroundColor: '#fdf2f2'
                },
                {
                    id: 'sports-story',
                    type: 'article',
                    content: 'Compte-rendu détaillé du match. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    x: 50, y: 170, width: 450, height: 250,
                    fontSize: 13, textAlign: 'justify'
                },
                {
                    id: 'stats-box',
                    type: 'article',
                    content: 'STATISTIQUES\n\nButs: 3-1\nCartons: 2\nPossession: 60%',
                    x: 520, y: 170, width: 230, height: 120,
                    fontSize: 12, backgroundColor: '#fff5f5', textAlign: 'left',
                    borderWidth: 2, borderColor: '#e74c3c'
                }
            ]
        }
    ];

    const shapes = [
        { id: 'rectangle', name: 'Rectangle', icon: Square },
        { id: 'circle', name: 'Cercle', icon: Circle },
        { id: 'triangle', name: 'Triangle', icon: Triangle },
        { id: 'star', name: 'Étoile', icon: Star },
        { id: 'heart', name: 'Cœur', icon: Heart },
        { id: 'hexagon', name: 'Hexagone', icon: Hexagon }
    ];

    const currentPageData = pages[currentPage];
    const elements = currentPageData?.elements || [];
    const visibleElements = elements.filter(el => el.visible !== false);
    const filteredElements = visibleElements.filter(el => {
        if (filterType !== 'all' && el.type !== filterType) return false;
        if (searchTerm && !el.content?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const saveToHistory = useCallback(() => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(pages)));
        setHistory(newHistory.slice(-50));
        setHistoryIndex(Math.min(newHistory.length - 1, 49));
    }, [pages, history, historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setPages(history[historyIndex - 1]);
            setSelectedElement(null);
            setSelectedElements([]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setPages(history[historyIndex + 1]);
            setSelectedElement(null);
            setSelectedElements([]);
        }
    };

    // Fonction pour mettre à jour l'ombre du texte
    const updateTextShadow = (property: string, value: any) => {
        if (!selectedElement) return;
        
        const currentPageElements = pages[currentPage]?.elements || [];
        const element = currentPageElements.find(el => el.id === selectedElement);
        if (!element) return;
        
        const updatedPages = pages.map((page, index) => {
            if (index === currentPage) {
                const updatedElements = page.elements.map(el => {
                    if (el.id === selectedElement) {
                        const updatedElement = { ...el };
                        
                        // Mise à jour des propriétés d'ombre
                        switch (property) {
                            case 'x':
                                updatedElement.textShadowX = value;
                                break;
                            case 'y':
                                updatedElement.textShadowY = value;
                                break;
                            case 'blur':
                                updatedElement.textShadowBlur = value;
                                break;
                            case 'color':
                                updatedElement.textShadowColor = value;
                                break;
                        }
                        
                        // Reconstruction de la propriété textShadow CSS
                        const x = updatedElement.textShadowX || 0;
                        const y = updatedElement.textShadowY || 0;
                        const blur = updatedElement.textShadowBlur || 0;
                        const color = updatedElement.textShadowColor || '#000000';
                        
                        if (x !== 0 || y !== 0 || blur !== 0) {
                            updatedElement.textShadow = `${x}px ${y}px ${blur}px ${color}`;
                        } else {
                            delete updatedElement.textShadow;
                        }
                        
                        return updatedElement;
                    }
                    return el;
                });
                
                return { ...page, elements: updatedElements };
            }
            return page;
        });
        
        setPages(updatedPages);
        saveToHistory();
    };

    const updateElements = (newElements) => {
        setPages(prev => prev.map((page, index) =>
            index === currentPage
                ? { ...page, elements: newElements }
                : page
        ));
    };

    const snapToGridFn = (value) => {
        if (!snapToGrid) return value;
        return Math.round(value / gridSize) * gridSize;
    };

    const handleElementClick = (element, e) => {
        e.stopPropagation();
        
        // Only handle element selection when using the select tool
        if (tool !== 'select') {
            return;
        }
        
        // Ensure the element exists in current elements
        const currentElement = elements.find(el => el.id === element.id);
        if (!currentElement) {
            console.warn('Element not found in current elements:', element.id);
            return;
        }

        if (e.shiftKey && selectedElements.length > 0) {
            if (selectedElements.includes(element.id)) {
                setSelectedElements(prev => prev.filter(id => id !== element.id));
                if (selectedElement === element.id) setSelectedElement(null);
            } else {
                setSelectedElements(prev => [...prev, element.id]);
                if (!selectedElement) setSelectedElement(element.id);
            }
        } else if (e.ctrlKey || e.metaKey) {
            if (selectedElements.includes(element.id)) {
                setSelectedElements(prev => prev.filter(id => id !== element.id));
                if (selectedElement === element.id) setSelectedElement(null);
            } else {
                setSelectedElements(prev => [...prev, element.id]);
                setSelectedElement(element.id);
            }
        } else {
            // Clear editing state when selecting different element
            if (selectedElement !== element.id) {
                setIsEditing(false);
            }
            
            // Set new selection
            setSelectedElements([element.id]);
            setSelectedElement(element.id);
            
            // Enable editing for text elements (only if double-click or already selected)
            if (selectedElement === element.id && element.editable && element.type !== 'image' && element.type !== 'shape') {
                setIsEditing(true);
                setEditingText(element.content);
            }
        }
    };

    const handleMouseDown = (element, e) => {
        if (element.locked) return;
        if (e.target.closest('.edit-controls') || e.target.closest('.resize-handle')) return;

        if (tool === 'select') {
            setDraggedElement(element.id);
            const rect = e.currentTarget.getBoundingClientRect();
            const canvas = canvasRef.current.getBoundingClientRect();
            setDragOffset({
                x: (e.clientX - canvas.left) / zoomLevel - element.x,
                y: (e.clientY - canvas.top) / zoomLevel - element.y
            });
        }
    };

    const handleCanvasMouseDown = (e) => {
        // Don't interfere with UI elements
        if (e.target.closest('.properties-panel') || 
            e.target.closest('.edit-controls') || 
            e.target.closest('.resize-handle') ||
            e.target.closest('input') ||
            e.target.closest('select') ||
            e.target.closest('button') ||
            e.target.closest('.sidebar')) {
            return;
        }
        
        // Handle different tools
        switch (tool) {
            case 'select':
                // Only clear selection if clicking on empty canvas (not on elements)
                if (!e.target.closest('.element')) {
                    setIsSelecting(true);
                    const canvas = canvasRef.current.getBoundingClientRect();
                    const startX = (e.clientX - canvas.left) / zoomLevel;
                    const startY = (e.clientY - canvas.top) / zoomLevel;
                    setSelectionStart({ x: startX, y: startY });
                    setSelectionEnd({ x: startX, y: startY });
                    
                    // Clear selection and editing when clicking empty space
                    setSelectedElement(null);
                    setSelectedElements([]);
                    setIsEditing(false);
                }
                break;
            
            case 'hand':
                // Hand tool is for panning - don't clear selections
                // Add panning logic here if needed
                break;
        }
    };

    const handleResizeStart = (element, handle, e) => {
        if (element.locked) return;
        e.stopPropagation();
        setIsResizing(true);
        setResizeHandle(handle);
        setSelectedElement(element.id);
    };

    const handleMouseMove = (e) => {
        if (!draggedElement && !isResizing && !isSelecting) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / zoomLevel;
        const mouseY = (e.clientY - rect.top) / zoomLevel;

        if (draggedElement) {
            const newX = snapToGridFn(mouseX - dragOffset.x);
            const newY = snapToGridFn(mouseY - dragOffset.y);

            if (selectedElements.length > 1 && selectedElements.includes(draggedElement)) {
                const draggedEl = elements.find(el => el.id === draggedElement);
                const deltaX = newX - draggedEl.x;
                const deltaY = newY - draggedEl.y;

                updateElements(elements.map(el =>
                    selectedElements.includes(el.id) && !el.locked
                        ? { ...el, x: Math.max(0, el.x + deltaX), y: Math.max(0, el.y + deltaY) }
                        : el
                ));
            } else {
                updateElements(elements.map(el =>
                    el.id === draggedElement && !el.locked
                        ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
                        : el
                ));
            }
        }

        if (isSelecting) {
            setSelectionEnd({ x: mouseX, y: mouseY });
            const minX = Math.min(selectionStart.x, mouseX);
            const maxX = Math.max(selectionStart.x, mouseX);
            const minY = Math.min(selectionStart.y, mouseY);
            const maxY = Math.max(selectionStart.y, mouseY);

            const selectedIds = elements
                .filter(el =>
                    el.x + el.width > minX &&
                    el.x < maxX &&
                    el.y + el.height > minY &&
                    el.y < maxY &&
                    el.visible !== false
                )
                .map(el => el.id);

            setSelectedElements(selectedIds);
        }

        if (isResizing && selectedElement) {
            updateElements(elements.map(el => {
                if (el.id === selectedElement && !el.locked) {
                    let newWidth = el.width;
                    let newHeight = el.height;
                    let newX = el.x;
                    let newY = el.y;

                    switch (resizeHandle) {
                        case 'se':
                            newWidth = Math.max(50, snapToGridFn(mouseX - el.x));
                            newHeight = Math.max(30, snapToGridFn(mouseY - el.y));
                            break;
                        case 'sw':
                            newWidth = Math.max(50, snapToGridFn(el.x + el.width - mouseX));
                            newHeight = Math.max(30, snapToGridFn(mouseY - el.y));
                            newX = snapToGridFn(mouseX);
                            break;
                        case 'ne':
                            newWidth = Math.max(50, snapToGridFn(mouseX - el.x));
                            newHeight = Math.max(30, snapToGridFn(el.y + el.height - mouseY));
                            newY = snapToGridFn(mouseY);
                            break;
                        case 'nw':
                            newWidth = Math.max(50, snapToGridFn(el.x + el.width - mouseX));
                            newHeight = Math.max(30, snapToGridFn(el.y + el.height - mouseY));
                            newX = snapToGridFn(mouseX);
                            newY = snapToGridFn(mouseY);
                            break;
                    }

                    return { ...el, x: newX, y: newY, width: newWidth, height: newHeight };
                }
                return el;
            }));
        }
    };

    const handleMouseUp = () => {
        if (draggedElement || isResizing) {
            saveToHistory();
        }
        if (isSelecting) {
            setIsSelecting(false);
        }
        setDraggedElement(null);
        setIsResizing(false);
        setResizeHandle(null);
    };

    const handleTextChange = (value) => {
        setEditingText(value);
        updateElements(elements.map(el =>
            el.id === selectedElement ? { ...el, content: value } : el
        ));
    };

    const handleTextSubmit = () => {
        setIsEditing(false);
        setSelectedElement(null);
        saveToHistory();
    };
    //
    // const handleImageUpload = (elementId, e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             updateElements(elements.map(el =>
    //                 el.id === elementId ? { ...el, content: e.target.result } : el
    //             ));
    //             saveToHistory();
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const addNewElement = (type, template = null) => {
        // Auto-switch to select tool
        setTool('select');
        
        let newElement = {
            id: `element-${Date.now()}`,
            type,
            x: snapToGridFn(100 + (elements.length * 20)),
            y: snapToGridFn(100 + (elements.length * 20)),
            zIndex: Math.max(...elements.map(el => el.zIndex || 0), 0) + 1,
            editable: true,
            locked: false,
            visible: true,
            rotation: 0,
            opacity: 1,
            borderWidth: 0,
            borderColor: '#000000',
            borderStyle: 'solid',
            borderRadius: 0,
            shadow: false
        };

        switch (type) {
            case 'image':
                newElement = {
                    ...newElement,
                    content: 'https://via.placeholder.com/200x150/CCCCCC/000000?text=Nouvelle+Image',
                    width: 200,
                    height: 150
                };
                break;
            case 'shape':
                newElement = {
                    ...newElement,
                    content: template || 'rectangle',
                    width: 100,
                    height: 100,
                    backgroundColor: '#4A90E2',
                    editable: false
                };
                break;
            case 'title':
                newElement = {
                    ...newElement,
                    content: 'Nouveau Titre',
                    width: 300,
                    height: 60,
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#8B0000',
                    textAlign: 'left'
                };
                break;
            case 'subtitle':
                newElement = {
                    ...newElement,
                    content: 'Sous-titre',
                    width: 250,
                    height: 40,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#8B0000',
                    textAlign: 'left'
                };
                break;
            case 'article':
                if (template === 'column') {
                    newElement = {
                        ...newElement,
                        content: 'Texte en colonne. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        width: 180,
                        height: 350,
                        fontSize: 11,
                        color: '#000000',
                        textAlign: 'justify',
                        columnCount: 2,
                        columnGap: 15
                    };
                } else if (template === 'news') {
                    newElement = {
                        ...newElement,
                        content: 'ACTUALITÉ - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
                        width: 400,
                        height: 120,
                        fontSize: 13,
                        color: '#000000',
                        textAlign: 'left',
                        fontWeight: 'normal'
                    };
                } else if (template === 'sidebar') {
                    newElement = {
                        ...newElement,
                        content: 'ENCADRÉ\n\nInformation importante ou citation mise en valeur dans cet encadré.',
                        width: 200,
                        height: 150,
                        fontSize: 12,
                        color: '#333333',
                        backgroundColor: '#f8f9fa',
                        textAlign: 'center',
                        borderWidth: 1,
                        borderColor: '#dee2e6',
                        borderRadius: 4
                    };
                } else if (template === 'header') {
                    newElement = {
                        ...newElement,
                        content: 'TITRE DE SECTION',
                        width: 400,
                        height: 50,
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#8B0000',
                        backgroundColor: '#FFF8DC',
                        textAlign: 'center',
                        borderWidth: 2,
                        borderColor: '#8B0000'
                    };
                } else {
                    newElement = {
                        ...newElement,
                        content: 'Nouveau texte d\'article. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        width: 300,
                        height: 100,
                        fontSize: 14,
                        color: '#000000',
                        textAlign: 'left'
                    };
                }
                break;
            default:
                newElement = {
                    ...newElement,
                    content: 'Nouveau texte',
                    width: 200,
                    height: 50,
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'left'
                };
        }

        updateElements([...elements, newElement]);
        setSelectedElement(newElement.id);
        setSelectedElements([newElement.id]);
        saveToHistory();
    };

    const deleteElement = (elementId) => {
        updateElements(elements.filter(el => el.id !== elementId));
        setSelectedElement(null);
        setSelectedElements(prev => prev.filter(id => id !== elementId));
        saveToHistory();
    };

    const deleteSelectedElements = () => {
        const elementsToDelete = selectedElements.filter(id => {
            const el = elements.find(e => e.id === id);
            return el && !el.locked && el.id !== 'header';
        });

        if (elementsToDelete.length > 0) {
            updateElements(elements.filter(el => !elementsToDelete.includes(el.id)));
            setSelectedElement(null);
            setSelectedElements([]);
            saveToHistory();
        }
    };

    const duplicateElement = (elementId) => {
        const element = elements.find(el => el.id === elementId);
        if (element) {
            const newElement = {
                ...element,
                id: `element-${Date.now()}`,
                x: element.x + 20,
                y: element.y + 20,
                zIndex: Math.max(...elements.map(el => el.zIndex || 0), 0) + 1
            };
            updateElements([...elements, newElement]);
            saveToHistory();
        }
    };

    const copyElement = () => {
        if (selectedElements.length > 1) {
            const elementsToCopy = elements.filter(el => selectedElements.includes(el.id));
            setClipboardElements(elementsToCopy);
        } else if (selectedElement) {
            const element = elements.find(el => el.id === selectedElement);
            if (element) {
                setClipboardElement({ ...element });
            }
        }
    };

    const pasteElement = () => {
        if (clipboardElements.length > 0) {
            const newElements = clipboardElements.map(el => ({
                ...el,
                id: `element-${Date.now()}-${Math.random()}`,
                x: el.x + 20,
                y: el.y + 20,
                zIndex: Math.max(...elements.map(e => e.zIndex || 0), 0) + 1
            }));
            updateElements([...elements, ...newElements]);
            setSelectedElements(newElements.map(el => el.id));
            saveToHistory();
        } else if (clipboardElement) {
            const newElement = {
                ...clipboardElement,
                id: `element-${Date.now()}`,
                x: clipboardElement.x + 20,
                y: clipboardElement.y + 20,
                zIndex: Math.max(...elements.map(el => el.zIndex || 0), 0) + 1
            };
            updateElements([...elements, newElement]);
            setSelectedElement(newElement.id);
            setSelectedElements([newElement.id]);
            saveToHistory();
        }
    };

    const updateElementStyle = (property, value) => {
        if (selectedElements.length > 1) {
            const updatedElements = elements.map(el =>
                selectedElements.includes(el.id) && !el.locked ? { ...el, [property]: value } : el
            );
            updateElements(updatedElements);
        } else if (selectedElement) {
            const updatedElements = elements.map(el =>
                el.id === selectedElement && !el.locked ? { ...el, [property]: value } : el
            );
            updateElements(updatedElements);
        }
        
        // Auto-save to history with debouncing
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        const newTimeout = setTimeout(() => {
            saveToHistory();
        }, 300);
        setSaveTimeout(newTimeout);
    };

    const alignElements = (alignment) => {
        if (selectedElements.length < 2) return;

        const selectedEls = elements.filter(el => selectedElements.includes(el.id) && !el.locked);
        if (selectedEls.length < 2) return;

        let updates = {};

        switch (alignment) {
            case 'left':
                const minX = Math.min(...selectedEls.map(el => el.x));
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { x: minX } }), {});
                break;
            case 'right':
                const maxRight = Math.max(...selectedEls.map(el => el.x + el.width));
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { x: maxRight - el.width } }), {});
                break;
            case 'top':
                const minY = Math.min(...selectedEls.map(el => el.y));
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { y: minY } }), {});
                break;
            case 'bottom':
                const maxBottom = Math.max(...selectedEls.map(el => el.y + el.height));
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { y: maxBottom - el.height } }), {});
                break;
            case 'center-h':
                const centerX = (Math.min(...selectedEls.map(el => el.x)) + Math.max(...selectedEls.map(el => el.x + el.width))) / 2;
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { x: centerX - el.width / 2 } }), {});
                break;
            case 'center-v':
                const centerY = (Math.min(...selectedEls.map(el => el.y)) + Math.max(...selectedEls.map(el => el.y + el.height))) / 2;
                updates = selectedEls.reduce((acc, el) => ({ ...acc, [el.id]: { y: centerY - el.height / 2 } }), {});
                break;
        }

        updateElements(elements.map(el =>
            updates[el.id] ? { ...el, ...updates[el.id] } : el
        ));
        saveToHistory();
    };

    const bringToFront = () => {
        const maxZ = Math.max(...elements.map(el => el.zIndex || 0));
        if (selectedElements.length > 1) {
            updateElements(elements.map(el =>
                selectedElements.includes(el.id) ? { ...el, zIndex: maxZ + 1 + selectedElements.indexOf(el.id) } : el
            ));
        } else {
            updateElementStyle('zIndex', maxZ + 1);
        }
        saveToHistory();
    };

    const sendToBack = () => {
        const minZ = Math.min(...elements.map(el => el.zIndex || 0));
        if (selectedElements.length > 1) {
            updateElements(elements.map(el =>
                selectedElements.includes(el.id) ? { ...el, zIndex: minZ - 1 - selectedElements.indexOf(el.id) } : el
            ));
        } else {
            updateElementStyle('zIndex', minZ - 1);
        }
        saveToHistory();
    };

    const toggleElementLock = (elementId) => {
        updateElements(elements.map(el =>
            el.id === elementId ? { ...el, locked: !el.locked } : el
        ));
        saveToHistory();
    };

    const toggleElementVisibility = (elementId) => {
        updateElements(elements.map(el =>
            el.id === elementId ? { ...el, visible: !el.visible } : el
        ));
        if (!elements.find(el => el.id === elementId)?.visible) {
            setSelectedElement(null);
            setSelectedElements(prev => prev.filter(id => id !== elementId));
        }
        saveToHistory();
    };

    const addPage = () => {
        const newPage = {
            id: `page-${Date.now()}`,
            name: `Page ${pages.length + 1}`,
            thumbnail: null,
            locked: false,
            visible: true,
            backgroundColor: '#ffffff',
            elements: []
        };
        setPages([...pages, newPage]);
        setCurrentPage(pages.length);
    };

    const duplicatePage = () => {
        const currentPageCopy = {
            ...currentPageData,
            id: `page-${Date.now()}`,
            name: `${currentPageData.name} (Copie)`,
            elements: currentPageData.elements.map(el => ({
                ...el,
                id: `${el.id}-copy-${Date.now()}`
            }))
        };
        setPages([...pages, currentPageCopy]);
        setCurrentPage(pages.length);
    };

    const applyNewsletterTemplate = (template) => {
        // Auto-switch to select tool
        setTool('select');
        
        const timestamp = Date.now();
        const newElements = template.elements.map((el, index) => ({
            ...el,
            id: `${el.id}-${timestamp}-${index}`,
            zIndex: el.zIndex || 1,
            editable: true,
            locked: false,
            visible: true,
            rotation: el.rotation || 0,
            opacity: el.opacity || 1,
            borderStyle: el.borderStyle || 'solid',
            borderRadius: el.borderRadius || 0,
            shadow: false,
            // Ensure all advanced font properties are preserved
            fontFamily: el.fontFamily || 'Arial, sans-serif',
            lineHeight: el.lineHeight || 1.2,
            letterSpacing: el.letterSpacing || 0,
            wordSpacing: el.wordSpacing || 0,
            textTransform: el.textTransform || 'none',
            textShadow: el.textShadow || 'none',
            textShadowX: el.textShadowX || 0,
            textShadowY: el.textShadowY || 0,
            textShadowBlur: el.textShadowBlur || 0,
            textShadowColor: el.textShadowColor || '#000000'
        }));
        
        updateElements(newElements);
        
        // Clear any existing selections since we're loading a new template
        setSelectedElement(null);
        setSelectedElements([]);
        setIsEditing(false);
        
        // Save to history with a slight delay to ensure state updates are complete
        setTimeout(() => {
            saveToHistory();
        }, 100);
    };

    const exportToPDF = async () => {
        if (!canvasRef.current) return;

        try {
            // Temporarily hide UI elements for clean PDF
            const canvas = canvasRef.current;
            const originalTransform = canvas.style.transform;
            const originalZoom = zoomLevel;
            
            // Reset zoom for PDF export
            canvas.style.transform = 'scale(1)';
            
            // Capture the canvas
            const canvasImage = await html2canvas(canvas, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;
            
            pdf.addImage(canvasImage.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Add other pages if they exist
            for (let i = 1; i < pages.length; i++) {
                pdf.addPage();
                // Note: For multiple pages, you'd need to render each page separately
                // This is a simplified version
            }
            
            // Save PDF
            pdf.save(`journal-${currentPageData?.name || 'page'}-${Date.now()}.pdf`);
            
            // Restore original zoom
            canvas.style.transform = originalTransform;
            
        } catch (error) {
            console.error('Erreur lors de l\'exportation PDF:', error);
            alert('Erreur lors de l\'exportation PDF. Veuillez réessayer.');
        }
    };

    const saveProject = () => {
        const projectData = {
            pages,
            settings: { zoomLevel, gridSize, showGrid, snapToGrid }
        };
        const dataStr = JSON.stringify(projectData);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'journal-project.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const loadProject = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const projectData = JSON.parse(e.target.result);
                    setPages(projectData.pages);
                    if (projectData.settings) {
                        setZoomLevel(projectData.settings.zoomLevel || 1);
                        setGridSize(projectData.settings.gridSize || 20);
                        setShowGrid(projectData.settings.showGrid !== false);
                        setSnapToGrid(projectData.settings.snapToGrid !== false);
                    }
                    setCurrentPage(0);
                    setHistory([]);
                    setHistoryIndex(-1);
                } catch (error) {
                    alert('Erreur lors du chargement du projet');
                }
            };
            reader.readAsText(file);
        }
    };

    // Image upload handler
    const handleImageUpload = (e, elementId) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const updatedPages = pages.map((page, index) => {
                    if (index === currentPage) {
                        const updatedElements = page.elements.map(el => {
                            if (el.id === elementId) {
                                return { ...el, content: event.target.result };
                            }
                            return el;
                        });
                        return { ...page, elements: updatedElements };
                    }
                    return page;
                });
                
                setPages(updatedPages);
                saveToHistory();
            };
            reader.readAsDataURL(file);
        }
    };

    const selectedElementData = useMemo(() => {
        if (!selectedElement || !elements.length) return null;
        const element = elements.find(el => el.id === selectedElement);
        return element || null;
    }, [elements, selectedElement]);
    const selectionBounds = isSelecting ? {
        x: Math.min(selectionStart.x, selectionEnd.x),
        y: Math.min(selectionStart.y, selectionEnd.y),
        width: Math.abs(selectionEnd.x - selectionStart.x),
        height: Math.abs(selectionEnd.y - selectionStart.y)
    } : null;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' && selectedElements.length > 0) {
                deleteSelectedElements();
            } else if (e.key === 'Escape') {
                setSelectedElement(null);
                setSelectedElements([]);
                setIsEditing(false);
                setTool('select');
            } else if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            redo();
                        } else {
                            undo();
                        }
                        break;
                    case 'c':
                        if (selectedElements.length > 0) {
                            e.preventDefault();
                            copyElement();
                        }
                        break;
                    case 'v':
                        if (clipboardElement || clipboardElements.length > 0) {
                            e.preventDefault();
                            pasteElement();
                        }
                        break;
                    case 'd':
                        if (selectedElement) {
                            e.preventDefault();
                            duplicateElement(selectedElement);
                        }
                        break;
                    case 'a':
                        e.preventDefault();
                        setSelectedElements(elements.map(el => el.id));
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, selectedElements, clipboardElement, clipboardElements, elements]);

    // Helper component for rendering shapes
    const renderShapeContent = (element) => {
        const shapeStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const iconProps = {
            size: Math.min(element.width * 0.8, element.height * 0.8),
            style: { color: element.backgroundColor || '#4A90E2' },
            fill: element.backgroundColor || '#4A90E2'
        };

        switch (element.content) {
            case 'rectangle': 
                return (
                    <div style={{
                        ...shapeStyle,
                        backgroundColor: element.backgroundColor || '#4A90E2',
                        border: `2px solid ${element.backgroundColor || '#4A90E2'}`
                    }} />
                );
            case 'circle': 
                return (
                    <div style={{
                        ...shapeStyle,
                        backgroundColor: element.backgroundColor || '#4A90E2',
                        borderRadius: '50%',
                        border: `2px solid ${element.backgroundColor || '#4A90E2'}`
                    }} />
                );
            case 'triangle': 
                return (
                    <div style={shapeStyle}>
                        <Triangle {...iconProps} />
                    </div>
                );
            case 'star': 
                return (
                    <div style={shapeStyle}>
                        <Star {...iconProps} />
                    </div>
                );
            case 'heart': 
                return (
                    <div style={shapeStyle}>
                        <Heart {...iconProps} />
                    </div>
                );
            case 'hexagon': 
                return (
                    <div style={shapeStyle}>
                        <Hexagon {...iconProps} />
                    </div>
                );
            default: 
                return (
                    <div style={{
                        ...shapeStyle,
                        backgroundColor: element.backgroundColor || '#4A90E2',
                        border: `2px solid ${element.backgroundColor || '#4A90E2'}`
                    }} />
                );
        }
    };

    // Helper function for text styles
    const getTextStyle = (element) => ({
        fontSize: element.fontSize,
        fontFamily: element.fontFamily || 'Arial, sans-serif',
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
        color: element.color,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight || (element.type === 'article' ? '1.6' : '1.2'),
        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
        textShadow: element.textShadow || 'none',
        columnCount: element.columnCount > 1 ? element.columnCount : undefined,
        columnGap: element.columnCount > 1 ? `${element.columnGap}px` : undefined,
        textTransform: element.textTransform || 'none',
        wordSpacing: element.wordSpacing ? `${element.wordSpacing}px` : 'normal'
    });

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar gauche */}
            <div className="sidebar w-80 bg-white border-r border-gray-300 flex flex-col">
                {/* Header toolbar */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Éditeur Journal</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={undo}
                                disabled={historyIndex <= 0}
                                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                                title="Annuler"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex >= history.length - 1}
                                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                                title="Rétablir"
                            >
                                <RotateCw size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Outils */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-xs text-gray-500 mr-2">Outils:</div>
                        <button
                            onClick={() => setTool('select')}
                            className={`p-2 rounded transition-all duration-150 ${tool === 'select' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                            title="Outil de sélection - Cliquer, déplacer et éditer les éléments"
                        >
                            <MousePointer size={16} />
                        </button>
                        <button
                            onClick={() => setTool('hand')}
                            className={`p-2 rounded transition-all duration-150 ${tool === 'hand' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                            title="Outil main - Déplacer la vue (pas encore implémenté)"
                        >
                            <Hand size={16} />
                        </button>
                        <div className="text-xs text-gray-400 ml-2">
                            {tool === 'select' ? 'Sélection' : 'Main'}
                        </div>
                    </div>

                    {/* Zoom et options */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            <ZoomOut size={14} />
                        </button>
                        <span className="text-sm font-mono w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                        <button
                            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            <ZoomIn size={14} />
                        </button>
                        <button
                            onClick={() => setZoomLevel(1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                            title="Zoom 100%"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`p-1 rounded ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                            title="Grille"
                        >
                            <Grid size={14} />
                        </button>
                        <button
                            onClick={() => setShowRulers(!showRulers)}
                            className={`p-1 rounded ${showRulers ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                            title="Règles"
                        >
                            <Maximize size={14} />
                        </button>
                        <button
                            onClick={() => setSnapToGrid(!snapToGrid)}
                            className={`p-1 rounded ${snapToGrid ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
                            title="Aimantation"
                        >
                            <Zap size={14} />
                        </button>
                        <button
                            onClick={() => setShowLayersPanel(!showLayersPanel)}
                            className={`p-1 rounded ${showLayersPanel ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
                            title="Calques"
                        >
                            <Layers size={14} />
                        </button>
                    </div>
                </div>

                {/* Pages */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-600">Pages</h3>
                        <div className="flex gap-1">
                            <button
                                onClick={addPage}
                                className="p-1 bg-blue-50 hover:bg-blue-100 rounded"
                                title="Ajouter une page"
                            >
                                <Plus size={14} />
                            </button>
                            <button
                                onClick={duplicatePage}
                                className="p-1 bg-green-50 hover:bg-green-100 rounded"
                                title="Dupliquer la page"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {pages.map((page, index) => (
                            <div
                                key={page.id}
                                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer ${
                                    currentPage === index ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setCurrentPage(index)}
                            >
                                <FileText size={14} />
                                <span className="flex-1">{page.name}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        page.visible = !page.visible;
                                        setPages([...pages]);
                                    }}
                                    className={`p-1 rounded ${page.visible !== false ? 'text-gray-600' : 'text-gray-400'}`}
                                >
                                    {page.visible !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                                </button>
                                {pages.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (pages.length > 1) {
                                                setPages(pages.filter((_, idx) => idx !== index));
                                                if (currentPage >= index && currentPage > 0) {
                                                    setCurrentPage(currentPage - 1);
                                                } else if (currentPage === index && index === 0) {
                                                    setCurrentPage(0);
                                                }
                                            }
                                        }}
                                        className="p-1 hover:bg-red-100 rounded text-red-500"
                                        title="Supprimer la page"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newspaper Templates */}
                <div className="p-4 border-b">
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">Templates Journal</h3>
                    <div className="space-y-2">
                        {newspaperTemplates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => applyNewsletterTemplate(template)}
                                className="w-full flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm text-left"
                                title={template.description}
                            >
                                <template.icon size={16} className="text-blue-600" />
                                <div className="flex-1">
                                    <div className="font-medium text-xs">{template.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{template.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Element Templates */}
                <div className="p-4 border-b">
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">Éléments</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => addNewElement('article', template.id)}
                                className="flex items-center gap-2 p-2 bg-indigo-50 hover:bg-indigo-100 rounded text-sm"
                            >
                                <template.icon size={14} />
                                <span className="text-xs">{template.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Éléments */}
                <div className="p-4 border-b">
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">Ajouter</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                            onClick={() => addNewElement('title')}
                            className="flex items-center gap-2 p-2 bg-red-50 hover:bg-red-100 rounded text-sm"
                        >
                            <Type size={16} />
                            Titre
                        </button>
                        <button
                            onClick={() => addNewElement('subtitle')}
                            className="flex items-center gap-2 p-2 bg-orange-50 hover:bg-orange-100 rounded text-sm"
                        >
                            <Type size={14} />
                            S-titre
                        </button>
                        <button
                            onClick={() => addNewElement('article')}
                            className="flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded text-sm"
                        >
                            <Edit3 size={16} />
                            Article
                        </button>
                        <button
                            onClick={() => addNewElement('image')}
                            className="flex items-center gap-2 p-2 bg-purple-50 hover:bg-purple-100 rounded text-sm"
                        >
                            <Image size={16} />
                            Image
                        </button>
                    </div>

                    {/* Formes */}
                    <h4 className="text-xs font-semibold mb-2 text-gray-500">Formes</h4>
                    <div className="grid grid-cols-3 gap-1">
                        {shapes.map(shape => (
                            <button
                                key={shape.id}
                                onClick={() => addNewElement('shape', shape.id)}
                                className="flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs"
                                title={shape.name}
                            >
                                <shape.icon size={12} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions sur sélection */}
                {selectedElements.length > 0 && (
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-semibold mb-2 text-gray-600">
                            Actions {selectedElements.length > 1 ? `(${selectedElements.length})` : ''}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button
                                onClick={copyElement}
                                className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm"
                            >
                                <Copy size={14} />
                                Copier
                            </button>
                            <button
                                onClick={pasteElement}
                                disabled={!clipboardElement && clipboardElements.length === 0}
                                className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 rounded text-sm"
                            >
                                <FileText size={14} />
                                Coller
                            </button>
                            <button
                                onClick={bringToFront}
                                className="flex items-center gap-2 p-2 bg-yellow-50 hover:bg-yellow-100 rounded text-sm"
                            >
                                <ArrowUp size={14} />
                                Avant
                            </button>
                            <button
                                onClick={sendToBack}
                                className="flex items-center gap-2 p-2 bg-yellow-50 hover:bg-yellow-100 rounded text-sm"
                            >
                                <ArrowDown size={14} />
                                Arrière
                            </button>
                        </div>

                        {/* Alignement */}
                        {selectedElements.length > 1 && (
                            <>
                                <h4 className="text-xs font-semibold mb-2 text-gray-500">Alignement</h4>
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    <button onClick={() => alignElements('left')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Aligner à gauche">
                                        <AlignLeft size={12} />
                                    </button>
                                    <button onClick={() => alignElements('center-h')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Centrer horizontalement">
                                        <AlignCenter size={12} />
                                    </button>
                                    <button onClick={() => alignElements('right')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Aligner à droite">
                                        <AlignRight size={12} />
                                    </button>
                                    <button onClick={() => alignElements('top')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Aligner en haut">
                                        <ArrowUp size={12} />
                                    </button>
                                    <button onClick={() => alignElements('center-v')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Centrer verticalement">
                                        <Circle size={12} />
                                    </button>
                                    <button onClick={() => alignElements('bottom')} className="p-1 bg-gray-50 hover:bg-gray-100 rounded text-xs" title="Aligner en bas">
                                        <ArrowDown size={12} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Panneau des calques */}
                {showLayersPanel && (
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-600">Calques</h3>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="text-xs px-2 py-1 border rounded w-20"
                                />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="text-xs px-1 py-1 border rounded"
                                >
                                    <option value="all">Tous</option>
                                    <option value="title">Titres</option>
                                    <option value="article">Articles</option>
                                    <option value="image">Images</option>
                                    <option value="shape">Formes</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {filteredElements
                                .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                                .map((element) => (
                                    <div
                                        key={element.id}
                                        className={`flex items-center gap-2 p-1 rounded text-xs cursor-pointer ${
                                            selectedElements.includes(element.id) ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                                        }`}
                                        onClick={() => {
                                            setSelectedElement(element.id);
                                            setSelectedElements([element.id]);
                                        }}
                                    >
                                        <div className="w-4 h-3 border rounded" style={{ backgroundColor: element.backgroundColor || '#f3f4f6' }}></div>
                                        <span className="flex-1 truncate">{element.content?.substring(0, 15) || element.type}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleElementVisibility(element.id);
                                            }}
                                            className={`p-1 rounded ${element.visible !== false ? 'text-gray-600' : 'text-gray-400'}`}
                                        >
                                            {element.visible !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleElementLock(element.id);
                                            }}
                                            className={`p-1 rounded ${element.locked ? 'text-orange-600' : 'text-gray-400'}`}
                                        >
                                            {element.locked ? <Lock size={10} /> : <Unlock size={10} />}
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Actions finales */}
                <div className="p-4 border-t space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept=".json"
                            onChange={loadProject}
                            className="hidden"
                            id="load-project"
                        />
                        <label
                            htmlFor="load-project"
                            className="flex-1 flex items-center gap-2 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm cursor-pointer justify-center"
                        >
                            <Upload size={16} />
                            Charger
                        </label>
                        <button
                            onClick={saveProject}
                            className="flex-1 flex items-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm justify-center"
                        >
                            <Save size={16} />
                            Sauver
                        </button>
                    </div>
                    <button
                        onClick={exportToPDF}
                        className="w-full flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm justify-center"
                    >
                        <Download size={16} />
                        Exporter PDF
                    </button>
                </div>
            </div>

            {/* Zone principale */}
            <div className="flex-1 flex flex-col">
                {/* Barre de navigation */}
                <div className="bg-white border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="font-medium">
                            {currentPageData?.name || 'Page'} ({currentPage + 1}/{pages.length})
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                            disabled={currentPage === pages.length - 1}
                            className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'design' ? 'preview' : 'design')}
                            className={`flex items-center gap-2 p-2 rounded ${
                                viewMode === 'preview' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                            }`}
                        >
                            <Eye size={16} />
                            {viewMode === 'preview' ? 'Aperçu' : 'Design'}
                        </button>
                        <button
                            onClick={() => setShowProperties(!showProperties)}
                            className={`flex items-center gap-2 p-2 rounded ${
                                showProperties ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                            }`}
                        >
                            <Settings size={16} />
                        </button>
                    </div>
                </div>

                {/* Règles */}
                {showRulers && (
                    <>
                        <div className="h-6 bg-gray-200 border-b flex items-end text-xs text-gray-600">
                            {Array.from({length: Math.ceil(800/50)}, (_, i) => (
                                <div key={i} className="w-12 h-4 border-r border-gray-300 flex items-end justify-center">
                                    {i * 50}
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <div className="w-6 bg-gray-200 border-r flex flex-col justify-between text-xs text-gray-600">
                                {Array.from({length: Math.ceil(1000/50)}, (_, i) => (
                                    <div key={i} className="h-12 border-b border-gray-300 flex items-center justify-center transform -rotate-90">
                                        {i * 50}
                                    </div>
                                ))}
                            </div>
                            <WorkspaceCanvas />
                        </div>
                    </>
                )}

                {!showRulers && <WorkspaceCanvas />}
            </div>

            {/* Panneau de propriétés */}
            {showProperties && selectedElementData && (
                <div className="properties-panel w-80 bg-white border-l border-gray-300 p-4 overflow-y-auto" 
                     onMouseDown={(e) => e.stopPropagation()}
                     onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-sm font-semibold mb-3 text-gray-600">Propriétés</h3>
                    <div className="space-y-4">
                        {/* Position et taille */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Position & Taille</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="X"
                                    value={Math.round(selectedElementData.x)}
                                    onChange={(e) => updateElementStyle('x', parseInt(e.target.value) || 0)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Y"
                                    value={Math.round(selectedElementData.y)}
                                    onChange={(e) => updateElementStyle('y', parseInt(e.target.value) || 0)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="L"
                                    value={Math.round(selectedElementData.width)}
                                    onChange={(e) => updateElementStyle('width', parseInt(e.target.value) || 50)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="H"
                                    value={Math.round(selectedElementData.height)}
                                    onChange={(e) => updateElementStyle('height', parseInt(e.target.value) || 30)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Style de texte */}
                        {selectedElementData.type !== 'image' && selectedElementData.type !== 'shape' && (
                            <>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Police de caractère</label>
                                    <select
                                        value={selectedElementData.fontFamily || 'Arial, sans-serif'}
                                        onChange={(e) => updateElementStyle('fontFamily', e.target.value)}
                                        className="w-full p-1 border rounded text-sm"
                                    >
                                        {fontFamilies.map(font => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>
                                                {font.split(',')[0]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Taille du texte</label>
                                    <input
                                        type="range"
                                        min="8"
                                        max="72"
                                        value={selectedElementData.fontSize || 14}
                                        onChange={(e) => updateElementStyle('fontSize', parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{selectedElementData.fontSize}px</div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Espacement des lignes</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={selectedElementData.lineHeight || 1.2}
                                        onChange={(e) => updateElementStyle('lineHeight', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{selectedElementData.lineHeight || 1.2}</div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Espacement des lettres</label>
                                    <input
                                        type="range"
                                        min="-2"
                                        max="10"
                                        step="0.5"
                                        value={selectedElementData.letterSpacing || 0}
                                        onChange={(e) => updateElementStyle('letterSpacing', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{selectedElementData.letterSpacing || 0}px</div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Couleurs</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Texte</label>
                                            <input
                                                type="color"
                                                value={selectedElementData.color || '#000000'}
                                                onChange={(e) => updateElementStyle('color', e.target.value)}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Fond</label>
                                            <input
                                                type="color"
                                                value={selectedElementData.backgroundColor || '#ffffff'}
                                                onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-2">Style</label>
                                    <div className="grid grid-cols-3 gap-1">
                                        <button
                                            onClick={() => updateElementStyle('fontWeight', selectedElementData.fontWeight === 'bold' ? 'normal' : 'bold')}
                                            className={`p-2 rounded text-sm ${selectedElementData.fontWeight === 'bold' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <Bold size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateElementStyle('fontStyle', selectedElementData.fontStyle === 'italic' ? 'normal' : 'italic')}
                                            className={`p-2 rounded text-sm ${selectedElementData.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <Italic size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateElementStyle('textDecoration', selectedElementData.textDecoration === 'underline' ? 'none' : 'underline')}
                                            className={`p-2 rounded text-sm ${selectedElementData.textDecoration === 'underline' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <Underline size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-2">Alignement</label>
                                    <div className="grid grid-cols-3 gap-1">
                                        <button
                                            onClick={() => updateElementStyle('textAlign', 'left')}
                                            className={`p-2 rounded text-sm ${selectedElementData.textAlign === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <AlignLeft size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateElementStyle('textAlign', 'center')}
                                            className={`p-2 rounded text-sm ${selectedElementData.textAlign === 'center' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <AlignCenter size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateElementStyle('textAlign', 'right')}
                                            className={`p-2 rounded text-sm ${selectedElementData.textAlign === 'right' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                                        >
                                            <AlignRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Transformation du texte</label>
                                    <select
                                        value={selectedElementData.textTransform || 'none'}
                                        onChange={(e) => updateElementStyle('textTransform', e.target.value)}
                                        className="w-full p-1 border rounded text-sm"
                                    >
                                        <option value="none">Aucune</option>
                                        <option value="uppercase">MAJUSCULES</option>
                                        <option value="lowercase">minuscules</option>
                                        <option value="capitalize">Première Lettre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Ombre du texte</label>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Décalage horizontal</label>
                                            <input
                                                type="range"
                                                min="-10"
                                                max="10"
                                                value={selectedElementData.textShadowX || 0}
                                                onChange={(e) => updateTextShadow('x', parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-xs text-gray-400 text-center">{selectedElementData.textShadowX || 0}px</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Décalage vertical</label>
                                            <input
                                                type="range"
                                                min="-10"
                                                max="10"
                                                value={selectedElementData.textShadowY || 0}
                                                onChange={(e) => updateTextShadow('y', parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-xs text-gray-400 text-center">{selectedElementData.textShadowY || 0}px</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Flou</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="20"
                                                value={selectedElementData.textShadowBlur || 0}
                                                onChange={(e) => updateTextShadow('blur', parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-xs text-gray-400 text-center">{selectedElementData.textShadowBlur || 0}px</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Couleur de l'ombre</label>
                                            <input
                                                type="color"
                                                value={selectedElementData.textShadowColor || '#000000'}
                                                onChange={(e) => updateTextShadow('color', e.target.value)}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Espacement des mots</label>
                                    <input
                                        type="range"
                                        min="-5"
                                        max="20"
                                        step="0.5"
                                        value={selectedElementData.wordSpacing || 0}
                                        onChange={(e) => updateElementStyle('wordSpacing', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{selectedElementData.wordSpacing || 0}px</div>
                                </div>

                                {/* Colonnes pour les articles */}
                                {selectedElementData.type === 'article' && (
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Colonnes</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max="4"
                                                placeholder="Nombre"
                                                value={selectedElementData.columnCount || 1}
                                                onChange={(e) => updateElementStyle('columnCount', parseInt(e.target.value) || 1)}
                                                className="w-full p-1 border rounded text-sm"
                                            />
                                            <input
                                                type="number"
                                                min="10"
                                                placeholder="Espacement"
                                                value={selectedElementData.columnGap || 20}
                                                onChange={(e) => updateElementStyle('columnGap', parseInt(e.target.value) || 20)}
                                                className="w-full p-1 border rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Propriétés des images */}
                        {selectedElementData.type === 'image' && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Changer l'image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, selectedElementData.id)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                                <div className="mt-2 text-xs text-gray-400">
                                    Formats supportés: JPG, PNG, GIF, WebP
                                </div>
                            </div>
                        )}

                        {/* Propriétés des formes */}
                        {selectedElementData.type === 'shape' && (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Couleur de forme</label>
                                <input
                                    type="color"
                                    value={selectedElementData.backgroundColor || '#4A90E2'}
                                    onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                            </div>
                        )}

                        {/* Rotation et opacité */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Transformation</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={selectedElementData.rotation || 0}
                                        onChange={(e) => updateElementStyle('rotation', parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{selectedElementData.rotation || 0}°</div>
                                </div>
                                <div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={selectedElementData.opacity || 1}
                                        onChange={(e) => updateElementStyle('opacity', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 text-center">{Math.round((selectedElementData.opacity || 1) * 100)}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Bordures */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Bordures</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Épaisseur"
                                    value={selectedElementData.borderWidth || 0}
                                    onChange={(e) => updateElementStyle('borderWidth', parseInt(e.target.value) || 0)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                                <input
                                    type="color"
                                    value={selectedElementData.borderColor || '#000000'}
                                    onChange={(e) => updateElementStyle('borderColor', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                                <select
                                    value={selectedElementData.borderStyle || 'solid'}
                                    onChange={(e) => updateElementStyle('borderStyle', e.target.value)}
                                    className="w-full p-1 border rounded text-sm"
                                >
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                </select>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Rayon"
                                    value={selectedElementData.borderRadius || 0}
                                    onChange={(e) => updateElementStyle('borderRadius', parseInt(e.target.value) || 0)}
                                    className="w-full p-1 border rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Effets */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">Effets</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedElementData.shadow || false}
                                    onChange={(e) => updateElementStyle('shadow', e.target.checked)}
                                    className="rounded"
                                />
                                <label className="text-xs text-gray-500">Ombre portée</label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function WorkspaceCanvas() {
        return (
            <div className="flex-1 overflow-auto p-8 bg-gray-50">
                <div
                    ref={canvasRef}
                    className="relative bg-white shadow-xl mx-auto origin-top-left"
                    style={{
                        width: `${800 * zoomLevel}px`,
                        height: `${1000 * zoomLevel}px`,
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: '0 0',
                        backgroundColor: currentPageData?.backgroundColor || '#ffffff'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleCanvasMouseDown}
                >
                    {/* Grille */}
                    {showGrid && (
                        <div
                            className="absolute inset-0 pointer-events-none opacity-10"
                            style={{
                                backgroundImage: `linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)`,
                                backgroundSize: `${gridSize}px ${gridSize}px`
                            }}
                        />
                    )}

                    {/* Sélection multiple */}
                    {selectionBounds && (
                        <div
                            className="absolute border-2 border-blue-400 bg-blue-100 bg-opacity-20 pointer-events-none"
                            style={{
                                left: selectionBounds.x,
                                top: selectionBounds.y,
                                width: selectionBounds.width,
                                height: selectionBounds.height
                            }}
                        />
                    )}

                    {/* Guides d'alignement */}
                    {draggedElement && (
                        <>
                            <div className="absolute left-0 top-0 w-full h-px bg-blue-400 opacity-50 pointer-events-none"
                                 style={{ top: elements.find(el => el.id === draggedElement)?.y }} />
                            <div className="absolute left-0 top-0 w-px h-full bg-blue-400 opacity-50 pointer-events-none"
                                 style={{ left: elements.find(el => el.id === draggedElement)?.x }} />
                        </>
                    )}

                    {/* Éléments */}
                    {visibleElements
                        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                        .map((element) => (
                            <ElementComponent
                                key={element.id}
                                element={element}
                                isSelected={selectedElements.includes(element.id)}
                                isEditing={isEditing && selectedElement === element.id}
                                editingText={editingText}
                                onTextChange={handleTextChange}
                                onTextSubmit={handleTextSubmit}
                                onMouseDown={handleMouseDown}
                                onResizeStart={handleResizeStart}
                                onImageUpload={handleImageUpload}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                                onToggleLock={toggleElementLock}
                                onToggleVisibility={toggleElementVisibility}
                                viewMode={viewMode}
                                draggedElement={draggedElement}
                            />
                        ))}
                </div>
            </div>
        );
    }

    function ElementComponent({
                                  element,
                                  isSelected,
                                  isEditing,
                                  editingText,
                                  onTextChange,
                                  onTextSubmit,
                                  onMouseDown,
                                  onResizeStart,
                                  onImageUpload,
                                  onDelete,
                                  onDuplicate,
                                  onToggleLock,
                                  onToggleVisibility,
                                  viewMode,
                                  draggedElement
                              }) {
        return (
            <div
                className={`element absolute cursor-move select-none group transition-all duration-200 ease-in-out ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                } ${draggedElement === element.id ? 'opacity-70 scale-105' : ''} ${
                    element.locked ? 'cursor-not-allowed' : ''
                }`}
                style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    zIndex: element.zIndex || 0,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    opacity: element.opacity || 1,
                    backgroundColor: element.type !== 'image' ? element.backgroundColor : 'transparent',
                    border: element.borderWidth ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#000000'}` : 'none',
                    borderRadius: `${element.borderRadius || 0}px`,
                    boxShadow: element.shadow ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                    padding: element.type === 'header' ? '10px' : '8px'
                }}
                onClick={(e) => handleElementClick(element, e)}
                onMouseDown={(e) => onMouseDown(element, e)}
            >
                {element.type === 'image' ? (
                    <div className="relative h-full">
                        <img
                            src={element.content}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ borderRadius: `${element.borderRadius || 0}px` }}
                            draggable={false}
                        />
                        {isSelected && viewMode === 'design' && (
                            <div className="edit-controls absolute top-2 right-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onImageUpload(e, element.id)}
                                    className="hidden"
                                    id={`image-upload-${element.id}`}
                                />
                                <label
                                    htmlFor={`image-upload-${element.id}`}
                                    className="bg-blue-600 text-white p-1 rounded cursor-pointer hover:bg-blue-700"
                                >
                                    <Edit3 size={12} />
                                </label>
                            </div>
                        )}
                    </div>
                ) : element.type === 'shape' ? (
                    renderShapeContent(element)
                ) : isEditing ? (
                    <textarea
                        value={editingText}
                        onChange={(e) => onTextChange(e.target.value)}
                        onBlur={onTextSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) onTextSubmit();
                            if (e.key === 'Escape') onTextSubmit();
                        }}
                        className="w-full h-full resize-none border-none outline-none bg-transparent"
                        style={getTextStyle(element)}
                        autoFocus
                    />
                ) : (
                    <div
                        className={`w-full h-full ${
                            element.type === 'title' || element.type === 'header' ? 'font-bold' : ''
                        } ${element.type === 'article' ? 'leading-relaxed' : ''} 
                        ${element.type === 'article' && element.textAlign === 'justify' ? 'text-justify' : ''}`}
                        style={getTextStyle(element)}
                    >
                        {element.content}
                    </div>
                )}

                {/* Contrôles de sélection */}
                {isSelected && viewMode === 'design' && (
                    <>
                        {/* Poignées de redimensionnement */}
                        <div
                            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize transition-all duration-150 hover:bg-blue-600 hover:scale-110"
                            onMouseDown={(e) => onResizeStart(element, 'nw', e)}
                        />
                        <div
                            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize transition-all duration-150 hover:bg-blue-600 hover:scale-110"
                            onMouseDown={(e) => onResizeStart(element, 'ne', e)}
                        />
                        <div
                            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize transition-all duration-150 hover:bg-blue-600 hover:scale-110"
                            onMouseDown={(e) => onResizeStart(element, 'sw', e)}
                        />
                        <div
                            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize transition-all duration-150 hover:bg-blue-600 hover:scale-110"
                            onMouseDown={(e) => onResizeStart(element, 'se', e)}
                        />

                        {/* Menu contextuel */}
                        <div className="edit-controls absolute -top-8 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(element.id);
                                }}
                                className="bg-green-600 text-white p-1 rounded hover:bg-green-700 transition-all duration-150 hover:scale-110 shadow-sm hover:shadow-md"
                                title="Dupliquer"
                            >
                                <Copy size={10} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLock(element.id);
                                }}
                                className={`p-1 rounded text-white transition-all duration-150 hover:scale-110 shadow-sm hover:shadow-md ${element.locked ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                                title={element.locked ? "Déverrouiller" : "Verrouiller"}
                            >
                                {element.locked ? <Lock size={10} /> : <Unlock size={10} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleVisibility(element.id);
                                }}
                                className="bg-purple-600 text-white p-1 rounded hover:bg-purple-700 transition-all duration-150 hover:scale-110 shadow-sm hover:shadow-md"
                                title="Masquer/Afficher"
                            >
                                {element.visible !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                            </button>
                            {element.id !== 'header' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(element.id);
                                    }}
                                    className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-all duration-150 hover:scale-110 shadow-sm hover:shadow-md"
                                    title="Supprimer"
                                >
                                    <Trash2 size={10} />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
};

export default NewspaperEditor;
