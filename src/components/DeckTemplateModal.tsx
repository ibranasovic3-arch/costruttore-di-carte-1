import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Check,
  Dices,
  Swords,
  Crown,
  Moon,
  Info,
} from 'lucide-react';
import { TEMPLATE_DECKS } from '../data/templateDecks.ts';
import { Deck } from '../types/card.ts';

interface DeckTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDeck: (deckId: string) => void;
  currentDeckId?: string;
}

type CategoryFilter = 'all' | 'boardgames' | 'tcg' | 'casino' | 'art';

const CATEGORIES: { id: CategoryFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'Tutti i Mazzi (7)', icon: Layers },
  { id: 'boardgames', label: '🎲 Giochi da Tavolo Famosi', icon: Dices },
  { id: 'tcg', label: '⚔️ TCG & Carte Fantasy', icon: Swords },
  { id: 'casino', label: '♠️ Poker & Casinò Classico', icon: Crown },
  { id: 'art', label: '🔮 Tarocchi & Dixit Onirico', icon: Moon },
];

export const DeckTemplateModal: React.FC<DeckTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectDeck,
  currentDeckId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [previewDeckId, setPreviewDeckId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDecks = TEMPLATE_DECKS.filter((d) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'boardgames') {
      return ['deck-monopoly', 'deck-cluedo', 'deck-uno'].includes(d.id);
    }
    if (selectedCategory === 'tcg') {
      return d.id === 'deck-fantasy-tcg';
    }
    if (selectedCategory === 'casino') {
      return d.id === 'deck-classic-poker';
    }
    if (selectedCategory === 'art') {
      return ['deck-tarot', 'deck-dixit'].includes(d.id);
    }
    return true;
  });

  const getDeckCategoryBadge = (deckId: string) => {
    switch (deckId) {
      case 'deck-monopoly':
        return { label: 'Monopoly Ufficiale', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'deck-cluedo':
        return { label: 'Cluedo Tudor', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'deck-uno':
        return { label: 'UNO Competizione', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'deck-fantasy-tcg':
        return { label: 'TCG Fantasy', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'deck-classic-poker':
        return { label: 'Casinò Classico', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'deck-tarot':
        return { label: 'Tarocchi 70x120', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'deck-dixit':
        return { label: 'Dixit Onirico', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
      default:
        return { label: 'Mazzo Pro', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const getDeckDescription = (deckId: string) => {
    switch (deckId) {
      case 'deck-monopoly':
        return 'Include Contratti di Proprietà (Parco della Vittoria, Viale dei Giardini, Stazione Nord), carte Imprevisti (In Prigione!) e carte Probabilità (Errore Bancario). Grafica autentica, tabelle affitti complete, 100% modificabile.';
      case 'deck-cluedo':
        return 'Tutti i Sospettati (Miss Scarlett, Colonnello Mustard), le Armi del Delitto (Candeliere, Pugnale) e i Luoghi (Salone, Tenuta Tudor). Design noir vittoriano con cornici dorate e retro unificato ad alta risoluzione.';
      case 'deck-uno':
        return 'Carte numerate e carte speciali iconiche: Salta Turno, Inverti Giro, Pesca Due e il micidiale Jolly Pesca Quattro (+4 Wild). Tipografia audace con ovali inclinati e leggendario retro nero/rosso.';
      case 'deck-fantasy-tcg':
        return 'Mazzo competitivo stile Magic / Pokémon con Draghi, Maghi delle Maree, gemme Mana, valori di Attacco/Difesa e cornici runiche per tornei.';
      case 'deck-classic-poker':
        return 'Mazzo da poker professionale in stile Casinò di Las Vegas: Assi, figure e semi cuori/quadri/picche/fiori con finitura lino per giochi tradizionali.';
      case 'deck-tarot':
        return 'Formato Tarocchi grande (70x120 mm) con Arcano I Il Mago, numeri romani, stelle mistiche e pergamene per divinazione e giochi da tavolo narrativi.';
      case 'deck-dixit':
        return 'Formato grande 70x120 mm ispirato a Dixit: carte con composizioni oniriche, cieli stellati, lune crescenti e citazioni poetiche suggestive.';
      default:
        return 'Template mazzo completo con carte fronte/retro preimpostate.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Catalogo Mazzi Ufficiali & Giochi Famosi</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  100% Modificabili
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Seleziona un mazzo originale predefinito per caricare subito tutte le carte pronte per modifica, stampa o personalizzazione grafica.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Decks Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => {
            const isCurrent = currentDeckId === deck.id;
            const badge = getDeckCategoryBadge(deck.id);
            const firstCard = deck.cards[0];
            const backFace = deck.sharedBack;

            return (
              <div
                key={deck.id}
                className={`group flex flex-col justify-between rounded-xl border bg-slate-950/60 hover:bg-slate-850 p-4 transition duration-200 ${
                  isCurrent
                    ? 'border-amber-500 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {deck.cards.length} carte
                    </span>
                  </div>

                  {/* Visual Preview Pair: Front Card + Back Card */}
                  <div className="flex items-center justify-center gap-3 py-3 px-2 bg-slate-900/80 rounded-xl border border-slate-800/80 mb-3 relative overflow-hidden">
                    {/* Front preview mini */}
                    <div
                      className="w-20 h-28 rounded-md border border-slate-700 shadow-md p-1.5 flex flex-col justify-between relative overflow-hidden transition transform group-hover:-translate-y-1"
                      style={{
                        backgroundColor: firstCard?.front?.backgroundColor || '#1e293b',
                      }}
                    >
                      <div className="text-[8px] font-bold text-white/90 truncate leading-tight">
                        {firstCard?.name}
                      </div>
                      <div className="text-[7px] text-slate-300/80 italic text-center">
                        Fronte
                      </div>
                      <div className="flex justify-between items-center text-[7px] text-white/70">
                        <span>★</span>
                        <span className="font-mono">1/{deck.cards.length}</span>
                      </div>
                    </div>

                    {/* Back preview mini */}
                    <div
                      className="w-20 h-28 rounded-md border border-slate-700 shadow-md p-1.5 flex flex-col justify-between items-center relative overflow-hidden transition transform group-hover:translate-y-1"
                      style={{
                        backgroundColor: backFace?.backgroundColor || '#991b1b',
                      }}
                    >
                      <div className="text-[7px] text-amber-200/90 font-bold uppercase tracking-wider text-center pt-1">
                        Retro
                      </div>
                      <div className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center text-[9px] font-bold text-amber-300">
                        {deck.id === 'deck-monopoly'
                          ? 'M'
                          : deck.id === 'deck-uno'
                          ? 'UNO'
                          : deck.id === 'deck-cluedo'
                          ? '?'
                          : '✦'}
                      </div>
                      <div className="text-[6.5px] text-white/60 text-center pb-0.5">
                        Unificato
                      </div>
                    </div>
                  </div>

                  {/* Title & Format Info */}
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition mb-1 leading-snug">
                    {deck.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2 font-mono">
                    <span>
                      Formato:{' '}
                      <strong className="text-slate-300 uppercase">{deck.format}</strong>
                    </span>
                    <span>•</span>
                    <span>Angoli {deck.cornerMm}mm</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-3">
                    {getDeckDescription(deck.id)}
                  </p>

                  {/* Included Cards Tags Preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {deck.cards.slice(0, 4).map((c) => (
                      <span
                        key={c.id}
                        className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {c.name.split('(')[0].trim()}
                      </span>
                    ))}
                    {deck.cards.length > 4 && (
                      <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded font-mono">
                        +{deck.cards.length - 4} altre
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => {
                    onSelectDeck(deck.id);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                    isCurrent
                      ? 'bg-amber-600 text-white hover:bg-amber-500'
                      : 'bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-200 border border-slate-700 hover:border-amber-500'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Mazzo Attualmente Caricato</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Carica Mazzo & Modifica</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tutte le carte caricate possono essere <strong>modificate al 100%</strong>: testi, affitti, colori, icone, cornici, dimensioni e posizioni.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
