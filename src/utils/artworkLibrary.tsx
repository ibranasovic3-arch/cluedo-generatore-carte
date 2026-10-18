import React from 'react';

export interface IconOption {
  id: string;
  name: string;
  category: 'suspect' | 'weapon' | 'room' | 'clue' | 'general';
}

export const AVAILABLE_ICONS: IconOption[] = [
  // Sospettati
  { id: 'scarlett', name: 'Miss Scarlett (Profilo elegante)', category: 'suspect' },
  { id: 'mustard', name: 'Col. Mustard (Ufficiale)', category: 'suspect' },
  { id: 'white', name: 'Dott.ssa White (Governante/Cuffia)', category: 'suspect' },
  { id: 'green', name: 'Rev. Green (Gentiluomo/Cappello)', category: 'suspect' },
  { id: 'peacock', name: 'Sig.ra Peacock (Piume/Ventaglio)', category: 'suspect' },
  { id: 'plum', name: 'Prof. Plum (Occhiali da studioso)', category: 'suspect' },
  { id: 'detective', name: 'Investigatore (Impermeabile)', category: 'suspect' },
  { id: 'orchid', name: 'Dott. Orchid (Scienziato botanico)', category: 'suspect' },

  // Armi
  { id: 'candlestick', name: 'Candelabro in Bronzo', category: 'weapon' },
  { id: 'dagger', name: 'Pugnale / Stiletto', category: 'weapon' },
  { id: 'lead_pipe', name: 'Tubo di Piombo', category: 'weapon' },
  { id: 'revolver', name: 'Revolver .38', category: 'weapon' },
  { id: 'rope', name: 'Corda / Cappio', category: 'weapon' },
  { id: 'wrench', name: 'Chiave Inglese', category: 'weapon' },
  { id: 'poison', name: 'Bottiglia di Veleno', category: 'weapon' },
  { id: 'axe', name: 'Ascia da Pompiere', category: 'weapon' },

  // Stanze
  { id: 'kitchen', name: 'Cucina (Coltelli & Pentole)', category: 'room' },
  { id: 'ballroom', name: 'Sala da Ballo (Lampadario)', category: 'room' },
  { id: 'conservatory', name: 'Veranda (Serra di vetro)', category: 'room' },
  { id: 'dining_room', name: 'Sala da Pranzo (Calici)', category: 'room' },
  { id: 'billiard_room', name: 'Sala del Biliardo', category: 'room' },
  { id: 'library', name: 'Biblioteca (Libri & Mappa)', category: 'room' },
  { id: 'lounge', name: 'Salotto (Camino acceso)', category: 'room' },
  { id: 'hall', name: 'Ingresso (Scalone & Armatura)', category: 'room' },
  { id: 'study', name: 'Studio (Scrivania & Mappamondo)', category: 'room' },
  { id: 'cellar', name: 'Cantina Vini & Segrete', category: 'room' },
  { id: 'observatory', name: 'Osservatorio Astronomico', category: 'room' },

  // Indizi & Extra
  { id: 'alibi', name: 'Alibi / Sigillo di Cera', category: 'clue' },
  { id: 'witness', name: 'Testimone / Serratura', category: 'clue' },
  { id: 'secret_passage', name: 'Passaggio Segreto', category: 'clue' },
  { id: 'magnifier', name: 'Lente d\'Ingrandimento', category: 'general' },
];

