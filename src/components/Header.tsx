import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Rotate3d,
  Printer,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  Undo2,
  Redo2,
  Download,
  Ruler,
  Sliders,
} from 'lucide-react';
import { CardFormatId, CornerStyle } from '../types/card.ts';
import { CARD_FORMATS } from '../utils/cardUtils.ts';
import { CUSTOM_SIZE_PRESETS } from '../data/assetLibrary.ts';

interface HeaderProps {
  deckTitle: string;
  onUpdateDeckTitle: (title: string) => void;
  activeView: 'editor' | '3d' | 'export' | 'order';
  onChangeView: (view: 'editor' | '3d' | 'export' | 'order') => void;
  format: CardFormatId;
  onChangeFormat: (format: CardFormatId) => void;
  customWidthMm?: number;
  customHeightMm?: number;
  onUpdateCustomDimensions?: (widthMm: number, heightMm: number) => void;
  cornerStyle: CornerStyle;
  onChangeCornerStyle: (style: CornerStyle) => void;
  preflightIssueCount: number;
  onOpenPreflight: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onQuickExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deckTitle,
  onUpdateDeckTitle,
  activeView,
  onChangeView,
  format,
  onChangeFormat,
  customWidthMm = 63.5,
  customHeightMm = 88.9,
  onUpdateCustomDimensions,
  cornerStyle,
  onChangeCornerStyle,
  preflightIssueCount,
  onOpenPreflight,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onQuickExport,
}) => {
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white select-none px-4 py-2 flex items-center justify-between gap-3 sticky top-0 z-40">
      {/* Brand & Deck Title */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-700 px-2.5 py-1.5 rounded-lg shadow-md shadow-amber-950/40 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-100" />
          <span className="font-extrabold tracking-tight text-xs text-white hidden sm:inline">CartaCraft</span>
          <span className="text-[10px] bg-amber-950/40 px-1 py-0.5 rounded text-amber-200 font-mono hidden md:inline">PRO</span>
        </div>

        {/* Inline editable deck title */}
        <input
          type="text"
          value={deckTitle}
          onChange={(e) => onUpdateDeckTitle(e.target.value)}
          className="bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-xs font-semibold text-slate-100 px-2.5 py-1.5 rounded-md border border-slate-700 focus:border-amber-500 focus:outline-none transition w-36 sm:w-44 md:w-48 truncate"
          title="Modifica titolo del mazzo"
          placeholder="Nome Mazzo..."
        />

        {/* Compact Undo / Redo icon buttons */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Annulla ultima modifica (Ctrl+Z)"
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
          >
            <Undo2 className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Ripristina modifica (Ctrl+Y)"
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
          >
            <Redo2 className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <nav className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner shrink-0">
        <button
          onClick={() => onChangeView('editor')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeView === 'editor'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => onChangeView('3d')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeView === '3d'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anteprima 3D</span>
          <span className="sm:hidden">3D</span>
        </button>

        <button
          onClick={() => onChangeView('export')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeView === 'export'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Stampa & 300 DPI</span>
          <span className="sm:hidden">Stampa</span>
        </button>

        <button
          onClick={() => onChangeView('order')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer relative ${
            activeView === 'order'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span className="font-semibold">Ordina Mazzi</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </nav>

      {/* Quick Settings & Tools */}
      <div className="flex items-center gap-2.5">
        {/* Card Format Selector & Custom mm Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <select
            value={format}
            onChange={(e) => {
              const val = e.target.value as CardFormatId;
              onChangeFormat(val);
              if (val === 'custom') setShowCustomSizeModal(true);
            }}
            className="hidden sm:inline-block bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {Object.values(CARD_FORMATS).map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} {f.id !== 'custom' ? `(${f.widthMm}x${f.heightMm}mm)` : ''}
              </option>
            ))}
          </select>

          {/* Dedicated Misura Personalizzata button */}
          <button
            onClick={() => setShowCustomSizeModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Imposta misura carta personalizzata in millimetri"
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>{customWidthMm}×{customHeightMm} mm</span>
            {format === 'custom' && (
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-bold uppercase">Custom</span>
            )}
          </button>
        </div>

        {/* Corner Style Toggle (Tondi vs Squadrati) */}
        <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
          <button
            onClick={() => onChangeCornerStyle('rounded')}
            title="Angoli Tondi fustellati (3.5mm standard da gioco)"
            className={`px-2 py-1 rounded cursor-pointer transition ${
              cornerStyle === 'rounded'
                ? 'bg-slate-700 text-amber-300 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tondi
          </button>
          <button
            onClick={() => onChangeCornerStyle('square')}
            title="Angoli a Squadro (90° rifilo netto)"
            className={`px-2 py-1 rounded cursor-pointer transition ${
              cornerStyle === 'square'
                ? 'bg-slate-700 text-amber-300 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Squadrati
          </button>
        </div>

        {/* Preflight Check Status Badge */}
        <button
          onClick={onOpenPreflight}
          title="Verifica Prestampa: Bleed, margini di sicurezza e risoluzione"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition ${
            preflightIssueCount > 0
              ? 'bg-amber-950/60 text-amber-300 border-amber-600/50 hover:bg-amber-900/60'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
          }`}
        >
          {preflightIssueCount > 0 ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{preflightIssueCount} Avvisi Stampa</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Prestampa OK</span>
            </>
          )}
        </button>

        {/* Quick Export Button */}
        <button
          onClick={onQuickExport}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Esporta</span>
        </button>
      </div>

      {/* Custom Dimensions Modal */}
      {showCustomSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Configura Misura Carta Personalizzata</h3>
              </div>
              <button
                onClick={() => setShowCustomSizeModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Imposta larghezza e altezza precise in millimetri. Il sistema ricalcolerà istantaneamente il canvas ad alta risoluzione 300 DPI, l'abbondaggio 3mm e la griglia per la stampa fronte/retro.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Larghezza (mm)</label>
                <input
                  type="number"
                  min="15"
                  max="350"
                  step="0.5"
                  value={customWidthMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 63.5;
                    onChangeFormat('custom');
                    if (onUpdateCustomDimensions) onUpdateCustomDimensions(val, customHeightMm);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Altezza (mm)</label>
                <input
                  type="number"
                  min="15"
                  max="350"
                  step="0.5"
                  value={customHeightMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 88.9;
                    onChangeFormat('custom');
                    if (onUpdateCustomDimensions) onUpdateCustomDimensions(customWidthMm, val);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>

            {/* Live 300 DPI calculation */}
            <div className="flex items-center justify-between px-3 py-2 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs">
              <span className="text-slate-300">Risoluzione di stampa ad alta precisione:</span>
              <span className="font-mono text-amber-300 font-bold">
                {Math.round((customWidthMm / 25.4) * 300)} × {Math.round((customHeightMm / 25.4) * 300)} px @ 300 DPI
              </span>
            </div>

            {/* Presets Table */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Formati & Fustelle Pronte:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CUSTOM_SIZE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onChangeFormat('custom');
                      if (onUpdateCustomDimensions) onUpdateCustomDimensions(preset.widthMm, preset.heightMm);
                      setShowCustomSizeModal(false);
                    }}
                    className="p-2 bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500 border border-slate-700 rounded-lg text-left cursor-pointer transition text-xs"
                  >
                    <span className="font-semibold text-white block truncate">{preset.name}</span>
                    <span className="text-[11px] text-amber-400 font-mono">{preset.widthMm} x {preset.heightMm} mm</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCustomSizeModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md"
              >
                Applica e Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
