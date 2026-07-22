/* ============================================
   MYHBeauty — Data Store Layer
   Shared data layer for admin & storefront
   Uses localStorage for persistence
   ============================================ */

/* ---------- Icon Library ---------- */
const ICON_LIBRARY = {
  rf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></svg>',
  led: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>',
  micro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  ultra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 12c0-5 4-9 9-9M6 12c0-3 3-6 6-6M12 3v18M21 12c0 5-4 9-9 9M18 12c0 3-3 6-6 6"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  face: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 12c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4 2-4 4-4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2L4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-5z"/><path d="M9 12l2 2 4-4"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>',
  cavitation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z"/><path d="M9 13a3 3 0 003 3"/></svg>',
  derma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7l4-4 14 14-4 4z"/><path d="M7 3l14 14M9 9l1 1M12 6l1 1M15 9l1 1"/></svg>',
  vacuum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 4h12v6a6 6 0 01-12 0z"/><path d="M9 16v4M15 16v4M12 18v2"/></svg>',
  hair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 21c0-6 2-10 7-10s7 4 7 10"/><path d="M8 21V11M12 21V9M16 21V11"/></svg>',
  ems: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  sshape: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M7 4c0 3 10 4 10 8s-10 5-10 8"/></svg>',
  cryo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>',
  needle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2v16M8 6v12M16 6v12M4 10v8M20 10v8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>'
};

/* ---------- Gradient Library ---------- */
const GRADIENT_LIBRARY = [
  { id: 'violet',      label: 'Violet',      value: 'linear-gradient(145deg, #8a1cc4, #660099)' },
  { id: 'royal-purple',label: 'Royal Purple',value: 'linear-gradient(145deg, #7b2cbf, #5a189a)' },
  { id: 'lavender',    label: 'Lavender',    value: 'linear-gradient(145deg, #9d4edd, #7209b7)' },
  { id: 'deep-purple', label: 'Deep Purple', value: 'linear-gradient(145deg, #660099, #4a006b)' },
  { id: 'mauve',       label: 'Mauve',       value: 'linear-gradient(145deg, #a663cc, #7b2cbf)' },
  { id: 'indigo',      label: 'Indigo',      value: 'linear-gradient(145deg, #7028e4, #5a189a)' },
  { id: 'plum',        label: 'Plum',        value: 'linear-gradient(145deg, #5f018e, #3c0061)' },
  { id: 'amethyst',    label: 'Amethyst',    value: 'linear-gradient(145deg, #8338ec, #660099)' },
  { id: 'orchid',      label: 'Orchid',      value: 'linear-gradient(145deg, #c77dff, #9d4edd)' },
  { id: 'deep-violet', label: 'Deep Violet', value: 'linear-gradient(145deg, #6a0572, #4a006b)' },
  { id: 'light-purple',label: 'Light Purple',value: 'linear-gradient(145deg, #e0aaff, #c77dff)' },
  { id: 'eggplant',    label: 'Eggplant',    value: 'linear-gradient(145deg, #5f018e, #2d0046)' }
];

/* ---------- Category Library ---------- */
const CATEGORY_LIBRARY = {
  rf:        { label: 'RF Technology',     short: 'RF',     icon: 'rf' },
  led:       { label: 'LED Therapy',       short: 'LED',    icon: 'led' },
  micro:     { label: 'Microcurrent',      short: 'EMS',    icon: 'micro' },
  ultra:     { label: 'Ultrasonic',        short: 'Ultra',  icon: 'ultra' },
  body:      { label: 'Body Care',         short: 'Body',   icon: 'body' },
  cavitation:{ label: 'Cavitation Machine',short: 'Cav',    icon: 'cavitation' },
  derma:     { label: 'Dermabrasion',      short: 'Derma',  icon: 'derma' },
  vacuum:    { label: 'Vacuum Therapy',    short: 'Vac',    icon: 'vacuum' },
  hair:      { label: 'Hair Removal',      short: 'Hair',   icon: 'hair' },
  ems:       { label: 'EMS Machine',       short: 'EMS',    icon: 'ems' },
  sshape:    { label: 'S Shape Machine',   short: 'S-Shape',icon: 'sshape' },
  cryo:      { label: 'Cryolipolysis',     short: 'Cryo',   icon: 'cryo' },
  needle:    { label: 'Microneedling',     short: 'Needle', icon: 'needle' }
};

/* ---------- Brand Library ---------- */
const BRAND_LIBRARY = ['MYHBeauty', 'UNOISETION', 'ARISTORM', 'LUMIERE', 'PROSCULPT'];

/* ---------- Application Area Library ---------- */
const AREA_LIBRARY = {
  face:   'Face & Neck',
  eye:    'Eye Area',
  body:   'Full Body',
  body_local: 'Localized Body',
  scalp:  'Scalp & Hair',
  full:   'Full Body Treatment'
};

/* ---------- Tag Library ---------- */
const TAG_LIBRARY = ['Best Seller', 'New', 'Professional', 'Home Use', 'Popular', 'Pro Series', 'Featured', 'Limited', 'Hot Sale', 'Salon Grade', 'OEM Ready', 'Top Rated'];

