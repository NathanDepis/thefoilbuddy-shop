import type { Locale } from './i18n';

/**
 * Informations légales de THEFOILBUDDY (SAS) — source :
 * https://annuaire-entreprises.data.gouv.fr/entreprise/100479591
 *
 * À tenir à jour si l'un de ces éléments change (statuts, siège, médiateur,
 * numéro TVA intracom si assujettissement, etc.).
 */
export const COMPANY = {
  name: 'THEFOILBUDDY',
  legalForm: 'SAS, société par actions simplifiée',
  capital: '100 €',
  address: '31 chemin de Hausses, Résidence Californie — Apt. 7, 64100 Bayonne, France',
  siren: '100 479 591',
  siret: '100 479 591 00016',
  apeCode: '47.91B',
  apeLabel: 'Vente à distance sur catalogue spécialisé',
  rneDate: '03/02/2026',
  vatNumber: 'FR33 100 479 591',
  vatNotice: 'Assujettie à la TVA — numéro de TVA intracommunautaire : FR33 100 479 591',
  director: 'Nathan Depis',
  email: 'support@thefoilbuddy.com',
  host: {
    name: 'Cloudflare, Inc.',
    address: '101 Townsend Street, San Francisco, CA 94107, États-Unis',
    url: 'https://www.cloudflare.com',
  },
  mediator: {
    // À compléter une fois l'adhésion médiateur conso réalisée (obligatoire B2C).
    // Exemples : MEDICYS (medicys.fr), CM2C (cm2c.net), FEVAD (fevad.com).
    name: '[À COMPLÉTER — médiateur de la consommation agréé]',
    url: 'https://www.economie.gouv.fr/mediation-conso',
  },
} as const;

export type LegalDoc = {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
};

const LAST_UPDATED_FR = 'Dernière mise à jour : avril 2026';
const LAST_UPDATED_EN = 'Last updated: April 2026';

/* ==========================================================================
   MENTIONS LÉGALES / LEGAL NOTICE
   ========================================================================== */

const legalFr: LegalDoc = {
  title: 'Mentions légales',
  updated: LAST_UPDATED_FR,
  sections: [
    {
      heading: 'Éditeur du site',
      body: `Le site thefoilbuddy.com est édité par la société ${COMPANY.name}, ${COMPANY.legalForm} au capital de ${COMPANY.capital}.
Siège social : ${COMPANY.address}.
SIREN : ${COMPANY.siren} — SIRET (siège) : ${COMPANY.siret}.
Code APE : ${COMPANY.apeCode} (${COMPANY.apeLabel}).
Société immatriculée au Registre national des entreprises (RNE) le ${COMPANY.rneDate}.
Numéro de TVA intracommunautaire : ${COMPANY.vatNumber}.
Directeur de la publication : ${COMPANY.director}.
Contact : ${COMPANY.email}.`,
    },
    {
      heading: 'Hébergeur',
      body: `${COMPANY.host.name}, ${COMPANY.host.address}. Site : ${COMPANY.host.url}.`,
    },
    {
      heading: 'Prestataire e-commerce',
      body: `Le catalogue produits, la gestion du panier, du paiement, de la facturation et des commandes est assurée par Wix.com Ltd., 40 Namal Tel Aviv St., Tel Aviv 6350671, Israël. Les paiements sont traités par Wix Payments dans un environnement sécurisé conforme aux standards PCI-DSS.`,
    },
    {
      heading: 'Propriété intellectuelle',
      body: `L'ensemble des contenus du site (textes, images, vidéos, logos, code) est la propriété exclusive de ${COMPANY.name} ou de ses partenaires, et protégé par le droit d'auteur et le droit des marques. Toute reproduction, représentation ou utilisation, totale ou partielle, sans autorisation écrite préalable est interdite.`,
    },
    {
      heading: 'Responsabilité',
      body: `${COMPANY.name} s'efforce d'assurer l'exactitude des informations publiées sur ce site mais ne peut garantir l'absence d'erreurs ou d'omissions. L'utilisateur reconnaît utiliser les informations et outils disponibles sous sa seule responsabilité.`,
    },
    {
      heading: 'Contact',
      body: `Pour toute question relative au site ou à son contenu : ${COMPANY.email}.`,
    },
  ],
};

