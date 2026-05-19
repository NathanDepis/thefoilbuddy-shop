import type { Locale } from './i18n';

export const REVIEW_STRINGS: Record<Locale, {
  pageTitle: string;
  invalidTitle: string;
  invalidBody: string;
  formTitle: (product: string) => string;
  formSubtitle: (firstName: string) => string;
  ratingLabel: string;
  ratingHelp: string;
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  bodyHelp: string;
  locationLabel: string;
  locationPlaceholder: string;
  submit: string;
  submitting: string;
  errorGeneric: string;
  errorRating: string;
  thanksTitle: string;
  thanksBody: string;
  thanksLink: string;
  verifiedBadge: string;
}> = {
  fr: {
    pageTitle: 'Ton avis',
    invalidTitle: 'Lien invalide ou expiré',
    invalidBody: "Ce lien n'est plus valide. Si tu penses que c'est une erreur, écris-nous à support@thefoilbuddy.com.",
    formTitle: (product) => `Comment trouves-tu ton ${product} ?`,
    formSubtitle: (firstName) => `Salut ${firstName}, raconte-nous en quelques mots — ça nous aide énormément.`,
    ratingLabel: 'Ta note',
    ratingHelp: 'Clique sur une étoile',
    titleLabel: 'Titre (optionnel)',
    titlePlaceholder: 'Indispensable sur l\'eau',
    bodyLabel: 'Ton avis',
    bodyPlaceholder: 'Raconte-nous comment l\'outil te sert au quotidien…',
    bodyHelp: 'Quelques mots suffisent.',
    locationLabel: 'Ta ville (optionnel)',
    locationPlaceholder: 'Bayonne, Carro, Plougonvelin…',
    submit: 'Envoyer mon avis',
    submitting: 'Envoi…',
    errorGeneric: 'Une erreur s\'est produite. Réessaie dans un instant.',
    errorRating: 'Choisis une note (1 à 5 étoiles).',
    thanksTitle: 'Merci !',
    thanksBody: 'Ton avis nous aide énormément. À bientôt sur l\'eau 🌊',
    thanksLink: 'Retour sur le site',
    verifiedBadge: 'Achat vérifié',
  },
  en: {
    pageTitle: 'Your review',
    invalidTitle: 'Invalid or expired link',
    invalidBody: 'This link is no longer valid. If you think this is a mistake, drop us a line at support@thefoilbuddy.com.',
    formTitle: (product) => `How's your ${product} treating you?`,
    formSubtitle: (firstName) => `Hi ${firstName}, tell us in a few words — it helps us a lot.`,
    ratingLabel: 'Your rating',
    ratingHelp: 'Tap a star',
    titleLabel: 'Title (optional)',
    titlePlaceholder: 'Game changer',
    bodyLabel: 'Your review',
    bodyPlaceholder: 'Tell us how it serves you out there…',
    bodyHelp: 'A few words is enough.',
    locationLabel: 'Your city (optional)',
    locationPlaceholder: 'Bayonne, Carro, San Diego…',
    submit: 'Submit my review',
    submitting: 'Submitting…',
    errorGeneric: 'Something went wrong. Please try again.',
    errorRating: 'Please select a rating (1 to 5 stars).',
    thanksTitle: 'Thank you!',
    thanksBody: 'Your review helps us a lot. See you on the water 🌊',
    thanksLink: 'Back to the site',
    verifiedBadge: 'Verified buyer',
  },
};