/* ---------- Default Products ---------- */
const DEFAULT_PRODUCTS = [
  {
    id: 'p001',
    name: 'RF Skin Tightening Device',
    category: 'rf',
    tag: 'Best Seller',
    icon: 'rf',
    gradient: 'linear-gradient(145deg, #8a1cc4, #660099)',
    description: 'Multi-polar radio frequency (1MHz) for deep collagen stimulation, skin firming, and wrinkle reduction.',
    price: '',
    featured: true,
    createdAt: '2024-01-15',
    image: 'https://picsum.photos/seed/myhp001/600/600',
    gallery: ['https://picsum.photos/seed/myhp001a/800/600', 'https://picsum.photos/seed/myhp001b/800/600', 'https://picsum.photos/seed/myhp001c/800/600'],
    specs: [
      { label: 'Technology', value: 'Multi-polar Radio Frequency' },
      { label: 'Frequency', value: '1 MHz' },
      { label: 'Power Output', value: '50 W' },
      { label: 'Treatment Area', value: 'Face & Neck' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p002',
    name: 'Pro RF Face & Neck System',
    category: 'rf',
    tag: 'Professional',
    icon: 'pulse',
    gradient: 'linear-gradient(145deg, #7b2cbf, #5a189a)',
    description: 'Salon-grade bipolar RF system with adjustable energy levels and interchangeable treatment heads.',
    price: '',
    featured: false,
    createdAt: '2024-01-20',
    image: 'https://picsum.photos/seed/myhp002/600/600',
    gallery: ['https://picsum.photos/seed/myhp002a/800/600', 'https://picsum.photos/seed/myhp002b/800/600', 'https://picsum.photos/seed/myhp002c/800/600'],
    specs: [
      { label: 'Technology', value: 'Multi-polar Radio Frequency' },
      { label: 'Frequency', value: '1 MHz' },
      { label: 'Power Output', value: '50 W' },
      { label: 'Treatment Area', value: 'Face & Neck' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p003',
    name: 'LED Light Therapy Mask',
    category: 'led',
    tag: 'New',
    icon: 'led',
    gradient: 'linear-gradient(145deg, #9d4edd, #7209b7)',
    description: 'Seven-wavelength LED panel targeting acne, aging, pigmentation, redness, and inflammation.',
    price: '',
    featured: true,
    createdAt: '2024-02-01',
    image: 'https://picsum.photos/seed/myhp003/600/600',
    gallery: ['https://picsum.photos/seed/myhp003a/800/600', 'https://picsum.photos/seed/myhp003b/800/600', 'https://picsum.photos/seed/myhp003c/800/600'],
    specs: [
      { label: 'Technology', value: 'LED Light Therapy' },
      { label: 'Wavelengths', value: '630nm / 830nm / 415nm' },
      { label: 'LED Count', value: '150 medical-grade LEDs' },
      { label: 'Treatment Modes', value: '7 color modes' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p004',
    name: 'Portable LED Wand',
    category: 'led',
    tag: 'Home Use',
    icon: 'sparkle',
    gradient: 'linear-gradient(145deg, #660099, #4a006b)',
    description: 'Compact 3-color LED wand for targeted treatment of fine lines, blemishes, and dullness on the go.',
    price: '',
    featured: false,
    createdAt: '2024-02-10',
    image: 'https://picsum.photos/seed/myhp004/600/600',
    gallery: ['https://picsum.photos/seed/myhp004a/800/600', 'https://picsum.photos/seed/myhp004b/800/600', 'https://picsum.photos/seed/myhp004c/800/600'],
    specs: [
      { label: 'Technology', value: 'LED Light Therapy' },
      { label: 'Wavelengths', value: '630nm / 830nm / 415nm' },
      { label: 'LED Count', value: '150 medical-grade LEDs' },
      { label: 'Treatment Modes', value: '7 color modes' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p005',
    name: 'Microcurrent Facial Toner',
    category: 'micro',
    tag: 'Popular',
    icon: 'micro',
    gradient: 'linear-gradient(145deg, #a663cc, #7b2cbf)',
    description: 'EMS microcurrent technology for muscle lifting, facial contouring, and improved skin elasticity.',
    price: '',
    featured: true,
    createdAt: '2024-02-15',
    image: 'https://picsum.photos/seed/myhp005/600/600',
    gallery: ['https://picsum.photos/seed/myhp005a/800/600', 'https://picsum.photos/seed/myhp005b/800/600', 'https://picsum.photos/seed/myhp005c/800/600'],
    specs: [
      { label: 'Technology', value: 'EMS Microcurrent' },
      { label: 'Frequency', value: '325 Hz' },
      { label: 'Intensity Levels', value: '5 adjustable levels' },
      { label: 'Treatment Area', value: 'Face / Eye' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p006',
    name: 'EMS Eye Care Device',
    category: 'micro',
    tag: 'Pro Series',
    icon: 'eye',
    gradient: 'linear-gradient(145deg, #7028e4, #5a189a)',
    description: "Specialized microcurrent device for the delicate eye area \u2014 reduces puffiness, dark circles, and crow's feet.",
    price: '',
    featured: false,
    createdAt: '2024-03-01',
    image: 'https://picsum.photos/seed/myhp006/600/600',
    gallery: ['https://picsum.photos/seed/myhp006a/800/600', 'https://picsum.photos/seed/myhp006b/800/600', 'https://picsum.photos/seed/myhp006c/800/600'],
    specs: [
      { label: 'Technology', value: 'EMS Microcurrent' },
      { label: 'Frequency', value: '325 Hz' },
      { label: 'Intensity Levels', value: '5 adjustable levels' },
      { label: 'Treatment Area', value: 'Eye Area' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p007',
    name: 'Ultrasonic Skin Scrubber',
    category: 'ultra',
    tag: 'Best Seller',
    icon: 'ultra',
    gradient: 'linear-gradient(145deg, #5f018e, #3c0061)',
    description: '28kHz ultrasonic vibration for deep pore cleansing, exfoliation, and enhanced serum absorption.',
    price: '',
    featured: false,
    createdAt: '2024-03-10',
    image: 'https://picsum.photos/seed/myhp007/600/600',
    gallery: ['https://picsum.photos/seed/myhp007a/800/600', 'https://picsum.photos/seed/myhp007b/800/600', 'https://picsum.photos/seed/myhp007c/800/600'],
    specs: [
      { label: 'Technology', value: 'Ultrasonic Vibration' },
      { label: 'Frequency', value: '28 kHz' },
      { label: 'Power Output', value: '15 W' },
      { label: 'Application', value: 'Cleansing & Infusion' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p008',
    name: 'Ultrasonic Infusion Device',
    category: 'ultra',
    tag: 'Professional',
    icon: 'wave',
    gradient: 'linear-gradient(145deg, #8338ec, #660099)',
    description: 'Low-frequency ultrasonic waves that drive active ingredients deep into the dermis for maximum efficacy.',
    price: '',
    featured: false,
    createdAt: '2024-03-20',
    image: 'https://picsum.photos/seed/myhp008/600/600',
    gallery: ['https://picsum.photos/seed/myhp008a/800/600', 'https://picsum.photos/seed/myhp008b/800/600', 'https://picsum.photos/seed/myhp008c/800/600'],
    specs: [
      { label: 'Technology', value: 'Ultrasonic Vibration' },
      { label: 'Frequency', value: '28 kHz' },
      { label: 'Power Output', value: '15 W' },
      { label: 'Application', value: 'Cleansing & Infusion' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p009',
    name: 'Body Slimming Massager',
    category: 'body',
    tag: 'New',
    icon: 'body',
    gradient: 'linear-gradient(145deg, #c77dff, #9d4edd)',
    description: 'RF + ultrasonic + vacuum triple-action system for body contouring, cellulite reduction, and lymphatic drainage.',
    price: '',
    featured: false,
    createdAt: '2024-04-01',
    image: 'https://picsum.photos/seed/myhp009/600/600',
    gallery: ['https://picsum.photos/seed/myhp009a/800/600', 'https://picsum.photos/seed/myhp009b/800/600', 'https://picsum.photos/seed/myhp009c/800/600'],
    specs: [
      { label: 'Technology', value: 'RF + Ultrasonic + Vacuum' },
      { label: 'Frequency', value: '1 MHz RF / 40 kHz Ultra' },
      { label: 'Power Output', value: '100 W' },
      { label: 'Treatment Area', value: 'Full Body' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p010',
    name: 'Heated Body Sculpting Belt',
    category: 'body',
    tag: 'Home Use',
    icon: 'shield',
    gradient: 'linear-gradient(145deg, #6a0572, #4a006b)',
    description: 'Infrared heat therapy belt for targeted fat metabolism, muscle relaxation, and improved circulation.',
    price: '',
    featured: false,
    createdAt: '2024-04-10',
    image: 'https://picsum.photos/seed/myhp010/600/600',
    gallery: ['https://picsum.photos/seed/myhp010a/800/600', 'https://picsum.photos/seed/myhp010b/800/600', 'https://picsum.photos/seed/myhp010c/800/600'],
    specs: [
      { label: 'Technology', value: 'RF + Ultrasonic + Vacuum' },
      { label: 'Frequency', value: '1 MHz RF / 40 kHz Ultra' },
      { label: 'Power Output', value: '100 W' },
      { label: 'Treatment Area', value: 'Full Body' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p011',
    name: 'Home RF Beauty Device',
    category: 'rf',
    tag: 'Home Use',
    icon: 'face',
    gradient: 'linear-gradient(145deg, #e0aaff, #c77dff)',
    description: 'Consumer-friendly RF device with smart sensors and auto-shutoff for safe, effective home treatments.',
    price: '',
    featured: false,
    createdAt: '2024-04-20',
    image: 'https://picsum.photos/seed/myhp011/600/600',
    gallery: ['https://picsum.photos/seed/myhp011a/800/600', 'https://picsum.photos/seed/myhp011b/800/600', 'https://picsum.photos/seed/myhp011c/800/600'],
    specs: [
      { label: 'Technology', value: 'Multi-polar Radio Frequency' },
      { label: 'Frequency', value: '1 MHz' },
      { label: 'Power Output', value: '50 W' },
      { label: 'Treatment Area', value: 'Face & Neck' },
      { label: 'Certification', value: 'CE, FCC, RoHS' }
    ]
  },
  {
    id: 'p012',
    name: 'Full-Body LED Therapy Panel',
    category: 'led',
    tag: 'Professional',
    icon: 'globe',
    gradient: 'linear-gradient(145deg, #5f018e, #2d0046)',
    description: 'Luxury full-body LED panel for clinics and spas — 1,500 medical-grade LEDs covering the entire body.',
    price: '',
    featured: false,
    createdAt: '2024-05-01',
    image: 'https://picsum.photos/seed/myhp012/600/600',
    gallery: ['https://picsum.photos/seed/myhp012a/800/600', 'https://picsum.photos/seed/myhp012b/800/600', 'https://picsum.photos/seed/myhp012c/800/600'],
    specs: [
      { label: 'Technology', value: 'LED Light Therapy' },
      { label: 'Wavelengths', value: '630nm / 830nm / 415nm' },
      { label: 'LED Count', value: '150 medical-grade LEDs' },
      { label: 'Treatment Modes', value: '7 color modes' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p013',
    name: '6-in-1 Cavitation Machine',
    category: 'cavitation',
    tag: 'Best Seller',
    brand: 'UNOISETION',
    icon: 'cavitation',
    gradient: 'linear-gradient(145deg, #8a1cc4, #660099)',
    description: '40kHz ultrasonic cavitation combined with RF and vacuum for effective body slimming, cellulite reduction, and skin tightening.',
    price: 315,
    comparePrice: 449,
    rating: 4.8,
    reviewCount: 267,
    area: 'body_local',
    featured: true,
    createdAt: '2024-05-10',
    image: 'https://picsum.photos/seed/myhp013/600/600',
    gallery: ['https://picsum.photos/seed/myhp013a/800/600', 'https://picsum.photos/seed/myhp013b/800/600', 'https://picsum.photos/seed/myhp013c/800/600'],
    specs: [
      { label: 'Technology', value: '40kHz Cavitation + RF + Vacuum' },
      { label: 'Cavitation Frequency', value: '40 kHz' },
      { label: 'RF Frequency', value: '1 MHz / 5 MHz' },
      { label: 'Treatment Area', value: 'Body Contouring' },
      { label: 'Certification', value: 'CE, RoHS' }
    ]
  },
  {
    id: 'p014',
    name: '9-in-1 Cavitation Machine',
    category: 'cavitation',
    tag: 'Salon Grade',
    brand: 'ARISTORM',
    icon: 'cavitation',
    gradient: 'linear-gradient(145deg, #7b2cbf, #5a189a)',
    description: 'Professional 9-in-1 cavitation system for startup beauty salons — body slimming, skin tightening, and facial rejuvenation.',
    price: 538,
    comparePrice: 598,
    rating: 4.7,
    reviewCount: 189,
    area: 'body',
    featured: false,
    createdAt: '2024-05-15',
    image: 'https://picsum.photos/seed/myhp014/600/600',
    gallery: ['https://picsum.photos/seed/myhp014a/800/600', 'https://picsum.photos/seed/myhp014b/800/600', 'https://picsum.photos/seed/myhp014c/800/600'],
    specs: [
      { label: 'Technology', value: '9-in-1 Cavitation System' },
      { label: 'Cavitation Frequency', value: '40 kHz' },
      { label: 'Functions', value: '9 treatment handles' },
      { label: 'Treatment Area', value: 'Full Body + Face' },
      { label: 'Certification', value: 'CE, RoHS' }
    ]
  },
  {
    id: 'p015',
    name: 'Hydro Dermabrasion Machine',
    category: 'derma',
    tag: 'New',
    brand: 'MYHBeauty',
    icon: 'derma',
    gradient: 'linear-gradient(145deg, #9d4edd, #7209b7)',
    description: 'Ultrasonic hydro dermabrasion system for deep cleansing, exfoliation, and skin rejuvenation with serum infusion.',
    price: 359,
    comparePrice: 459,
    rating: 4.6,
    reviewCount: 98,
    area: 'face',
    featured: true,
    createdAt: '2024-05-20',
    image: 'https://picsum.photos/seed/myhp015/600/600',
    gallery: ['https://picsum.photos/seed/myhp015a/800/600', 'https://picsum.photos/seed/myhp015b/800/600', 'https://picsum.photos/seed/myhp015c/800/600'],
    specs: [
      { label: 'Technology', value: 'Hydro Dermabrasion + Ultrasonic' },
      { label: 'Pressure', value: 'Adjustable 0-80 cmHg' },
      { label: 'Functions', value: 'Cleanse / Exfoliate / Infuse' },
      { label: 'Treatment Area', value: 'Face & Neck' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p016',
    name: 'Diamond Microdermabrasion System',
    category: 'derma',
    tag: 'Professional',
    brand: 'LUMIERE',
    icon: 'derma',
    gradient: 'linear-gradient(145deg, #660099, #4a006b)',
    description: 'Diamond-tip microdermabrasion with 9 interchangeable tips for precise exfoliation and skin texture improvement.',
    price: 229,
    comparePrice: 289,
    rating: 4.5,
    reviewCount: 76,
    area: 'face',
    featured: false,
    createdAt: '2024-05-25',
    image: 'https://picsum.photos/seed/myhp016/600/600',
    gallery: ['https://picsum.photos/seed/myhp016a/800/600', 'https://picsum.photos/seed/myhp016b/800/600', 'https://picsum.photos/seed/myhp016c/800/600'],
    specs: [
      { label: 'Technology', value: 'Diamond Microdermabrasion' },
      { label: 'Tips Included', value: '9 diamond tips' },
      { label: 'Suction Power', value: 'Adjustable 5 levels' },
      { label: 'Treatment Area', value: 'Face & Body' },
      { label: 'Certification', value: 'CE, RoHS' }
    ]
  },
  {
    id: 'p017',
    name: 'Vacuum Therapy Butt Lift Machine',
    category: 'vacuum',
    tag: 'Popular',
    brand: 'ARISTORM',
    icon: 'vacuum',
    gradient: 'linear-gradient(145deg, #a663cc, #7b2cbf)',
    description: 'Non-surgical vacuum therapy system for buttocks lifting, body sculpting, and lymphatic drainage.',
    price: 489,
    comparePrice: 599,
    rating: 4.7,
    reviewCount: 143,
    area: 'body_local',
    featured: false,
    createdAt: '2024-06-01',
    image: 'https://picsum.photos/seed/myhp017/600/600',
    gallery: ['https://picsum.photos/seed/myhp017a/800/600', 'https://picsum.photos/seed/myhp017b/800/600', 'https://picsum.photos/seed/myhp017c/800/600'],
    specs: [
      { label: 'Technology', value: 'Vacuum Therapy + RF' },
      { label: 'Suction Range', value: '0-70 cmHg' },
      { label: 'Cups Included', value: '3 sizes' },
      { label: 'Treatment Area', value: 'Buttocks & Body' },
      { label: 'Certification', value: 'CE, RoHS' }
    ]
  },
  {
    id: 'p018',
    name: 'S Shape Cavitation Machine',
    category: 'sshape',
    tag: 'Top Rated',
    brand: 'ARISTORM',
    icon: 'sshape',
    gradient: 'linear-gradient(145deg, #5f018e, #3c0061)',
    description: 'S-shape body sculpting machine combining cavitation, RF, and vacuum for ultimate body contouring and skin tightening.',
    price: 749,
    comparePrice: 899,
    rating: 4.9,
    reviewCount: 211,
    area: 'body_local',
    featured: true,
    createdAt: '2024-06-05',
    image: 'https://picsum.photos/seed/myhp018/600/600',
    gallery: ['https://picsum.photos/seed/myhp018a/800/600', 'https://picsum.photos/seed/myhp018b/800/600', 'https://picsum.photos/seed/myhp018c/800/600'],
    specs: [
      { label: 'Technology', value: 'S-Shape Cavitation + RF + Vacuum' },
      { label: 'Cavitation Frequency', value: '40 kHz' },
      { label: 'RF Frequency', value: '5 MHz Bipolar' },
      { label: 'Treatment Area', value: 'Targeted Body Sculpting' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p019',
    name: 'IPL Hair Removal Device',
    category: 'hair',
    tag: 'Hot Sale',
    brand: 'MYHBeauty',
    icon: 'hair',
    gradient: 'linear-gradient(145deg, #7028e4, #5a189a)',
    description: 'At-home IPL hair removal device with 5 energy levels and 999,999 flash capacity for long-lasting smooth skin.',
    price: 179,
    comparePrice: 229,
    rating: 4.6,
    reviewCount: 287,
    area: 'full',
    featured: true,
    createdAt: '2024-06-10',
    image: 'https://picsum.photos/seed/myhp019/600/600',
    gallery: ['https://picsum.photos/seed/myhp019a/800/600', 'https://picsum.photos/seed/myhp019b/800/600', 'https://picsum.photos/seed/myhp019c/800/600'],
    specs: [
      { label: 'Technology', value: 'IPL Intense Pulsed Light' },
      { label: 'Flash Capacity', value: '999,999 flashes' },
      { label: 'Energy Levels', value: '5 adjustable levels' },
      { label: 'Treatment Area', value: 'Full Body & Face' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p020',
    name: 'Professional Diode Laser Hair Removal',
    category: 'hair',
    tag: 'Salon Grade',
    brand: 'PROSCULPT',
    icon: 'hair',
    gradient: 'linear-gradient(145deg, #8338ec, #660099)',
    description: '808nm diode laser hair removal system for professional salons — permanent hair reduction on all skin types.',
    price: 1299,
    comparePrice: 1599,
    rating: 4.8,
    reviewCount: 64,
    area: 'full',
    featured: false,
    createdAt: '2024-06-15',
    image: 'https://picsum.photos/seed/myhp020/600/600',
    gallery: ['https://picsum.photos/seed/myhp020a/800/600', 'https://picsum.photos/seed/myhp020b/800/600', 'https://picsum.photos/seed/myhp020c/800/600'],
    specs: [
      { label: 'Technology', value: '808nm Diode Laser' },
      { label: 'Wavelength', value: '808 nm' },
      { label: 'Power', value: '600W peak' },
      { label: 'Treatment Area', value: 'Full Body' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p021',
    name: 'EMS Body Sculpting Machine',
    category: 'ems',
    tag: 'New',
    brand: 'PROSCULPT',
    icon: 'ems',
    gradient: 'linear-gradient(145deg, #c77dff, #9d4edd)',
    description: 'High-intensity EMS muscle stimulator for body sculpting — builds muscle and burns fat simultaneously.',
    price: 689,
    comparePrice: 859,
    rating: 4.7,
    reviewCount: 112,
    area: 'body_local',
    featured: false,
    createdAt: '2024-06-20',
    image: 'https://picsum.photos/seed/myhp021/600/600',
    gallery: ['https://picsum.photos/seed/myhp021a/800/600', 'https://picsum.photos/seed/myhp021b/800/600', 'https://picsum.photos/seed/myhp021c/800/600'],
    specs: [
      { label: 'Technology', value: 'High-Intensity EMS' },
      { label: 'Intensity', value: '7 Tesla' },
      { label: 'Frequency', value: '1-100 Hz' },
      { label: 'Treatment Area', value: 'Abs / Arms / Legs / Buttocks' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p022',
    name: 'Cryolipolysis Fat Freezing Machine',
    category: 'cryo',
    tag: 'Professional',
    brand: 'ARISTORM',
    icon: 'cryo',
    gradient: 'linear-gradient(145deg, #6a0572, #4a006b)',
    description: 'Non-invasive cryolipolysis fat freezing machine for targeted fat reduction without surgery or downtime.',
    price: 1199,
    comparePrice: 1499,
    rating: 4.8,
    reviewCount: 87,
    area: 'body_local',
    featured: false,
    createdAt: '2024-06-25',
    image: 'https://picsum.photos/seed/myhp022/600/600',
    gallery: ['https://picsum.photos/seed/myhp022a/800/600', 'https://picsum.photos/seed/myhp022b/800/600', 'https://picsum.photos/seed/myhp022c/800/600'],
    specs: [
      { label: 'Technology', value: 'Cryolipolysis Fat Freezing' },
      { label: 'Temperature', value: '-11°C to 5°C' },
      { label: 'Applicators', value: '4 handles (multi-size)' },
      { label: 'Treatment Area', value: 'Targeted Fat Reduction' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  },
  {
    id: 'p023',
    name: 'Microneedling RF Device',
    category: 'needle',
    tag: 'Pro Series',
    brand: 'MYHBeauty',
    icon: 'needle',
    gradient: 'linear-gradient(145deg, #e0aaff, #c77dff)',
    description: 'Fractional RF microneedling device for skin resurfacing, scar reduction, and collagen induction therapy.',
    price: 399,
    comparePrice: 499,
    rating: 4.7,
    reviewCount: 156,
    area: 'face',
    featured: false,
    createdAt: '2024-07-01',
    image: 'https://picsum.photos/seed/myhp023/600/600',
    gallery: ['https://picsum.photos/seed/myhp023a/800/600', 'https://picsum.photos/seed/myhp023b/800/600', 'https://picsum.photos/seed/myhp023c/800/600'],
    specs: [
      { label: 'Technology', value: 'Fractional RF Microneedling' },
      { label: 'Needle Depth', value: '0.5-3.5 mm adjustable' },
      { label: 'RF Frequency', value: '2 MHz' },
      { label: 'Treatment Area', value: 'Face / Neck / Body' },
      { label: 'Certification', value: 'CE, FDA, RoHS' }
    ]
  }
];

/* ---------- Storage Key ---------- */
const STORAGE_KEY = 'myhbeauty_products';

/* ---------- Store API ---------- */
const Store = {
  /* Get all products */
  getProducts() {
    let products;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        products = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Store: Failed to read products, using defaults.', e);
    }
    if (!products) {
      // First visit — seed with defaults
      products = [...DEFAULT_PRODUCTS];
      this.saveProducts(products);
    }

    // Migration: ensure all products have image/gallery/specs fields
    // (for backward compat with data saved before these fields existed)
    const defaultMap = {};
    DEFAULT_PRODUCTS.forEach(p => { defaultMap[p.id] = p; });

    // Extra fields for original products (p001-p012) that predate price/brand/rating
    const EXTRA_FIELDS = {
      p001: { brand: 'MYHBeauty',  price: 289,  comparePrice: 359,  rating: 4.8, reviewCount: 156, area: 'face' },
      p002: { brand: 'ARISTORM',   price: 599,  comparePrice: 749,  rating: 4.7, reviewCount: 89,  area: 'face' },
      p003: { brand: 'MYHBeauty',  price: 199,  comparePrice: 259,  rating: 4.9, reviewCount: 312, area: 'face' },
      p004: { brand: 'LUMIERE',    price: 89,   comparePrice: 119,  rating: 4.5, reviewCount: 78,  area: 'face' },
      p005: { brand: 'MYHBeauty',  price: 159,  comparePrice: 199,  rating: 4.6, reviewCount: 203, area: 'face' },
      p006: { brand: 'PROSCULPT',  price: 129,  comparePrice: 169,  rating: 4.4, reviewCount: 67,  area: 'eye' },
      p007: { brand: 'MYHBeauty',  price: 79,   comparePrice: 99,   rating: 4.7, reviewCount: 145, area: 'face' },
      p008: { brand: 'ARISTORM',   price: 249,  comparePrice: 299,  rating: 4.5, reviewCount: 56,  area: 'face' },
      p009: { brand: 'ARISTORM',   price: 459,  comparePrice: 599,  rating: 4.8, reviewCount: 178, area: 'body' },
      p010: { brand: 'LUMIERE',    price: 189,  comparePrice: 239,  rating: 4.3, reviewCount: 92,  area: 'body_local' },
      p011: { brand: 'MYHBeauty',  price: 139,  comparePrice: 179,  rating: 4.6, reviewCount: 134, area: 'face' },
      p012: { brand: 'ARISTORM',   price: 899,  comparePrice: 1099, rating: 4.9, reviewCount: 45,  area: 'full' }
    };

    let needsSave = false;
    products = products.map(p => {
      const dp = defaultMap[p.id];
      if (!p.image) { p.image = dp ? dp.image : ''; needsSave = true; }
      if (!Array.isArray(p.gallery)) { p.gallery = dp ? dp.gallery : []; needsSave = true; }
      if (!Array.isArray(p.specs)) { p.specs = dp ? dp.specs : []; needsSave = true; }
      // Supplement new fields for legacy products
      const extra = EXTRA_FIELDS[p.id];
      if (extra) {
        if (!p.brand)        { p.brand = extra.brand; needsSave = true; }
        if (!p.price)        { p.price = extra.price; needsSave = true; }
        if (!p.comparePrice) { p.comparePrice = extra.comparePrice; needsSave = true; }
        if (!p.rating)       { p.rating = extra.rating; needsSave = true; }
        if (!p.reviewCount)  { p.reviewCount = extra.reviewCount; needsSave = true; }
        if (!p.area)         { p.area = extra.area; needsSave = true; }
      }
      return p;
    });

    if (needsSave) this.saveProducts(products);
    return products;
  },

  /* Save entire product array */
  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return true;
    } catch (e) {
      console.error('Store: Failed to save products.', e);
      return false;
    }
  },

  /* Get a single product by id */
  getProduct(id) {
    return this.getProducts().find(p => p.id === id) || null;
  },

  /* Add a new product */
  addProduct(product) {
    const products = this.getProducts();
    product.id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    product.createdAt = new Date().toISOString().split('T')[0];
    products.unshift(product);
    this.saveProducts(products);
    return product;
  },

  /* Update an existing product */
  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, id, createdAt: products[index].createdAt };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },

  /* Delete a product */
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
    return products;
  },

  /* Reset to default data */
  resetToDefault() {
    this.saveProducts(DEFAULT_PRODUCTS);
    return [...DEFAULT_PRODUCTS];
  },

  /* Export data as JSON string */
  exportData() {
    return JSON.stringify(this.getProducts(), null, 2);
  },

  /* Import data from JSON string */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        // Validate basic structure
        const valid = data.every(p => p.name && p.category);
        if (valid) {
          this.saveProducts(data);
          return { success: true, count: data.length };
        }
      }
      return { success: false, error: 'Invalid data format. Expected an array of products with name and category fields.' };
    } catch (e) {
      return { success: false, error: 'Invalid JSON: ' + e.message };
    }
  },

  /* Get featured products */
  getFeaturedProducts() {
    return this.getProducts().filter(p => p.featured);
  },

  /* Get products by category */
  getProductsByCategory(category) {
    if (category === 'all') return this.getProducts();
    return this.getProducts().filter(p => p.category === category);
  },

  /* Search products */
  searchProducts(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.getProducts();
    return this.getProducts().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (CATEGORY_LIBRARY[p.category] && CATEGORY_LIBRARY[p.category].label.toLowerCase().includes(q))
    );
  },

  /* Generate unique id */
  generateId() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  /* Get related products by category (excluding current) */
  getRelatedProducts(productId, limit) {
    const product = this.getProduct(productId);
    if (!product) return [];
    let related = this.getProducts().filter(p => p.id !== productId && p.category === product.category);
    if (related.length < (limit || 4)) {
      const others = this.getProducts().filter(p => p.id !== productId && p.category !== product.category);
      related = related.concat(others);
    }
    return related.slice(0, limit || 4);
  }
};

/* ============================================
   Blog Articles Data
   ============================================ */
const BLOG_CATEGORIES = ['Facial Care', 'Body Care', 'Hair Removal', 'Technology', 'Industry News', 'Treatment Guide'];

const BLOG_ARTICLES = [
  {
    id: 'b001',
    title: 'Is Radio Frequency Skin Tightening Safe for Your Face?',
    category: 'Facial Care',
    excerpt: 'RF skin tightening is one of the most popular non-invasive treatments today. We explore the science, safety profile, and what to expect from your sessions.',
    author: 'Dr. Elena Chen',
    date: '2025-06-15',
    readTime: '6 min',
    image: 'https://picsum.photos/seed/myhblog1/800/500',
    featured: true
  },
  {
    id: 'b002',
    title: 'Does a Microneedling Device Really Work for Acne Scars?',
    category: 'Facial Care',
    excerpt: 'Microneedling has gained attention for treating acne scars. Here is what the clinical evidence says about its effectiveness and best practices.',
    author: 'Dr. James Liu',
    date: '2025-06-10',
    readTime: '8 min',
    image: 'https://picsum.photos/seed/myhblog2/800/500',
    featured: true
  },
  {
    id: 'b003',
    title: 'How a Skin Analysis Machine Finds Your Real Skin Type',
    category: 'Technology',
    excerpt: 'Understanding your true skin type is the foundation of any effective treatment plan. Modern skin analysis machines make this easier than ever.',
    author: 'Sarah Mitchell',
    date: '2025-06-05',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/myhblog3/800/500',
    featured: false
  },
  {
    id: 'b004',
    title: 'Best Skin Tag Removal Pen 2026: Top Picks & Buying Guide',
    category: 'Facial Care',
    excerpt: 'Looking for a reliable skin tag removal pen? We break down the top models, features to look for, and safety considerations.',
    author: 'Dr. Elena Chen',
    date: '2025-05-28',
    readTime: '7 min',
    image: 'https://picsum.photos/seed/myhblog4/800/500',
    featured: false
  },
  {
    id: 'b005',
    title: 'How to Exfoliate Legs — Complete Guide for Smooth Skin',
    category: 'Body Care',
    excerpt: 'Proper exfoliation is key to smooth, healthy-looking legs. Learn the best techniques, tools, and products for your skin type.',
    author: 'Sarah Mitchell',
    date: '2025-05-20',
    readTime: '6 min',
    image: 'https://picsum.photos/seed/myhblog5/800/500',
    featured: false
  },
  {
    id: 'b006',
    title: 'Cavitation Machine Results: What to Expect Before and After',
    category: 'Body Care',
    excerpt: 'Ultrasonic cavitation is a popular non-surgical fat reduction method. We explain the realistic results, timeline, and aftercare tips.',
    author: 'Dr. James Liu',
    date: '2025-05-12',
    readTime: '9 min',
    image: 'https://picsum.photos/seed/myhblog6/800/500',
    featured: false
  },
  {
    id: 'b007',
    title: 'IPL vs Laser Hair Removal: Which Is Right for You?',
    category: 'Hair Removal',
    excerpt: 'Both IPL and laser hair removal offer long-term hair reduction, but they work differently. We compare effectiveness, cost, and suitability.',
    author: 'Dr. Elena Chen',
    date: '2025-05-05',
    readTime: '7 min',
    image: 'https://picsum.photos/seed/myhblog7/800/500',
    featured: false
  },
  {
    id: 'b008',
    title: 'The Rise of EMS Body Sculpting in Modern Aesthetics',
    category: 'Industry News',
    excerpt: 'High-intensity EMS is transforming body contouring. Discover why salons worldwide are adding this technology to their service menus.',
    author: 'Sarah Mitchell',
    date: '2025-04-28',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/myhblog8/800/500',
    featured: false
  },
  {
    id: 'b009',
    title: 'Understanding Cryolipolysis: The Science of Fat Freezing',
    category: 'Technology',
    excerpt: 'Cryolipolysis targets fat cells through controlled cooling. Learn how it works, who is a good candidate, and expected outcomes.',
    author: 'Dr. James Liu',
    date: '2025-04-20',
    readTime: '8 min',
    image: 'https://picsum.photos/seed/myhblog9/800/500',
    featured: false
  }
];

/* ============================================
   Testimonials Data
   ============================================ */
const TESTIMONIALS = [
  {
    id: 't001',
    name: 'Maria Rodriguez',
    role: 'Salon Owner, Madrid',
    rating: 5,
    text: 'MYHBeauty\'s cavitation machines have transformed our salon services. The build quality is exceptional and our clients see real results. The after-sales support is outstanding.',
    avatar: 'MR',
    gradient: 'linear-gradient(145deg, #8a1cc4, #660099)'
  },
  {
    id: 't002',
    name: 'David Chen',
    role: 'Distributor, Singapore',
    rating: 5,
    text: 'We have partnered with MYHBeauty for 3 years now. Their OEM service is professional, certifications are complete, and delivery is always on time. Highly recommended for B2B.',
    avatar: 'DC',
    gradient: 'linear-gradient(145deg, #7b2cbf, #5a189a)'
  },
  {
    id: 't003',
    name: 'Sophie Laurent',
    role: 'Aesthetician, Paris',
    rating: 5,
    text: 'The RF skin tightening device is a game-changer. My clients love the visible results after just a few sessions. The technology rivals machines twice the price.',
    avatar: 'SL',
    gradient: 'linear-gradient(145deg, #9d4edd, #7209b7)'
  },
  {
    id: 't004',
    name: 'Ahmed Al-Rashid',
    role: 'Clinic Director, Dubai',
    rating: 5,
    text: 'We equipped our entire clinic with MYHBeauty devices. The S-Shape machine and cryolipolysis unit are patient favorites. Reliable, certified, and beautifully designed.',
    avatar: 'AR',
    gradient: 'linear-gradient(145deg, #5f018e, #3c0061)'
  },
  {
    id: 't005',
    name: 'Jennifer Park',
    role: 'Home User, Seoul',
    rating: 5,
    text: 'I purchased the IPL hair removal device for home use. It is easy to use, painless, and after 8 weeks I see a huge difference. Worth every penny.',
    avatar: 'JP',
    gradient: 'linear-gradient(145deg, #7028e4, #5a189a)'
  },
  {
    id: 't006',
    name: 'Robert Williams',
    role: 'Spa Manager, London',
    rating: 5,
    text: 'The hydro dermabrasion machine has become our most-requested treatment. Clients leave with glowing skin every time. MYHBeauty\'s training materials are also excellent.',
    avatar: 'RW',
    gradient: 'linear-gradient(145deg, #8338ec, #660099)'
  }
];

/* ============================================
   Treatment Guide Data
   ============================================ */
const TREATMENT_CATEGORIES = ['Body Slimming', 'Facial Rejuvenation', 'Skin Tightening', 'Hair Removal', 'Skin Resurfacing'];

const TREATMENTS = [
  {
    id: 'tr001',
    name: 'Body Contouring & Fat Reduction',
    category: 'Body Slimming',
    area: 'Full Body',
    duration: '45-60 min',
    sessions: '6-8 sessions',
    icon: 'cavitation',
    gradient: 'linear-gradient(145deg, #8a1cc4, #660099)',
    description: 'Non-surgical body contouring using cavitation, RF, and vacuum technologies to reduce localized fat deposits and cellulite.',
    benefits: ['Reduces fat cells permanently', 'Improves skin texture', 'No downtime', 'Painless treatment'],
    relatedCategories: ['cavitation', 'sshape', 'cryo']
  },
  {
    id: 'tr002',
    name: 'Skin Tightening & Lifting',
    category: 'Skin Tightening',
    area: 'Face & Neck',
    duration: '30-45 min',
    sessions: '6-10 sessions',
    icon: 'rf',
    gradient: 'linear-gradient(145deg, #7b2cbf, #5a189a)',
    description: 'Multi-polar RF energy stimulates collagen production to firm, lift, and tighten sagging skin on the face and neck.',
    benefits: ['Stimulates collagen', 'Reduces wrinkles', 'Lifts sagging skin', 'Natural-looking results'],
    relatedCategories: ['rf', 'needle']
  },
  {
    id: 'tr003',
    name: 'LED Light Therapy Facial',
    category: 'Facial Rejuvenation',
    area: 'Face',
    duration: '20-30 min',
    sessions: '8-12 sessions',
    icon: 'led',
    gradient: 'linear-gradient(145deg, #9d4edd, #7209b7)',
    description: 'Medical-grade LED light therapy targeting acne, aging, pigmentation, and inflammation using multiple wavelengths.',
    benefits: ['Kills acne bacteria', 'Boosts collagen', 'Reduces redness', 'Safe for all skin types'],
    relatedCategories: ['led']
  },
  {
    id: 'tr004',
    name: 'Deep Cleansing & Hydration',
    category: 'Facial Rejuvenation',
    area: 'Face',
    duration: '40-50 min',
    sessions: '4-6 sessions',
    icon: 'derma',
    gradient: 'linear-gradient(145deg, #660099, #4a006b)',
    description: 'Hydro dermabrasion combined with ultrasonic infusion for deep pore cleansing, exfoliation, and intensive hydration.',
    benefits: ['Deep pore cleansing', 'Instant glow', 'Enhances serum absorption', 'No irritation'],
    relatedCategories: ['derma', 'ultra']
  },
  {
    id: 'tr005',
    name: 'Permanent Hair Reduction',
    category: 'Hair Removal',
    area: 'Full Body',
    duration: '15-60 min',
    sessions: '6-10 sessions',
    icon: 'hair',
    gradient: 'linear-gradient(145deg, #a663cc, #7b2cbf)',
    description: 'IPL and diode laser technologies for long-lasting hair reduction on all skin types and body areas.',
    benefits: ['Permanent hair reduction', 'Suitable for all skin types', 'Fast treatment time', 'Painless experience'],
    relatedCategories: ['hair']
  },
  {
    id: 'tr006',
    name: 'Muscle Building & Sculpting',
    category: 'Body Slimming',
    area: 'Localized Body',
    duration: '30 min',
    sessions: '4-6 sessions',
    icon: 'ems',
    gradient: 'linear-gradient(145deg, #5f018e, #3c0061)',
    description: 'High-intensity EMS technology that builds muscle and burns fat simultaneously for body sculpting and toning.',
    benefits: ['Builds muscle mass', 'Burns fat', 'Tones target areas', 'Equivalent to 20,000 crunches'],
    relatedCategories: ['ems', 'sshape']
  },
  {
    id: 'tr007',
    name: 'Skin Resurfacing & Scar Repair',
    category: 'Skin Resurfacing',
    area: 'Face & Body',
    duration: '30-45 min',
    sessions: '4-6 sessions',
    icon: 'needle',
    gradient: 'linear-gradient(145deg, #7028e4, #5a189a)',
    description: 'Fractional RF microneedling for skin resurfacing, acne scar reduction, and overall texture improvement.',
    benefits: ['Reduces acne scars', 'Improves skin texture', 'Minimizes pores', 'Collagen induction'],
    relatedCategories: ['needle', 'derma']
  },
  {
    id: 'tr008',
    name: 'Buttocks Lifting & Vacuum Therapy',
    category: 'Body Slimming',
    area: 'Localized Body',
    duration: '30-40 min',
    sessions: '6-8 sessions',
    icon: 'vacuum',
    gradient: 'linear-gradient(145deg, #8338ec, #660099)',
    description: 'Non-surgical vacuum therapy for natural buttocks lifting, body sculpting, and lymphatic drainage.',
    benefits: ['Natural lifting', 'Improves circulation', 'Reduces cellulite', 'Non-invasive'],
    relatedCategories: ['vacuum', 'sshape']
  }
];

/* ============================================
   Auth Module — Admin Login Protection
   ============================================ */

/* Simple hash function (djb2) — obfuscates credentials,
   not cryptographically secure but avoids plaintext */
function _hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
    h = h & 0xffffffff;
  }
  return h.toString(16);
}

/* Stored credential hashes — account: MYH / password: lbe13288225900 */
const ADMIN_CREDENTIALS = {
  username: 'b880633',     // _hash('MYH')
  password: '-2f87f170'    // _hash('lbe13288225900')
};

const AUTH_KEY = 'myhbeauty_auth';

const Auth = {
  /* Attempt login; returns true on success */
  login(username, password) {
    const u = _hash(username.trim());
    const p = _hash(password);
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        user: username.trim(),
        ts: Date.now()
      }));
      return true;
    }
    return false;
  },

  /* Check if currently logged in */
  isLoggedIn() {
    try {
      const data = sessionStorage.getItem(AUTH_KEY);
      if (!data) return false;
      const parsed = JSON.parse(data);
      return !!(parsed && parsed.user && parsed.ts);
    } catch (e) {
      return false;
    }
  },

  /* Get current logged-in username */
  currentUser() {
    try {
      const data = sessionStorage.getItem(AUTH_KEY);
      if (!data) return null;
      return JSON.parse(data).user || null;
    } catch (e) {
      return null;
    }
  },

  /* Log out and redirect to login page */
  logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
  },

  /* Guard: redirect to login if not authenticated.
     Call at the top of admin pages. */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

/* ============================================
   Content Management Module (CMS)
   Allows admin to edit text & images on all pages
   ============================================ */

/* ---------- Page Content Schema ----------
   Defines all editable content per page.
   Each item: { id, label, selector, index, type, group }
   type: 'text' (textContent) | 'html' (innerHTML) | 'image' (src)
   index: which matching element (default 0)
*/
const PAGE_CONTENT_SCHEMA = {
  'index': {
    label: 'Home Page',
    groups: [
      { name: 'Hero Section', items: [
        { id: 'idx_hero_eyebrow', label: 'Eyebrow', selector: '.hero .eyebrow', type: 'text' },
        { id: 'idx_hero_title', label: 'Main Title', selector: '.hero h1', type: 'html' },
        { id: 'idx_hero_subtitle', label: 'Subtitle', selector: '.hero .lead', type: 'text' },
        { id: 'idx_hero_btn1', label: 'Button 1 Text', selector: '.hero-actions .btn-primary', type: 'text' },
        { id: 'idx_hero_btn2', label: 'Button 2 Text', selector: '.hero-actions .btn-outline', type: 'text' },
      ]},
      { name: 'Features Section', items: [
        { id: 'idx_feat_eyebrow', label: 'Section Eyebrow', selector: 'section.section .section-title .eyebrow', index: 0, type: 'text' },
        { id: 'idx_feat_title', label: 'Section Title', selector: 'section.section .section-title h2', index: 0, type: 'text' },
        { id: 'idx_feat_lead', label: 'Section Lead', selector: 'section.section .section-title .lead', index: 0, type: 'text' },
        { id: 'idx_feat_c1_title', label: 'Card 1 Title', selector: '.feature-card h3', index: 0, type: 'text' },
        { id: 'idx_feat_c1_text', label: 'Card 1 Text', selector: '.feature-card p', index: 0, type: 'text' },
        { id: 'idx_feat_c2_title', label: 'Card 2 Title', selector: '.feature-card h3', index: 1, type: 'text' },
        { id: 'idx_feat_c2_text', label: 'Card 2 Text', selector: '.feature-card p', index: 1, type: 'text' },
        { id: 'idx_feat_c3_title', label: 'Card 3 Title', selector: '.feature-card h3', index: 2, type: 'text' },
        { id: 'idx_feat_c3_text', label: 'Card 3 Text', selector: '.feature-card p', index: 2, type: 'text' },
        { id: 'idx_feat_c4_title', label: 'Card 4 Title', selector: '.feature-card h3', index: 3, type: 'text' },
        { id: 'idx_feat_c4_text', label: 'Card 4 Text', selector: '.feature-card p', index: 3, type: 'text' },
      ]},
      { name: 'About Preview', items: [
        { id: 'idx_about_eyebrow', label: 'Eyebrow', selector: '.split-text .eyebrow', index: 0, type: 'text' },
        { id: 'idx_about_title', label: 'Title', selector: '.split-text h2', index: 0, type: 'html' },
        { id: 'idx_about_lead', label: 'Lead Paragraph', selector: '.split-text .lead', index: 0, type: 'text' },
        { id: 'idx_about_p', label: 'Description', selector: '.split-text p:not(.lead)', index: 0, type: 'text' },
        { id: 'idx_about_btn', label: 'Button Text', selector: '.split-text .btn', index: 0, type: 'text' },
      ]},
      { name: 'Featured Products', items: [
        { id: 'idx_prod_eyebrow', label: 'Eyebrow', selector: 'section.section .section-title .eyebrow', index: 1, type: 'text' },
        { id: 'idx_prod_title', label: 'Title', selector: 'section.section .section-title h2', index: 1, type: 'text' },
        { id: 'idx_prod_lead', label: 'Lead', selector: 'section.section .section-title .lead', index: 1, type: 'text' },
        { id: 'idx_prod_btn', label: 'Button Text', selector: '.text-center .btn-primary', index: 0, type: 'text' },
      ]},
      { name: 'Technology Section', items: [
        { id: 'idx_tech_eyebrow', label: 'Eyebrow', selector: '.split-reverse .eyebrow', type: 'text' },
        { id: 'idx_tech_title', label: 'Title', selector: '.split-reverse h2', type: 'html' },
        { id: 'idx_tech_lead', label: 'Lead Paragraph', selector: '.split-reverse .lead', type: 'text' },
        { id: 'idx_tech_btn', label: 'Button Text', selector: '.split-reverse .btn', type: 'text' },
      ]},
      { name: 'Testimonials Section', items: [
        { id: 'idx_test_eyebrow', label: 'Eyebrow', selector: 'section.section .section-title .eyebrow', index: 2, type: 'text' },
        { id: 'idx_test_title', label: 'Title', selector: 'section.section .section-title h2', index: 2, type: 'text' },
        { id: 'idx_test_lead', label: 'Lead', selector: 'section.section .section-title .lead', index: 2, type: 'text' },
      ]},
      { name: 'Blog Preview Section', items: [
        { id: 'idx_blog_eyebrow', label: 'Eyebrow', selector: 'section.section .section-title .eyebrow', index: 3, type: 'text' },
        { id: 'idx_blog_title', label: 'Title', selector: 'section.section .section-title h2', index: 3, type: 'text' },
        { id: 'idx_blog_lead', label: 'Lead', selector: 'section.section .section-title .lead', index: 3, type: 'text' },
        { id: 'idx_blog_btn', label: 'Button Text', selector: '.text-center .btn-outline', index: 0, type: 'text' },
      ]},
      { name: 'CTA Banner', items: [
        { id: 'idx_cta_eyebrow', label: 'Eyebrow', selector: '.cta-banner .eyebrow', type: 'text' },
        { id: 'idx_cta_title', label: 'Title', selector: '.cta-banner h2', type: 'html' },
        { id: 'idx_cta_lead', label: 'Lead', selector: '.cta-banner .lead', type: 'text' },
        { id: 'idx_cta_btn', label: 'Button Text', selector: '.cta-banner .btn', type: 'text' },
      ]},
      { name: 'Footer', items: [
        { id: 'idx_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
        { id: 'idx_footer_news', label: 'Newsletter Text', selector: '.footer-col p', index: 0, type: 'text' },
      ]},
    ]
  },

  'about': {
    label: 'About Page',
    groups: [
      { name: 'Page Header', items: [
        { id: 'about_hdr_eyebrow', label: 'Eyebrow', selector: '.page-header .eyebrow', type: 'text' },
        { id: 'about_hdr_title', label: 'Title', selector: '.page-header h1', type: 'html' },
        { id: 'about_hdr_lead', label: 'Subtitle', selector: '.page-header .lead', type: 'text' },
      ]},
      { name: 'Story Section', items: [
        { id: 'about_story_eyebrow', label: 'Eyebrow', selector: '.split-text .eyebrow', index: 0, type: 'text' },
        { id: 'about_story_title', label: 'Title', selector: '.split-text h2', index: 0, type: 'html' },
        { id: 'about_story_lead', label: 'Lead Paragraph', selector: '.split-text .lead', index: 0, type: 'text' },
        { id: 'about_story_p1', label: 'Paragraph 1', selector: '.split-text p:not(.lead)', index: 0, type: 'text' },
        { id: 'about_story_p2', label: 'Paragraph 2', selector: '.split-text p:not(.lead)', index: 1, type: 'text' },
        { id: 'about_story_btn', label: 'Button Text', selector: '.split-text .btn', index: 0, type: 'text' },
      ]},
      { name: 'Mission & Vision', items: [
        { id: 'about_mv_eyebrow', label: 'Eyebrow', selector: '.split-reverse .eyebrow', type: 'text' },
        { id: 'about_mv_title', label: 'Title', selector: '.split-reverse h2', type: 'html' },
        { id: 'about_mv_mission', label: 'Mission Text', selector: '.split-reverse p', index: 0, type: 'text' },
        { id: 'about_mv_vision', label: 'Vision Text', selector: '.split-reverse p', index: 1, type: 'text' },
        { id: 'about_mv_btn', label: 'Button Text', selector: '.split-reverse .btn', type: 'text' },
      ]},
      { name: 'Timeline Section', items: [
        { id: 'about_tl_eyebrow', label: 'Eyebrow', selector: '.section-title .eyebrow', index: 0, type: 'text' },
        { id: 'about_tl_title', label: 'Title', selector: '.section-title h2', index: 0, type: 'text' },
        { id: 'about_tl_lead', label: 'Lead', selector: '.section-title .lead', index: 0, type: 'text' },
      ]},
      { name: 'Core Values', items: [
        { id: 'about_val_eyebrow', label: 'Eyebrow', selector: '.section-title .eyebrow', index: 1, type: 'text' },
        { id: 'about_val_title', label: 'Title', selector: '.section-title h2', index: 1, type: 'text' },
        { id: 'about_val_lead', label: 'Lead', selector: '.section-title .lead', index: 1, type: 'text' },
        { id: 'about_val1_title', label: 'Value 1 Title', selector: '.value-item h3', index: 0, type: 'text' },
        { id: 'about_val1_text', label: 'Value 1 Text', selector: '.value-item p', index: 0, type: 'text' },
        { id: 'about_val2_title', label: 'Value 2 Title', selector: '.value-item h3', index: 1, type: 'text' },
        { id: 'about_val2_text', label: 'Value 2 Text', selector: '.value-item p', index: 1, type: 'text' },
        { id: 'about_val3_title', label: 'Value 3 Title', selector: '.value-item h3', index: 2, type: 'text' },
        { id: 'about_val3_text', label: 'Value 3 Text', selector: '.value-item p', index: 2, type: 'text' },
        { id: 'about_val4_title', label: 'Value 4 Title', selector: '.value-item h3', index: 3, type: 'text' },
        { id: 'about_val4_text', label: 'Value 4 Text', selector: '.value-item p', index: 3, type: 'text' },
      ]},
      { name: 'Footer', items: [
        { id: 'about_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
      ]},
    ]
  },

  'contact': {
    label: 'Contact Page',
    groups: [
      { name: 'Page Header', items: [
        { id: 'contact_hdr_eyebrow', label: 'Eyebrow', selector: '.page-header .eyebrow', type: 'text' },
        { id: 'contact_hdr_title', label: 'Title', selector: '.page-header h1', type: 'html' },
        { id: 'contact_hdr_lead', label: 'Subtitle', selector: '.page-header .lead', type: 'text' },
      ]},
      { name: 'Contact Info Section', items: [
        { id: 'contact_info_eyebrow', label: 'Eyebrow', selector: '.contact-grid .eyebrow', type: 'text' },
        { id: 'contact_info_title', label: 'Title', selector: '.contact-grid h2', type: 'html' },
        { id: 'contact_info_desc', label: 'Description', selector: '.contact-grid > div > p', type: 'text' },
        { id: 'contact_addr', label: 'Address', selector: '.contact-info-item p', index: 0, type: 'html' },
        { id: 'contact_phone', label: 'Phone', selector: '.contact-info-item p', index: 1, type: 'html' },
        { id: 'contact_email', label: 'Email', selector: '.contact-info-item p', index: 2, type: 'html' },
      ]},
      { name: 'Footer', items: [
        { id: 'contact_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
      ]},
    ]
  },

  'products': {
    label: 'Products Page',
    groups: [
      { name: 'Page Header', items: [
        { id: 'prod_hdr_eyebrow', label: 'Eyebrow', selector: '.page-header .eyebrow', type: 'text' },
        { id: 'prod_hdr_title', label: 'Title', selector: '.page-header h1', type: 'html' },
        { id: 'prod_hdr_lead', label: 'Subtitle', selector: '.page-header .lead', type: 'text' },
      ]},
      { name: 'Footer', items: [
        { id: 'prod_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
      ]},
    ]
  },

  'blog': {
    label: 'Blog Page',
    groups: [
      { name: 'Page Header', items: [
        { id: 'blog_hdr_eyebrow', label: 'Eyebrow', selector: '.page-header .eyebrow', type: 'text' },
        { id: 'blog_hdr_title', label: 'Title', selector: '.page-header h1', type: 'html' },
        { id: 'blog_hdr_lead', label: 'Subtitle', selector: '.page-header .lead', type: 'text' },
      ]},
      { name: 'Footer', items: [
        { id: 'blog_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
      ]},
    ]
  },

  'treatments': {
    label: 'Treatments Page',
    groups: [
      { name: 'Page Header', items: [
        { id: 'treat_hdr_eyebrow', label: 'Eyebrow', selector: '.page-header .eyebrow', type: 'text' },
        { id: 'treat_hdr_title', label: 'Title', selector: '.page-header h1', type: 'html' },
        { id: 'treat_hdr_lead', label: 'Subtitle', selector: '.page-header .lead', type: 'text' },
      ]},
      { name: 'Footer', items: [
        { id: 'treat_footer_desc', label: 'Brand Description', selector: '.footer-brand p', type: 'text' },
      ]},
    ]
  }
};

/* ---------- Content Store ---------- */
const CONTENT_KEY = 'myhbeauty_content';

const Content = {
  /* Get the current page key from URL */
  getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const page = path.replace('.html', '');
    return PAGE_CONTENT_SCHEMA[page] ? page : null;
  },

  /* Get all saved content overrides */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(CONTENT_KEY)) || {};
    } catch (e) {
      return {};
    }
  },

  /* Get saved overrides for a specific page */
  getPage(page) {
    const all = this.getAll();
    return all[page] || {};
  },

  /* Save overrides for a specific page */
  savePage(page, values) {
    const all = this.getAll();
    all[page] = values;
    localStorage.setItem(CONTENT_KEY, JSON.stringify(all));
  },

  /* Reset a page to defaults (remove overrides) */
  resetPage(page) {
    const all = this.getAll();
    delete all[page];
    localStorage.setItem(CONTENT_KEY, JSON.stringify(all));
  },

  /* Find a DOM element for a schema item */
  findElement(item) {
    const els = document.querySelectorAll(item.selector);
    const idx = item.index || 0;
    return els[idx] || null;
  },

  /* Get the current value of a schema item from the DOM */
  getValue(item) {
    const el = this.findElement(item);
    if (!el) return '';
    if (item.type === 'image') return el.src || el.getAttribute('src') || '';
    if (item.type === 'html') return el.innerHTML.trim();
    return el.textContent.trim();
  },

  /* Apply saved overrides to the current page's DOM */
  apply() {
    const page = this.getCurrentPage();
    if (!page) return;
    const schema = PAGE_CONTENT_SCHEMA[page];
    const overrides = this.getPage(page);

    schema.groups.forEach(group => {
      group.items.forEach(item => {
        const saved = overrides[item.id];
        if (saved === undefined) return;
        const el = this.findElement(item);
        if (!el) return;
        if (item.type === 'image') {
          el.src = saved;
        } else if (item.type === 'html') {
          el.innerHTML = saved;
        } else {
          el.textContent = saved;
        }
      });
    });
  },

  /* Get the full schema */
  getSchema() {
    return PAGE_CONTENT_SCHEMA;
  }
};
