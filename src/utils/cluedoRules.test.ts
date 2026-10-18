import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDeck, generateMysteryCase, getDuplexBackIndex, validateProjectData } from './cluedoRules.ts';
import type { CluedoCard } from '../types/cluedo.ts';

const mockCards: CluedoCard[] = [
  {
    id: 's1',
    name: 'Miss Scarlett',
    category: 'suspect',
    subtitle: 'Rosso rubino',
    description: 'Attrice affascinante',
    color: '#C02026',
    iconType: 'builtin',
    iconName: 'scarlett',
    cardBackStyle: 'classic_hasbro',
  },
  {
    id: 'w1',
    name: 'Candelabro',
    category: 'weapon',
    subtitle: 'Bronzo pesante',
    description: 'Trovato vicino al camino',
    color: '#D49B18',
    iconType: 'builtin',
    iconName: 'candlestick',
    cardBackStyle: 'classic_hasbro',
  },
  {
    id: 'r1',
    name: 'Cucina',
    category: 'room',
    subtitle: 'Piano terra',
    description: 'Piena di utensili affilati',
    color: '#7F4020',
    iconType: 'builtin',
    iconName: 'kitchen',
    cardBackStyle: 'classic_hasbro',
  },
];

test('analyzeDeck recognizes playable minimum deck', () => {
  const stats = analyzeDeck(mockCards);
  assert.equal(stats.suspectsCount, 1);
  assert.equal(stats.weaponsCount, 1);
  assert.equal(stats.roomsCount, 1);
  assert.equal(stats.isPlayable, true);
  assert.equal(stats.isStandardHasbroDeck, false);
  assert.equal(stats.warnings.length, 0);
});

test('analyzeDeck warns on empty categories', () => {
  const stats = analyzeDeck([mockCards[0]]);
  assert.equal(stats.isPlayable, false);
  assert.equal(stats.warnings.length, 2);
});

test('generateMysteryCase creates valid mystery scenario', () => {
  const mystery = generateMysteryCase(mockCards, 'Classica');
  assert.ok(mystery);
  assert.equal(mystery?.suspectId, 's1');
  assert.equal(mystery?.weaponId, 'w1');
  assert.equal(mystery?.roomId, 'r1');
  assert.ok(mystery?.title.length > 5);
  assert.ok(mystery?.detectiveBriefing.includes('Miss Scarlett'));
  assert.ok(mystery?.detectiveBriefing.includes('Candelabro'));
  assert.ok(mystery?.detectiveBriefing.includes('Cucina'));
});

test('getDuplexBackIndex mirrors columns for precision cardstock printing', () => {
  // 3 columns x 3 rows = 9 cards per sheet
  // Row 0: index 0 (col 0) -> mirrored to col 2 (index 2)
  assert.equal(getDuplexBackIndex(0, 3, 3), 2);
  // Row 0: index 1 (col 1) -> mirrored to col 1 (index 1)
  assert.equal(getDuplexBackIndex(1, 3, 3), 1);
  // Row 0: index 2 (col 2) -> mirrored to col 0 (index 0)
  assert.equal(getDuplexBackIndex(2, 3, 3), 0);

  // Row 1: index 3 (col 0) -> mirrored to col 2 (index 5)
  assert.equal(getDuplexBackIndex(3, 3, 3), 5);
  assert.equal(getDuplexBackIndex(5, 3, 3), 3);

  // Page 2: index 9 (row 0, col 0 of page 2) -> mirrored to index 11
  assert.equal(getDuplexBackIndex(9, 3, 3), 11);
});

test('validateProjectData validates format correctly', () => {
  const valid = {
    id: 'p1',
    name: 'Villa Tudor',
    cards: mockCards,
  };
  assert.equal(validateProjectData(valid), true);

  const invalid = {
    id: 'p1',
    name: 123,
    cards: 'not-an-array',
  };
  assert.equal(validateProjectData(invalid), false);
});