const legalEn: LegalDoc = {
  title: 'Legal notice',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: 'Site publisher',
      body: `thefoilbuddy.com is operated by ${COMPANY.name}, a French simplified joint-stock company (SAS) with share capital of ${COMPANY.capital}.
Registered office: ${COMPANY.address}.
SIREN: ${COMPANY.siren} — SIRET (head office): ${COMPANY.siret}.
NAF code: ${COMPANY.apeCode} (${COMPANY.apeLabel}).
Registered with the French National Register of Enterprises (RNE) on ${COMPANY.rneDate}.
Intra-community VAT number: ${COMPANY.vatNumber}.
Publication director: ${COMPANY.director}.
Contact: ${COMPANY.email}.`,
    },
    {
      heading: 'Hosting',
      body: `${COMPANY.host.name}, ${COMPANY.host.address}. Website: ${COMPANY.host.url}.`,
    },
    {
      heading: 'E-commerce platform',
      body: `Product catalog, cart, checkout, invoicing and order management are handled by Wix.com Ltd., 40 Namal Tel Aviv St., Tel Aviv 6350671, Israel. Payments are processed by Wix Payments in a PCI-DSS compliant secure environment.`,
    },
    {
      heading: 'Intellectual property',
      body: `All content on this site (texts, images, videos, logos, code) is the exclusive property of ${COMPANY.name} or its partners, and protected by copyright and trademark law. Any reproduction, representation or use, in whole or in part, without prior written permission is prohibited.`,
    },
    {
      heading: 'Liability',
      body: `${COMPANY.name} strives to ensure the accuracy of the information published on this site but cannot guarantee the absence of errors or omissions. Users acknowledge that they use the information and tools available at their own risk.`,
    },
    {
      heading: 'Contact',
      body: `For any question related to this site or its content: ${COMPANY.email}.`,
    },
  ],
};

/* ==========================================================================
   CGV / TERMS
   ========================================================================== */

