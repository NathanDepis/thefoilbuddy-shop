import type { Locale } from '@/lib/i18n';

type AppPageDict = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  webApp: string;
  featuresTitle: string;
  features: { title: string; body: string }[];
  shotsTitle: string;
  shots: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  badgeStrip: string;
  footerTitle: string;
};

const fr: AppPageDict = {
  metaTitle: 'Application TheFoilBuddy — spots, conditions et tracking foil',
  metaDescription:
    "L'app TheFoilBuddy (The Foil Buddy) : spots et conditions en temps réel, tracking de session pumpfoil, dockstart, wingfoil, surf foil et downwind, montre Apple Watch / Wear OS, communauté. Gratuite sur iPhone.",
  kicker: "L'application",
  title: 'TheFoilBuddy, ton compagnon de session foil.',
  intro:
    'Trouve le bon spot au bon moment, enregistre tes sessions et partage-les avec la communauté. Gratuite sur l’App Store, bientôt sur Google Play.',
  webApp: 'Ou ouvre la version web',
  featuresTitle: 'Ce que fait l’app',
  features: [
    {
      title: 'Spots et conditions',
      body: 'Carte des spots, vent, rafales, direction, marées, houle et température, avec comparaison de plusieurs modèles météo heure par heure.',
    },
    {
      title: 'Tracking par pratique',
      body: 'Pumpfoil, dockstart, wingfoil, surf foil et downwind : chaque session est enregistrée avec les métriques qui comptent pour ta pratique — distance, vitesse, temps de vol, tracé GPS.',
    },
    {
      title: 'Montre connectée',
      body: 'Lance et suis ta session depuis ton Apple Watch ou ta montre Wear OS, sans sortir le téléphone.',
    },
    {
      title: 'Vidéo de partage',
      body: 'Génère une vidéo de ta session avec ton tracé et tes stats, prête à partager.',
    },
    {
      title: 'Communauté',
      body: 'Canal par spot, signalement des conditions du moment, messages entre riders et classements par spot.',
    },
    {
      title: 'IA',
      body: 'Un débrief de chaque session par l’IA, et un connecteur pour interroger tes sessions et les conditions depuis ton assistant IA.',
    },
  ],
  shotsTitle: 'Aperçu',
  shots: ['Carte des spots', 'Vent heure par heure sur un spot', 'Comparaison des modèles météo', 'Détail d’une session', 'Vidéo de partage'],
  faqTitle: 'Questions fréquentes',
  faq: [
    { q: 'L’application est-elle gratuite ?', a: 'Oui, TheFoilBuddy se télécharge gratuitement sur l’App Store.' },
    {
      q: 'Est-elle disponible sur Android ?',
      a: 'La version Android est en test fermé sur Google Play et arrive bientôt. En attendant, la version web fonctionne dans le navigateur de ton téléphone.',
    },
    {
      q: 'Quelles pratiques sont suivies ?',
      a: 'Pumpfoil, dockstart, wingfoil, surf foil et downwind. Les métriques affichées s’adaptent à la pratique choisie.',
    },
    {
      q: 'Faut-il une montre ?',
      a: 'Non. Le téléphone suffit pour enregistrer une session ; l’Apple Watch ou une montre Wear OS permet de le laisser au sec.',
    },
    {
      q: 'Mon spot n’est pas référencé, que faire ?',
      a: 'Ajoute-le depuis l’app en quelques secondes : nom, position sur la carte, type de plan d’eau et webcam si elle existe.',
    },
  ],
  ctaTitle: 'Télécharge TheFoilBuddy',
  badgeStrip: 'L’app TheFoilBuddy est disponible',
  footerTitle: 'L’application',
};

const en: AppPageDict = {
  metaTitle: 'TheFoilBuddy app — foil spots, live conditions and session tracking',
  metaDescription:
    'The TheFoilBuddy (The Foil Buddy) app: spots and live conditions, session tracking for pumpfoil, dockstart, wingfoil, surf foil and downwind, Apple Watch / Wear OS, community. Free on iPhone.',
  kicker: 'The app',
  title: 'TheFoilBuddy, your foil session companion.',
  intro:
    'Find the right spot at the right time, record your sessions and share them with the community. Free on the App Store, coming soon to Google Play.',
  webApp: 'Or open the web version',
  featuresTitle: 'What the app does',
  features: [
    {
      title: 'Spots and conditions',
      body: 'Spot map, wind, gusts, direction, tides, swell and temperature, with several weather models compared hour by hour.',
    },
    {
      title: 'Tracking by discipline',
      body: 'Pumpfoil, dockstart, wingfoil, surf foil and downwind: each session is recorded with the metrics that matter for your discipline — distance, speed, flight time, GPS track.',
    },
    {
      title: 'Smartwatch',
      body: 'Start and follow your session from your Apple Watch or Wear OS watch, and leave your phone on the beach.',
    },
    {
      title: 'Share video',
      body: 'Generate a video of your session with your track and stats, ready to share.',
    },
    {
      title: 'Community',
      body: 'A channel per spot, live condition reports, messages between riders and per-spot leaderboards.',
    },
    {
      title: 'AI',
      body: 'An AI debrief of every session, and a connector to ask your AI assistant about your sessions and the conditions.',
    },
  ],
  shotsTitle: 'Preview',
  shots: ['Spot map', 'Hourly wind on a spot', 'Weather model comparison', 'Session details', 'Share video'],
  faqTitle: 'FAQ',
  faq: [
    { q: 'Is the app free?', a: 'Yes, TheFoilBuddy is a free download on the App Store.' },
    {
      q: 'Is it available on Android?',
      a: 'The Android version is in closed testing on Google Play and is coming soon. Meanwhile, the web version works in your phone browser.',
    },
    {
      q: 'Which disciplines are tracked?',
      a: 'Pumpfoil, dockstart, wingfoil, surf foil and downwind. The metrics adapt to the discipline you pick.',
    },
    {
      q: 'Do I need a watch?',
      a: 'No. Your phone is enough to record a session; an Apple Watch or Wear OS watch lets you keep it dry.',
    },
    {
      q: 'My spot is missing, what can I do?',
      a: 'Add it from the app in seconds: name, position on the map, type of water and webcam if there is one.',
    },
  ],
  ctaTitle: 'Get TheFoilBuddy',
  badgeStrip: 'The TheFoilBuddy app is out',
  footerTitle: 'The app',
};

export function appPageT(locale: Locale): AppPageDict {
  return locale === 'fr' ? fr : en;
}
