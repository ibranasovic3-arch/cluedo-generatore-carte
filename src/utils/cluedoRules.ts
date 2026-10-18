import type { CluedoCard, CardCategory, MysteryCase, CluedoProject } from '../types/cluedo.ts';

export interface DeckStats {
  suspectsCount: number;
  weaponsCount: number;
  roomsCount: number;
  cluesCount: number;
  totalCards: number;
  isPlayable: boolean;
  isStandardHasbroDeck: boolean;
  warnings: string[];
}

export function analyzeDeck(cards: CluedoCard[]): DeckStats {
  const suspectsCount = cards.filter((c) => c.category === 'suspect').length;
  const weaponsCount = cards.filter((c) => c.category === 'weapon').length;
  const roomsCount = cards.filter((c) => c.category === 'room').length;
  const cluesCount = cards.filter((c) => c.category === 'clue').length;
  const totalCards = cards.length;

  const warnings: string[] = [];

  if (suspectsCount === 0) {
    warnings.push('Manca almeno 1 sospettato per giocare una partita valida.');
  }
  if (weaponsCount === 0) {
    warnings.push('Manca almeno 1 arma per creare il delitto.');
  }
  if (roomsCount === 0) {
    warnings.push('Manca almeno 1 stanza / luogo per definire la scena del crimine.');
  }

  const isPlayable = suspectsCount >= 1 && weaponsCount >= 1 && roomsCount >= 1;
  const isStandardHasbroDeck =
    suspectsCount === 6 && weaponsCount === 6 && roomsCount === 9;

  return {
    suspectsCount,
    weaponsCount,
    roomsCount,
    cluesCount,
    totalCards,
    isPlayable,
    isStandardHasbroDeck,
    warnings,
  };
}

const MOTIVES = [
  'Vendetta per un antico ricatto finanziario legato all\'eredità di Villa Tudor.',
  'Gelosia travolgente scoperta durante la cena di gala nella sala da pranzo.',
  'Tentativo disperato di recuperare un testamento modificato di nascosto.',
  'Rancore per una truffa su investimenti esotici andata in fumo.',
  'Minaccia di rivelare al club degli ufficiali una condotta disonorevole.',
  'Furto di una formula chimica segreta custodita nella cassaforte dello studio.',
  'Disputa violenta su un affare d\'arte antica dal valore inestimabile.',
];

const BRIEFING_TEMPLATES = [
  (s: string, w: string, r: string) =>
    `ATTENZIONE INVESTIGATORI: Ieri sera alle ore 22:45 il padrone di casa è stato trovato privo di vita. Le prime tracce portano dritto a ${s}, sorpreso con ${w} nei pressi di ${r}. Nessun alibi sembra reggere alla lente dell'ispettore.`,
  (s: string, w: string, r: string) =>
    `Mistero fitto a Villa Tudor: un urlo ha squarciato il silenzio. L'arma del delitto risulta essere ${w}. Gli indizi convertono inequivocabilmente verso ${r}, dove ${s} è stato visto dileguarsi nell'ombra.`,
  (s: string, w: string, r: string) =>
    `Rapporto speciale di polizia: Il crimine è avvenuto a porte chiuse in ${r}. La perizia medico-legale conferma colpi sferrati con ${w}. I testimoni indicano che solo ${s} conosceva la combinazione segreta di quella stanza.`,
];

export function generateMysteryCase(
  cards: CluedoCard[],
  difficulty: 'Facile' | 'Classica' | 'Esperto' = 'Classica'
): MysteryCase | null {
  const suspects = cards.filter((c) => c.category === 'suspect');
  const weapons = cards.filter((c) => c.category === 'weapon');
  const rooms = cards.filter((c) => c.category === 'room');

  if (suspects.length === 0 || weapons.length === 0 || rooms.length === 0) {
    return null;
  }

  const pickedSuspect = suspects[Math.floor(Math.random() * suspects.length)];
  const pickedWeapon = weapons[Math.floor(Math.random() * weapons.length)];
  const pickedRoom = rooms[Math.floor(Math.random() * rooms.length)];

  const motive = MOTIVES[Math.floor(Math.random() * MOTIVES.length)];
  const template = BRIEFING_TEMPLATES[Math.floor(Math.random() * BRIEFING_TEMPLATES.length)];
  const briefing = template(pickedSuspect.name, pickedWeapon.name, pickedRoom.name);

  const clues: string[] = [
    `Un frammento o fibra compatibile con gli abiti di ${pickedSuspect.name} è stato rinvenuto sulla scena.`,
    `L'arma (${pickedWeapon.name}) mostra impronte parziali cancellate frettolosamente con un tovagliolo.`,
    `Sul pavimento di ${pickedRoom.name} sono visibili segni di colluttazione e gocce fresche.`,
  ];

  if (difficulty === 'Esperto') {
    clues.push('Un testimone afferma di aver udito un forte tonfo prima del rintocco della mezzanotte.');
  }

  return {
    id: `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `Delitto a Villa Tudor: Il Caso ${pickedSuspect.name.replace(/^(Miss|Colonnello|Dott\.ssa|Sig\.ra|Reverendo|Sig\.|Prof\.|Ispettore)\s*/i, '')}`,
    suspectId: pickedSuspect.id,
    weaponId: pickedWeapon.id,
    roomId: pickedRoom.id,
    motive,
    detectiveBriefing: briefing,
    difficulty,
    clues,
    createdAt: Date.now(),
  };
}

/**
 * Calculates duplex page layout indices for printing double-sided cardstock.
 * For a sheet of columns `cols` and rows `rows`, the back of card at (r, c)
 * must be located at (r, cols - 1 - c) so that flipping the page on the long edge
 * (or standard cardstock duplex printer) aligns perfectly back-to-back.
 */
export function getDuplexBackIndex(
  frontIndex: number,
  cols: number,
  rows: number
): number {
  const cardsPerPage = cols * rows;
  const pageIndex = Math.floor(frontIndex / cardsPerPage);
  const indexInPage = frontIndex % cardsPerPage;

  const row = Math.floor(indexInPage / cols);
  const col = indexInPage % cols;

  const mirroredCol = cols - 1 - col;
  const mirroredIndexInPage = row * cols + mirroredCol;

  return pageIndex * cardsPerPage + mirroredIndexInPage;
}

/**
 * Validates imported project JSON schema.
 */
export function validateProjectData(data: unknown): data is CluedoProject {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  if (typeof p.id !== 'string' || typeof p.name !== 'string') return false;
  if (!Array.isArray(p.cards)) return false;
  return p.cards.every(
    (c) =>
      typeof c === 'object' &&
      c !== null &&
      typeof c.id === 'string' &&
      typeof c.name === 'string' &&
      typeof c.category === 'string'
  );
}