const termsFr: LegalDoc = {
  title: 'Conditions générales de vente',
  updated: LAST_UPDATED_FR,
  sections: [
    {
      heading: '1. Objet',
      body: `Les présentes conditions générales de vente (« CGV ») régissent les relations contractuelles entre la société ${COMPANY.name} (ci-après « le Vendeur ») et tout consommateur (ci-après « le Client ») effectuant un achat sur le site thefoilbuddy.com. Toute commande implique l'acceptation sans réserve des présentes CGV.`,
    },
    {
      heading: '2. Produits',
      body: `Les produits proposés à la vente sont décrits et présentés avec la plus grande exactitude possible. En cas d'erreur ou omission, la responsabilité du Vendeur ne saurait être engagée. Les photographies ont une valeur illustrative et ne sont pas contractuelles.`,
    },
    {
      heading: '3. Prix',
      body: `Les prix sont indiqués en euros, toutes taxes comprises (TVA française au taux normal de 20 % applicable). Numéro de TVA intracommunautaire du Vendeur : ${COMPANY.vatNumber}. Les frais de livraison sont indiqués avant validation de la commande. Le Vendeur se réserve le droit de modifier ses prix à tout moment ; les produits seront facturés sur la base du tarif en vigueur au moment de la validation de la commande.`,
    },
    {
      heading: '4. Commande',
      body: `Le Client passe commande via le site en sélectionnant les produits, puis en validant son panier. La commande est définitivement enregistrée après confirmation du paiement. Le Vendeur se réserve le droit d'annuler ou refuser toute commande en cas de litige ou de défaut de paiement.`,
    },
    {
      heading: '5. Paiement',
      body: `Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard) ou via les solutions proposées au checkout (Apple Pay, Google Pay). Les transactions sont traitées par Wix Payments dans un environnement sécurisé (protocole SSL, conformité PCI-DSS). Aucune donnée de carte n'est conservée par le Vendeur.`,
    },
    {
      heading: '6. Livraison',
      body: `Les commandes sont expédiées sous 48 heures ouvrées à compter de la validation du paiement. Les délais de livraison varient de 3 à 5 jours ouvrés en France métropolitaine. La livraison est gratuite en France métropolitaine. Pour toute expédition hors France, les frais et délais sont indiqués lors du checkout. Le Vendeur ne saurait être tenu responsable des retards imputables au transporteur.`,
    },
    {
      heading: '7. Droit de rétractation',
      body: `Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un délai de quatorze (14) jours à compter de la réception du produit pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités. Le produit doit être retourné dans son état d'origine, non utilisé, dans son emballage d'origine, accompagné de sa preuve d'achat. Les frais de retour sont à la charge du Client. Le remboursement sera effectué dans un délai maximum de 14 jours suivant la réception du produit retourné, par le même moyen de paiement que celui utilisé lors de la commande. Un formulaire-type de rétractation est reproduit en annexe des présentes CGV.`,
    },
    {
      heading: '8. Garanties légales',
      body: `Indépendamment de toute garantie commerciale, le Vendeur reste tenu des défauts de conformité du bien au contrat dans les conditions des articles L217-3 à L217-14 du Code de la consommation (garantie légale de conformité, 2 ans à compter de la délivrance du bien) et des défauts cachés de la chose vendue dans les conditions des articles 1641 à 1649 du Code civil (garantie des vices cachés, 2 ans à compter de la découverte du vice). Les outils Foil Buddy en titane grade 5 sont par ailleurs garantis à vie contre la corrosion par le Vendeur, dans le cadre d'un usage normal du produit.`,
    },
    {
      heading: '9. Responsabilité',
      body: `Les produits commercialisés sont destinés à un usage spécifique (entretien et réglage de matériel de foil nautique). Le Client reconnaît avoir pris connaissance des précautions d'usage et utilise le produit sous sa seule responsabilité. Le Vendeur ne pourra être tenu responsable de tout dommage résultant d'une mauvaise utilisation ou d'un usage non conforme à la destination du produit.`,
    },
    {
      heading: '10. Données personnelles',
      body: `Le traitement des données personnelles est détaillé dans la Politique de confidentialité, accessible depuis le pied de page du site.`,
    },
    {
      heading: '11. Règlement des litiges — Médiation de la consommation',
      body: `Conformément à l'article L612-1 du Code de la consommation, en cas de litige avec le Vendeur et après avoir effectué une démarche écrite préalable resté infructueuse, le Client peut recourir gratuitement au médiateur de la consommation suivant : ${COMPANY.mediator.name}. Le Client peut également recourir à la plateforme européenne de Règlement en Ligne des Litiges (RLL) : https://ec.europa.eu/consumers/odr.`,
    },
    {
      heading: '12. Droit applicable — Juridiction compétente',
      body: `Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.`,
    },
    {
      heading: 'Annexe — Formulaire-type de rétractation',
      body: `(À compléter et renvoyer uniquement en cas de rétractation)

À l'attention de ${COMPANY.name}, ${COMPANY.address}, ${COMPANY.email} :

Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien ci-dessous :

— Commandé le (*)/reçu le (*) :
— Nom du (des) consommateur(s) :
— Adresse du (des) consommateur(s) :
— Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :
— Date :

(*) Rayez la mention inutile.`,
    },
  ],
};

