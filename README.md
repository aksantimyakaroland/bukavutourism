# Bukavu

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![ESLint](https://img.shields.io/badge/ESLint-8-4B32C3?logo=eslint)](https://eslint.org)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify)](https://netlify.com)

> **Bukavu, Sud-Kivu, RDC** — Plateforme de tourisme avec réservation de circuits, guides,
> événements, articles et galerie photo. CRUD admin complet, carte interactive Leaflet/OSM,
> déploiement Netlify.

---

## Fonctionnalités

- **Carte interactive** — Leaflet + OpenStreetMap, gratuit, sans clé API
- **Destinations** — Fiche détaillée avec galerie, coordonnées GPS, circuits associés
- **Circuits** — Réservation en ligne avec confirmation immédiate et code unique
- **Guides** — Profils, disponibilités, tarifs, avis
- **Événements** — Calendrier et filtres
- **Articles** — Blog de voyage avec publication
- **Galerie** — Upload et gestion des images
- **Admin CRUD** — Dashboard, paramètres, gestion des avis et messages
- **Responsive** — Design editorial magazine
- **Français uniquement** — Interface entièrement en français

## Stack technique

| Frontend | Backend & DB | Outils |
|---|---|---|
| Next.js 14 (App Router) | Supabase (Postgres) | TypeScript |
| React 18 | Supabase Auth | ESLint |
| Tailwind CSS 3 | Supabase Storage | Git |
| Leaflet + react-leaflet | Supabase RLS | Netlify |
| next-intl | — | — |

## Démarrage rapide

### Prérequis

- Node.js 20
- Compte Supabase (gratuit)

### Installation

```bash
git clone https://github.com/aksantimyakaroland/bukavutourism.git
cd bukavutourism
cp .env.example .env
```

Renseigner les variables dans `.env` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=cle_anon_publique
```

Puis :

```bash
npm install
npm run dev
```

Le site est accessible sur `http://localhost:3000`.

### Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |
| `npm run typecheck` | Vérification TypeScript |

## Structure du projet

```
src/
├── app/
│   ├── [locale]/(public)/   # Pages publiques
│   │   ├── articles/        # Blog
│   │   ├── auth/            # Connexion / Inscription
│   │   ├── contact/         # Formulaire de contact
│   │   ├── destinations/    # Fiches destinations
│   │   ├── events/          # Événements
│   │   ├── gallery/         # Galerie photo
│   │   ├── guides/          # Profils guides
│   │   ├── tours/           # Circuits
│   │   └── profile/         # Profil + réservations
│   ├── admin/               # Interface admin
│   │   ├── destinations/    # CRUD destinations
│   │   ├── tours/           # CRUD circuits
│   │   ├── guides/          # CRUD guides
│   │   ├── events/          # CRUD événements
│   │   ├── articles/        # CRUD articles
│   │   ├── gallery/         # CRUD galerie
│   │   ├── reservations/    # Gestion réservations
│   │   ├── ratings/         # Modération avis
│   │   ├── contact/         # Messages reçus
│   │   ├── settings/        # Paramètres site
│   │   └── profile/         # Profil admin
│   └── api/                 # Routes API
├── components/
│   ├── admin/               # Formulaires, sidebar
│   ├── client/              # Cards, modale réservation, carte
│   └── shared/              # Header, Footer
├── lib/
│   ├── supabase/            # Client browser/server/service
│   └── utils/               # formatDate, cn, i18n-field
├── types/                   # Interfaces TypeScript
└── i18n/                    # Configuration next-intl
```

## Déploiement Netlify

1. Connecter le dépôt GitHub à Netlify
2. Définir les variables d'environnement identiques au `.env`
3. Netlify détecte automatiquement Next.js via `netlify.toml`

La configuration de build est déjà présente dans le dépôt.

## Accès admin

1. Créer un compte utilisateur via la page `/auth/signup`
2. Dans le dashboard Supabase → SQL Editor, exécuter :
   ```sql
   UPDATE users SET user_type = 'admin' WHERE email = 'votre@email.com';
   ```
3. Se connecter sur `/admin/login`

## Licence

Tous droits réservés © 2026 Roland Myaka. Voir le fichier `LICENSE`.

## Contribuer

Les contributions sont les bienvenues. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles à suivre.

---

Développé par [Roland Myaka](https://rolandmyaka.netlify.app)
