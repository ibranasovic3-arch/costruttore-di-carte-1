import React, { useState } from 'react';
import {
  Trash2,
  Copy,
  Undo2,
  Redo2,
  ArrowUp,
  ArrowDown,
  Type,
  Maximize,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Palette,
  Ruler,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CardElement, CardFace, CardFormatId, CornerStyle } from '../types/card.ts';
import {
  FONT_OPTIONS,
  GAME_ICONS,
  PATTERN_OPTIONS,
  COLOR_PALETTES,
  GRADIENT_PRESETS,
} from '../data/assetLibrary.ts';

interface InspectorProps {
  selectedElement: CardElement | null;
  onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  activeFace: CardFace;
  onUpdateFace: (updates: Partial<CardFace>) => void;
  format?: CardFormatId;
  customWidthMm?: number;
  customHeightMm?: number;
  onUpdateCustomDimensions?: (w: number, h: number) => void;
  cornerStyle?: CornerStyle;
  onChangeCornerStyle?: (style: CornerStyle) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  activeFace,
  onUpdateFace,
  format,
  customWidthMm = 63.5,
  customHeightMm = 88.9,
  onUpdateCustomDimensions,
  cornerStyle = 'rounded',
  onChangeCornerStyle,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('casino');
  const activePalette = COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  // If no element is selected, show Card Background & Dimensions Inspector
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 text-slate-200 overflow-y-auto select-none space-y-5">
        {/* Undo/Redo & Section Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              <span>Sfondo & Dimensioni</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Personalizza aspetto e fustella della carta</p>
          </div>

          <div className="flex items-center gap-1">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Annulla ultima modifica (Ctrl+Z)"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Ripristina modifica (Ctrl+Y)"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. SOLID COLOR & THEMATIC PALETTES */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-200 block">Colore di Fondo & Palette TCG</label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={activeFace.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdateFace({ backgroundColor: e.target.value })}
              className="w-9 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={activeFace.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdateFace({ backgroundColor: e.target.value })}
              className="bg-slate-800 text-xs text-slate-200 px-2 py-1.5 rounded border border-slate-700 flex-1 font-mono uppercase"
            />
          </div>

          {/* Palette selector & Swatches */}
          <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Palette Tipografica:</span>
              <select
                value={selectedPaletteId}
                onChange={(e) => setSelectedPaletteId(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] focus:outline-none cursor-pointer"
              >
                {COLOR_PALETTES.map((pal) => (
                  <option key={pal.id} value={pal.id}>
                    {pal.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-8 gap-1 pt-1">
              {activePalette.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => onUpdateFace({ backgroundColor: c })}
                  style={{ backgroundColor: c }}
                  className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                  title={`Imposta ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. GRADIENT SFUMATURE */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!activeFace.backgroundGradient?.enabled}
                onChange={(e) =>
                  onUpdateFace({
                    backgroundGradient: {
                      enabled: e.target.checked,
                      type: activeFace.backgroundGradient?.type || 'linear',
                      colors: activeFace.backgroundGradient?.colors || ['#1e293b', '#0f172a'],
                      angle: activeFace.backgroundGradient?.angle || 180,
                    },
                  })
                }
                className="accent-amber-500 rounded cursor-pointer"
              />
              <span>Sfumatura & Gradiente</span>
            </div>
            {activeFace.backgroundGradient?.enabled && (
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Attivo</span>
            )}
          </label>

          {activeFace.backgroundGradient?.enabled && (
            <div className="space-y-3 pt-1 border-t border-slate-800 text-xs">
              {/* Type: Linear vs Radial */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Tipo Sfumatura:</span>
                <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    onClick={() =>
                      onUpdateFace({
                        backgroundGradient: { ...activeFace.backgroundGradient!, type: 'linear' },
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                      activeFace.backgroundGradient.type === 'linear'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lineare
                  </button>
                  <button
                    onClick={() =>
                      onUpdateFace({
                        backgroundGradient: { ...activeFace.backgroundGradient!, type: 'radial' },
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                      activeFace.backgroundGradient.type === 'radial'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Radiale
                  </button>
                </div>
              </div>

              {/* Color stops */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Colore 1</span>
                  <input
                    type="color"
                    value={activeFace.backgroundGradient.colors[0] || '#1e293b'}
                    onChange={(e) => {
                      const colors = [...activeFace.backgroundGradient!.colors];
                      colors[0] = e.target.value;
                      onUpdateFace({
                        backgroundGradient: { ...activeFace.backgroundGradient!, colors },
                      });
                    }}
                    className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Colore 2</span>
                  <input
                    type="color"
                    value={activeFace.backgroundGradient.colors[1] || '#0f172a'}
                    onChange={(e) => {
                      const colors = [...activeFace.backgroundGradient!.colors];
                      colors[1] = e.target.value;
                      onUpdateFace({
                        backgroundGradient: { ...activeFace.backgroundGradient!, colors },
                      });
                    }}
                    className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              {/* Angle slider (for linear) */}
              {activeFace.backgroundGradient.type === 'linear' && (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Angolo Sfumatura</span>
                    <span className="font-mono text-amber-400">{activeFace.backgroundGradient.angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeFace.backgroundGradient.angle || 180}
                    onChange={(e) =>
                      onUpdateFace({
                        backgroundGradient: {
                          ...activeFace.backgroundGradient!,
                          angle: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Quick Gradient Presets */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Preset Sfumature Pronte:</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const preset = GRADIENT_PRESETS.find((g) => g.id === e.target.value);
                    if (preset) {
                      onUpdateFace({
                        backgroundGradient: {
                          enabled: true,
                          type: preset.type,
                          colors: preset.colors,
                          angle: preset.angle,
                        },
                      });
                    }
                    e.target.value = '';
                  }}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Scegli una sfumatura speciale...
                  </option>
                  {GRADIENT_PRESETS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 3. PATTERNS / TEXTURES */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200 block">Trama / Texture Tipografica</label>
          <select
            value={activeFace.backgroundPattern || 'none'}
            onChange={(e) => onUpdateFace({ backgroundPattern: e.target.value as any })}
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {PATTERN_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. CUSTOM DIMENSIONS & CORNERS */}
        {onUpdateCustomDimensions && (
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Ruler className="w-3.5 h-3.5" />
              <span>Misura Carta Personalizzata</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Larghezza (mm)</span>
                <input
                  type="number"
                  min="15"
                  max="350"
                  step="0.5"
                  value={customWidthMm}
                  onChange={(e) => onUpdateCustomDimensions(parseFloat(e.target.value) || 63.5, customHeightMm)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 font-mono text-center"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Altezza (mm)</span>
                <input
                  type="number"
                  min="15"
                  max="350"
                  step="0.5"
                  value={customHeightMm}
                  onChange={(e) => onUpdateCustomDimensions(customWidthMm, parseFloat(e.target.value) || 88.9)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 font-mono text-center"
                />
              </div>
            </div>

            {/* Corner Style Toggle */}
            {onChangeCornerStyle && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Taglio Angoli:</span>
                <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    onClick={() => onChangeCornerStyle('rounded')}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition ${
                      cornerStyle === 'rounded'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tondi (3.5mm)
                  </button>
                  <button
                    onClick={() => onChangeCornerStyle('square')}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition ${
                      cornerStyle === 'square'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Squadrati (90°)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tip */}
        <div className="p-3 bg-amber-950/20 border border-amber-600/30 rounded-xl text-[11px] text-amber-300 space-y-1">
          <p className="font-semibold">💡 Suggerimento Pro:</p>
          <p className="text-amber-200/80">
            Fai clic su qualsiasi elemento sulla carta (testo, immagine, icona, forma) per modificarne posizione, rotazione, livello o eliminarlo direttamente.
          </p>
        </div>
      </aside>
    );
  }

  // ELEMENT SELECTED: Render Element Inspector
  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 text-slate-200 overflow-y-auto select-none space-y-4">
      {/* Header with Type, Undo/Redo, Duplicate & PROMINENT DELETE */}
      <div className="border-b border-slate-800 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 font-bold">
              {selectedElement.type}
            </span>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[110px]">
              {selectedElement.name}
            </span>
          </div>

          {/* Quick Undo / Redo in Inspector */}
          <div className="flex items-center gap-1">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Annulla modifica (Ctrl+Z)"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Ripristina modifica (Ctrl+Y)"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-slate-700/60"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Buttons: DUPLICA & ELIMINA ELEMENTO */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {onDuplicateElement && (
            <button
              onClick={() => onDuplicateElement(selectedElement.id)}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold cursor-pointer transition shadow-xs"
              title="Crea una copia identica dell'elemento"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplica</span>
            </button>
          )}

          <button
            onClick={() => onDeleteElement(selectedElement.id)}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition shadow-md col-span-1"
            title="Elimina elemento (Tasto Canc o Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Elimina</span>
            <kbd className="text-[9px] bg-rose-800/80 px-1 rounded font-mono font-normal">Canc</kbd>
          </button>
        </div>
      </div>

      {/* Element Name */}
      <div>
        <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nome Identificativo</label>
        <input
          type="text"
          value={selectedElement.name || ''}
          onChange={(e) => onUpdateElement(selectedElement.id, { name: e.target.value })}
          className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-medium"
        />
      </div>

      {/* Alignment Helpers */}
      <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 text-[11px] font-medium">Allinea al Centro:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const centeredX = Math.round((100 - selectedElement.width) / 2);
              onUpdateElement(selectedElement.id, { x: centeredX });
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] cursor-pointer transition"
            title="Centra orizzontalmente"
          >
            <AlignCenterHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Orizzontale</span>
          </button>
          <button
            onClick={() => {
              const centeredY = Math.round((100 - selectedElement.height) / 2);
              onUpdateElement(selectedElement.id, { y: centeredY });
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] cursor-pointer transition"
            title="Centra verticalmente"
          >
            <AlignCenterVertical className="w-3.5 h-3.5 text-amber-400" />
            <span>Verticale</span>
          </button>
        </div>
      </div>

      {/* Position & Dimensions Grid */}
      <div className="space-y-2 border-b border-slate-800 pb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Geometria & Posizione (%)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Pos X (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(selectedElement.x)}
              onChange={(e) => onUpdateElement(selectedElement.id, { x: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Pos Y (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(selectedElement.y)}
              onChange={(e) => onUpdateElement(selectedElement.id, { y: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Larghezza (%)</span>
            <input
              type="number"
              min="2"
              max="100"
              value={Math.round(selectedElement.width)}
              onChange={(e) => onUpdateElement(selectedElement.id, { width: parseFloat(e.target.value) || 10 })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Altezza (%)</span>
            <input
              type="number"
              min="2"
              max="100"
              value={Math.round(selectedElement.height)}
              onChange={(e) => onUpdateElement(selectedElement.id, { height: parseFloat(e.target.value) || 10 })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Rotazione</span>
            <span className="font-mono text-amber-400">{selectedElement.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={selectedElement.rotation || 0}
            onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* TEXT SPECIFIC PROPERTIES */}
      {selectedElement.type === 'text' && (
        <div className="space-y-3 border-b border-slate-800 pb-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Testo</label>
            <textarea
              rows={3}
              value={selectedElement.text || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
              placeholder="Scrivi qui..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Font Tipografico</label>
            <select
              value={selectedElement.fontFamily || 'Inter'}
              onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Dimensione (pt)</span>
              <input
                type="number"
                min="6"
                max="72"
                value={selectedElement.fontSize || 12}
                onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Colore Testo</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-1.5 py-1 text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'left' })}
                className={`p-1.5 rounded cursor-pointer ${selectedElement.textAlign === 'left' ? 'bg-slate-700 text-amber-400' : 'text-slate-400'}`}
                title="Allinea a Sinistra"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'center' })}
                className={`p-1.5 rounded cursor-pointer ${(!selectedElement.textAlign || selectedElement.textAlign === 'center') ? 'bg-slate-700 text-amber-400' : 'text-slate-400'}`}
                title="Allinea al Centro"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'right' })}
                className={`p-1.5 rounded cursor-pointer ${selectedElement.textAlign === 'right' ? 'bg-slate-700 text-amber-400' : 'text-slate-400'}`}
                title="Allinea a Destra"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={!!selectedElement.shadow}
                onChange={(e) => onUpdateElement(selectedElement.id, { shadow: e.target.checked })}
                className="accent-amber-500 rounded"
              />
              <span>Ombra</span>
            </label>
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC PROPERTIES */}
      {selectedElement.type === 'shape' && (
        <div className="space-y-3 border-b border-slate-800 pb-3 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Forma</label>
            <select
              value={selectedElement.shapeType || 'rectangle'}
              onChange={(e) => onUpdateElement(selectedElement.id, { shapeType: e.target.value as any })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="rectangle">Rettangolo / Riquadro</option>
              <option value="circle">Cerchio / Ovale Stat</option>
              <option value="shield">Scudo da Battaglia</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Riempimento</span>
              <input
                type="color"
                value={selectedElement.fillColor === 'transparent' ? '#ffffff' : selectedElement.fillColor || '#1e293b'}
                onChange={(e) => onUpdateElement(selectedElement.id, { fillColor: e.target.value })}
                className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Colore Bordo</span>
              <input
                type="color"
                value={selectedElement.borderColor || '#f59e0b'}
                onChange={(e) => onUpdateElement(selectedElement.id, { borderColor: e.target.value })}
                className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Spessore Bordo (px)</span>
              <input
                type="number"
                min="0"
                max="12"
                value={selectedElement.borderWidth ?? 2}
                onChange={(e) => onUpdateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Raggio Angoli</span>
              <input
                type="number"
                min="0"
                max="30"
                value={selectedElement.borderRadius ?? 4}
                onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ICON SPECIFIC PROPERTIES */}
      {selectedElement.type === 'icon' && (
        <div className="space-y-3 border-b border-slate-800 pb-3 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Scegli Simbolo / Icona</label>
            <select
              value={selectedElement.iconName || 'stat_sword'}
              onChange={(e) => {
                const found = GAME_ICONS.find((i) => i.id === e.target.value);
                onUpdateElement(selectedElement.id, {
                  iconName: e.target.value,
                  name: found?.name || 'Icona',
                });
              }}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {GAME_ICONS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Colore Tinta Icona</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.tint || '#d97706'}
                onChange={(e) => onUpdateElement(selectedElement.id, { tint: e.target.value })}
                className="w-9 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.tint || '#d97706'}
                onChange={(e) => onUpdateElement(selectedElement.id, { tint: e.target.value })}
                className="bg-slate-800 text-xs text-slate-200 px-2 py-1.5 rounded border border-slate-700 flex-1 font-mono uppercase"
              />
            </div>
          </div>
        </div>
      )}

      {/* IMAGE SPECIFIC PROPERTIES */}
      {selectedElement.type === 'image' && (
        <div className="space-y-3 border-b border-slate-800 pb-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Adattamento Immagine</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateElement(selectedElement.id, { fit: 'cover' })}
                className={`py-1.5 px-2 rounded border cursor-pointer text-center ${
                  selectedElement.fit === 'cover' ? 'bg-amber-600 border-amber-500 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Riempi (Cover)
              </button>
              <button
                onClick={() => onUpdateElement(selectedElement.id, { fit: 'contain' })}
                className={`py-1.5 px-2 rounded border cursor-pointer text-center ${
                  selectedElement.fit === 'contain' ? 'bg-amber-600 border-amber-500 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Intera (Contain)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opacity & Layer Order */}
      <div className="space-y-3 text-xs border-b border-slate-800 pb-4">
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Opacità Livello</span>
            <span className="font-mono text-amber-400">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedElement.opacity ?? 1}
            onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1.5">Ordinamento Livelli</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onUpdateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 1) + 1 })}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center justify-center gap-1 cursor-pointer transition text-slate-300"
              title="Porta avanti di un livello"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Avanti</span>
            </button>
            <button
              onClick={() => onUpdateElement(selectedElement.id, { zIndex: Math.max(1, (selectedElement.zIndex || 1) - 1) })}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center justify-center gap-1 cursor-pointer transition text-slate-300"
              title="Porta indietro di un livello"
            >
              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Indietro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Full-Width Delete Button at bottom */}
      <div className="pt-2">
        <button
          onClick={() => onDeleteElement(selectedElement.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/50 text-xs font-bold cursor-pointer transition shadow-xs group"
          title="Elimina definitivamente questo elemento (Tasto Canc o Backspace)"
        >
          <Trash2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          <span>Elimina Elemento Selezionato</span>
          <kbd className="text-[10px] bg-rose-950/80 px-1.5 py-0.5 rounded font-mono font-normal border border-rose-800/60">Canc</kbd>
        </button>
      </div>
    </aside>
  );
};
