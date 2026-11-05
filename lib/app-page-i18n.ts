import type { Locale } from '@/lib/i18n';

export type Shot = { src: string; alt: string };
type Feature = { id: string; kicker: string; title: string; body: string; points: string[]; shots: Shot[] };

type AppPageDict = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  titleAccent: string;
  intro: string;
  free: string;
  webApp: string;
  heroShot: Shot;
  pills: string[];
  features: Feature[];
  watchKicker: string;
  watchTitle: string;
  watchBody: string;
  watches: { name: string; body: string }[];
  shotsTitle: string;
  storeShots: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
  footerTitle: string;
};

const fr: AppPageDict = {
  metaTitle: 'App wingfoil et pumpfoil gratuite : coach IA, sessions, spots, vent',
  metaDescription:
    "L'app foil gratuite : ton coach IA débriefe chaque session. Sauts, jibes, vitesse, spots, prévisions, alertes vent, webcams, Apple Watch, Wear OS et Garmin.",
  kicker: "L'application TheFoilBuddy",
  title: 'Ton coach IA débriefe',
  titleAccent: 'chaque session.',
  intro:
    'Tu rides, l’app enregistre. Ton coach IA te dit ce qui a marché et quoi travailler la prochaine fois. Et derrière : tes sauts, tes jibes, ta vitesse, les spots, le vent et la communauté.',
  free: 'Gratuite · iPhone · Android · montres',
  webApp: 'Ou ouvre la version web',
  heroShot: { src: '/app-shots/v2-deb-fr.jpg', alt: 'Débrief de session par le coach IA' },
  pills: ['Wingfoil', 'Surf foil', 'Pumpfoil', 'Downwind', 'Parawing', 'Kitefoil'],
  features: [
    {
      id: 'coach',
      kicker: 'Coach IA',
      title: 'Un vrai coach dans ta poche',
      body: 'À la fin de chaque session, ton coach IA lit tes données et te fait un débrief : ce qui a bien marché, ce qui coince, et sur quoi te concentrer la prochaine fois. Tu peux ensuite lui poser tes questions.',
      points: ['Débrief de chaque session', 'Des pistes concrètes pour progresser', 'Adapté à ta pratique'],
      shots: [
        { src: '/app-shots/store-fr-3.jpg', alt: 'Pumpfoil : ton coach IA te débriefe' },
        { src: '/app-shots/v2-deb-fr.jpg', alt: 'Débrief du coach IA' },
      ],
    },
    {
      id: 'record',
      kicker: 'Enregistrement',
      title: 'Téléphone ou montre : tu lances et tu rides',
      body: 'Enregistre ta session depuis ton téléphone ou ta montre connectée. Tracé GPS, distance, vitesse et temps sur le foil sont enregistrés, et tu retrouves l’historique de toutes tes sorties pour suivre ta progression.',
      points: ['Tracé GPS complet', 'Distance, vitesse moyenne et max', 'Temps sur le foil, historique et progression'],
      shots: [{ src: '/app-shots/04-session.jpg', alt: 'Détail d’une session : durée, distance, vitesses, temps sur le foil' }],
    },
    {
      id: 'stats',
      kicker: 'Tes stats',
      title: 'Sauts, jibes, tacks, vitesse : tout est mesuré',
      body: 'Les métriques s’adaptent à ta pratique : sauts et meilleur saut en wing, jibes et tacks, vagues en surf foil, vols en pumpfoil, vitesse max. Et ta vitesse peut s’afficher sur ta vidéo GoPro, prête à partager.',
      points: ['Sauts : hauteur estimée et temps en l’air', 'Jibes et tacks comptés', 'Ta vitesse calée sur ta vidéo'],
      shots: [
        { src: '/app-shots/v2-stats-fr.jpg', alt: 'Statistiques de session' },
        { src: '/app-shots/store-fr-2.jpg', alt: 'Wingfoil : tes sauts mesurés' },
      ],
    },
    {
      id: 'spots',
      kicker: 'Spots et vent',
      title: 'Le bon spot, au bon moment',
      body: 'Une carte des spots dans le monde entier, chacun avec ses conditions : vent, rafales, direction, marée, houle, température de l’air et de l’eau, et sa webcam quand elle existe. Compare plusieurs modèles météo heure par heure, et reçois une alerte quand le vent correspond à tes réglages sur tes spots favoris.',
      points: ['Prévisions et comparaison des modèles (GFS, ICON, ECMWF, AROME)', 'Alertes vent sur tes spots', 'Webcams des spots', 'Ajoute ton spot s’il manque'],
      shots: [
        { src: '/app-shots/v2-spot-fr.jpg', alt: 'Conditions d’un spot' },
        { src: '/app-shots/store-fr-5.jpg', alt: 'Alertes vent sur tes spots' },
      ],
    },
    {
      id: 'community',
      kicker: 'Communauté',
      title: 'Les riders de ton spot',
      body: 'Chaque spot a son canal pour échanger avec les riders du coin et dire si ça ride. Envoie des messages privés, partage tes sessions et mesure-toi aux autres dans les classements par spot.',
      points: ['Canal par spot et signalement des conditions', 'Messages entre riders', 'Classements par spot'],
      shots: [
        { src: '/app-shots/02-spot.jpg', alt: 'Canal du spot et vent heure par heure' },
        { src: '/app-shots/05-partage.jpg', alt: 'Partage de session' },
      ],
    },
  ],
  watchKicker: 'Montres',
  watchTitle: 'Laisse ton téléphone au sec',
  watchBody: 'Lance l’enregistrement depuis ta montre, ride, puis enregistre : la session arrive toute seule dans l’app, avec le débrief de ton coach IA.',
  watches: [
    { name: 'Apple Watch', body: 'Lance et suis ta session depuis ton poignet.' },
    { name: 'Wear OS', body: 'Les montres Android, même principe.' },
    { name: 'Garmin', body: 'Tracé GPS, vitesse max, nombre de vols et distance. La session est aussi enregistrée dans Garmin Connect.' },
  ],
  shotsTitle: 'En images',
  storeShots: ['Surf foil : tes vagues, tes stats', 'Wingfoil : tes sauts mesurés', 'Pumpfoil : ton coach IA te débriefe', 'Ta vitesse, en vrai, sur ta vidéo', 'Alertes vent sur tes spots', 'Connecte ton IA', 'Gratuit sur iOS et Android'],
  faqTitle: 'Questions fréquentes',
  faq: [
    { q: 'L’application est-elle gratuite ?', a: 'Oui, TheFoilBuddy est gratuite sur l’App Store, Google Play et le Connect IQ Store de Garmin.' },
    { q: 'Quelles pratiques sont suivies ?', a: 'Wingfoil, surf foil, pumpfoil, dockstart, downwind, parawing et kitefoil. Les métriques s’adaptent à la pratique choisie.' },
    { q: 'Faut-il une montre ?', a: 'Non. Le téléphone suffit pour enregistrer une session ; une Apple Watch, une montre Wear OS ou une Garmin permet de le laisser au sec.' },
    { q: 'Mon spot n’est pas référencé, que faire ?', a: 'Ajoute-le depuis l’app : nom, position sur la carte, type de plan d’eau et webcam si elle existe.' },
  ],
  ctaTitle: 'Télécharge TheFoilBuddy',
  ctaBody: 'Gratuit. Ton prochain débrief t’attend.',
  footerTitle: 'L’application',
};

