@AGENTS.md

# The Foil Buddy — Architecture & Operations

Document central pour tout agent (Pascalou, Claude Code, etc.) qui doit
travailler sur les deux codebases qui composent The Foil Buddy.

> Conventions transverses → voir [§ Conventions](#conventions) en bas.
> Onboarding rapide → voir [§ Onboarding](#onboarding-pour-un-nouvel-agent).

---

## 1. Vue d'ensemble

**The Foil Buddy** est une marque d'outils titane pour wingfoilers (Nathan
DEPIS, Bayonne). Deux codebases distincts, deux hébergeurs :

| Domaine                | Tech                  | Hébergeur | Repo                                                  |
|------------------------|-----------------------|-----------|-------------------------------------------------------|
| `thefoilbuddy.com`     | Next.js 16 + Headless | Vercel    | **CE REPO** : `/Users/nathandepis/Documents/thefoilbuddy-shop` |
| `thefoilbuddy.wixsite.com/the-foil-buddy` | Wix Editor classique + Velo | Wix | Pas de repo, code édité dans Wix Editor. **Miroir** dans `wix-backend/` |

Le Wix Editor site stocke les vrais ordres/factures/produits (Wix Stores +
Wix Invoices). Le Next.js shop consomme l'API Wix Headless pour afficher
les produits et déclencher le checkout côté Wix.

**Backend Velo (`wix-backend/`)** = source de vérité versionnée du code
backend qui tourne sur le site Wix Editor. Il n'est PAS exécuté par
Vercel. Pour le déployer il faut copier-coller dans Wix Editor + Publish
(cf. [§ Déploiement Velo](#52-déploiement-velo)).

**Pascalou** = autre agent Claude tournant dans un conteneur Docker isolé
chez Nathan. Pascalou poll les endpoints Velo pour archiver les factures
sur Drive + Qonto. N'est jamais exposé sur internet → pull-based, pas de
webhook entrant côté Pascalou.

---

## 2. Repo Next.js (ce repo)

### 2.1 Stack

- **Next.js 16.2.4** avec App Router et Turbopack
- **React 19**
- **Tailwind v4** (postcss config)
- **TypeScript 5**
- **Wix Headless SDK** (`@wix/sdk`, `@wix/ecom`, `@wix/redirects`, `@wix/stores`)
- **Vercel Analytics**
- **Vitest** pour les tests

⚠️ Next.js 16 a des breaking changes vs ce que la plupart des agents
connaissent. Avant d'écrire du code Next, lire les docs locales :
`node_modules/next/dist/docs/` (voir AGENTS.md à la racine).

### 2.2 Structure

```
app/
  [locale]/               # i18n par préfixe URL (fr | en)
    page.tsx              # Landing (avec bento "Conçu à Bayonne")
    shop/
      page.tsx            # Liste des produits + mini-rating
      [slug]/
        page.tsx          # Page produit + mini-rating + section ProductReviews
        actions.ts        # Server actions (cart)
    cart/                 # Panier
    thanks/               # Page post-checkout
    legal/                # CGV, mentions légales, etc.
  api/                    # Routes API Next (meta-feed pour Facebook, etc.)
components/
  Landing.tsx             # Hero + bento (workshop + photo Marto)
  Footer.tsx
  ShopHeader.tsx
  Hero.tsx, FeaturesGrid.tsx, Comparison.tsx, VideoTestimonials.tsx
  product/
    ProductBuyBox.tsx     # Sélecteur couleur/quantité + add-to-cart
    ProductGallery.tsx
    ProductDetails.tsx    # VariantProvider + composants connectés
    ProductReviews.tsx    # Affichage des avis clients (stars + histogramme + liste)
lib/
  i18n.ts                 # Traductions FR/EN + overrides noms/descriptions produits
  reviews.ts              # ⭐ Source de vérité des avis clients (seeded)
  legal.ts                # Textes CGV/CGU/etc.
  stats.ts                # Stats community (fetched de Supabase via l'app spots)
  video-testimonials.ts
  wix.ts, wix-server.ts   # Client Wix Headless
  meta-feed/              # Génération du feed Meta/Facebook
public/
  founder.jpg             # Photo Nathan
  marto.jpg               # Photo Florian Thomar (atelier)
  workshop.mp4, hero.mp4
  logo-hd.png, logo-icon.png
  app-*.jpg               # Screenshots de l'app spots
  cutter-*.jpg/mp4        # Visuels du coupe-ligne
wix-backend/              # Miroir du code Velo (voir § 3)
middleware.ts             # Routing i18n
```

### 2.3 Déploiement Next.js

**Vercel auto-deploy sur `main`** → tout push sur `origin/main` déclenche
un build + déploiement prod sur `thefoilbuddy.com` en 1-2 min.

```bash
git add . && git commit -m "..." && git push
```

Pas de staging environment configuré. Pour preview : Vercel crée des
preview deploys sur chaque PR / branche.

### 2.4 Système de reviews (`lib/reviews.ts`)

**Source de vérité unique** : un fichier TS avec les reviews seedées.
Affiché par :
- `app/[locale]/shop/page.tsx` (mini-rating sur chaque carte produit)
- `app/[locale]/shop/[slug]/page.tsx` (mini-rating sous le titre + section complète en bas)

**Format Review** :
```ts
{
  id: string,
  name: 'Prénom L.',
  location?: 'Ville',
  rating: 1|2|3|4|5,
  date: 'YYYY-MM-DD',          // ISO
  verified: boolean,
  title?: string,               // optionnel — apparaît en gras à côté des étoiles
  body: string,                 // langue d'origine, PAS de traduction auto
}
```

**Modération = édition manuelle de ce fichier.** Pas de UI admin, pas de
backend. Une review dans le tableau = publiée. Suppression du tableau =
masquée.

**Important :** ne JAMAIS auto-traduire le `body`. Les avis restent dans
la langue de l'auteur (FR par défaut, EN si l'auteur est anglophone). Le
locale switcher du site ne change que les libellés UI (« Avis clients »,
« Achat vérifié », format des dates).

**Map produits ↔ slug :**
- `tool-titanium-torx-t30-t45-yellow-orange` = produit nommé "T30/T45" (jaune/orange)
- `tool-titanium-torx-t30-t45-green-red` = produit nommé "T30/T40 (Standard)" (vert/rouge)
- `outil-flottant-coupe-ligne-clé-torx-t45` = Coupe-ligne (NEW badge)

⚠️ La couleur ≠ le nom du produit. Les slugs contiennent tous "t30-t45"
mais le label affiché dans Wix Stores distingue T30/T45 (jaune-orange) et
T30/T40 (vert-rouge). Lire le commentaire `// ===== Foil Buddy — T30/T... =====`
dans `lib/reviews.ts` pour ne pas confondre.

### 2.5 Tweaks récents (mai 2026)

- **Bento "Conçu à Bayonne" sur Landing** : tuile workshop a vidéo
  imprimante 3D à gauche + photo `/marto.jpg` à droite, avec caption
  créditant Florian Thomar (`d.community.workshopCaption`).
  Voir `components/Landing.tsx` lignes ~241+.
- **Mini-rating produit** : pattern `★★★★☆ 4.7 (3 avis)` avec lien
  ancre `#reviews`. Cliquable.

---

## 3. Site Wix Editor (`wix-backend/`)

### 3.1 Identité du site

- **Site ID** : `44b2951f-1b4a-4649-8986-dd295c5a5ca7`
- **Display name** : "The Foil Buddy"
- **Editor type** : `EDITOR` (classique — PAS Wix Studio)
- **URL publique** : `https://thefoilbuddy.wixsite.com/the-foil-buddy`
- **Account ID Wix** : `67a543b6-dfbb-4c73-a467-3cfe6ea4970c`
- **Domain custom branché ?** : non (`domainConnected: false`). Le
  domaine `thefoilbuddy.com` pointe sur Vercel, pas sur ce Wix site.

### 3.2 Velo activé

Mode développeur ON dans Wix Editor. Fichiers backend visibles dans le
panneau **Back-end et public** (icône `{ }` dans la sidebar gauche de
l'éditeur).

### 3.3 Fichiers backend déployés

Tous miroirés dans `wix-backend/` du repo Next.js :

| Fichier Wix                  | Miroir repo                       | Rôle |
|------------------------------|-----------------------------------|------|
| `backend/http-functions.js`  | `wix-backend/http-functions.js`   | HTTP endpoints (ping, pendingInvoices, markProcessed, invoice/{id}/pdf) |
| `backend/events.js`          | `wix-backend/events.js`           | Webhooks `wixBilling_onInvoicePaid` / `_onInvoiceCreated` → enqueue dans `PendingInvoices` |
| `backend/sync-invoices.js`   | `wix-backend/sync-invoices.js`    | Job cron quotidien de réconciliation (filet de sécurité) |
| `backend/jobs.config`        | `wix-backend/jobs.config`         | Config cron Velo (02:00 UTC daily) |

Le miroir dans le repo est **versionné via git**, mais le déploiement
nécessite quand même un copier-coller manuel dans Wix Editor.

### 3.4 Secrets Manager Wix

| Nom du secret              | Usage                                              |
|----------------------------|----------------------------------------------------|
| `PASCALOU_BACKEND_SECRET`  | Bearer token utilisé par Pascalou pour s'authentifier sur tous les endpoints Velo (sauf `/ping`) |

⚠️ Ne JAMAIS coller la valeur du secret dans un chat, un commit ou un
log. Pour le rotate : Wix Dashboard → Settings → Developer Tools → Secrets
Manager. Une copie locale est dans le keychain de Nathan.

URL directe Secrets Manager :
`https://manage.wix.com/dashboard/44b2951f-1b4a-4649-8986-dd295c5a5ca7/secrets-manager`

### 3.5 Collection Wix Data : `PendingInvoices`

Créée manuellement dans Wix CMS. Schéma (15 fields + Title par défaut) :

| Field            | Type          | Notes                                          |
|------------------|---------------|------------------------------------------------|
| `invoiceId`      | Texte         | UUID Wix, **clé d'idempotence**                |
| `invoiceNumber`  | Texte         | ex. "0000031"                                  |
| `orderNumber`    | Nombre        | numéro court ordre Wix eCom                    |
| `totalAmount`    | Nombre        | TTC EUR                                        |
| `currency`       | Texte         | "EUR"                                          |
| `customerEmail`  | Texte         |                                                |
| `customerName`   | Texte         |                                                |
| `pdfUrl`         | Texte         | URL preview de `createInvoicePreviewUrl`       |
| `status`         | Texte         | `pending` \| `processed` \| `failed`           |
| `source`         | Texte         | `webhook` \| `reconcile`                       |
| `errorMessage`   | Texte         | rempli si status=failed                        |
| `createdAt`      | Date et heure |                                                |
| `processedAt`    | Date et heure |                                                |
| `driveFileId`    | Texte         | rempli par Pascalou après archivage Drive      |
| `qontoTxnId`     | Texte         | rempli par Pascalou après matching Qonto       |

**Permissions** : Admin + Collaborator only (pas member, pas anyone).
Le code Velo bypass avec `suppressAuth: true` de toute façon — les perms
sont là en ceinture+bretelles.

---

## 4. Pipeline factures (Pascalou bridge)

### 4.1 Architecture

```
Wix Invoice payée
        │
        ▼ (webhook Wix interne)
wixBilling_onInvoicePaid   ◄────────────── filet 2 : cron quotidien
  (backend/events.js)                       backend/sync-invoices.js
        │                                   (02:00 UTC, scan Orders 72h)
        ▼                                          │
  insert dans PendingInvoices ◄────────────────────┘
  collection (status=pending)
        │
        ▼ (poll toutes les 5 min)
   Pascalou (Docker)
        │
        ├──► fetch GET /_functions/pendingInvoices
        │     Bearer PASCALOU_BACKEND_SECRET
        │     → [{ invoiceId, pdfUrl, customer, ... }]
        │
        ├──► download PDF (suit pdfUrl)
        │     → archive Drive (récupère driveFileId)
        │     → match Qonto txn (récupère qontoTxnId)
        │
        └──► POST /_functions/markProcessed
              body: { invoiceId, status:"processed", driveFileId, qontoTxnId }
              → row passe à status=processed
```

### 4.2 Endpoints HTTP (`wix-backend/http-functions.js`)

Tous exposés sur `https://thefoilbuddy.wixsite.com/the-foil-buddy/_functions/...`

| Méthode + chemin                  | Auth   | Rôle |
|-----------------------------------|--------|------|
| `GET /ping`                       | aucune | Health check, renvoie `{ ok: true, ts }` |
| `GET /pendingInvoices`            | Bearer | Liste les factures en attente. Query : `?status=pending\|failed\|processed` (default `pending`), `?limit=N` (max 100) |
| `POST /markProcessed`             | Bearer | Marque une facture comme traitée. Body : `{ invoiceId, status: "processed"\|"failed", driveFileId?, qontoTxnId?, errorMessage? }` |
| `GET /invoice/{id}/pdf`           | Bearer | 302 vers le PDF d'une facture Wix par ID, via `createInvoicePreviewUrl` |

### 4.3 Limites connues (NE PAS retenter)

Ces pistes ont été explorées et confirmées comme bloquées :

- **`wix-billing-backend.invoices.listInvoices`** : n'existe pas. Le module
  legacy expose 8 méthodes : `create`, `update`, `get`, `delete`, `send`,
  `void`, `createInvoicePreviewUrl`, `addPayment`. Pas de list/query.
- **`wix-billing.v2`** : module présent mais n'expose que `taxGroups`,
  `taxRegions`, `taxCalculation`. Pas d'invoices v2 sur site Editor classique.
- **`wix-fetch` depuis Velo vers `manage.wix.com/wix-quotes-web/...`** :
  retourne 401 `NOT_AUTHENTICATED`. Velo n'a pas de credentials implicites
  pour les API internes Wix Dashboard.
- **REST API publique `www.wixapis.com/billing/v[123]/`, `/invoicing/v[123]/`,
  `/business-tools/v1/`, `/get-paid/v1/`** : tous 404. Wix n'expose pas
  publiquement les invoices via REST avec ce naming.
- **POST `/wix-quotes-web/api/v1/invoices/query` avec Admin API Key** :
  retourne 200 mais avec données SANITIZED (juste `result`, `status`,
  `invoiceSettings` par item — pas d'IDs, pas de customer, pas de data).
  La même URL appelée avec session cookie du dashboard renvoie le full
  payload 71 KB pour 28 invoices. Conclusion : Wix shape la réponse selon
  l'auth.

→ **D'où l'architecture actuelle :** webhook Velo + collection + endpoints
maison. C'est la seule voie viable pour un site Wix Editor classique.

### 4.4 Idempotence et failover

- **Idempotence** : avant chaque insert dans `PendingInvoices`, on
  query par `invoiceId` (webhook) ou `orderNumber` (reconcile). Une
  même facture ne sera jamais doublée.
- **Webhook primaire** : `wixBilling_onInvoicePaid` (couvre ~99% du flow
  temps réel).
- **Filet 1** : si `_onInvoicePaid` ne fire pas pour cette version Wix,
  on a aussi un handler `_onInvoiceCreated` (commenté ou en backup dans
  `events.js`).
- **Filet 2** : `sync-invoices.js` tourne tous les jours à 02:00 UTC.
  Il scrute les Wix eCom Orders payés des 72h précédentes et insère
  ceux qui sont absents de `PendingInvoices`. L'endpoint REST
  `ecom/v2/orders/invoices/list-by-orders` (Developer Preview) peut
  échouer gracefully → on log et on continue.

---

## 5. Déploiement

### 5.1 Déploiement Next.js → Vercel

```bash
git add . && git commit -m "..." && git push
```

Vercel déploie automatiquement sur `main` en 1-2 min. URL prod :
`https://thefoilbuddy.com`. Logs disponibles sur le dashboard Vercel.

Modifs typiques :
- **Reviews** : éditer `lib/reviews.ts`
- **Landing** : éditer `components/Landing.tsx`
- **i18n** : éditer `lib/i18n.ts`
- **Product description** : `lib/i18n.ts` (overrides Wix)

### 5.2 Déploiement Velo

**Wix Editor classique = pas de déploiement programmatique.** Aucune CLI
ni API REST n'expose l'écriture des fichiers Velo. Workflow obligatoire :

1. Modifier le fichier dans `wix-backend/` localement
2. Committer le changement
3. Pousser sur le site Wix via `wix-backend/deploy.sh` *(ce script
   copie le code dans le clipboard, ouvre Wix Editor, ouvre Secrets
   Manager, et lance les curls de validation à la fin)*
4. Le résiduel humain irreductible = paste (Cmd+V) + clic Publier

Si tu n'as pas accès à `pbcopy`/`open` (pas macOS), adapter le script.

### 5.3 Tester les endpoints Velo

```bash
BASE="https://thefoilbuddy.wixsite.com/the-foil-buddy/_functions"
SECRET="<from-keychain>"

# Health
curl -s "$BASE/ping"
# → { "ok": true, "ts": "..." }

# Liste
curl -s -H "Authorization: Bearer $SECRET" "$BASE/pendingInvoices"
# → { "count": N, "items": [...] }

# Mark processed
curl -s -X POST -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
  -d '{"invoiceId":"<uuid>","status":"processed","driveFileId":"...","qontoTxnId":"..."}' \
  "$BASE/markProcessed"
```

---

## 6. Logs et observabilité Wix

- **Wix Site Monitoring** : Wix Dashboard → Settings → Developer Tools
  → Site Monitoring. Tous les `console.log/warn/error` du backend Velo
  y apparaissent en temps réel.
- **Vercel Logs** : Vercel Dashboard → Project → Logs.
- Pas de tracing distribué entre les deux pour l'instant.

---

## 7. Onboarding pour un nouvel agent

Si tu prends ce projet en main pour la première fois :

1. **Lis ce fichier en entier**, puis `AGENTS.md` à la racine.
2. **Pas de secrets dans le chat** : si tu as besoin d'une valeur de
   secret (Bearer Pascalou, API key Wix, etc.), demande à Nathan de la
   mettre dans une variable d'env locale ou de la coller via une UI
   privée. Jamais en clair dans une conversation.
3. **Avant toute modif Wix Velo** : relis [§ 4.3 Limites connues](#43-limites-connues-ne-pas-retenter)
   pour ne pas explorer des pistes déjà mortes.
4. **Pour une modif Next.js** : edit → `git push` → Vercel déploie. Pas
   besoin de demander permission pour des tâches techniques de routine.
5. **Pour une modif Velo** : edit le miroir dans `wix-backend/`, commit,
   puis lance `wix-backend/deploy.sh` (ou guide Nathan via UI) pour le
   push manuel.
6. **Toujours en français** dans les chats avec Nathan. Direct, pas de
   blabla. Modèle préféré : Sonnet.

---

## Conventions

- **Langue** : tout est en français côté UI et conversation. Identifiants
  techniques et noms de fields restent en anglais (`invoiceId`, etc.).
- **Style** : direct, pas de superlatifs inutiles, pas d'emojis dans le
  code. Emojis OK dans les chats si naturel.
- **Autonomie** : Nathan donne autonomie totale sur les tâches
  techniques. Ne pas demander permission, agir et tester.
- **Secrets** : JAMAIS demander à coller un secret dans le chat. Utiliser
  la CLI, la UI ou le clipboard local.
- **Commits** : message clair en anglais, scope préfixé
  (`feat(reviews):`, `fix(landing):`, `wix-backend:`, etc.). Inclure
  co-author Claude si l'agent a contribué.
- **Migration Next 16** : breaking changes par rapport aux versions
  antérieures. Lire `node_modules/next/dist/docs/` avant écrire du code
  Next.
