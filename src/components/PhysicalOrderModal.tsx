import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Truck,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Layers,
  Award,
  Box,
  CreditCard,
  Download,
  Info,
} from 'lucide-react';
import {
  CornerStyle,
  Deck,
  FinishType,
  PackagingType,
  PaperStock,
} from '../types/card.ts';
import {
  CARD_FORMATS,
  calculateOrderQuote,
  getCardDimensions,
  runPreflightCheck,
} from '../utils/cardUtils.ts';

interface PhysicalOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck;
  onUpdateDeckCornerStyle: (corner: CornerStyle) => void;
}

export const PhysicalOrderModal: React.FC<PhysicalOrderModalProps> = ({
  isOpen,
  onClose,
  deck,
  onUpdateDeckCornerStyle,
}) => {
  const [step, setStep] = useState<'config' | 'shipping' | 'proof' | 'confirmed'>('config');

  // Specs state
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>(deck.cornerStyle || 'rounded');
  const [finish, setFinish] = useState<FinishType>('matte');
  const [paperStock, setPaperStock] = useState<PaperStock>('310_black_core');
  const [packaging, setPackaging] = useState<PackagingType>('custom_box');
  const [deckQuantity, setDeckQuantity] = useState<number>(1);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    fullName: 'Marco Rossi',
    email: 'marco.rossi@example.com',
    address: 'Via dei Mille 42',
    city: 'Milano',
    province: 'MI',
    zipCode: '20121',
    phone: '+39 340 1234567',
    notes: 'Lasciare al portiere se assente',
  });

  const [proofApproved, setProofApproved] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  if (!isOpen) return null;

  const quote = calculateOrderQuote({
    deckCardsCount: deck.cards.length,
    deckQuantity,
    cornerStyle,
    finish,
    paperStock,
    packaging,
  });

  const cardFormat = getCardDimensions(deck.format, deck.customWidthMm, deck.customHeightMm);
  const preflightIssues = runPreflightCheck(deck);
  const criticalErrors = preflightIssues.filter((i) => i.severity === 'error');

  const handleConfirmOrder = () => {
    const generatedOrderNumber = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNumber);
    setStep('confirmed');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-600/30">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ordine Mazzi Fisici di Alta Qualità Tipografica</h2>
              <p className="text-xs text-slate-400">
                Stampa professionale casinò grade su carta Black Core con fustellatura a scelta e finitura protettiva
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

        {/* Stepper Progress */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-center select-none">
          <div className={`py-2.5 border-b-2 transition ${step === 'config' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'}`}>
            1. Finiture & Quantità
          </div>
          <div className={`py-2.5 border-b-2 transition ${step === 'shipping' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'}`}>
            2. Dati Spedizione
          </div>
          <div className={`py-2.5 border-b-2 transition ${step === 'proof' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'}`}>
            3. Visto Si Stampi
          </div>
          <div className={`py-2.5 border-b-2 transition ${step === 'confirmed' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'}`}>
            4. Conferma Produzione
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Configurator Columns */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Angoli Modificabili (Squadrati vs Tondi) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Taglio Angoli Fustellati</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Rifilo precisione 0.1mm</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCornerStyle('rounded');
                        onUpdateDeckCornerStyle('rounded');
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition relative ${
                        cornerStyle === 'rounded'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-amber-300">Angoli Tondi (Standard Casinò)</span>
                        <div className="w-4 h-4 rounded-full border border-amber-400 bg-amber-400/20" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Raggio curvatura 3.5mm fustellato a freddo. Evita lo sfaldamento degli angoli e garantisce mescolamenti fluidi e durevoli.
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setCornerStyle('square');
                        onUpdateDeckCornerStyle('square');
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition relative ${
                        cornerStyle === 'square'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-amber-300">Angoli a Squadro (90°)</span>
                        <div className="w-4 h-4 border border-amber-400 bg-amber-400/20" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Taglio a ghigliottina netto a 90°. Look vintage autentico, perfetto per tarocchi tradizionali, mappe modulari e carte prototipo.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Finitura Superficiale (Opaca vs Lucida) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Finitura & Verniciatura Tipografica</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setFinish('matte')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        finish === 'matte'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-300 mb-1">Finitura Opaca (Matte)</div>
                      <p className="text-[10px] text-slate-400">
                        Anti-riflesso morbido, zero impronte digitali, lettura ideale sotto luce diretta.
                      </p>
                    </button>

                    <button
                      onClick={() => setFinish('glossy')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        finish === 'glossy'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-300 mb-1">Finitura Lucida UV</div>
                      <p className="text-[10px] text-slate-400">
                        Vernice UV lucida a specchio, esalta al massimo la saturazione e i contrasti di colore.
                      </p>
                    </button>

                    <button
                      onClick={() => setFinish('linen')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        finish === 'linen'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-300 mb-1">Trama Lino Casinò</div>
                      <p className="text-[10px] text-slate-400">
                        Cuscino d'aria Air-Cushion goffrato in tela di lino, standard dei casinò di Las Vegas.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3. Supporto Carta & Anima Interna */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Supporto Cartoncino Professionale</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaperStock('310_black_core')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        paperStock === '310_black_core'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-emerald-300">310 gsm German Black Core</span>
                        <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Consigliato</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Anima nera opaca inserita all'interno: impedisce qualsiasi trasparenza anche contro fonti di luce intensa.
                      </p>
                    </button>

                    <button
                      onClick={() => setPaperStock('350_white_core')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        paperStock === '350_white_core'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-200 mb-1">350 gsm Premium White Core</div>
                      <p className="text-[10px] text-slate-400">
                        Cartoncino extra rigido ad alto spessore, rigidità superiore per carte collezionabili e tarocchi.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 4. Confezionamento Scatola */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>Packaging & Astuccio</span>
                  </label>

                  <select
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="custom_box">Astuccio Personalizzato Stampato (Custom Tuck Box con grafica del tuo mazzo) (+€4.50)</option>
                    <option value="plastic_case">Custodia Rigida Trasparente in Policarbonato Protettivo (+€2.20)</option>
                    <option value="velvet_pouch">Sacchetto Elegante in Velluto Nero con laccio dorato (+€3.00)</option>
                    <option value="shrink_wrap">Cellophanatura Protettiva Termoretraibile (+€0.50)</option>
                  </select>
                </div>
              </div>

              {/* Right Order Summary & Quote Breakdown */}
              <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Preventivo Tipografia Istantaneo
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{deck.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{cardFormat.name}</span>
                      <span>•</span>
                      <span>{deck.cards.length} carte</span>
                    </div>
                  </div>

                  {/* Quantity selector with bulk discount badges */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Numero di Mazzi da Stampare
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 5, 10, 20, 50, 100].map((qty) => (
                        <button
                          key={qty}
                          onClick={() => setDeckQuantity(qty)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition ${
                            deckQuantity === qty
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {qty} {qty === 1 ? 'mazzo' : 'mazzi'}
                        </button>
                      ))}
                    </div>
                    {quote.discountPercentage > 0 && (
                      <div className="mt-2 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-700/40 px-2 py-1 rounded-md flex items-center justify-between">
                        <span>Sconto quantità applicato:</span>
                        <span className="font-bold font-mono">-{quote.discountPercentage}%</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prezzo unitario per mazzo:</span>
                      <span className="font-mono text-white">€{quote.unitPrice.toFixed(2)} / mazzo</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Subtotale ({deckQuantity}x):</span>
                      <span className="font-mono text-white">€{quote.subtotal.toFixed(2)}</span>
                    </div>

                    {quote.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Risparmio Totale Sconto:</span>
                        <span className="font-mono font-bold">-€{quote.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-400">Spedizione Corriere Espresso (DHL/GLS):</span>
                      <span className="font-mono text-white">
                        {quote.shipping === 0 ? <strong className="text-emerald-400">Gratuita</strong> : `€${quote.shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">IVA (22% inclusa):</span>
                      <span className="font-mono text-slate-400">€{quote.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 text-sm">
                      <span className="font-bold text-white">Totale Ordine:</span>
                      <span className="font-mono text-lg font-extrabold text-emerald-400">
                        €{quote.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Delivery time estimate */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Consegna stimata entro <strong>{quote.estimatedDeliveryDays} giorni lavorativi</strong> con tracciamento completo.
                    </span>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={() => setStep('shipping')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
                >
                  <span>Procedi con i Dati di Spedizione</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'shipping' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Indirizzo di Spedizione e Destinatario</h3>
                <p className="text-xs text-slate-400">
                  I tuoi mazzi stampati saranno imballati in confezione anti-urto rigida e spediti con corriere espresso assicurato.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Nome e Cognome / Ragione Sociale</label>
                  <input
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Email per Ricevuta e Tracking</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1">Indirizzo e Numero Civico</label>
                  <input
                    type="text"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Città</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Provincia</label>
                    <input
                      type="text"
                      value={shippingForm.province}
                      onChange={(e) => setShippingForm({ ...shippingForm, province: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">CAP</label>
                    <input
                      type="text"
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Telefono (per il corriere)</label>
                  <input
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Note di Consegna (opzionale)</label>
                  <input
                    type="text"
                    value={shippingForm.notes}
                    onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep('config')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Torna alle Finiture</span>
                </button>

                <button
                  onClick={() => setStep('proof')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-md"
                >
                  <span>Procedi a Verifica Bozza</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'proof' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verifica Digitale Visto Si Stampi (Digital Press Proof)</span>
                </h3>

                <p className="text-xs text-slate-300">
                  Prima dell'avvio della produzione tipografica laser/offset, controlla il riepilogo delle specifiche scelte per il tuo mazzo:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Titolo Mazzo:</span>
                    <strong className="text-white">{deck.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Formato & Dimensioni:</span>
                    <strong className="text-white">{cardFormat.name} ({cardFormat.widthMm}x{cardFormat.heightMm}mm)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Finitura Superficie:</span>
                    <strong className="text-amber-400 capitalize">{finish}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fustellatura Angoli:</span>
                    <strong className="text-amber-400 capitalize">
                      {cornerStyle === 'rounded' ? 'Tondi (3.5mm)' : 'Squadrati (90°)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cartoncino Selezionato:</span>
                    <strong className="text-white">
                      {paperStock === '310_black_core' ? '310 gsm German Black Core' : '350 gsm Premium White Core'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quantità Ordinata:</span>
                    <strong className="text-emerald-400">{deckQuantity} {deckQuantity === 1 ? 'Mazzo' : 'Mazzi'}</strong>
                  </div>
                </div>

                {preflightIssues.length > 0 && (
                  <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>{preflightIssues.length} Avvisi di Prestampa Rilevati</span>
                    </div>
                    <p className="text-[11px] text-amber-200/80">
                      Alcuni elementi testuali sono vicini all'area di sicurezza. Se hai verificato che la grafica è intenzionale, puoi procedere con l'approvazione.
                    </p>
                  </div>
                )}

                <label className="flex items-start gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-700/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proofApproved}
                    onChange={(e) => setProofApproved(e.target.checked)}
                    className="accent-emerald-500 rounded mt-0.5 cursor-pointer"
                  />
                  <div className="text-xs text-slate-200">
                    <strong className="text-white block mb-0.5">Approvazione Visto Si Stampi</strong>
                    <span>
                      Dichiaro di aver verificato i testi, la risoluzione e le finiture del mazzo <strong>{deck.title}</strong> e autorizzo l'avvio della lavorazione in tipografia.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modifica Dati Spedizione</span>
                </button>

                <button
                  onClick={handleConfirmOrder}
                  disabled={!proofApproved}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-xl disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Conferma Ordine e Avvia Stampa (€{quote.total.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="max-w-xl mx-auto text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Ordine Confermato con Successo!
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">
                  Il tuo mazzo è in coda di produzione tipografica
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Codice Ordine: <strong className="text-amber-400 font-mono text-sm">{orderNumber}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-left space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Destinatario:</span>
                  <span className="text-white font-medium">{shippingForm.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Indirizzo:</span>
                  <span className="text-white font-medium">{shippingForm.address}, {shippingForm.city} ({shippingForm.province})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Specifiche Tecniche:</span>
                  <span className="text-amber-400 font-medium">
                    {cornerStyle === 'rounded' ? 'Angoli Tondi' : 'Angoli Squadrati'} • Finitura {finish} • {paperStock}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-slate-400">Totale Pagato:</span>
                  <span className="text-emerald-400 font-bold font-mono text-base">€{quote.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-600/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Riceverai il tracking link via email all'indirizzo <strong>{shippingForm.email}</strong> non appena il corriere ritirerà i mazzi dallo stabilimento.
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-700"
                >
                  Torna all'Editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
