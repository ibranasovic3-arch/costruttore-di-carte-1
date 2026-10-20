import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Settings,
} from 'lucide-react';
import { CardFormatId, Deck, PrintSettings } from '../types/card.ts';
import { getCardDimensions } from '../utils/cardUtils.ts';
import { generatePrintSheetPdf, renderCardFaceToCanvas } from '../utils/exportUtils.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck;
  selectedCardId: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  deck,
  selectedCardId,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'single' | 'color'>('sheet');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    paperSize: 'a4',
    orientation: 'portrait',
    includeBleed: true,
    includeCropMarks: true,
    includeSafeZone: false,
    bleedMm: 3,
    safeMarginMm: 3,
    dpi: 300,
    colorMode: 'sRGB',
    doubleSidedGuide: true,
  });

  const cardFormat = getCardDimensions(deck.format, deck.customWidthMm, deck.customHeightMm);
  const currentCard = deck.cards.find((c) => c.id === selectedCardId) || deck.cards[0];

  if (!isOpen) return null;

  // Single card export handler
  const handleExportSingleCard = async (faceType: 'front' | 'back' | 'both') => {
    setIsExporting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const facesToExport: { face: any; label: string }[] = [];
      if (faceType === 'front' || faceType === 'both') {
        facesToExport.push({ face: currentCard.front, label: `${currentCard.name}_Fronte` });
      }
      if (faceType === 'back' || faceType === 'both') {
        const backFace = deck.useSharedBack ? deck.sharedBack : currentCard.back || deck.sharedBack;
        facesToExport.push({ face: backFace, label: `${currentCard.name}_Retro` });
      }

      for (const item of facesToExport) {
        const canvas = await renderCardFaceToCanvas(item.face, deck.format, {
          dpi: printSettings.dpi,
          includeBleed: printSettings.includeBleed,
          bleedMm: printSettings.bleedMm,
          showGuides: printSettings.includeCropMarks,
          colorMode: printSettings.colorMode,
          cornerStyle: deck.cornerStyle,
          cornerMm: deck.cornerMm,
          customWidthMm: deck.customWidthMm,
          customHeightMm: deck.customHeightMm,
        });

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${item.label}_300DPI_${printSettings.includeBleed ? 'ConAbbondaggio' : 'Rifilata'}.png`;
        link.href = dataUrl;
        link.click();
      }

      setSuccessMessage('Esportazione 300 DPI ad alta risoluzione completata con successo!');
    } catch (err) {
      setErrorMessage('Errore durante la generazione dell\'immagine ad alta risoluzione.');
    } finally {
      setIsExporting(false);
    }
  };

  // PDF Sheet export handler
  const handleExportPdf = async () => {
    setIsExporting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const doc = await generatePrintSheetPdf(deck, printSettings);
      doc.save(`${deck.title.replace(/\s+/g, '_')}_Fogli_Stampa_300DPI.pdf`);
      setSuccessMessage('PDF professionale multi-pagina (Fronte + Retro allineato) scaricato!');
    } catch (err) {
      setErrorMessage('Errore durante la generazione del PDF pronto per la stampa.');
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Browser Print
  const handleDirectPrint = async () => {
    setIsExporting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const doc = await generatePrintSheetPdf(deck, printSettings);
      doc.save(`${deck.title.replace(/\s+/g, '_')}_Stampa_Diretta_300DPI.pdf`);
      setSuccessMessage('File PDF per la stampa diretta generato e salvato!');
    } catch (err) {
      setErrorMessage('Errore durante la preparazione del documento di stampa.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-600/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Stampa & Esportazione Alta Risoluzione 300 DPI</h2>
              <p className="text-xs text-slate-400">
                Precisione cromatica tipografica, crocini di registro e fogli A4/Letter fronte-retro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`py-3 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'sheet'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Fogli di Stampa Completi (A4 / Letter)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`py-3 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'single'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Carta Singola (PNG 300 DPI)</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={`py-3 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'color'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gestione Colore & CMYK</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-600/50 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'sheet' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Format & Bleed Controls */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Parametri Foglio di Stampa
                  </h4>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Formato Carta Stampante</label>
                    <select
                      value={printSettings.paperSize}
                      onChange={(e) =>
                        setPrintSettings({ ...printSettings, paperSize: e.target.value as any })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="a4">Standard A4 (210 x 297 mm) — Consigliato Europa</option>
                      <option value="letter">US Letter (215.9 x 279.4 mm) — USA & Canada</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.includeBleed}
                        onChange={(e) =>
                          setPrintSettings({ ...printSettings, includeBleed: e.target.checked })
                        }
                        className="accent-amber-500 rounded"
                      />
                      <span>Includi Abbondaggio 3mm (consigliato per evitare bordi bianchi)</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.includeCropMarks}
                        onChange={(e) =>
                          setPrintSettings({ ...printSettings, includeCropMarks: e.target.checked })
                        }
                        className="accent-amber-500 rounded"
                      />
                      <span>Includi Crocini di Taglio e Registro (linee di guida per taglierina)</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.doubleSidedGuide}
                        onChange={(e) =>
                          setPrintSettings({ ...printSettings, doubleSidedGuide: e.target.checked })
                        }
                        className="accent-amber-500 rounded"
                      />
                      <span>Allineamento Fronte/Retro a Specchio (combaciamento millimetrico)</span>
                    </label>
                  </div>
                </div>

                {/* Print Sheet Specs Summary */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between text-xs space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Specifiche Tipografiche
                    </h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Formato Carta:</span>
                        <span className="font-semibold text-white">
                          {cardFormat.name} ({cardFormat.widthMm} x {cardFormat.heightMm} mm)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risoluzione Render:</span>
                        <span className="font-mono text-amber-400 font-bold">300 DPI Reali</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carte nel Mazzo:</span>
                        <span className="font-bold text-white">{deck.cards.length} carte</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Griglia Foglio:</span>
                        <span className="text-slate-200">9 carte per foglio (3 x 3)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Angoli:</span>
                        <span className="text-amber-400 capitalize">
                          {deck.cornerStyle === 'rounded' ? 'Tondi (Fustella 3.5mm)' : 'Squadrati (90°)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-950/30 border border-amber-600/30 rounded-lg text-[11px] text-amber-300">
                    💡 <strong>Consiglio di Stampa Duplex:</strong> Seleziona nel driver della tua stampante "Capovolgi sul lato lungo" (Long-Edge Binding). Le colonne del retro sono già invertite per coincidere esattamente con il fronte!
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={handleDirectPrint}
                  disabled={isExporting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Stampa Diretta Stampante</span>
                </button>

                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generazione in corso...' : 'Scarica PDF Pronto Stampa (300 DPI)'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'single' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Esporta la carta attualmente selezionata (<strong>{currentCard.name}</strong>) in altissima risoluzione a 300 DPI con canale trasparenza e abbondaggio perimetrale per invio a tipografia o plotter da taglio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleExportSingleCard('front')}
                  disabled={isExporting}
                  className="p-4 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white group-hover:text-amber-400">Solo Fronte</span>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">PNG 300 DPI ad alta definizione del fronte con crocini.</p>
                </button>

                <button
                  onClick={() => handleExportSingleCard('back')}
                  disabled={isExporting}
                  className="p-4 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white group-hover:text-amber-400">Solo Retro</span>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">PNG 300 DPI del retro condiviso o dedicato della carta.</p>
                </button>

                <button
                  onClick={() => handleExportSingleCard('both')}
                  disabled={isExporting}
                  className="p-4 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 rounded-xl text-left cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300">Fronte & Retro (2 File)</span>
                    <Download className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-amber-200/70">Scarica entrambi i lati pronti per la fustella di stampa.</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Precisione Cromatica & Simulazione CMYK
                </h4>
                <p>
                  Gli schermi visualizzano i colori nello spazio RGB additivo, mentre le macchine da stampa tipografiche (offset e digitali laser a toner) utilizzano l'inchiostro in quadricromia <strong>CMYK (Ciano, Magenta, Giallo, Nero)</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">1. Profilo FOGRA39 / ISO Coated</span>
                    <p className="text-[11px] text-slate-400">
                      Standard industriale europeo per carte patinate e finiture lino da casinò. CartaCraft Studio applica una simulazione spettrale per prevenire desaturazioni impreviste.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">2. Controllo Fuori Gamut</span>
                    <p className="text-[11px] text-slate-400">
                      I colori fluorescenti o ciano/magenta troppo elettrici su monitor non possono essere riprodotti su carta comune senza inchiostri speciali Pantone fluo. Attiva l'allarme Gamut nell'editor per individuarli.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