export function renderCardArtwork(
  iconName: string,
  className = 'w-full h-full',
  color = '#B91C1C'
): React.ReactElement {
  switch (iconName) {
    // --- SOSPETTATI ---
    case 'scarlett':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <path d="M60 22C46 22 36 34 36 50C36 62 44 72 54 75V84C42 87 26 95 24 106H96C94 95 78 87 66 84V75C76 72 84 62 84 50C84 34 74 22 60 22Z" fill="currentColor" fillOpacity="0.88"/>
          {/* Feather fascinator hat */}
          <path d="M42 32C40 20 54 12 72 10C64 16 66 26 58 32Z" fill="#FBBF24"/>
          <circle cx="48" cy="30" r="3.5" fill="#EF4444"/>
          {/* Pearl necklace */}
          <ellipse cx="60" cy="80" rx="14" ry="4" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="2 3"/>
          {/* Long cigarette holder */}
          <line x1="72" y1="58" x2="98" y2="48" stroke="#111827" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="94" y1="49.5" x2="98" y2="48" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="98.5" cy="48" r="1.5" fill="#EF4444"/>
        </svg>
      );

    case 'mustard':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Military peaked cap */}
          <path d="M34 34C42 22 78 22 86 34L94 40C94 40 82 43 60 43C38 43 26 40 26 40L34 34Z" fill="#78350F"/>
          <path d="M30 40H90V44C90 47 76 50 60 50C44 50 30 47 30 44V40Z" fill="#D97706"/>
          <circle cx="60" cy="38" r="4" fill="#FDE047"/>
          {/* Face & mustache */}
          <path d="M42 46C42 46 42 66 60 68C78 66 78 46 78 46" fill="currentColor" fillOpacity="0.85"/>
          <path d="M46 60C52 64 60 58 60 58C60 58 68 64 74 60C72 65 64 68 60 67C56 68 48 65 46 60Z" fill="#FFFFFF"/>
          {/* Military tunic with medals & epaulettes */}
          <path d="M60 74L30 84V106H90V84L60 74Z" fill="currentColor" fillOpacity="0.95"/>
          <rect x="26" y="80" width="16" height="6" rx="2" fill="#F59E0B" transform="rotate(-15 26 80)"/>
          <rect x="78" y="76" width="16" height="6" rx="2" fill="#F59E0B" transform="rotate(15 78 76)"/>
          <circle cx="50" cy="92" r="3" fill="#EF4444"/>
          <circle cx="60" cy="92" r="3" fill="#3B82F6"/>
          <circle cx="70" cy="92" r="3" fill="#10B981"/>
        </svg>
      );

    case 'white':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Maid/Nurse Bonnet */}
          <path d="M38 46C38 28 82 28 82 46C86 48 86 54 82 56C82 56 60 50 38 56C34 54 34 48 38 46Z" fill="#F3F4F6"/>
          <path d="M42 52V68C42 76 50 82 60 82C70 82 78 76 78 68V52" fill="currentColor" fillOpacity="0.75"/>
          {/* Stethoscope / Victorian apron lace */}
          <path d="M34 88C38 84 52 82 60 82C68 82 82 84 86 88L92 106H28L34 88Z" fill="#E5E7EB"/>
          <path d="M52 84L60 98L68 84" stroke="#4B5563" strokeWidth="2"/>
          <circle cx="60" cy="100" r="3.5" fill="#DC2626"/>
        </svg>
      );

    case 'green':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Fedora hat */}
          <ellipse cx="60" cy="40" rx="36" ry="6" fill="#064E3B"/>
          <path d="M38 38C38 26 44 20 60 20C76 20 82 26 82 38Z" fill="#047857"/>
          <rect x="40" y="34" width="40" height="4" fill="#F59E0B"/>
          {/* Face */}
          <path d="M46 44C46 44 44 64 60 66C76 64 74 44 74 44" fill="currentColor" fillOpacity="0.85"/>
          {/* Clerical collar or bow-tie */}
          <path d="M32 82C40 76 54 74 60 74C66 74 80 76 88 82L92 106H28L32 82Z" fill="#064E3B"/>
          <rect x="54" y="74" width="12" height="6" fill="#F9FAFB"/>
        </svg>
      );

    case 'peacock':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Peacock feather fan background */}
          <path d="M25 50C25 30 40 18 60 18C80 18 95 30 95 50" stroke="#0284C7" strokeWidth="3" strokeDasharray="4 4"/>
          <circle cx="36" cy="30" r="4" fill="#06B6D4"/>
          <circle cx="60" cy="22" r="5" fill="#3B82F6"/>
          <circle cx="84" cy="30" r="4" fill="#06B6D4"/>
          {/* Aristocratic silhouette */}
          <path d="M44 38C44 28 76 28 76 38C76 56 68 68 60 68C52 68 44 56 44 38Z" fill="currentColor" fillOpacity="0.88"/>
          {/* Feather hair decoration */}
          <path d="M70 32C82 22 88 12 88 12C88 12 80 26 74 34Z" fill="#38BDF8"/>
          {/* Evening gown with pearl ropes */}
          <path d="M32 84C42 78 54 76 60 76C66 76 78 78 88 84L94 106H26L32 84Z" fill="#1E3A8A"/>
          <ellipse cx="60" cy="84" rx="16" ry="5" fill="none" stroke="#FDE047" strokeWidth="2"/>
        </svg>
      );

    case 'plum':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Academic face with hair & spectacles */}
          <path d="M42 32C42 22 78 22 78 32C84 38 84 50 80 62C74 70 68 72 60 72C52 72 46 70 40 62C36 50 36 38 42 32Z" fill="currentColor" fillOpacity="0.85"/>
          {/* Round wire glasses */}
          <circle cx="50" cy="48" r="7" stroke="#F59E0B" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.3"/>
          <circle cx="70" cy="48" r="7" stroke="#F59E0B" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.3"/>
          <line x1="57" y1="48" x2="63" y2="48" stroke="#F59E0B" strokeWidth="2"/>
          {/* Bowtie and tweed jacket */}
          <path d="M30 84C40 78 54 76 60 76C66 76 80 78 90 84L94 106H26L30 84Z" fill="#581C87"/>
          <polygon points="54,78 60,82 54,86" fill="#F59E0B"/>
          <polygon points="66,78 60,82 66,86" fill="#F59E0B"/>
          <circle cx="60" cy="82" r="2" fill="#DC2626"/>
        </svg>
      );

    case 'detective':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Trench hat */}
          <ellipse cx="60" cy="38" rx="34" ry="7" fill="#1F2937"/>
          <path d="M40 36C40 24 48 18 60 18C72 18 80 24 80 36Z" fill="#374151"/>
          {/* Trench coat collar */}
          <path d="M28 86L46 64L60 74L74 64L92 86L94 106H26L28 86Z" fill="#1F2937"/>
          <polygon points="46,64 60,78 52,86 42,76" fill="#4B5563"/>
          <polygon points="74,64 60,78 68,86 78,76" fill="#4B5563"/>
        </svg>
      );

    case 'orchid':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Test tube & toxic orchid */}
          <rect x="52" y="24" width="16" height="54" rx="8" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M54 48H66V70C66 73 63 76 60 76C57 76 54 73 54 70V48Z" fill="#E11D48"/>
          <circle cx="58" cy="56" r="2" fill="#FFFFFF"/>
          <circle cx="62" cy="64" r="1.5" fill="#FFFFFF"/>
          {/* Orchid blossom */}
          <path d="M40 86C48 78 72 78 80 86C74 98 46 98 40 86Z" fill="#BE185D"/>
        </svg>
      );

    // --- ARMI ---
    case 'candlestick':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Base */}
          <ellipse cx="60" cy="98" rx="32" ry="7" fill="currentColor" fillOpacity="0.9"/>
          <rect x="54" y="90" width="12" height="8" rx="2" fill="currentColor"/>
          {/* Stem & Center Column */}
          <path d="M56 46H64V90H56V46Z" fill="currentColor"/>
          <circle cx="60" cy="66" r="6" fill="#F59E0B"/>
          {/* Left & Right Arms */}
          <path d="M40 56C40 72 56 74 56 74" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          <path d="M80 56C80 72 64 74 64 74" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          {/* Candle Holders */}
          <rect x="34" y="52" width="12" height="6" rx="1.5" fill="currentColor"/>
          <rect x="54" y="42" width="12" height="6" rx="1.5" fill="currentColor"/>
          <rect x="74" y="52" width="12" height="6" rx="1.5" fill="currentColor"/>
          {/* Candles */}
          <rect x="37" y="32" width="6" height="20" fill="#FEF3C7"/>
          <rect x="57" y="22" width="6" height="20" fill="#FEF3C7"/>
          <rect x="77" y="32" width="6" height="20" fill="#FEF3C7"/>
          {/* Flames */}
          <path d="M40 31C38 27 40 22 40 22C40 22 42 27 40 31Z" fill="#F59E0B"/>
          <path d="M60 21C58 15 60 10 60 10C60 10 62 15 60 21Z" fill="#EF4444"/>
          <path d="M80 31C78 27 80 22 80 22C80 22 82 27 80 31Z" fill="#F59E0B"/>
        </svg>
      );

    case 'dagger':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <g transform="rotate(45 60 60)">
            {/* Pommel */}
            <circle cx="60" cy="18" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
            {/* Grip */}
            <rect x="57" y="24" width="6" height="20" rx="2" fill="#78350F"/>
            <line x1="57" y1="28" x2="63" y2="28" stroke="#FDE047" strokeWidth="1.5"/>
            <line x1="57" y1="34" x2="63" y2="34" stroke="#FDE047" strokeWidth="1.5"/>
            <line x1="57" y1="40" x2="63" y2="40" stroke="#FDE047" strokeWidth="1.5"/>
            {/* Crossguard */}
            <path d="M44 44H76C77 44 78 46 76 47L72 50H48L44 47C42 46 43 44 44 44Z" fill="#F59E0B"/>
            {/* Blade */}
            <path d="M52 50L60 102L68 50H52Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
            <line x1="60" y1="50" x2="60" y2="96" stroke="#6B7280" strokeWidth="1.5"/>
            {/* Blood drops */}
            <circle cx="63" cy="98" r="2" fill="#DC2626"/>
            <circle cx="65" cy="104" r="1.5" fill="#DC2626"/>
          </g>
        </svg>
      );

    case 'lead_pipe':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <g transform="rotate(-30 60 60)">
            {/* Metallic pipe tube */}
            <rect x="36" y="26" width="48" height="18" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="2"/>
            <rect x="32" y="24" width="8" height="22" rx="2" fill="#4B5563"/>
            {/* Elbow joint */}
            <path d="M84 26C94 26 100 32 100 42V84H82V44H84V26Z" fill="#4B5563" stroke="#1F2937" strokeWidth="2"/>
            <rect x="80" y="80" width="22" height="8" rx="2" fill="#374151"/>
            {/* Scratch marks */}
            <line x1="50" y1="30" x2="56" y2="40" stroke="#9CA3AF" strokeWidth="1.5"/>
            <line x1="64" y1="30" x2="70" y2="40" stroke="#9CA3AF" strokeWidth="1.5"/>
          </g>
        </svg>
      );

    case 'revolver':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <g transform="translate(14, 18)">
            {/* Barrel */}
            <rect x="22" y="30" width="46" height="12" rx="2" fill="#4B5563" stroke="#1F2937" strokeWidth="2"/>
            <rect x="22" y="27" width="4" height="4" fill="#1F2937"/>
            {/* Cylinder */}
            <rect x="38" y="28" width="20" height="18" rx="3" fill="#374151" stroke="#111827" strokeWidth="1.5"/>
            <line x1="42" y1="28" x2="42" y2="46" stroke="#6B7280" strokeWidth="1.5"/>
            <line x1="48" y1="28" x2="48" y2="46" stroke="#6B7280" strokeWidth="1.5"/>
            <line x1="54" y1="28" x2="54" y2="46" stroke="#6B7280" strokeWidth="1.5"/>
            {/* Frame & Hammer */}
            <path d="M58 32H72C74 32 75 30 74 27L70 26L68 32Z" fill="#1F2937"/>
            {/* Trigger guard & Trigger */}
            <path d="M46 46C46 54 58 54 58 46" stroke="#1F2937" strokeWidth="2.5" fill="none"/>
            <path d="M52 46C52 49 55 50 55 50" stroke="#9CA3AF" strokeWidth="2" fill="none"/>
            {/* Wooden grip handle */}
            <path d="M60 44C62 44 68 48 72 58C76 68 70 78 60 76C54 74 54 66 56 56L60 44Z" fill="#92400E" stroke="#451A03" strokeWidth="2"/>
            <circle cx="64" cy="64" r="3" fill="#F59E0B"/>
          </g>
        </svg>
      );

    case 'rope':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Hanging rope loop / noose */}
          <line x1="60" y1="14" x2="60" y2="42" stroke="#B45309" strokeWidth="4" strokeDasharray="4 2"/>
          {/* Coiled knot */}
          <rect x="53" y="42" width="14" height="18" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2"/>
          <line x1="53" y1="46" x2="67" y2="46" stroke="#FDE047" strokeWidth="2"/>
          <line x1="53" y1="51" x2="67" y2="51" stroke="#FDE047" strokeWidth="2"/>
          <line x1="53" y1="56" x2="67" y2="56" stroke="#FDE047" strokeWidth="2"/>
          {/* Loop */}
          <ellipse cx="60" cy="78" rx="18" ry="22" fill="none" stroke="#B45309" strokeWidth="4.5" strokeDasharray="5 2"/>
        </svg>
      );

    case 'wrench':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <g transform="rotate(45 60 60)">
            {/* Open end / Spanner jaws */}
            <path d="M46 22C46 32 54 38 60 38C66 38 74 32 74 22C74 16 68 18 60 26C52 18 46 16 46 22Z" fill="#4B5563" stroke="#1F2937" strokeWidth="2"/>
            {/* Handle */}
            <rect x="55" y="36" width="10" height="54" rx="3" fill="#6B7280" stroke="#374151" strokeWidth="2"/>
            {/* Box end loop */}
            <circle cx="60" cy="94" r="10" fill="#4B5563" stroke="#1F2937" strokeWidth="2"/>
            <polygon points="56,88 64,88 67,94 64,100 56,100 53,94" fill="#111827"/>
          </g>
        </svg>
      );

    case 'poison':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Cork stopper */}
          <polygon points="54,20 66,20 64,28 56,28" fill="#92400E"/>
          {/* Neck */}
          <rect x="55" y="28" width="10" height="12" fill="#047857"/>
          {/* Glass vial flask */}
          <path d="M55 40L36 84C34 88 38 96 44 96H76C82 96 86 88 84 84L65 40H55Z" fill="#065F46" stroke="#047857" strokeWidth="2"/>
          {/* Poison level & Skull */}
          <circle cx="60" cy="74" r="7" fill="#F9FAFB"/>
          <circle cx="58" cy="73" r="1.5" fill="#111827"/>
          <circle cx="62" cy="73" r="1.5" fill="#111827"/>
          <rect x="58" y="78" width="4" height="3" rx="1" fill="#111827"/>
        </svg>
      );

    case 'axe':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          <g transform="rotate(35 60 60)">
            <rect x="57" y="22" width="6" height="82" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="1.5"/>
            {/* Axe blade */}
            <path d="M60 24H76C84 28 88 40 82 48H60V24Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
            <path d="M78 28C84 34 84 42 78 46" stroke="#FEE2E2" strokeWidth="2" fill="none"/>
            {/* Spike */}
            <path d="M60 30L44 36L60 42V30Z" fill="#4B5563"/>
          </g>
        </svg>
      );

    // --- STANZE ---
    case 'kitchen':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Chef knife & fork cross */}
          <path d="M38 34L48 24C62 38 64 56 64 56L56 64C56 64 38 62 24 48L34 38L38 34Z" fill="currentColor" fillOpacity="0.85"/>
          <line x1="56" y1="64" x2="78" y2="86" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
          {/* Stock pot */}
          <rect x="36" y="80" width="48" height="22" rx="3" fill="#4B5563" stroke="#1F2937" strokeWidth="2"/>
          <line x1="30" y1="84" x2="36" y2="84" stroke="#1F2937" strokeWidth="3"/>
          <line x1="84" y1="84" x2="90" y2="84" stroke="#1F2937" strokeWidth="3"/>
        </svg>
      );

    case 'ballroom':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Crystal Chandelier */}
          <line x1="60" y1="16" x2="60" y2="34" stroke="#F59E0B" strokeWidth="2"/>
          <ellipse cx="60" cy="40" rx="26" ry="6" fill="#FDE047" fillOpacity="0.6" stroke="#D97706" strokeWidth="2"/>
          <path d="M40 44L60 72L80 44" stroke="#F59E0B" strokeWidth="2" fill="none"/>
          <circle cx="60" cy="74" r="4" fill="#FDE047"/>
          <circle cx="48" cy="56" r="3" fill="#FDE047"/>
          <circle cx="72" cy="56" r="3" fill="#FDE047"/>
          {/* Parquet floor lines */}
          <line x1="26" y1="102" x2="94" y2="102" stroke="currentColor" strokeWidth="2"/>
          <path d="M36 102L48 88L60 102L72 88L84 102" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6"/>
        </svg>
      );

    case 'conservatory':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Victorian glass dome */}
          <path d="M30 96V70C30 46 44 26 60 26C76 26 90 46 90 70V96H30Z" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="60" y1="26" x2="60" y2="96" stroke="currentColor" strokeWidth="2"/>
          <path d="M42 40C48 52 50 72 50 96" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M78 40C72 52 70 72 70 96" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="32" y1="64" x2="88" y2="64" stroke="currentColor" strokeWidth="2"/>
          {/* Exotic palm fronds */}
          <path d="M60 96C60 76 46 64 36 68" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
          <path d="M60 96C60 76 74 64 84 68" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );

    case 'dining_room':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Imperial dining table with cloth */}
          <ellipse cx="60" cy="74" rx="38" ry="12" fill="currentColor" fillOpacity="0.85"/>
          <rect x="28" y="74" width="64" height="22" fill="currentColor" fillOpacity="0.6"/>
          {/* Wine goblets & covered platter */}
          <ellipse cx="60" cy="64" rx="14" ry="4" fill="#FDE047"/>
          <path d="M50 64C50 54 70 54 70 64H50Z" fill="#F59E0B"/>
          {/* Goblets */}
          <path d="M36 58V66H42V58H36Z" fill="#93C5FD"/>
          <path d="M78 58V66H84V58H78Z" fill="#93C5FD"/>
        </svg>
      );

    case 'billiard_room':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Billiard table top */}
          <rect x="24" y="44" width="72" height="42" rx="6" fill="#047857" stroke="#78350F" strokeWidth="4"/>
          {/* Pockets */}
          <circle cx="28" cy="48" r="4" fill="#111827"/>
          <circle cx="60" cy="48" r="4" fill="#111827"/>
          <circle cx="92" cy="48" r="4" fill="#111827"/>
          <circle cx="28" cy="82" r="4" fill="#111827"/>
          <circle cx="60" cy="82" r="4" fill="#111827"/>
          <circle cx="92" cy="82" r="4" fill="#111827"/>
          {/* Crossed cue sticks */}
          <line x1="20" y1="26" x2="100" y2="94" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="100" y1="26" x2="20" y2="94" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Balls */}
          <circle cx="56" cy="65" r="3" fill="#EF4444"/>
          <circle cx="62" cy="62" r="3" fill="#FDE047"/>
          <circle cx="64" cy="68" r="3" fill="#FFFFFF"/>
        </svg>
      );

    case 'library':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Bookshelves */}
          <rect x="26" y="24" width="68" height="74" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="26" y1="48" x2="94" y2="48" stroke="currentColor" strokeWidth="3"/>
          <line x1="26" y1="72" x2="94" y2="72" stroke="currentColor" strokeWidth="3"/>
          {/* Books rows */}
          <rect x="32" y="30" width="8" height="18" fill="#B91C1C"/>
          <rect x="42" y="33" width="7" height="15" fill="#D97706"/>
          <rect x="51" y="28" width="9" height="20" fill="#047857"/>
          <rect x="62" y="32" width="7" height="16" fill="#1D4ED8"/>
          <rect x="71" y="30" width="8" height="18" fill="#6D28D9"/>
          {/* Globe & antique ladder */}
          <circle cx="48" cy="84" r="7" fill="none" stroke="#F59E0B" strokeWidth="2"/>
          <line x1="78" y1="20" x2="86" y2="98" stroke="#78350F" strokeWidth="3"/>
        </svg>
      );

    case 'lounge':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Fireplace mantel */}
          <rect x="28" y="34" width="64" height="10" fill="#78350F"/>
          <path d="M34 44V92H86V44H34ZM44 88V56H76V88H44Z" fill="currentColor" fillOpacity="0.8"/>
          {/* Roaring fire flames */}
          <path d="M52 86C50 78 54 70 60 64C66 70 70 78 68 86H52Z" fill="#F59E0B"/>
          <path d="M56 86C54 80 57 74 60 70C63 74 66 80 64 86H56Z" fill="#EF4444"/>
        </svg>
      );

    case 'hall':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Monumental door arch */}
          <path d="M38 96V50C38 36 48 26 60 26C72 26 82 36 82 50V96H38Z" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="60" y1="26" x2="60" y2="96" stroke="currentColor" strokeWidth="2"/>
          <circle cx="56" cy="66" r="2.5" fill="#F59E0B"/>
          <circle cx="64" cy="66" r="2.5" fill="#F59E0B"/>
          {/* Steps */}
          <rect x="30" y="96" width="60" height="6" fill="currentColor"/>
          <rect x="24" y="102" width="72" height="6" fill="currentColor" fillOpacity="0.7"/>
        </svg>
      );

    case 'study':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Roll-top desk with lamp */}
          <rect x="28" y="58" width="64" height="38" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="2"/>
          <rect x="34" y="66" width="16" height="24" fill="#451A03"/>
          <rect x="70" y="66" width="16" height="24" fill="#451A03"/>
          {/* Banker lamp */}
          <path d="M44 44H62" stroke="#10B981" strokeWidth="6" strokeLinecap="round"/>
          <path d="M53 47V58" stroke="#F59E0B" strokeWidth="2"/>
          {/* Wall safe */}
          <circle cx="78" cy="40" r="12" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
          <circle cx="78" cy="40" r="4" fill="#FDE047"/>
        </svg>
      );

    case 'alibi':
    case 'clue':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Wax sealed parchment */}
          <rect x="34" y="30" width="52" height="64" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
          <line x1="42" y1="42" x2="78" y2="42" stroke="#78350F" strokeWidth="2" strokeDasharray="2 2"/>
          <line x1="42" y1="52" x2="78" y2="52" stroke="#78350F" strokeWidth="2" strokeDasharray="2 2"/>
          <line x1="42" y1="62" x2="68" y2="62" stroke="#78350F" strokeWidth="2" strokeDasharray="2 2"/>
          {/* Red wax seal */}
          <circle cx="60" cy="76" r="10" fill="#DC2626"/>
          <circle cx="60" cy="76" r="6" fill="#991B1B"/>
          <text x="60" y="79" fill="#FEF3C7" fontSize="8" fontWeight="bold" textAnchor="middle">C</text>
        </svg>
      );

    case 'witness':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Keyhole frame */}
          <path d="M46 36C46 26 52 20 60 20C68 20 74 26 74 36C74 42 70 47 66 50L72 88H48L54 50C50 47 46 42 46 36Z" fill="#111827"/>
          {/* Peering eye inside */}
          <ellipse cx="60" cy="36" rx="10" ry="6" fill="#FFFFFF"/>
          <circle cx="60" cy="36" r="4" fill="#3B82F6"/>
          <circle cx="60" cy="36" r="2" fill="#000000"/>
        </svg>
      );

    case 'magnifier':
    default:
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="54" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
          {/* Magnifying Glass */}
          <circle cx="52" cy="50" r="26" stroke="#D97706" strokeWidth="5" fill="#60A5FA" fillOpacity="0.25"/>
          <circle cx="52" cy="50" r="21" stroke="#FDE047" strokeWidth="1.5" fill="none"/>
          {/* Fingerprint inside glass */}
          <path d="M48 44C50 42 54 42 56 44C58 46 58 52 56 56" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M44 48C46 42 56 40 60 46C62 52 60 58 56 62" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" fill="none"/>
          {/* Brass Handle */}
          <line x1="71" y1="69" x2="96" y2="94" stroke="#92400E" strokeWidth="7" strokeLinecap="round"/>
          <line x1="71" y1="69" x2="78" y2="76" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round"/>
        </svg>
      );
  }
}