const en: AppPageDict = {
  metaTitle: 'Free wingfoil & pumpfoil app: AI coach, sessions, spots, wind',
  metaDescription:
    'The free foil app: your AI coach debriefs every session. Jumps, jibes, speed, spots, forecasts, wind alerts, webcams, Apple Watch, Wear OS and Garmin.',
  kicker: 'The TheFoilBuddy app',
  title: 'Your AI coach debriefs',
  titleAccent: 'every session.',
  intro:
    'You ride, the app records. Your AI coach tells you what worked and what to work on next time. And behind it: your jumps, jibes, speed, the spots, the wind and the community.',
  free: 'Free · iPhone · Android · watches',
  webApp: 'Or open the web version',
  heroShot: { src: '/app-shots/v2-deb-en.jpg', alt: 'AI coach session debrief' },
  pills: ['Wingfoil', 'Surf foil', 'Pumpfoil', 'Downwind', 'Parawing', 'Kitefoil'],
  features: [
    {
      id: 'coach',
      kicker: 'AI coach',
      title: 'A real coach in your pocket',
      body: 'After every session, your AI coach reads your data and debriefs you: what went well, what is holding you back, and what to focus on next time. Then ask it your own questions.',
      points: ['A debrief of every session', 'Concrete tips to progress', 'Adapted to your discipline'],
      shots: [
        { src: '/app-shots/store-en-3.jpg', alt: 'Pumpfoil: your AI coach debriefs you' },
        { src: '/app-shots/v2-deb-en.jpg', alt: 'AI coach debrief' },
      ],
    },
    {
      id: 'record',
      kicker: 'Recording',
      title: 'Phone or watch: press start and ride',
      body: 'Record your session from your phone or your smartwatch. GPS track, distance, speed and time on foil are saved, and your whole session history is there to track your progress.',
      points: ['Full GPS track', 'Distance, average and top speed', 'Time on foil, history and progress'],
      shots: [{ src: '/app-shots/session-en.jpg', alt: 'Session details: flights, time on foil, top speed' }],
    },
    {
      id: 'stats',
      kicker: 'Your stats',
      title: 'Jumps, jibes, tacks, speed: all measured',
      body: 'Metrics adapt to your discipline: jumps and best jump in wing, jibes and tacks, waves in surf foil, flights in pumpfoil, top speed. And your speed can be overlaid on your GoPro video, ready to share.',
      points: ['Jumps: estimated height and airtime', 'Jibes and tacks counted', 'Your speed synced on your video'],
      shots: [
        { src: '/app-shots/v2-stats-en.jpg', alt: 'Session stats' },
        { src: '/app-shots/store-en-2.jpg', alt: 'Wingfoil: your jumps, measured' },
      ],
    },
    {
      id: 'spots',
      kicker: 'Spots & wind',
      title: 'The right spot at the right time',
      body: 'A map of spots worldwide, each with its conditions: wind, gusts, direction, tide, swell, air and water temperature, and its webcam when there is one. Compare several weather models hour by hour, and get an alert when the wind matches your settings on your favourite spots.',
      points: ['Forecasts and model comparison (GFS, ICON, ECMWF, AROME)', 'Wind alerts on your spots', 'Spot webcams', 'Add your spot if it is missing'],
      shots: [
        { src: '/app-shots/v2-spot-en.jpg', alt: 'Spot conditions' },
        { src: '/app-shots/store-en-5.jpg', alt: 'Wind alerts for your spots' },
      ],
    },
    {
      id: 'community',
      kicker: 'Community',
      title: 'The riders of your spot',
      body: 'Every spot has its own channel to chat with local riders and say whether it is on. Send private messages, share your sessions and compare yourself on per-spot leaderboards.',
      points: ['Channel per spot and live condition reports', 'Messages between riders', 'Per-spot leaderboards'],
      shots: [
        { src: '/app-shots/community-en.jpg', alt: 'Spot channels' },
        { src: '/app-shots/v2-live-en.jpg', alt: 'Your speed on your video, ready to share' },
      ],
    },
  ],
  watchKicker: 'Watches',
  watchTitle: 'Keep your phone dry',
  watchBody: 'Start recording from your watch, ride, then save: the session lands in the app on its own, with your AI coach debrief.',
  watches: [
    { name: 'Apple Watch', body: 'Start and follow your session from your wrist.' },
    { name: 'Wear OS', body: 'Android watches, same idea.' },
    { name: 'Garmin', body: 'GPS track, top speed, number of flights and distance. The session is also saved to Garmin Connect.' },
  ],
  shotsTitle: 'In pictures',
  storeShots: ['Surf foil: your waves, your stats', 'Wingfoil: your jumps, measured', 'Pumpfoil: your AI coach debriefs you', 'Your real speed, on your video', 'Wind alerts for your spots', 'Connect your AI', 'Free on iOS and Android'],
  faqTitle: 'FAQ',
  faq: [
    { q: 'Is the app free?', a: 'Yes, TheFoilBuddy is free on the App Store, Google Play and the Garmin Connect IQ Store.' },
    { q: 'Which disciplines are tracked?', a: 'Wingfoil, surf foil, pumpfoil, dockstart, downwind, parawing and kitefoil. The metrics adapt to the discipline you pick.' },
    { q: 'Do I need a watch?', a: 'No. Your phone is enough to record a session; an Apple Watch, a Wear OS watch or a Garmin lets you keep it dry.' },
    { q: 'My spot is missing, what can I do?', a: 'Add it from the app: name, position on the map, type of water and webcam if there is one.' },
  ],
  ctaTitle: 'Get TheFoilBuddy',
  ctaBody: 'Free. Your next debrief is waiting.',
  footerTitle: 'The app',
};

export function appPageT(locale: Locale): AppPageDict {
  return locale === 'fr' ? fr : en;
}
