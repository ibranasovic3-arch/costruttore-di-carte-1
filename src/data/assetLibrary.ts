export type IconCategory = 'boardgames' | 'suits' | 'combat' | 'fantasy' | 'stats' | 'elements' | 'scifi';

export interface AssetIcon {
  id: string;
  name: string;
  category: IconCategory;
  tags?: string[];
  svgPath: string;
}

export const ICON_CATEGORIES: { id: 'all' | IconCategory; label: string; count?: number }[] = [
  { id: 'all', label: 'Tutte le Icone' },
  { id: 'boardgames', label: '🎲 Giochi da Tavolo' },
  { id: 'suits', label: '♠️ Semi & Casinò' },
  { id: 'combat', label: '⚔️ Combattimento & Armi' },
  { id: 'fantasy', label: '🔮 Fantasy & Magia' },
  { id: 'stats', label: '🛡️ Stats & RPG' },
  { id: 'elements', label: '🔥 Elementi Naturali' },
  { id: 'scifi', label: '⚡ Sci-Fi & Cyber' },
];

export const GAME_ICONS: AssetIcon[] = [
  // GIOCHI DA TAVOLO (MONOPOLY, CLUEDO, UNO, ECC.)
  {
    id: 'bg_monopoly_house',
    name: 'Casa Monopoly',
    category: 'boardgames',
    tags: ['monopoly', 'casa', 'proprietà', 'costruzione', 'verde'],
    svgPath: 'M12 3L2 12h3v8h14v-8h3L12 3zm1 15h-2v-4h2v4zm4 0h-2v-4h2v4z',
  },
  {
    id: 'bg_monopoly_hotel',
    name: 'Albergo Monopoly',
    category: 'boardgames',
    tags: ['monopoly', 'albergo', 'hotel', 'rosso', 'rendita', 'grattacielo'],
    svgPath: 'M4 4h16v16H4V4zm3 3v3h3V7H7zm7 0v3h3V7h-3zm-7 5v3h3v-3H7zm7 0v3h3v-3h-3zm-4 5v3h2v-3h-2z',
  },
  {
    id: 'bg_monopoly_money',
    name: 'Banconota Monopoly',
    category: 'boardgames',
    tags: ['monopoly', 'soldi', 'denaro', 'banconota', 'dollaro', 'valuta'],
    svgPath: 'M3 6v12h18V6H3zm16 10H5V8h14v8zm-7-1c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z',
  },
  {
    id: 'bg_chance_question',
    name: 'Punto Interrogativo Imprevisti',
    category: 'boardgames',
    tags: ['monopoly', 'imprevisti', 'chance', 'domanda', 'arancione'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 12.9 12 13.5 12 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z',
  },
  {
    id: 'bg_chest_treasure',
    name: 'Forziere Probabilità',
    category: 'boardgames',
    tags: ['monopoly', 'probabilità', 'community chest', 'tesoro', 'baule', 'oro'],
    svgPath: 'M5 4h14a2 2 0 0 1 2 2v3H3V6a2 2 0 0 1 2-2zm-2 7h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7zm8 2v2h2v-2h-2z',
  },
  {
    id: 'bg_railroad_train',
    name: 'Locomotiva Stazione',
    category: 'boardgames',
    tags: ['monopoly', 'stazione', 'treno', 'ferrovia', 'locomotiva', 'viaggio'],
    svgPath: 'M12 2c-4 0-8 .5-8 4v10c0 2 2 3.5 4 3.5l-1.5 1.5v1h11v-1L16 19.5c2 0 4-1.5 4-3.5V6c0-3.5-4-4-8-4zm-4 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm2-7H6V6h12v3z',
  },
  {
    id: 'bg_waterworks_faucet',
    name: 'Rubinetto Acqua Potabile',
    category: 'boardgames',
    tags: ['monopoly', 'acqua', 'rubinetto', 'società', 'servizio', 'idraulica'],
    svgPath: 'M12 2a4 4 0 0 0-4 4c0 1.6.9 2.9 2.2 3.6L10 11H6v2h2v3a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-3h2v-2h-4l-.2-1.4c1.3-.7 2.2-2 2.2-3.6a4 4 0 0 0-4-4zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 12c-1.1 0-2-.9-2-2v-3h4v3c0 1.1-.9 2-2 2z',
  },
  {
    id: 'bg_lightbulb',
    name: 'Lampadina Società Elettrica',
    category: 'boardgames',
    tags: ['monopoly', 'luce', 'lampadina', 'elettricità', 'energia', 'società'],
    svgPath: 'M12 2a7 7 0 0 0-7 7c0 2.5 1.4 4.8 3.5 6v2a1.5 1.5 0 0 0 1.5 1.5h4A1.5 1.5 0 0 0 15.5 17v-2c2.1-1.2 3.5-3.5 3.5-6a7 7 0 0 0-7-7zm-2 19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h-4v1zm-1-3h6v-1.5H9V18zm6-3.2l-.5.3-.5.5v.4h-4v-.4l-.5-.5-.5-.3C7.4 13.8 6.5 12 6.5 9a5.5 5.5 0 1 1 11 0c0 3-.9 4.8-2.5 5.8z',
  },
  {
    id: 'bg_jail_bars',
    name: 'Sbarre Prigione Monopoly',
    category: 'boardgames',
    tags: ['monopoly', 'prigione', 'sbarre', 'cella', 'arresto', 'giustizia'],
    svgPath: 'M3 3v18h2V3H3zm4 0v18h2V3H7zm4 0v18h2V3h-2zm4 0v18h2V3h-2zm4 0v18h2V3h-2zM2 7h20v2H2V7zm0 8h20v2H2v-2z',
  },
  {
    id: 'bg_clue_magnifier',
    name: 'Lente Investigatore Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'indagine', 'lente', 'detective', 'mistero', 'indizio'],
    svgPath: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  },
  {
    id: 'bg_clue_candlestick',
    name: 'Candeliere Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'candeliere', 'arma', 'delitto', 'candela', 'ottone'],
    svgPath: 'M12 2c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1V3c0-.6-.4-1-1-1zm-6 6c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1V9c0-.6-.4-1-1-1zm12 0c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1V9c0-.6-.4-1-1-1zm-6 2h2v4c2.5 0 4.5-2 4.5-4.5h2c0 3.3-2.5 6-5.8 6.5v4H15v2H9v-2h1.3v-4c-3.3-.5-5.8-3.2-5.8-6.5h2C6.5 10 8.5 12 11 12v-2z',
  },
  {
    id: 'bg_clue_revolver',
    name: 'Rivoltella Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'rivoltella', 'pistola', 'arma', 'sparo', 'proiettile'],
    svgPath: 'M2 9v4h6l2 2h4v-2h5l3-3V7l-4-1H8L6 9H2zm10 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-2 5l-2 5h-3l2-5h3z',
  },
  {
    id: 'bg_clue_rope',
    name: 'Corda Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'corda', 'cappio', 'nodo', 'arma', 'canapa'],
    svgPath: 'M12 2C9.2 2 7 4.2 7 7c0 2 1.2 3.8 3 4.6V14h4v-2.4c1.8-.8 3-2.6 3-4.6 0-2.8-2.2-5-5-5zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-2 8h4v2h-4v-2zm-1 3h6v3h-6v-3z',
  },
  {
    id: 'bg_clue_pipe',
    name: 'Tubo di Piombo Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'tubo', 'piombo', 'arma', 'delitto', 'metallo'],
    svgPath: 'M4 4l3-3 14 14-3 3L4 4zm2 1l12 12 1-1L7 4 6 5zm11-3l4 4-1.5 1.5-4-4L17 2zM3 16l4 4-1.5 1.5-4-4L3 16z',
  },
  {
    id: 'bg_clue_wrench',
    name: 'Chiave Inglese Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'chiave', 'inglese', 'meccanica', 'arma', 'officina'],
    svgPath: 'M21.7 4.3a4.5 4.5 0 0 0-6.1.4l-1.8 1.8 3.5 3.5 1.8-1.8c.8.2 1.7 0 2.4-.7 1.8-1.8 1.8-4.6.2-6.2l-3 3-1.4-1.4 3-3c-.5-.4-1.1-.6-1.8-.6L7.1 11.7l5.2 5.2 7.4-7.4c1.6 1.6 1.6 4.3 0 5.9-1.2 1.2-3 1.5-4.5.9L5.3 22l-3.3-3.3 5.7-5.7c-.6-1.5-.3-3.3.9-4.5 1.6-1.6 4.3-1.6 5.9 0l7.2-4.2z',
  },
  {
    id: 'bg_clue_mansion',
    name: 'Tenuta Tudor Cluedo',
    category: 'boardgames',
    tags: ['cluedo', 'villa', 'tenuta', 'tudor', 'castello', 'palazzo', 'delitto'],
    svgPath: 'M12 2L2 9h3v12h14V9h3L12 2zm-4 7h2v3H8V9zm0 5h2v3H8v-3zm6-5h2v3h-2V9zm0 5h2v3h-2v-3zm-3-3h2v7h-2v-7z',
  },
  {
    id: 'bg_uno_reverse',
    name: 'Inverti Giro UNO',
    category: 'boardgames',
    tags: ['uno', 'inverti', 'reverse', 'frecce', 'giro', 'senso'],
    svgPath: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
  },
  {
    id: 'bg_uno_skip',
    name: 'Salta Turno UNO',
    category: 'boardgames',
    tags: ['uno', 'salta', 'skip', 'divieto', 'stop', 'blocco'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z',
  },
  {
    id: 'bg_uno_draw4',
    name: 'Jolly Pesca 4 UNO',
    category: 'boardgames',
    tags: ['uno', 'pesca 4', 'wild', '+4', 'jolly', 'colori', 'speciale'],
    svgPath: 'M4 4h7v10H4V4zm9 3h7v10h-7V7zm-6 6h7v7H7v-7zm10-5h2v4h-2V8zm-1 2h4v-2h-4v2z',
  },
  {
    id: 'bg_dice',
    name: 'Dado a 6 Facce',
    category: 'boardgames',
    tags: ['dado', 'dadi', 'tiro', 'punteggio', 'fortuna', 'tavolo', 'board game'],
    svgPath: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  },
  {
    id: 'bg_pawn',
    name: 'Pedina da Gioco (Meeple)',
    category: 'boardgames',
    tags: ['pedina', 'meeple', 'segnalino', 'giocatore', 'turno', 'posizione'],
    svgPath: 'M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L6 11l2 2 2-1v8h4v-8l2 1 2-2-3.8-3.9c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3z',
  },
  // SEMI & CASINÒ
  {
    id: 'suit_heart',
    name: 'Cuori',
    category: 'suits',
    tags: ['cuore', 'seme', 'rosso', 'amore', 'vita'],
    svgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
  {
    id: 'suit_spade',
    name: 'Picche',
    category: 'suits',
    tags: ['picche', 'seme', 'nero', 'asso', 'arma'],
    svgPath: 'M12 2C9.5 6 4 10 4 14a5 5 0 0 0 9 3v3h-2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3a5 5 0 0 0 9-3c0-4-5.5-8-8-12z',
  },
  {
    id: 'suit_diamond',
    name: 'Quadri',
    category: 'suits',
    tags: ['quadri', 'diamante', 'gemma', 'rosso', 'seme'],
    svgPath: 'M12 2L3 12l9 10 9-10-9-10z',
  },
  {
    id: 'suit_club',
    name: 'Fiori',
    category: 'suits',
    tags: ['fiori', 'trifoglio', 'seme', 'nero', 'fortuna'],
    svgPath: 'M12 2a4 4 0 0 0-3.8 2.7 4 4 0 0 0-4.2 4.3 4 4 0 0 0 5 3.9A4.5 4.5 0 0 0 11 17v3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3a4.5 4.5 0 0 0 2-4.1 4 4 0 0 0 5-3.9 4 4 0 0 0-4.2-4.3A4 4 0 0 0 12 2z',
  },
  {
    id: 'casino_joker',
    name: 'Jolly / Giullare',
    category: 'suits',
    tags: ['jolly', 'joker', 'buffone', 'folle', 'wild'],
    svgPath: 'M12 2a3 3 0 0 0-3 3c0 .35.06.69.17 1H6a3 3 0 0 0-3 3c0 .87.37 1.66.97 2.21A3 3 0 0 0 3 13a3 3 0 0 0 3 3h.17c-.11.31-.17.65-.17 1a3 3 0 0 0 6 0c0-.35-.06-.69-.17-1H18a3 3 0 0 0 3-3c0-.87-.37-1.66-.97-2.21A3 3 0 0 0 21 9a3 3 0 0 0-3-3h-3.17c.11-.31.17-.65.17-1a3 3 0 0 0-3-3zm0 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
  {
    id: 'casino_chip',
    name: 'Fiches Casinò',
    category: 'suits',
    tags: ['fiches', 'chip', 'poker', 'puntata', 'soldi'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  },
  {
    id: 'casino_card',
    name: 'Carta Asso',
    category: 'suits',
    tags: ['asso', 'mazzo', 'blackjack', 'carta', 'gioco'],
    svgPath: 'M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zm8 4l2 3h-4l2-3zm0 5l-2.5 3.5h5L12 13z',
  },

  // COMBATTIMENTO & ARMI
  {
    id: 'stat_sword',
    name: 'Spada da Cavaliere',
    category: 'combat',
    tags: ['spada', 'attacco', 'lama', 'cavaliere', 'combattimento'],
    svgPath: 'M19.7 4.3c-.4-.4-1-.4-1.4 0L13.5 9.1l-1.4-1.4 1.4-1.4-1.4-1.4-4.2 4.2 1.4 1.4 1.4-1.4 1.4 1.4-6.4 6.4c-.4.4-.4 1 0 1.4l2.8 2.8c.4.4 1 .4 1.4 0l6.4-6.4 1.4 1.4-1.4 1.4 1.4 1.4 4.2-4.2-1.4-1.4-1.4 1.4-1.4-1.4 4.8-4.8c.4-.4.4-1 0-1.4l-2.8-2.8z',
  },
  {
    id: 'stat_dual_swords',
    name: 'Spade Incrociate',
    category: 'combat',
    tags: ['spade', 'duello', 'battaglia', 'scontro', 'guerra'],
    svgPath: 'M19.7 4.3c-.4-.4-1-.4-1.4 0L12 10.6 5.7 4.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L10.6 12l-6.3 6.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l6.3-6.3 6.3 6.3c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L13.4 12l6.3-6.3c.4-.4.4-1 0-1.4z',
  },
  {
    id: 'stat_shield',
    name: 'Scudo Araldico',
    category: 'combat',
    tags: ['scudo', 'difesa', 'armatura', 'protezione', 'parata'],
    svgPath: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z',
  },
  {
    id: 'stat_bow',
    name: 'Arco e Freccia',
    category: 'combat',
    tags: ['arco', 'freccia', 'caccia', 'cecchino', 'tiro'],
    svgPath: 'M3.5 3.5c-.8.8-.8 2.1 0 2.8L6.8 9.6C5.1 11.8 4 14.5 4 17.5c0 1.4.3 2.7.8 3.9l2.4-2.4C7 18.3 7 17.9 7 17.5c0-2.5 1-4.7 2.6-6.4l2.1 2.1c-.8.8-1.3 1.9-1.3 3.1 0 2.4 1.9 4.3 4.3 4.3 1.2 0 2.3-.5 3.1-1.3l2.8 2.8c.8.8 2.1.8 2.8 0 .8-.8.8-2.1 0-2.8l-19.9-19.8zm11.7 5.7l-4.2 4.2c.4-.6 1-.9 1.8-.9 1.3 0 2.4 1.1 2.4 2.4 0 .8-.3 1.4-.9 1.8l4.2-4.2-3.3-3.3z',
  },
  {
    id: 'stat_axe',
    name: 'Ascia da Battaglia',
    category: 'combat',
    tags: ['ascia', 'barbaro', 'guerriero', 'spacco', 'fendente'],
    svgPath: 'M12 2l1.5 3h5.5l-3 4 3 4h-5.5L12 16v6h-2v-6l-1.5-3H3l3-4-3-4h5.5L10 2h2z',
  },
  {
    id: 'stat_dagger',
    name: 'Pugnale Furtivo',
    category: 'combat',
    tags: ['pugnale', 'daga', 'ladro', 'furtivo', 'critico'],
    svgPath: 'M18.3 3.3c-.4-.4-1-.4-1.4 0L10.6 9.6l-2-2-1.4 1.4 2 2-6.5 6.5c-.4.4-.4 1 0 1.4l1.5 1.5c.4.4 1 .4 1.4 0l6.5-6.5 2 2 1.4-1.4-2-2 6.3-6.3c.4-.4.4-1 0-1.4l-1.5-1.5z',
  },
  {
    id: 'stat_helmet',
    name: 'Elmo da Guerriero',
    category: 'combat',
    tags: ['elmo', 'armatura', 'gladiatore', 'protezione', 'testa'],
    svgPath: 'M12 2C6.5 2 2 6.5 2 12v3c0 2.2 1.8 4 4 4h1v3h10v-3h1c2.2 0 4-1.8 4-4v-3c0-5.5-4.5-10-10-10zm-6 9h12v3H6v-3zm6-7c3.9 0 7.1 2.8 7.8 6.5H4.2C4.9 6.8 8.1 4 12 4z',
  },
  {
    id: 'stat_target',
    name: 'Mirino / Bersaglio',
    category: 'combat',
    tags: ['mirino', 'bersaglio', 'precisione', 'focus', 'cecchino'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  },
  {
    id: 'stat_fist',
    name: 'Pugno / Forza',
    category: 'combat',
    tags: ['pugno', 'forza', 'corpo a corpo', 'potenza', 'combattimento'],
    svgPath: 'M17 5c-.7 0-1.3.4-1.7 1-.3-.6-.9-1-1.6-1-.5 0-1 .2-1.3.6C12 5.2 11.5 5 11 5c-1.1 0-2 .9-2 2v4.8L8.1 11c-.4-.4-1-.6-1.6-.6-.6 0-1.2.2-1.6.7-.8.8-.8 2.2 0 3l5.5 5.5c1 .9 2.2 1.4 3.6 1.4h4c2.8 0 5-2.2 5-5V10c0-1.1-.9-2-2-2-.3 0-.6.1-.9.2C19.7 7.4 19 6.7 18.2 6.3 17.9 5.5 17.5 5 17 5z',
  },

  // FANTASY & MAGIA
  {
    id: 'game_crown',
    name: 'Corona Reale',
    category: 'fantasy',
    tags: ['corona', 're', 'regina', 'monarca', 'vittoria'],
    svgPath: 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z',
  },
  {
    id: 'game_potion',
    name: 'Ampolla Pozione',
    category: 'fantasy',
    tags: ['pozione', 'cura', 'alchimia', 'veleno', 'elisir'],
    svgPath: 'M9 2h6v2h-1v2.17l4.7 9.4c.85 1.7.35 3.77-1.15 4.93C16.5 21.31 15.28 22 14 22H10c-1.28 0-2.5-.69-3.55-1.5-1.5-1.16-2-3.23-1.15-4.93L10 6.17V4H9V2z',
  },
  {
    id: 'game_scroll',
    name: 'Pergamena Arcana',
    category: 'fantasy',
    tags: ['pergamena', 'incantesimo', 'mistero', 'papiro', 'sapere'],
    svgPath: 'M19 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 14H7a2 2 0 0 1 0-4h10v4zm0-6H7c-.35 0-.69.04-1 .1V7a2 2 0 0 1 2-2h9v6z',
  },
  {
    id: 'game_spellbook',
    name: 'Grimorio / Libro Magico',
    category: 'fantasy',
    tags: ['libro', 'grimorio', 'mago', 'incantesimi', 'stregone'],
    svgPath: 'M19 2H6c-1.7 0-3 1.3-3 3v14c0 1.7 1.3 3 3 3h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 16H6c-.6 0-1-.4-1-1s.4-1 1-1h12v2zm0-4H6c-1.1 0-2 .4-2.6 1-.3-.3-.4-.6-.4-1V5c0-.6.4-1 1-1h13v10zM12 7l1.5 2.5L16 10l-2 2 .5 2.5L12 13.2l-2.5 1.3.5-2.5-2-2 2.5-.5z',
  },
  {
    id: 'game_wand',
    name: 'Bacchetta Magica',
    category: 'fantasy',
    tags: ['bacchetta', 'magia', 'stelle', 'fatato', 'incanto'],
    svgPath: 'M17.5 2l1.4 1.4-9.3 9.3 1.4 1.4 9.3-9.3L21.7 6.2 13.9 14l-1.4-1.4 1.4-1.4-9.3 9.3c-.4.4-1 .4-1.4 0l-1.5-1.5c-.4-.4-.4-1 0-1.4L11 8.3 9.6 6.9 11 5.5 17.5 2zm-5.5 2l.7.7-1.4 1.4-.7-.7L12 4z',
  },
  {
    id: 'game_crystal',
    name: 'Gemma / Cristallo',
    category: 'fantasy',
    tags: ['cristallo', 'gemma', 'diamante', 'rubino', 'potere'],
    svgPath: 'M12 2L4 8l3 12h10l3-12-8-6zm-1.5 3h3l4 3.5-2 9h-5l-2-9 2-3.5z',
  },
  {
    id: 'game_dragon',
    name: 'Drago Mitologico',
    category: 'fantasy',
    tags: ['drago', 'mostro', 'boss', 'ali', 'bestia'],
    svgPath: 'M12 2C8 2 4 5 4 10c0 3 1.5 5.5 4 7l-2 4h12l-2-4c2.5-1.5 4-4 4-7 0-5-4-8-8-8zm-3 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3 7c-1.7 0-3-.7-3-2h6c0 1.3-1.3 2-3 2z',
  },
  {
    id: 'game_skull',
    name: 'Teschio / Necromanzia',
    category: 'fantasy',
    tags: ['teschio', 'morte', 'scheletro', 'veleno', 'pericolo'],
    svgPath: 'M12 2a9 9 0 0 0-9 9c0 3.87 2.44 7.17 5.9 8.48V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.52c3.46-1.31 5.9-4.61 5.9-8.48a9 9 0 0 0-9-9zm-3 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4.5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z',
  },
  {
    id: 'game_cauldron',
    name: 'Calderone Alchemico',
    category: 'fantasy',
    tags: ['calderone', 'strega', 'mistura', 'pozione', 'rito'],
    svgPath: 'M19 8h-1V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v1c0 4.4 3.6 8 8 8v3H8v2h8v-2h-3v-3c4.4 0 8-3.6 8-8v-1c0-1.1-.9-2-2-2zM8 6h8v2H8V6zm11 5c0 3.3-2.7 6-6 6s-6-2.7-6-6v-1h12v1z',
  },
  {
    id: 'game_ring',
    name: 'Anello del Potere',
    category: 'fantasy',
    tags: ['anello', 'gioiello', 'reliquia', 'prezioso', 'fede'],
    svgPath: 'M12 2c-4.4 0-8 3.6-8 8 0 3.6 2.4 6.6 5.7 7.6L9 21h6l-.7-3.4c3.3-1 5.7-4 5.7-7.6 0-4.4-3.6-8-8-8zm0 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z',
  },
  {
    id: 'game_key',
    name: 'Chiave del Dungeon',
    category: 'fantasy',
    tags: ['chiave', 'tesoro', 'porta', 'sotterraneo', 'segreto'],
    svgPath: 'M7 2a5 5 0 0 0-5 5c0 2.4 1.7 4.4 4 4.9V20a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 1-1v-2h-2v-2.1c2.3-.5 4-2.5 4-4.9a5 5 0 0 0-5-5zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },

  // STATS & RPG
  {
    id: 'stat_heart_hp',
    name: 'Punti Vita / Cuore HP',
    category: 'stats',
    tags: ['salute', 'vita', 'hp', 'cuore', 'vitalita'],
    svgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
  {
    id: 'stat_mana_drop',
    name: 'Mana / Energia Magica',
    category: 'stats',
    tags: ['mana', 'mp', 'goccia', 'energia', 'incanto'],
    svgPath: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  },
  {
    id: 'stat_lightning',
    name: 'Velocità / Iniziativa',
    category: 'stats',
    tags: ['velocita', 'fulmine', 'lampo', 'iniziativa', 'elettricita'],
    svgPath: 'M7 2v11h3v9l7-12h-4l4-8z',
  },
  {
    id: 'stat_star',
    name: 'Rarità / Stella Livello',
    category: 'stats',
    tags: ['stella', 'rarita', 'livello', 'punteggio', 'leggendario'],
    svgPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    id: 'game_dice',
    name: 'Dado D20 Ruolo',
    category: 'stats',
    tags: ['dado', 'd20', 'fortuna', 'tiro', 'rpg'],
    svgPath: 'M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.24L5.3 7.82l6.7 3.72 6.7-3.72L12 4.24zM4 9.46v5.88l6 3.33v-5.88L4 9.46zm16 0l-6 3.33v5.88l6-3.33V9.46z',
  },
  {
    id: 'stat_coin',
    name: 'Moneta / Oro',
    category: 'stats',
    tags: ['moneta', 'oro', 'dollaro', 'prezzo', 'costo'],
    svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v2h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v2h-4v2h2v2h2v-2h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-2h4V7z',
  },
  {
    id: 'stat_hourglass',
    name: 'Clessidra / Tempo',
    category: 'stats',
    tags: ['tempo', 'clessidra', 'turno', 'ricarica', 'durata'],
    svgPath: 'M6 2v6l4 4-4 4v6h12v-6l-4-4 4-4V2H6zm10 14.5V20H8v-3.5l4-4 4 4zM12 11.5l-4-4V4h8v3.5l-4 4z',
  },
  {
    id: 'stat_feather',
    name: 'Piuma / Agilità',
    category: 'stats',
    tags: ['piuma', 'leggerezza', 'agilita', 'schivata', 'vento'],
    svgPath: 'M21.2 2.8c-2.8 0-6.4 1.2-9.7 3.5L8.7 9.1l3.5 3.5 2.8-2.8c2.3-3.3 3.5-6.9 3.5-9.7l2.7 2.7zM7.3 10.5L3.8 14c-.8.8-.8 2 0 2.8l3.4 3.4c.8.8 2 .8 2.8 0l3.5-3.5-6.2-6.2zM2 22l4-2-2-2-2 4z',
  },
  {
    id: 'stat_eye',
    name: 'Occhio / Percezione',
    category: 'stats',
    tags: ['occhio', 'visione', 'percezione', 'veggenza', 'chiarezza'],
    svgPath: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z',
  },

  // ELEMENTI NATURALI
  {
    id: 'elem_flame',
    name: 'Elemento Fuoco',
    category: 'elements',
    tags: ['fuoco', 'fiamma', 'calore', 'ardore', 'rosso'],
    svgPath: 'M12 2.5C9.5 5.5 8 8.5 8 11.5c0 1.2.3 2.3.8 3.3.4-1.3 1.2-2.3 2.2-3.1.5 2 2 3.8 4 4.5-.4-1.2-.4-2.5.2-3.7 1.8 1.8 2.8 4.2 2.8 6.5 0 4.4-3.6 8-8 8S2 19.4 2 15c0-4.5 3.5-8.8 7-11.5 1.5 2 3 3 3 4z',
  },
  {
    id: 'elem_water',
    name: 'Elemento Acqua',
    category: 'elements',
    tags: ['acqua', 'onda', 'flusso', 'blu', 'liquido'],
    svgPath: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  },
  {
    id: 'elem_leaf',
    name: 'Elemento Natura / Foglia',
    category: 'elements',
    tags: ['foglia', 'natura', 'terra', 'verde', 'bosco'],
    svgPath: 'M17 2C10 2 4 8 4 15c0 2.2.6 4.3 1.6 6.1L4 22.8l1.7-1.6C7.5 22.3 9.7 23 12 23c7 0 13-6 13-13 0-4.4-3.6-8-8-8zm-5 18c-1.9 0-3.6-.6-5.1-1.6l6.8-6.8c.4-.4.4-1 0-1.4s-1-.4-1.4 0L5.5 17c-1-1.5-1.5-3.2-1.5-5 0-5.5 4.5-10 10-10 3.3 0 6 2.7 6 6 0 5.5-4.5 12-8 12z',
  },
  {
    id: 'elem_wind',
    name: 'Elemento Vento',
    category: 'elements',
    tags: ['vento', 'aria', 'turbine', 'soffio', 'bufera'],
    svgPath: 'M4 8h10a3 3 0 1 0-3-3h2a1 1 0 1 1 1 1H4v2zm12 4H2v2h14a2 2 0 1 1-2 2h-2a4 4 0 1 0 4-4zM4 18h8a2 2 0 1 0-2-2h-2a4 4 0 1 1 4 4H4v-2z',
  },
  {
    id: 'elem_sun',
    name: 'Sole Radioso',
    category: 'elements',
    tags: ['sole', 'luce', 'sacro', 'giorno', 'splendore'],
    svgPath: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z',
  },
  {
    id: 'elem_moon',
    name: 'Luna / Notte Oscura',
    category: 'elements',
    tags: ['luna', 'notte', 'ombra', 'crepuscolo', 'arcano'],
    svgPath: 'M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.6-11.6A10 10 0 0 1 12.3 2z',
  },
  {
    id: 'elem_snowflake',
    name: 'Gelo / Cristallo di Neve',
    category: 'elements',
    tags: ['ghiaccio', 'gelo', 'neve', 'freddo', 'inverno'],
    svgPath: 'M12 2l1 2v4l3-2 1.5-1.5 1.5 1.5L17 8l4-1 2 1-1 2-4 1 3 3-1 2-3-1v4l2 1 1.5-1.5 1.5 1.5L19 19l1 4-2 1-2-1-1-4-3 3 1 2-2 1-2-3h-4l-2 3-2-1 1-2 3-3-1-4-2 1-2-1 1-4 3-1-1-2 2-1 4 1V9l-3 1-1.5-1.5L8 7l1-2 4 1V4l-1-2h2z',
  },
  {
    id: 'elem_meteor',
    name: 'Meteora / Cometa',
    category: 'elements',
    tags: ['meteora', 'cometa', 'spazio', 'cataclisma', 'astro'],
    svgPath: 'M18.8 2.2L12 9l2 2 6.8-6.8-2-2zM8.5 12.5L2 19l3 3 6.5-6.5-3-3zM12 11l1 1-6 6-1-1 6-6zm3-3l1 1-4 4-1-1 4-4z',
  },

  // SCI-FI & CYBERPUNK
  {
    id: 'sci_gear',
    name: 'Ingranaggio Meccanico',
    category: 'scifi',
    tags: ['ingranaggio', 'steampunk', 'meccanica', 'tecnologia', 'macchina'],
    svgPath: 'M19.4 13c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.4.1-.6l-2-3.5c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1.1-.7-1.8-.9l-.4-2.7c0-.2-.2-.4-.5-.4h-4c-.2 0-.4.2-.5.4l-.4 2.7c-.7.2-1.3.5-1.8.9l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.5c-.1.2-.1.5.1.6l2.1 1.6c0 .3-.1.7-.1 1s0 .7.1 1l-2.1 1.6c-.2.2-.2.4-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.8.9l.4 2.7c0 .2.2.4.5.4h4c.2 0 .4-.2.5-.4l.4-2.7c.7-.2 1.3-.5 1.8-.9l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6L19.4 13zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z',
  },
  {
    id: 'sci_circuit',
    name: 'Circuito / Microchip',
    category: 'scifi',
    tags: ['circuito', 'cyber', 'chip', 'digitale', 'elettronica'],
    svgPath: 'M15 4v3h-2V4h-2v3H9V4H7v5H4v2h3v2H4v2h3v5h2v-3h2v3h2v-3h2v3h2v-5h3v-2h-3v-2h3V9h-3V4h-2zm-1 8h-4v-2h4v2z',
  },
  {
    id: 'sci_atom',
    name: 'Atomo / Reattore',
    category: 'scifi',
    tags: ['atomo', 'scienza', 'nucleare', 'energia', 'fisica'],
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2c3.9 0 7.2 2.7 8.3 6.4-1.7-1.3-4.2-2.1-7-2.3.4-.7.7-1.5.7-2.1 0-.7-.3-1.4-.8-1.7-.4-.2-.8-.3-1.2-.3zm-2 2.3c0 .8.4 1.7.9 2.5-2.8.2-5.3 1-7 2.3C5 5.5 8.1 4 11.5 4c-.9.5-1.5 1.3-1.5 2.3zM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
  {
    id: 'sci_biohazard',
    name: 'Biohazard / Tossico',
    category: 'scifi',
    tags: ['biohazard', 'veleno', 'tossico', 'radiazioni', 'pericolo'],
    svgPath: 'M12 2a4 4 0 0 0-3.8 2.7A4 4 0 0 0 4 9c0 1.9 1.3 3.5 3.1 3.9A6.9 6.9 0 0 0 6 16c0 3.9 3.1 7 7 7s7-3.1 7-7c0-1.1-.3-2.2-1.1-3.1 1.8-.4 3.1-2 3.1-3.9a4 4 0 0 0-4.2-4.3A4 4 0 0 0 12 2zm0 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
  {
    id: 'sci_rocket',
    name: 'Razzo Spaziale',
    category: 'scifi',
    tags: ['razzo', 'spazio', 'lancio', 'astronave', 'futuro'],
    svgPath: 'M12 2.5s-4 4.5-4 10.5c0 3 1.5 5 4 7 2.5-2 4-4 4-7 0-6-4-10.5-4-10.5zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-5 4l-3 4 3 1v-5zm10 0v5l3-1-3-4z',
  },
  {
    id: 'sci_radiation',
    name: 'Radiazioni Ionizzanti',
    category: 'scifi',
    tags: ['radiazione', 'nucleare', 'scoria', 'contaminato', 'avviso'],
    svgPath: 'M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4.5 5.5l-3-3a10 10 0 0 0-2.3 6.5h4.2a6 6 0 0 1 1.1-3.5zm9 0a6 6 0 0 1 1.1 3.5h4.2a10 10 0 0 0-2.3-6.5l-3 3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-3.5 7.5a6 6 0 0 1-3.5-1.1v4.2a10 10 0 0 0 6.5 2.3l-3-5.4zm7 0l-3 5.4a10 10 0 0 0 6.5-2.3v-4.2a6 6 0 0 1-3.5 1.1z',
  },
];

export interface PresetFrame {
  id: string;
  name: string;
  borderWidth: number;
  borderColor: string;
  innerBorderColor?: string;
  accentColor?: string;
  style: 'classic' | 'cyber' | 'vintage' | 'fantasy' | 'minimal';
}

export const PRESET_FRAMES: PresetFrame[] = [
  {
    id: 'classic_gold',
    name: 'Oro Reale Classico',
    borderWidth: 4,
    borderColor: '#d97706',
    innerBorderColor: '#fbbf24',
    accentColor: '#b45309',
    style: 'classic',
  },
  {
    id: 'cyber_cyan',
    name: 'Cyberpunk Neon',
    borderWidth: 3,
    borderColor: '#06b6d4',
    innerBorderColor: '#3b82f6',
    accentColor: '#a855f7',
    style: 'cyber',
  },
  {
    id: 'dark_gothic',
    name: 'Gotico Ossidiana',
    borderWidth: 4,
    borderColor: '#475569',
    innerBorderColor: '#94a3b8',
    accentColor: '#dc2626',
    style: 'vintage',
  },
  {
    id: 'emerald_runic',
    name: 'Smeraldo Runico',
    borderWidth: 4,
    borderColor: '#059669',
    innerBorderColor: '#34d399',
    accentColor: '#10b981',
    style: 'fantasy',
  },
  {
    id: 'clean_modern',
    name: 'Minimal Moderno',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    innerBorderColor: '#cbd5e1',
    style: 'minimal',
  },
];

export const PATTERN_OPTIONS = [
  { id: 'none', name: 'Tinta Unita Liscia' },
  { id: 'linen', name: 'Trama Lino Casinò (Air-Cushion)' },
  { id: 'parchment', name: 'Pergamena Antica / Papiro' },
  { id: 'damask', name: 'Damascato Barocco Reale' },
  { id: 'diamonds', name: 'Dorso Classico Casinò (Diamanti)' },
  { id: 'stars', name: 'Costellazione & Polvere di Stelle' },
  { id: 'hexagons', name: "Nido d'Ape Esagonale Game" },
  { id: 'carbon', name: 'Fibra di Carbonio Hi-Tech' },
  { id: 'wood', name: 'Venature di Legno Fantasy' },
  { id: 'marble', name: 'Marmo Imperiale Patinato' },
  { id: 'holographic', name: 'Lamina Olografica Prismatic' },
  { id: 'circuit', name: 'Microchip & Circuiti Cyber' },
  { id: 'dots', name: 'Halftone Pop-Art & Fumetto' },
  { id: 'runic', name: 'Nodi Celtici & Cerchi Runici' },
  { id: 'sunburst', name: 'Raggi Sunburst Vintage' },
];

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'casino',
    name: 'Gran Casinò Royale',
    colors: ['#7f1d1d', '#991b1b', '#b91c1c', '#d97706', '#fbbf24', '#fef08a', '#fffdfa', '#18181b'],
  },
  {
    id: 'fantasy',
    name: 'Fiamma del Drago',
    colors: ['#450a0a', '#7f1d1d', '#ea580c', '#f59e0b', '#fbbf24', '#27272a', '#18181b', '#fef2f2'],
  },
  {
    id: 'arcane',
    name: 'Arcano Notturno',
    colors: ['#0f172a', '#1e1b4b', '#312e81', '#1e3a8a', '#0284c7', '#38bdf8', '#bae6fd', '#ffffff'],
  },
  {
    id: 'emerald',
    name: 'Smeraldo Imperiale',
    colors: ['#022c22', '#064e3b', '#047857', '#10b981', '#34d399', '#a7f3d0', '#ecfdf5', '#111827'],
  },
  {
    id: 'cyber',
    name: 'Cyberpunk 2099',
    colors: ['#030712', '#18181b', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#f43f5e', '#f0fdf4'],
  },
  {
    id: 'parchment',
    name: 'Antico Papiro & Cuoio',
    colors: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#d97706', '#92400e', '#78350f', '#451a03'],
  },
  {
    id: 'noir',
    name: 'Monochrome Noir & Minimal',
    colors: ['#09090b', '#18181b', '#27272a', '#52525b', '#a1a1aa', '#e4e4e7', '#f4f4f5', '#ffffff'],
  },
  {
    id: 'vampire',
    name: 'Sangue di Vampiro & Ossidiana',
    colors: ['#1c1917', '#292524', '#450a0a', '#7f1d1d', '#991b1b', '#dc2626', '#fca5a5', '#fafaf9'],
  },
  {
    id: 'steampunk',
    name: 'Ottone Steampunk & Rame',
    colors: ['#291807', '#45220a', '#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fef3c7'],
  },
  {
    id: 'manga',
    name: 'Pastello Anime & Shonen',
    colors: ['#1e1b4b', '#4338ca', '#818cf8', '#f472b6', '#fb7185', '#fda4af', '#fef08a', '#ffffff'],
  },
];

export interface GradientPreset {
  id: string;
  name: string;
  type: 'linear' | 'radial';
  angle: number;
  colors: string[];
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'gold_foil',
    name: 'Oro Pregiato Foil',
    type: 'linear',
    angle: 135,
    colors: ['#78350f', '#d97706', '#fbbf24', '#fef08a', '#d97706'],
  },
  {
    id: 'midnight_cosmos',
    name: 'Cosmo Profondo',
    type: 'radial',
    angle: 0,
    colors: ['#1e1b4b', '#090d16'],
  },
  {
    id: 'ruby_passion',
    name: 'Rubino Casinò Royal',
    type: 'linear',
    angle: 180,
    colors: ['#991b1b', '#450a0a', '#1c1917'],
  },
  {
    id: 'hologram_prism',
    name: 'Prisma Olografico',
    type: 'linear',
    angle: 45,
    colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
  },
  {
    id: 'emerald_matrix',
    name: 'Smeraldo Runa Fantasy',
    type: 'linear',
    angle: 135,
    colors: ['#064e3b', '#022c22', '#0f172a'],
  },
  {
    id: 'silver_platinum',
    name: 'Platino / Acciaio Spazzolato',
    type: 'linear',
    angle: 90,
    colors: ['#64748b', '#cbd5e1', '#f8fafc', '#475569'],
  },
  {
    id: 'sunset_neon',
    name: 'Tramonto Synth Neon',
    type: 'linear',
    angle: 135,
    colors: ['#f43f5e', '#a855f7', '#3b82f6', '#06b6d4'],
  },
  {
    id: 'obsidian_shadow',
    name: 'Ossidiana Profonda (Dark)',
    type: 'radial',
    angle: 0,
    colors: ['#27272a', '#09090b'],
  },
  {
    id: 'vintage_sepia',
    name: 'Luce Centrale Antica',
    type: 'radial',
    angle: 0,
    colors: ['#fef3c7', '#d97706', '#451a03'],
  },
];

export const CUSTOM_SIZE_PRESETS = [
  { name: 'Poker Standard B8 (TCG / Collezionabili)', widthMm: 63.5, heightMm: 88.9 },
  { name: 'Bridge Tradizionale / Burraco', widthMm: 57.0, heightMm: 88.9 },
  { name: 'Tarocchi / Grandi Opere', widthMm: 70.0, heightMm: 120.0 },
  { name: 'Tarocchi XL / Divinazione', widthMm: 80.0, heightMm: 140.0 },
  { name: 'Boardgame Euro Standard', widthMm: 59.0, heightMm: 92.0 },
  { name: 'Boardgame USA Standard', widthMm: 56.0, heightMm: 87.0 },
  { name: 'Quadrato Boardgame 70x70', widthMm: 70.0, heightMm: 70.0 },
  { name: 'Tessera Quadrata 80x80', widthMm: 80.0, heightMm: 80.0 },
  { name: 'Token / Plancia 100x100', widthMm: 100.0, heightMm: 100.0 },
  { name: 'Mini Euro / Token Oggetto', widthMm: 44.0, heightMm: 67.0 },
  { name: 'Mini American / Spell Card', widthMm: 41.0, heightMm: 63.0 },
  { name: 'Domino / Tessera Lunga', widthMm: 45.0, heightMm: 90.0 },
  { name: 'Biglietto Visita Game', widthMm: 85.0, heightMm: 55.0 },
  { name: 'Segnalibro Personaggio / Boss', widthMm: 50.0, heightMm: 150.0 },
];

export const FONT_OPTIONS = [
  { id: 'Cinzel', name: 'Cinzel (Fantasy / Imperiale)', family: "'Cinzel', serif" },
  { id: 'Playfair Display', name: 'Playfair (Elegante Poker / Carte da Gioco)', family: "'Playfair Display', serif" },
  { id: 'MedievalSharp', name: 'MedievalSharp (Gotico / RPG)', family: "'MedievalSharp', cursive" },
  { id: 'Orbitron', name: 'Orbitron (Sci-Fi / Mecha / Cyber)', family: "'Orbitron', sans-serif" },
  { id: 'Inter', name: 'Inter (Pulito / Tecnico / Moderno)', family: "'Inter', sans-serif" },
];