const termsEn: LegalDoc = {
  title: 'Terms and conditions',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: '1. Purpose',
      body: `These terms and conditions ("Terms") govern the contractual relationship between ${COMPANY.name} ("the Seller") and any consumer ("the Customer") placing an order on thefoilbuddy.com. Placing an order implies unreserved acceptance of these Terms.`,
    },
    {
      heading: '2. Products',
      body: `Products offered for sale are described and presented as accurately as possible. The Seller cannot be held liable for errors or omissions. Product photographs are for illustrative purposes only and are not contractual.`,
    },
    {
      heading: '3. Prices',
      body: `Prices are indicated in euros, all taxes included (French standard VAT rate of 20% applies). Seller's intra-community VAT number: ${COMPANY.vatNumber}. Shipping fees are shown before order confirmation. The Seller reserves the right to change prices at any time; products will be invoiced at the price in effect at the time the order is confirmed.`,
    },
    {
      heading: '4. Order',
      body: `The Customer places an order through the site by selecting products and confirming the cart. The order is definitively recorded after payment confirmation. The Seller reserves the right to cancel or refuse any order in case of dispute or payment default.`,
    },
    {
      heading: '5. Payment',
      body: `Payment is made online by credit card (Visa, Mastercard) or via the checkout options (Apple Pay, Google Pay). Transactions are processed by Wix Payments in a secure environment (SSL protocol, PCI-DSS compliance). No card data is retained by the Seller.`,
    },
    {
      heading: '6. Shipping',
      body: `Orders are shipped within 48 working hours from payment confirmation. Delivery times range from 3 to 5 working days in metropolitan France. Shipping is free within metropolitan France. For international shipments, fees and times are indicated at checkout. The Seller cannot be held liable for delays attributable to the carrier.`,
    },
    {
      heading: '7. Right of withdrawal',
      body: `Pursuant to articles L221-18 et seq. of the French Consumer Code, the Customer has a period of fourteen (14) days from receipt of the product to exercise the right of withdrawal without having to justify reasons or pay penalties. The product must be returned in its original condition, unused, in its original packaging, accompanied by proof of purchase. Return shipping costs are borne by the Customer. Refunds will be issued within a maximum of 14 days following receipt of the returned product, using the same means of payment used for the order. A standard withdrawal form is provided in the annex to these Terms.`,
    },
    {
      heading: '8. Legal warranties',
      body: `Regardless of any commercial warranty, the Seller remains liable for non-conformities of the goods to the contract under the conditions of articles L217-3 to L217-14 of the Consumer Code (legal warranty of conformity, 2 years from delivery) and for hidden defects under the conditions of articles 1641 to 1649 of the Civil Code (warranty against hidden defects, 2 years from discovery of the defect). Foil Buddy titanium grade 5 tools are additionally covered by a lifetime warranty against corrosion by the Seller, under normal product use.`,
    },
    {
      heading: '9. Liability',
      body: `Products are intended for a specific use (maintenance and adjustment of nautical foil equipment). The Customer acknowledges having read the usage precautions and uses the product at their own risk. The Seller cannot be held liable for any damage resulting from misuse or use contrary to the product's intended purpose.`,
    },
    {
      heading: '10. Personal data',
      body: `Personal data processing is detailed in the Privacy Policy, accessible from the site footer.`,
    },
    {
      heading: '11. Dispute resolution — Consumer mediation',
      body: `Pursuant to art. L612-1 of the French Consumer Code, in the event of a dispute with the Seller and after a prior written claim has remained unsuccessful, the Customer may refer the matter free of charge to the following consumer mediator: ${COMPANY.mediator.name}. The Customer may also use the European Online Dispute Resolution platform: https://ec.europa.eu/consumers/odr.`,
    },
    {
      heading: '12. Governing law — Jurisdiction',
      body: `These Terms are governed by French law. In the event of a dispute, and failing amicable resolution, the French courts shall have sole jurisdiction.`,
    },
    {
      heading: 'Annex — Standard withdrawal form',
      body: `(To be completed and returned only if you wish to withdraw from the contract)

To ${COMPANY.name}, ${COMPANY.address}, ${COMPANY.email}:

I/We (*) hereby give notice that I/we (*) withdraw from my/our (*) contract of sale of the following good:

— Ordered on (*)/received on (*):
— Name of consumer(s):
— Address of consumer(s):
— Signature of consumer(s) (only if this form is notified on paper):
— Date:

(*) Delete as appropriate.`,
    },
  ],
};

/* ==========================================================================
   POLITIQUE DE CONFIDENTIALITÉ / PRIVACY POLICY
   ========================================================================== */

