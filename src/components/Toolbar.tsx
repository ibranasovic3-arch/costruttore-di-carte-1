import React, { useRef, useState, useMemo } from 'react';
import {
  Type,
  Image as ImageIcon,
  Shapes,
  Palette,
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  Upload,
  Undo2,
  Redo2,
  Trash2,
  Sliders,
  Search,
  Grid,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { CardElement, CardFace, ElementType } from '../types/card.ts';
import {
  GAME_ICONS,
  ICON_CATEGORIES,
  IconCategory,
  PATTERN_OPTIONS,
  COLOR_PALETTES,
  GRADIENT_PRESETS,
} from '../data/assetLibrary.ts';

interface ToolbarProps {
  onAddElement: (element: Partial<CardElement>) => void;
  activeFace: CardFace;
  onUpdateFaceBackground: (updates: Partial<CardFace>) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  selectedElementId?: string | null;
  onDeleteElement?: (id: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddElement,
  activeFace,
  onUpdateFaceBackground,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  selectedElementId,
  onDeleteElement,
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'icons' | 'shapes' | 'background'>('elements');
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('casino');
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Vector Icon Panel State
  const [iconCategory, setIconCategory] = useState<'all' | IconCategory>('all');
  const [iconSearch, setIconSearch] = useState<string>('');
  const [iconTint, setIconTint] = useState<string>('#f59e0b');
  const [iconSizePreset, setIconSizePreset] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [isIconModalOpen, setIsIconModalOpen] = useState<boolean>(false);

  const filteredIcons = useMemo(() => {
    return GAME_ICONS.filter((icon) => {
      const matchCat = iconCategory === 'all' || icon.category === iconCategory;
      if (!matchCat) return false;
      if (!iconSearch.trim()) return true;
      const q = iconSearch.toLowerCase();
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.id.toLowerCase().includes(q) ||
        icon.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [iconCategory, iconSearch]);

  const handleInsertIcon = (icon: typeof GAME_ICONS[0]) => {
    let w = 28;
    let h = 24;
    if (iconSizePreset === 'sm') {
      w = 16;
      h = 14;
    } else if (iconSizePreset === 'lg') {
      w = 42;
      h = 36;
    } else if (iconSizePreset === 'xl') {
      w = 60;
      h = 50;
    }
    const x = Math.max(5, Math.round((100 - w) / 2));
    const y = Math.max(5, Math.round((100 - h) / 2));

    let finalTint = iconTint;
    if (
      icon.category === 'suits' &&
      (icon.id === 'suit_heart' || icon.id === 'suit_diamond') &&
      iconTint === '#f59e0b'
    ) {
      finalTint = '#dc2626';
    }

    onAddElement({
      type: 'icon',
      name: icon.name,
      iconName: icon.id,
      x,
      y,
      width: w,
      height: h,
      tint: finalTint,
      zIndex: 3,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onAddElement({
        type: 'image',
        name: 'Immagine Caricata',
        url: dataUrl,
        x: 10,
        y: 15,
        width: 80,
        height: 50,
        fit: 'cover',
        opacity: 1,
      });
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const activePalette = COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Tool Category Selector & Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'elements' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Testi & Media</span>
          </button>

          <button
            onClick={() => setActiveTab('icons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'icons' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simboli & Semi</span>
          </button>

          <button
            onClick={() => setActiveTab('shapes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'shapes' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Forme & Cornici</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'background' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colori & Sfondo</span>
          </button>
        </div>

        {/* Quick Canvas Actions: Undo, Redo, Delete Element */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Annulla ultima modifica (Ctrl+Z)"
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold hidden sm:inline">Annulla</span>
            </button>
          )}

          {onRedo && (
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Ripristina modifica (Ctrl+Y)"
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold hidden sm:inline">Ripristina</span>
            </button>
          )}

          {selectedElementId && onDeleteElement && (
            <button
              onClick={() => onDeleteElement(selectedElementId)}
              title="Elimina elemento selezionato (Canc / Backspace)"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-[11px] font-semibold transition cursor-pointer shadow-xs ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Elimina Elemento</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Sub-bar based on active tab */}
      <div className="flex items-center gap-2 flex-wrap">
        {activeTab === 'elements' && (
          <>
            <button
              onClick={() =>
                onAddElement({
                  type: 'text',
                  name: 'Titolo Grande',
                  text: 'TITOLO CARTA',
                  fontSize: 16,
                  fontFamily: 'Cinzel',
                  fontWeight: '900',
                  color: '#ffffff',
                  shadow: true,
                  x: 10,
                  y: 8,
                  width: 80,
                  height: 8,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition font-medium"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Titolo</span>
            </button>

            <button
              onClick={() =>
                onAddElement({
                  type: 'text',
                  name: 'Descrizione / Effetto',
                  text: 'Descrizione delle abilità speciali della carta o effetto in gioco.',
                  fontSize: 10,
                  fontFamily: 'Inter',
                  color: '#e2e8f0',
                  x: 10,
                  y: 65,
                  width: 80,
                  height: 16,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition font-medium"
            >
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Descrizione</span>
            </button>

            <button
              onClick={() =>
                onAddElement({
                  type: 'text',
                  name: 'Badge Statistica',
                  text: '10',
                  fontSize: 14,
                  fontFamily: 'Cinzel',
                  fontWeight: '900',
                  color: '#ffffff',
                  x: 8,
                  y: 86,
                  width: 14,
                  height: 8,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition font-medium"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">#</span>
              <span>+ Numero / Stat</span>
            </button>

            <button
              onClick={() => imageInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded-lg flex items-center gap-1.5 cursor-pointer transition font-semibold"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Carica Foto / Art</span>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </>
        )}

        {activeTab === 'icons' && (
          <div className="flex items-center gap-2 flex-wrap max-w-full">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1">
              <select
                value={iconCategory}
                onChange={(e) => setIconCategory(e.target.value as any)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                {ICON_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cerca icone (es. monopoly, dado, spada)..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="bg-slate-800 text-slate-200 placeholder-slate-500 text-xs pl-7 pr-6 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-36 sm:w-48"
              />
              {iconSearch && (
                <button
                  onClick={() => setIconSearch('')}
                  className="absolute right-1.5 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Tint Palette */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 pl-1 font-semibold">Tinta:</span>
              {[
                { label: 'Oro', color: '#f59e0b' },
                { label: 'Rosso', color: '#dc2626' },
                { label: 'Verde', color: '#16a34a' },
                { label: 'Blu', color: '#2563eb' },
                { label: 'Viola', color: '#9333ea' },
                { label: 'Bianco', color: '#ffffff' },
                { label: 'Nero', color: '#0f172a' },
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() => setIconTint(c.color)}
                  title={c.label}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition ${
                    iconTint.toLowerCase() === c.color.toLowerCase()
                      ? 'ring-2 ring-amber-400 scale-110 border-white'
                      : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                />
              ))}
              <input
                type="color"
                value={iconTint}
                onChange={(e) => setIconTint(e.target.value)}
                title="Scegli colore personalizzato"
                className="w-4 h-4 rounded border-0 bg-transparent cursor-pointer p-0"
              />
            </div>

            {/* Size Preset Selector */}
            <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setIconSizePreset(sz)}
                  className={`px-1.5 py-0.5 rounded font-semibold uppercase cursor-pointer transition ${
                    iconSizePreset === sz
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Dimensione: ${sz === 'sm' ? '16%' : sz === 'md' ? '28%' : sz === 'lg' ? '42%' : '60%'}`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Quick Insert Horizontal Strip */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-sm sm:max-w-md py-0.5 px-1 border-l border-slate-800">
              {filteredIcons.slice(0, 10).map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => handleInsertIcon(icon)}
                  title={`Inserisci ${icon.name} sulla carta`}
                  className="p-1.5 bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition group"
                >
                  <svg
                    className="w-4 h-4 fill-current transition group-hover:scale-110"
                    viewBox="0 0 24 24"
                    style={{ color: iconTint }}
                  >
                    <path d={icon.svgPath} />
                  </svg>
                </button>
              ))}
            </div>

            {/* Open Full Vector Icon Library Modal */}
            <button
              onClick={() => setIsIconModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 text-xs font-semibold cursor-pointer transition"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Tutte le Icone ({filteredIcons.length})</span>
            </button>
          </div>
        )}

        {activeTab === 'shapes' && (
          <>
            <button
              onClick={() =>
                onAddElement({
                  type: 'shape',
                  name: 'Cornice Dorata',
                  shapeType: 'rectangle',
                  x: 5,
                  y: 3.5,
                  width: 90,
                  height: 93,
                  fillColor: 'transparent',
                  borderColor: '#f59e0b',
                  borderWidth: 2,
                  borderRadius: 6,
                  zIndex: 1,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Cornice Card</span>
            </button>

            <button
              onClick={() =>
                onAddElement({
                  type: 'shape',
                  name: 'Riquadro Effetto',
                  shapeType: 'rectangle',
                  x: 8,
                  y: 62,
                  width: 84,
                  height: 24,
                  fillColor: '#1e293b',
                  borderColor: '#475569',
                  borderWidth: 1,
                  borderRadius: 4,
                  opacity: 0.9,
                  zIndex: 1,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Shapes className="w-3.5 h-3.5 text-blue-400" />
              <span>Riquadro Testo</span>
            </button>

            <button
              onClick={() =>
                onAddElement({
                  type: 'shape',
                  name: 'Cerchio Stat',
                  shapeType: 'circle',
                  x: 8,
                  y: 84,
                  width: 14,
                  height: 10,
                  fillColor: '#b91c1c',
                  borderColor: '#fca5a5',
                  borderWidth: 1.5,
                  zIndex: 2,
                })
              }
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <div className="w-3 h-3 rounded-full border border-amber-400 bg-red-600"></div>
              <span>Cerchio Stat</span>
            </button>
          </>
        )}

        {activeTab === 'background' && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Palette Presets & Swatches */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Palette:</span>
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

              {/* Swatches */}
              <div className="flex items-center gap-1 pl-1">
                {activePalette.colors.slice(0, 6).map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateFaceBackground({ backgroundColor: c })}
                    style={{ backgroundColor: c }}
                    className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform cursor-pointer shadow-xs"
                    title={`Imposta ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color picker */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={activeFace.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdateFaceBackground({ backgroundColor: e.target.value })}
                className="w-6 h-6 rounded border border-slate-700 cursor-pointer bg-transparent"
                title="Scegli colore personalizzato"
              />
            </div>

            {/* Gradient Presets Quick Apply */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Sfumatura:</span>
              <select
                defaultValue=""
                onChange={(e) => {
                  const preset = GRADIENT_PRESETS.find((g) => g.id === e.target.value);
                  if (preset) {
                    onUpdateFaceBackground({
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
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Applica Gradiente...
                </option>
                {GRADIENT_PRESETS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              {activeFace.backgroundGradient?.enabled && (
                <button
                  onClick={() =>
                    onUpdateFaceBackground({
                      backgroundGradient: { ...activeFace.backgroundGradient!, enabled: false },
                    })
                  }
                  className="text-[10px] bg-slate-800 hover:bg-slate-750 px-1 py-0.5 rounded text-amber-300 border border-slate-700 cursor-pointer"
                  title="Disattiva gradiente"
                >
                  Togli
                </button>
              )}
            </div>

            {/* Pattern picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Trama:</span>
              <select
                value={activeFace.backgroundPattern || 'none'}
                onChange={(e) => onUpdateFaceBackground({ backgroundPattern: e.target.value as any })}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {PATTERN_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* FULL VECTOR ICON LIBRARY MODAL */}
      {isIconModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Libreria Completa Icone Vettoriali</h3>
                  <p className="text-xs text-slate-400">
                    Seleziona un'icona vettoriale di gioco o simbolo da posizionare direttamente sulla carta.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsIconModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Controls Bar */}
            <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {ICON_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setIconCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap cursor-pointer ${
                      iconCategory === cat.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Custom Tint */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filtra icone..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="bg-slate-800 text-slate-200 placeholder-slate-500 text-xs pl-7 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-40"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 px-1 font-semibold">Tinta:</span>
                  <input
                    type="color"
                    value={iconTint}
                    onChange={(e) => setIconTint(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] uppercase text-slate-300">{iconTint}</span>
                </div>
              </div>
            </div>

            {/* Icons Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => {
                    handleInsertIcon(icon);
                    setIsIconModalOpen(false);
                  }}
                  className="group flex flex-col items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-amber-500/80 transition cursor-pointer text-center relative"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 flex items-center justify-center p-2 mb-2 transition group-hover:scale-110 shadow-inner">
                    <svg
                      className="w-full h-full fill-current transition"
                      viewBox="0 0 24 24"
                      style={{ color: iconTint }}
                    >
                      <path d={icon.svgPath} />
                    </svg>
                  </div>
                  <div className="w-full">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 truncate leading-tight">
                      {icon.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 capitalize">
                      {icon.category}
                    </div>
                  </div>
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                  Nessuna icona trovata per la ricerca "{iconSearch}". Prova a cercare termini come "monopoly", "arma", "cuore", "dado" o "stella".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>{filteredIcons.length} icone disponibili · Clicca su un'icona per inserirla direttamente</span>
              <button
                onClick={() => setIsIconModalOpen(false)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
