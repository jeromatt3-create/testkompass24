const env = typeof process !== 'undefined' && process.env ? process.env : {};

export const SITE_CONFIG = {
  name: env.SITE_NAME || 'TestKompass24',
  tagline: 'Unabhängige Produktvergleiche, Kaufberatung & Preis-Checks',
  description:
    'Aktuelle Produktvergleiche, datenbasierte Kaufberatungen und Preis-Leistungs-Checks für Tech, Haushalt, Smart Home, Audio und Alltag.',
  amazonPartnerTag: env.AMAZON_PARTNER_TAG || 'testkompass0a-21',
  amazonMarketplace: 'www.amazon.de',
  preferDirectAsin: false,
  categories: {
    'tech-gadgets': {
      slug: 'tech-gadgets',
      name: 'Tech & Gadgets',
      icon: '💻',
      description:
        'Smartphones, Zubehör, Powerbanks, Wearables & Technik-Neuheiten im Vergleich.',
      accent: '#2563eb',
    },
    'haushalt-kueche': {
      slug: 'haushalt-kueche',
      name: 'Haushalt & Küche',
      icon: '🍳',
      description:
        'Heißluftfritteusen, Saugroboter, Kaffeemaschinen und smarte Küchenhelfer.',
      accent: '#d97706',
    },
    'smart-home': {
      slug: 'smart-home',
      name: 'Smart Home & Wohnen',
      icon: '🏠',
      description:
        'Überwachungskameras, smarte Thermostate, Beleuchtung & Luftreiniger.',
      accent: '#059669',
    },
    'gaming-audio': {
      slug: 'gaming-audio',
      name: 'Gaming & Audio',
      icon: '🎧',
      description:
        'Bluetooth-Kopfhörer, Gaming-Headsets, Mikrofone und Lautsprecher.',
      accent: '#7c3aed',
    },
    'outdoor-fitness': {
      slug: 'outdoor-fitness',
      name: 'Fitness & Alltag',
      icon: '🏃',
      description:
        'Fitness-Tracker, Massagepistolen, E-Scooter-Zubehör und Outdoor-Ausrüstung.',
      accent: '#e11d48',
    },
  },
};

export function getCategoryList() {
  return Object.values(SITE_CONFIG.categories);
}

export function getCategoryBySlug(slug) {
  return SITE_CONFIG.categories[slug] || SITE_CONFIG.categories['tech-gadgets'];
}
