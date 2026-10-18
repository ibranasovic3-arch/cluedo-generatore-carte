export type CardCategory = 'suspect' | 'weapon' | 'room' | 'clue';

export type CardTheme = 'classic_hasbro' | 'victorian_noir' | 'modern_deluxe' | 'vintage_1949';

export type CardSize = 'bridge' | 'poker' | 'hasbro_classic';

export interface CluedoCard {
  id: string;
  name: string;
  category: CardCategory;
  subtitle: string;
  description: string;
  color: string;
  secondaryColor?: string;
  iconType: 'builtin' | 'custom_image' | 'preset_svg';
  iconName: string;
  customImageData?: string;
  cardBackStyle: 'classic_hasbro' | 'vintage_magnifying' | 'mansion_crest' | 'noir_gold';
  badgeText?: string;
  cardIdCode?: string;
  isCustom?: boolean;
}

export interface MysteryCase {
  id: string;
  title: string;
  suspectId: string;
  weaponId: string;
  roomId: string;
  motive: string;
  detectiveBriefing: string;
  difficulty: 'Facile' | 'Classica' | 'Esperto';
  clues: string[];
  createdAt: number;
}

export interface PrintSettings {
  paperSize: 'a4' | 'letter';
  cardSize: CardSize;
  bleedMm: number;
  showCropMarks: boolean;
  duplexMode: 'front_and_back_pages' | 'front_only' | 'back_only' | 'side_by_side';
  cardsPerPage: number;
  showCornerGuides: boolean;
  goldFoilEffect: boolean;
  showCardIdCode: boolean;
}

export interface CluedoProject {
  id: string;
  name: string;
  description: string;
  theme: CardTheme;
  cardSize: CardSize;
  language: 'it' | 'en';
  cards: CluedoCard[];
  activeCase?: MysteryCase;
  savedCases?: MysteryCase[];
  printSettings: PrintSettings;
  createdAt: number;
  updatedAt: number;
}

export interface CardDimensions {
  widthMm: number;
  heightMm: number;
  aspectRatio: number;
  label: string;
}

export const CARD_DIMENSIONS: Record<CardSize, CardDimensions> = {
  bridge: {
    widthMm: 56,
    heightMm: 87,
    aspectRatio: 56 / 87,
    label: 'Standard Bridge / Euro (56 × 87 mm)',
  },
  hasbro_classic: {
    widthMm: 58,
    heightMm: 89,
    aspectRatio: 58 / 89,
    label: 'Originale Hasbro Cluedo (58 × 89 mm)',
  },
  poker: {
    widthMm: 63.5,
    heightMm: 88.9,
    aspectRatio: 63.5 / 88.9,
    label: 'Standard Poker Card (63.5 × 88.9 mm)',
  },
};
