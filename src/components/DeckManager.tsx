import React, { useRef, useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  FolderOpen,
  Layers,
  Sparkles,
  ArrowRightLeft,
  Upload,
  Download,
  Dices,
} from 'lucide-react';
import { CardItem, Deck } from '../types/card.ts';
import { TEMPLATE_DECKS } from '../data/templateDecks.ts';
import { DeckTemplateModal } from './DeckTemplateModal.tsx';

interface DeckManagerProps {
  deck: Deck;
  selectedCardId: string;
  onSelectCard: (cardId: string) => void;
  activeFace: 'front' | 'back';
  onChangeActiveFace: (face: 'front' | 'back') => void;
  onAddCard: () => void;
  onDuplicateCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardName: (cardId: string, name: string) => void;
  onToggleSharedBack: (shared: boolean) => void;
  onLoadTemplate: (templateId: string) => void;
  onExportJson: () => void;
  onImportJson: (deck: Deck) => void;
  onOpenTemplateCatalog?: () => void;
}

export const DeckManager: React.FC<DeckManagerProps> = ({
  deck,
  selectedCardId,
  onSelectCard,
  activeFace,
  onChangeActiveFace,
  onAddCard,
  onDuplicateCard,
  onDeleteCard,
  onUpdateCardName,
  onToggleSharedBack,
  onLoadTemplate,
  onExportJson,
  onImportJson,
  onOpenTemplateCatalog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalModalOpen, setInternalModalOpen] = useState<boolean>(false);

  const selectedCard = deck.cards.find((c) => c.id === selectedCardId) || deck.cards[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          onImportJson(parsed);
        } else {
          alert('Il file caricato non sembra un formato mazzo CartaCraft valido.');
        }
      } catch (err) {
        alert('Errore nella lettura del file JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-200 select-none">
      {/* Top Section: Face Switcher & Shared Back Toggle */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">Lato in Modifica</span>
          <span className="text-amber-400 font-mono text-[11px]">{deck.cards.length} carte nel mazzo</span>
        </div>

        {/* Fronte vs Retro Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeActiveFace('front')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeFace === 'front'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fronte Carta</span>
          </button>
          <button
            onClick={() => onChangeActiveFace('back')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeFace === 'back'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Retro Carta</span>
          </button>
        </div>

        {/* Shared Back toggle */}
        {activeFace === 'back' && (
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 p-2 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={deck.useSharedBack}
              onChange={(e) => onToggleSharedBack(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span className="leading-tight">
              <strong>Retro Unificato:</strong> stesso design per tutte le carte del mazzo (standard tipografico)
            </span>
          </label>
        )}
      </div>

      {/* Cards List Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800/60 text-xs">
        <span className="font-semibold text-slate-400">Elenco Carte</span>
        <button
          onClick={onAddCard}
          className="flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuova</span>
        </button>
      </div>

      {/* Cards Scrollable List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {deck.cards.map((card, idx) => {
          const isSelected = card.id === selectedCardId;
          const currentFace = activeFace === 'front' ? card.front : (deck.useSharedBack ? deck.sharedBack : card.back || deck.sharedBack);
          const bgCol = currentFace?.backgroundColor || '#1e293b';

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card.id)}
              className={`group flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Thumbnail mini preview */}
              <div
                className="w-8 h-11 rounded-sm border border-slate-700 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner text-[9px] font-mono font-bold"
                style={{ backgroundColor: bgCol }}
              >
                <span className="text-white/60 drop-shadow-xs">{idx + 1}</span>
              </div>

              {/* Name & Elements count */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={card.name}
                  onClick={() => onSelectCard(card.id)}
                  onFocus={() => onSelectCard(card.id)}
                  onChange={(e) => onUpdateCardName(card.id, e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-600 focus:border-amber-400 font-medium text-xs text-slate-200 focus:text-white focus:outline-none truncate"
                  placeholder="Nome carta..."
                />
                <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{card.front.elements.length} elem. fronte</span>
                  <span>•</span>
                  <span>{card.quantity}x</span>
                </div>
              </div>

              {/* Actions: Duplicate / Delete */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateCard(card.id);
                  }}
                  title="Duplica questa carta"
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {deck.cards.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCard(card.id);
                    }}
                    title="Elimina questa carta"
                    className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Deck Actions & Template Loader */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        {/* Catalogo Mazzi Ufficiali Button */}
        <button
          onClick={() => (onOpenTemplateCatalog ? onOpenTemplateCatalog() : setInternalModalOpen(true))}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-md shadow-amber-950/40 flex items-center justify-center gap-2 transition cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 transition group-hover:rotate-12" />
          <span>Catalogo Mazzi Ufficiali ({TEMPLATE_DECKS.length})</span>
        </button>

        <div className="text-[10px] text-slate-400 text-center font-medium">
          Monopoly · Cluedo · UNO · TCG · Casinò
        </div>

        {/* Quick Dropdown Fallback */}
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onLoadTemplate(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="" disabled>
            Cambio rapido mazzo...
          </option>
          {TEMPLATE_DECKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        {/* Import / Export JSON */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
          >
            <Upload className="w-3 h-3 text-slate-400" />
            <span>Importa</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={onExportJson}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Fallback Internal Modal */}
      {!onOpenTemplateCatalog && (
        <DeckTemplateModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
          onSelectDeck={onLoadTemplate}
          currentDeckId={deck.id}
        />
      )}
    </aside>
  );
};
