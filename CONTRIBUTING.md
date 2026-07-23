# Contribuer

Merci de vouloir contribuer à Bukavu Tourism Platform.

## Signaler un bug

Ouvrir une **issue GitHub** en utilisant le template **Bug Report**.
Inclure :
- URL ou page concernée
- Comportement attendu vs réel
- Capture d'écran (si applicable)

## Proposer une fonctionnalité

Ouvrir une **issue GitHub** en utilisant le template **Feature Request**.
Décrire le besoin, le cas d'usage et les éventuelles alternatives.

## Processus de pull request

1. Créer une branche à partir de `main` :
   ```bash
   git checkout -b feat/ma-fonctionnalite
   ```
2. Commiter avec des messages clairs (voir conventions ci-dessous)
3. Pousser la branche et ouvrir une pull request vers `main`
4. Une CI vérifie automatiquement le code (lint, types, build)
5. Le mainteneur review et merge

## Conventions de commit

Utiliser le format `type: description` en anglais :

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `refactor` | Réorganisation sans changement fonctionnel |
| `style` | CSS, UI (pas de logique métier) |
| `chore` | Build, dépendances, config |
| `ci` | GitHub Actions, déploiement |

Exemples :
```
feat: add guide availability calendar
fix: prevent double booking submission
docs: update env example
```

## Style de code

- TypeScript strict, pas de `any` sauf exception justifiée
- ESLint et Prettier — la CI vérifie la conformité
- Pas de commentaires dans le code (le code doit être auto-documenté)
- Composants React : 'use client' si état local ou hooks
- Imports groupés : React, librairies, internes
- UI en français uniquement
