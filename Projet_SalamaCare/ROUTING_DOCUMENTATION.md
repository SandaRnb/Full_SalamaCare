# Architecture de Routing - SalamaCare

## Structure du Routage

### Routes Principales

```
/login                 - Page de connexion (publique)
/dashboard            - Dashboard principal (protégée)
/                     - Redirige vers /dashboard
```

## Fichiers de Routing

### 1. main.jsx
- Enveloppe l'app avec `BrowserRouter`
- Importe `AppRouter` pour la gestion des routes

### 2. AppRouter.jsx
- Définit toutes les routes de l'application
- Utilise `PrivateRoute` pour protéger les routes authentifiées
- Routes :
  - `/login` → Page de connexion
  - `/dashboard` → Dashboard principal (protégée)
  - `/` → Redirige vers `/dashboard`
  - `*` → 404 redirige vers `/dashboard`

### 3. PrivateRoute.jsx
- Composant de protection de routes
- Vérifie si `userToken` existe dans localStorage
- Redirige vers `/login` si pas d'authentification

### 4. login.jsx
- Page de connexion
- Sauvegarde le token dans localStorage
- Redirige vers `/dashboard` après succès

### 5. Dashboard.jsx
- Page principale du responsable médical
- Gère la navigation interne via sections
- Transmet les données aux composants (medecins, dossiers, rendezVous)

## Flux d'Authentification

```
Accès "/dashboard"
    ↓
PrivateRoute vérifie localStorage.userToken
    ↓
    ├─ Token existe → Affiche Dashboard
    └─ Token n'existe pas → Redirige vers "/login"

Login form soumis
    ↓
Sauvegarde token + email dans localStorage
    ↓
Redirige vers "/dashboard" avec navigate()
```

## Structure du DOM

```
AppRouter (Routes)
├── Route /login → Login
│   └── Formulaire d'authentification
└── Route /dashboard (PrivateRoute)
    └── Dashboard
        ├── SideBar (navigation interne)
        │   └── menuItems (stats, dossier, rdv, attribution, suivi)
        ├── NavBar
        └── Section dynamique (selon activeSection)
            ├── StatistiqueGeneral
            ├── GestionDossier
            ├── GestionRdv
            ├── AttributionMedecin
            └── SuiviFlux
```

## Gestion des États

- **localStorage** : userToken, userEmail
- **useState (App)** : activeSection (navigation interne)
- **useState (Dashboard)** : activeSection (pour changer les vues)

## Déconnexion

- Bouton "Déconnexion" dans SideBar
- Supprime token et email de localStorage
- Redirige vers `/login`

## Fonctionnalités de Base

- ✅ Navigation par routes publiques/protégées
- ✅ Système de token en localStorage
- ✅ Redirection automatique non authentifiés
- ✅ Navigation interne dans le dashboard
- ✅ Transmission de données (medecins, dossiers, etc.)
