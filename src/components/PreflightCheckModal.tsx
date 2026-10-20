import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Deck, PreflightIssue } from '../types/card.ts';
import { runPreflightCheck } from '../utils/cardUtils.ts';

interface PreflightCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck;
  onSelectCard: (cardId: string) => void;
  onChangeActiveFace?: (face: 'front' | 'back') => void;
}

export const PreflightCheckModal: React.FC<PreflightCheckModalProps> = ({
  isOpen,
  onClose,
  deck,
  onSelectCard,
  onChangeActiveFace,
}) => {
  if (!isOpen) return null;

  const issues = runPreflightCheck(deck);
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                issues.length > 0
                  ? 'bg-amber-600/20 text-amber-400 border-amber-600/30'
                  : 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30'
              }`}
            >
              {issues.length > 0 ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Verifica Prestampa Tipografica (Preflight)</h2>
              <p className="text-xs text-slate-400">
                Controllo automatico di abbondaggio, area di sicurezza, testi a rischio taglio e risoluzione
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status Banner */}
          {issues.length === 0 ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-600/40 rounded-xl flex items-center gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block text-sm">Nessun problema rilevato!</strong>
                <span>
                  Tutti gli elementi rispettano i margini di sicurezza di 3mm e la geometria di stampa. Il mazzo è pronto per l'esportazione a 300 DPI e per l'ordine fisico.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Riepilogo Controlli:</span>
                {errors.length > 0 && (
                  <span className="text-rose-400 font-semibold">{errors.length} Errori Critici</span>
                )}
                {warnings.length > 0 && (
                  <span className="text-amber-400 font-semibold">{warnings.length} Avvisi di Taglio</span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{deck.cards.length} carte scansionate</span>
            </div>
          )}

          {/* Issues List */}
          <div className="space-y-2.5">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        issue.severity === 'error'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <strong className="text-white">{issue.cardName}</strong>
                    <span className="text-slate-500">• Lato {issue.face === 'front' ? 'Fronte' : 'Retro'}</span>
                  </div>
                  <p className="text-slate-300 font-medium">{issue.message}</p>
                  <p className="text-[11px] text-slate-400">{issue.recommendation}</p>
                </div>

                <button
                  onClick={() => {
                    onSelectCard(issue.cardId);
                    if (onChangeActiveFace) onChangeActiveFace(issue.face);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition shrink-0"
                >
                  <span>Correggi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