const privacyFr: LegalDoc = {
  title: 'Politique de confidentialité',
  updated: LAST_UPDATED_FR,
  sections: [
    {
      heading: 'Responsable de traitement',
      body: `Le responsable du traitement des données personnelles est ${COMPANY.name}, ${COMPANY.address}. Contact : ${COMPANY.email}.`,
    },
    {
      heading: 'Données collectées',
      body: `Dans le cadre de l'utilisation du site et du traitement des commandes, nous collectons les catégories de données suivantes :
— identité (nom, prénom) ;
— coordonnées (adresse postale, email, téléphone) ;
— données de commande (produits, montants, historique d'achat) ;
— données techniques (adresse IP, logs de connexion, type de navigateur) ;
— données de navigation (cookies, voir section dédiée).
Aucune donnée bancaire n'est conservée par le Vendeur ; les paiements sont intégralement traités par Wix Payments.`,
    },
    {
      heading: 'Finalités et bases légales',
      body: `Vos données sont traitées pour :
— exécuter votre commande et en assurer le suivi (base légale : exécution du contrat) ;
— émettre les factures et respecter les obligations comptables et fiscales (base légale : obligation légale) ;
— répondre à vos sollicitations via le service client (base légale : intérêt légitime) ;
— vous envoyer, avec votre consentement, des communications marketing (base légale : consentement).`,
    },
    {
      heading: 'Destinataires',
      body: `Les données sont accessibles aux services internes du Vendeur et à ses sous-traitants strictement nécessaires à l'exécution des prestations : Wix.com Ltd. (hébergement catalogue, panier, paiements, facturation), transporteurs (livraison), Cloudflare (hébergement site).`,
    },
    {
      heading: 'Durée de conservation',
      body: `Les données client sont conservées pendant toute la durée de la relation commerciale, puis archivées pour une durée maximale de 10 ans après la dernière commande afin de respecter les obligations comptables et fiscales. Les données à des fins marketing sont conservées 3 ans à compter du dernier contact.`,
    },
    {
      heading: 'Cookies',
      body: `Le site utilise des cookies strictement nécessaires à son fonctionnement (session, panier) et, sous réserve de votre consentement, des cookies de mesure d'audience. Vous pouvez à tout moment modifier vos préférences via les paramètres de votre navigateur ou le bandeau dédié.`,
    },
    {
      heading: 'Vos droits',
      body: `Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants : droit d'accès, de rectification, d'effacement, d'opposition, de limitation du traitement, et de portabilité. Vous pouvez exercer ces droits en écrivant à ${COMPANY.email} ou par courrier postal à l'adresse du siège. En cas de difficulté, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).`,
    },
    {
      heading: 'Transferts hors UE',
      body: `Certains sous-traitants (Wix.com Ltd., basé en Israël ; Cloudflare, Inc., basé aux États-Unis) peuvent être amenés à traiter des données en dehors de l'Union européenne. Ces transferts sont encadrés par les mécanismes prévus par le RGPD (décisions d'adéquation, clauses contractuelles types).`,
    },
  ],
};

const privacyEn: LegalDoc = {
  title: 'Privacy policy',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: 'Data controller',
      body: `The personal data controller is ${COMPANY.name}, ${COMPANY.address}. Contact: ${COMPANY.email}.`,
    },
    {
      heading: 'Data collected',
      body: `In connection with the use of the site and the processing of orders, we collect the following categories of data:
— identity (first name, last name);
— contact details (postal address, email, phone);
— order data (products, amounts, purchase history);
— technical data (IP address, connection logs, browser type);
— browsing data (cookies, see dedicated section).
No banking data is retained by the Seller; payments are processed entirely by Wix Payments.`,
    },
    {
      heading: 'Purposes and legal bases',
      body: `Your data is processed to:
— fulfill your order and provide tracking (legal basis: performance of the contract);
— issue invoices and comply with accounting and tax obligations (legal basis: legal obligation);
— respond to your customer service requests (legal basis: legitimate interest);
— send you marketing communications, with your consent (legal basis: consent).`,
    },
    {
      heading: 'Recipients',
      body: `Data is accessible to the Seller's internal teams and to subcontractors strictly necessary to provide services: Wix.com Ltd. (catalog, cart, payments, invoicing), carriers (delivery), Cloudflare (site hosting).`,
    },
    {
      heading: 'Retention period',
      body: `Customer data is retained throughout the commercial relationship, then archived for a maximum period of 10 years after the last order to comply with accounting and tax obligations. Marketing data is retained for 3 years from the last contact.`,
    },
    {
      heading: 'Cookies',
      body: `The site uses cookies strictly necessary for its operation (session, cart) and, subject to your consent, audience measurement cookies. You can change your preferences at any time via your browser settings or the dedicated banner.`,
    },
    {
      heading: 'Your rights',
      body: `Under Regulation (EU) 2016/679 (GDPR) and the French Data Protection Act, you have the following rights: access, rectification, erasure, objection, restriction of processing, and data portability. You can exercise these rights by writing to ${COMPANY.email} or by postal mail to the registered office address. In case of difficulty, you may file a complaint with the French data protection authority (CNIL, www.cnil.fr).`,
    },
    {
      heading: 'International data transfers',
      body: `Some subcontractors (Wix.com Ltd., based in Israel; Cloudflare, Inc., based in the United States) may process data outside the European Union. These transfers are framed by the mechanisms provided by the GDPR (adequacy decisions, standard contractual clauses).`,
    },
  ],
};

