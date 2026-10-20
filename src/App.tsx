import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { DeckManager } from './components/DeckManager.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { CanvasEditor } from './components/CanvasEditor.tsx';
import { Inspector } from './components/Inspector.tsx';
import { Card3DViewer } from './components/Card3DViewer.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { PhysicalOrderModal } from './components/PhysicalOrderModal.tsx';
import { PreflightCheckModal } from './components/PreflightCheckModal.tsx';
import { DeckTemplateModal } from './components/DeckTemplateModal.tsx';
import { TEMPLATE_DECKS } from './data/templateDecks.ts';
import {
  CardElement,
  CardFace,
  CardFormatId,
  CardItem,
  CornerStyle,
  Deck,
} from './types/card.ts';
import { runPreflightCheck } from './utils/cardUtils.ts';

export default function App() {
  // Deck state
  const [deck, setDeck] = useState<Deck>(() => {
    const saved = localStorage.getItem('cartacraft_deck_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return TEMPLATE_DECKS[0];
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Deck[]>([TEMPLATE_DECKS[0]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active view: 'editor' | '3d' | 'export' | 'order'
  const [activeView, setActiveView] = useState<'editor' | '3d' | 'export' | 'order'>('editor');

  // Navigation & Selection state
  const [selectedCardId, setSelectedCardId] = useState<string>(
    () => deck.cards[0]?.id || 'card_dragon'
  );
  const [activeFace, setActiveFace] = useState<'front' | 'back'>('front');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Modal open states
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  // Mobile drawer states
  const [isMobileDeckOpen, setIsMobileDeckOpen] = useState<boolean>(false);
  const [isMobileInspectorOpen, setIsMobileInspectorOpen] = useState<boolean>(false);

  // Push new deck state into history
  const updateDeckWithHistory = useCallback((newDeck: Deck) => {
    setDeck(newDeck);
    try {
      localStorage.setItem('cartacraft_deck_v1', JSON.stringify(newDeck));
    } catch (e) {
      // safe fallback
    }

    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, newDeck];
    });
    setHistoryIndex((idx) => idx + 1);
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      const prevDeck = history[newIdx];
      setDeck(prevDeck);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      const nextDeck = history[newIdx];
      setDeck(nextDeck);
    }
  }, [history, historyIndex]);

  // Current active card
  const currentCard = useMemo(() => {
    return deck.cards.find((c) => c.id === selectedCardId) || deck.cards[0];
  }, [deck.cards, selectedCardId]);

  // Current active face object
  const currentFace = useMemo<CardFace>(() => {
    if (!currentCard) return deck.sharedBack;
    if (activeFace === 'front') {
      return currentCard.front;
    } else {
      return deck.useSharedBack ? deck.sharedBack : currentCard.back || deck.sharedBack;
    }
  }, [currentCard, activeFace, deck.useSharedBack, deck.sharedBack]);

  // Selected element object
  const selectedElement = useMemo<CardElement | null>(() => {
    if (!selectedElementId || !currentFace) return null;
    return currentFace.elements.find((el) => el.id === selectedElementId) || null;
  }, [selectedElementId, currentFace]);

  // Preflight check calculation
  const preflightIssues = useMemo(() => runPreflightCheck(deck), [deck]);

  // Handlers for Deck operations
  const handleUpdateDeckTitle = (title: string) => {
    updateDeckWithHistory({ ...deck, title, updatedAt: Date.now() });
  };

  const handleChangeFormat = (format: CardFormatId) => {
    updateDeckWithHistory({ ...deck, format, updatedAt: Date.now() });
  };

  const handleChangeCornerStyle = (cornerStyle: CornerStyle) => {
    updateDeckWithHistory({ ...deck, cornerStyle, updatedAt: Date.now() });
  };

  const handleToggleSharedBack = (useSharedBack: boolean) => {
    updateDeckWithHistory({ ...deck, useSharedBack, updatedAt: Date.now() });
  };

  const handleAddCard = () => {
    const newId = `card_${Date.now()}`;
    const newCard: CardItem = {
      id: newId,
      name: `Nuova Carta #${deck.cards.length + 1}`,
      quantity: 1,
      front: {
        backgroundColor: '#18181b',
        backgroundPattern: 'linen',
        elements: [
          {
            id: `el_border_${Date.now()}`,
            type: 'shape',
            name: 'Cornice',
            shapeType: 'rectangle',
            x: 6,
            y: 4,
            width: 88,
            height: 92,
            rotation: 0,
            opacity: 1,
            zIndex: 1,
            fillColor: 'transparent',
            borderColor: '#f59e0b',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            id: `el_title_${Date.now()}`,
            type: 'text',
            name: 'Titolo',
            x: 10,
            y: 8,
            width: 80,
            height: 8,
            rotation: 0,
            opacity: 1,
            zIndex: 2,
            text: 'TITOLO CARTA',
            fontFamily: 'Cinzel',
            fontSize: 14,
            fontWeight: '900',
            textAlign: 'center',
            color: '#fef08a',
          },
        ],
      },
      back: {
        backgroundColor: '#0f172a',
        elements: [],
      },
    };

    updateDeckWithHistory({
      ...deck,
      cards: [...deck.cards, newCard],
      updatedAt: Date.now(),
    });
    setSelectedCardId(newId);
  };

  const handleDuplicateCard = (cardId: string) => {
    const target = deck.cards.find((c) => c.id === cardId);
    if (!target) return;
    const duplicated: CardItem = {
      ...JSON.parse(JSON.stringify(target)),
      id: `card_${Date.now()}`,
      name: `${target.name} (Copia)`,
    };
    updateDeckWithHistory({
      ...deck,
      cards: [...deck.cards, duplicated],
      updatedAt: Date.now(),
    });
    setSelectedCardId(duplicated.id);
  };

  const handleDeleteCard = (cardId: string) => {
    if (deck.cards.length <= 1) return;
    const filtered = deck.cards.filter((c) => c.id !== cardId);
    updateDeckWithHistory({ ...deck, cards: filtered, updatedAt: Date.now() });
    if (selectedCardId === cardId) {
      setSelectedCardId(filtered[0].id);
    }
  };

  const handleUpdateCardName = (cardId: string, name: string) => {
    const updatedCards = deck.cards.map((c) => (c.id === cardId ? { ...c, name } : c));
    updateDeckWithHistory({ ...deck, cards: updatedCards, updatedAt: Date.now() });
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = TEMPLATE_DECKS.find((t) => t.id === templateId);
    if (template) {
      const cloned = JSON.parse(JSON.stringify(template));
      updateDeckWithHistory(cloned);
      setSelectedCardId(cloned.cards[0]?.id || '');
      setSelectedElementId(null);
    }
  };

  // Handlers for Active Face & Elements
  const handleUpdateFace = (updates: Partial<CardFace>) => {
    if (activeFace === 'front') {
      const updatedCards = deck.cards.map((c) =>
        c.id === selectedCardId ? { ...c, front: { ...c.front, ...updates } } : c
      );
      updateDeckWithHistory({ ...deck, cards: updatedCards, updatedAt: Date.now() });
    } else {
      if (deck.useSharedBack) {
        updateDeckWithHistory({
          ...deck,
          sharedBack: { ...deck.sharedBack, ...updates },
          updatedAt: Date.now(),
        });
      } else {
        const updatedCards = deck.cards.map((c) =>
          c.id === selectedCardId
            ? { ...c, back: { ...(c.back || deck.sharedBack), ...updates } }
            : c
        );
        updateDeckWithHistory({ ...deck, cards: updatedCards, updatedAt: Date.now() });
      }
    }
  };

  const handleAddElement = (newElData: Partial<CardElement>) => {
    const newEl: CardElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: newElData.type || 'text',
      name: newElData.name || 'Nuovo Elemento',
      x: newElData.x ?? 25,
      y: newElData.y ?? 25,
      width: newElData.width ?? 50,
      height: newElData.height ?? 20,
      rotation: newElData.rotation ?? 0,
      opacity: newElData.opacity ?? 1,
      zIndex: (currentFace.elements?.length || 0) + 1,
      ...newElData,
    };

    handleUpdateFace({
      elements: [...currentFace.elements, newEl],
    });
    setSelectedElementId(newEl.id);
  };

  const handleUpdateElement = (id: string, updates: Partial<CardElement>) => {
    const updatedElements = currentFace.elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    handleUpdateFace({ elements: updatedElements });
  };

  const handleDeleteElement = (id: string) => {
    const filteredElements = currentFace.elements.filter((el) => el.id !== id);
    handleUpdateFace({ elements: filteredElements });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const el = currentFace.elements.find((item) => item.id === id);
    if (el) {
      handleAddElement({
        ...el,
        name: `${el.name} (Copia)`,
        x: Math.min(85, el.x + 3),
        y: Math.min(85, el.y + 3),
      });
    }
  };

  // Global keyboard shortcuts for Undo, Redo, and Delete Element
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      // Redo: Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Delete selected element
      if (selectedElementId && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        handleDeleteElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedElementId, currentFace]);

  // Export / Import JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${deck.title.replace(/\s+/g, '_')}_mazzo.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (importedDeck: Deck) => {
    updateDeckWithHistory(importedDeck);
    if (importedDeck.cards.length > 0) {
      setSelectedCardId(importedDeck.cards[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Global Application Header */}
      <Header
        deckTitle={deck.title}
        onUpdateDeckTitle={handleUpdateDeckTitle}
        activeView={activeView}
        onChangeView={(view) => {
          if (view === 'order') {
            setIsOrderModalOpen(true);
          } else if (view === 'export') {
            setIsExportModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        format={deck.format}
        onChangeFormat={handleChangeFormat}
        customWidthMm={deck.customWidthMm || 63.5}
        customHeightMm={deck.customHeightMm || 88.9}
        onUpdateCustomDimensions={(widthMm, heightMm) => {
          updateDeckWithHistory({
            ...deck,
            format: 'custom',
            customWidthMm: widthMm,
            customHeightMm: heightMm,
            updatedAt: Date.now(),
          });
        }}
        cornerStyle={deck.cornerStyle}
        onChangeCornerStyle={handleChangeCornerStyle}
        preflightIssueCount={preflightIssues.length}
        onOpenPreflight={() => setIsPreflightModalOpen(true)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onQuickExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop for Deck Manager */}
        {isMobileDeckOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsMobileDeckOpen(false)}
          />
        )}

        {/* Left Sidebar: Deck & Card List */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:transform-none ${
            isMobileDeckOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <DeckManager
            deck={deck}
            selectedCardId={selectedCardId}
            onSelectCard={(id) => {
              setSelectedCardId(id);
              setSelectedElementId(null);
              setIsMobileDeckOpen(false);
            }}
            activeFace={activeFace}
            onChangeActiveFace={setActiveFace}
            onAddCard={handleAddCard}
            onDuplicateCard={handleDuplicateCard}
            onDeleteCard={handleDeleteCard}
            onUpdateCardName={handleUpdateCardName}
            onToggleSharedBack={handleToggleSharedBack}
            onLoadTemplate={handleLoadTemplate}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onOpenTemplateCatalog={() => setIsTemplateModalOpen(true)}
          />
        </div>

        {/* Center Canvas or 3D Preview */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'editor' && (
            <>
              {/* Graphic Element Insertion Toolbar */}
              <Toolbar
                onAddElement={handleAddElement}
                activeFace={currentFace}
                onUpdateFaceBackground={handleUpdateFace}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
                selectedElementId={selectedElementId}
                onDeleteElement={handleDeleteElement}
              />

              {/* Mobile Drawer Trigger Bar */}
              <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
                <button
                  onClick={() => setIsMobileDeckOpen(true)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 font-medium cursor-pointer"
                >
                  📋 Carte ({deck.cards.length})
                </button>
                <button
                  onClick={() => setIsMobileInspectorOpen(true)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 font-medium cursor-pointer"
                >
                  ⚙️ Proprietà
                </button>
              </div>

              {/* Interactive Canvas Workspace */}
              <CanvasEditor
                face={currentFace}
                format={deck.format}
                customWidthMm={deck.customWidthMm}
                customHeightMm={deck.customHeightMm}
                cornerStyle={deck.cornerStyle}
                cornerMm={deck.cornerMm}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onDuplicateElement={handleDuplicateElement}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </>
          )}

          {activeView === '3d' && (
            <Card3DViewer
              cardName={currentCard?.name || deck.title}
              front={currentCard?.front || currentFace}
              back={deck.useSharedBack ? deck.sharedBack : currentCard?.back || deck.sharedBack}
              format={deck.format}
              customWidthMm={deck.customWidthMm}
              customHeightMm={deck.customHeightMm}
              cornerStyle={deck.cornerStyle}
              cornerMm={deck.cornerMm}
            />
          )}
        </main>

        {/* Mobile backdrop for Inspector */}
        {isMobileInspectorOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setIsMobileInspectorOpen(false)}
          />
        )}

        {/* Right Sidebar: Inspector */}
        {activeView === 'editor' && (
          <div
            className={`fixed inset-y-0 right-0 z-40 transform transition-transform duration-200 lg:static lg:transform-none ${
              isMobileInspectorOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            }`}
          >
            <Inspector
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
              activeFace={currentFace}
              onUpdateFace={handleUpdateFace}
              format={deck.format}
              customWidthMm={deck.customWidthMm}
              customHeightMm={deck.customHeightMm}
              onUpdateCustomDimensions={(w, h) => {
                updateDeckWithHistory({
                  ...deck,
                  format: 'custom',
                  customWidthMm: w,
                  customHeightMm: h,
                  updatedAt: Date.now(),
                });
              }}
              cornerStyle={deck.cornerStyle}
              onChangeCornerStyle={handleChangeCornerStyle}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        deck={deck}
        selectedCardId={selectedCardId}
      />

      <PhysicalOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        deck={deck}
        onUpdateDeckCornerStyle={handleChangeCornerStyle}
      />

      <PreflightCheckModal
        isOpen={isPreflightModalOpen}
        onClose={() => setIsPreflightModalOpen(false)}
        deck={deck}
        onSelectCard={(id) => {
          setSelectedCardId(id);
          setActiveView('editor');
        }}
        onChangeActiveFace={setActiveFace}
      />

      <DeckTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectDeck={handleLoadTemplate}
        currentDeckId={deck.id}
      />
    </div>
  );
}