/* ==========================================================================
   RETOURS & LIVRAISON / SHIPPING & RETURNS
   ========================================================================== */

const returnsFr: LegalDoc = {
  title: 'Livraison & retours',
  updated: LAST_UPDATED_FR,
  sections: [
    {
      heading: 'Livraison',
      body: `Les commandes sont préparées et expédiées sous 48 heures ouvrées à compter de la validation du paiement. En France métropolitaine, le délai de livraison est de 3 à 5 jours ouvrés, en livraison gratuite, via La Poste / Colissimo. Pour toute expédition hors France métropolitaine, les frais et délais sont indiqués au checkout. Un email de suivi vous est envoyé dès que votre commande quitte notre atelier.`,
    },
    {
      heading: 'Retours',
      body: `Vous disposez de 14 jours calendaires à compter de la réception pour retourner votre commande, conformément au droit de rétractation prévu aux articles L221-18 et suivants du Code de la consommation. Le produit doit être retourné dans son état d'origine, non utilisé, dans son emballage d'origine, accompagné de sa preuve d'achat. Les frais de retour sont à votre charge.`,
    },
    {
      heading: 'Remboursement',
      body: `Dès réception du produit retourné et après vérification de son état, nous procédons au remboursement dans un délai maximum de 14 jours, par le même moyen de paiement que celui utilisé lors de la commande.`,
    },
    {
      heading: 'Garantie à vie anti-corrosion',
      body: `Les outils Foil Buddy en titane grade 5 sont garantis à vie contre la corrosion dans le cadre d'un usage normal. En cas de défaut constaté, contactez-nous avec photos et preuve d'achat : nous remplaçons l'outil sans frais.`,
    },
    {
      heading: 'Contact',
      body: `Pour toute demande concernant votre commande, un retour ou une garantie : ${COMPANY.email}.`,
    },
  ],
};

const returnsEn: LegalDoc = {
  title: 'Shipping & returns',
  updated: LAST_UPDATED_EN,
  sections: [
    {
      heading: 'Shipping',
      body: `Orders are prepared and shipped within 48 working hours from payment confirmation. Within metropolitan France, delivery takes 3 to 5 working days with free shipping, via La Poste / Colissimo. For international shipments, fees and delivery times are indicated at checkout. A tracking email is sent as soon as your order leaves our workshop.`,
    },
    {
      heading: 'Returns',
      body: `You have 14 calendar days from receipt to return your order, under the right of withdrawal provided by articles L221-18 et seq. of the French Consumer Code. The product must be returned in its original condition, unused, in its original packaging, accompanied by proof of purchase. Return shipping costs are your responsibility.`,
    },
    {
      heading: 'Refund',
      body: `Upon receipt of the returned product and after verification of its condition, we will issue a refund within a maximum of 14 days, using the same means of payment used for the order.`,
    },
    {
      heading: 'Lifetime anti-corrosion warranty',
      body: `Foil Buddy titanium grade 5 tools are covered by a lifetime warranty against corrosion under normal use. If a defect is found, contact us with photos and proof of purchase: we will replace the tool free of charge.`,
    },
    {
      heading: 'Contact',
      body: `For any question about your order, a return or a warranty claim: ${COMPANY.email}.`,
    },
  ],
};

/* ==========================================================================
   RESOLVER
   ========================================================================== */

export type LegalKey = 'legal' | 'terms' | 'privacy' | 'returns';

const DOCS: Record<Locale, Record<LegalKey, LegalDoc>> = {
  en: { legal: legalEn, terms: termsEn, privacy: privacyEn, returns: returnsEn },
  fr: { legal: legalFr, terms: termsFr, privacy: privacyFr, returns: returnsFr },
};

export function getLegalDoc(locale: Locale, key: LegalKey): LegalDoc {
  return DOCS[locale][key];
}
