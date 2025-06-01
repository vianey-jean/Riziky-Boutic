
# Architecture Technique - Riziky-Boutic

## 📋 Résumé Technique du Projet

### Stack Technologique
- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + Shadcn/UI
- **Backend** : Node.js + Express.js
- **Base de données** : Fichiers JSON (système de fichiers)
- **Temps réel** : Socket.io
- **Authentification** : JWT

---

## 🏗️ Structure du Projet

### Frontend (`/src`)
```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Composants de mise en page
│   ├── products/       # Composants liés aux produits
│   ├── promotions/     # Composants promotionnels
│   └── profile/        # Composants de profil utilisateur
├── contexts/           # Contexts React (état global)
├── pages/             # Pages de l'application
│   └── admin/         # Pages d'administration
├── services/          # Services API et utilitaires
│   ├── core/          # Configuration API centrale
│   └── modules/       # Services par domaine métier
├── types/             # Définitions TypeScript
└── utils/             # Fonctions utilitaires
```

### Backend (`/server`)
```
server/
├── config/            # Configuration serveur
├── core/              # Modules centraux (base de données)
├── data/              # Fichiers JSON de données
├── middlewares/       # Middlewares Express
├── routes/            # Routes API organisées par domaine
├── services/          # Services métier backend
├── socket/            # Configuration Socket.io
└── uploads/           # Fichiers uploadés (images)
```

---

## 🔄 Flux de Données

### 1. Architecture Frontend
```
Pages/Components → Services API → Backend Routes → Database Files
```

### 2. État Global
- **Context API** : Gestion de l'état utilisateur et panier
- **Local State** : États locaux des composants
- **Services** : Abstraction des appels API

### 3. Communication Temps Réel
```
Client Socket.io ← → Server Socket.io → Chat/Notifications
```

---

## 🎨 Système de Design

### Couleurs Principales
- `text-red-900` : Texte principal de marque
- `bg-red-600` : Boutons et éléments actifs
- `hover:text-red-600` : États de survol

### Composants UI (Shadcn/UI)
- Button, Input, Card, Dialog
- DropdownMenu, Select, Checkbox
- Badge, Toast, Skeleton

### Responsive Design
- **Mobile First** : Design adaptatif
- **Breakpoints** : sm, md, lg, xl, 2xl
- **Grid System** : CSS Grid et Flexbox

---

## 🔐 Sécurité et Authentification

### Frontend
- **JWT Storage** : Tokens stockés en localStorage
- **Route Protection** : Guards sur routes privées
- **API Interceptors** : Gestion automatique des tokens

### Backend
- **JWT Middleware** : Vérification des tokens
- **CORS Configuration** : Cross-origin sécurisé
- **Input Validation** : Sanitisation des données
- **File Upload Security** : Validation des fichiers

---

## 📊 Gestion des Données

### Structure des Fichiers JSON
```
data/
├── users.json           # Utilisateurs et authentification
├── products.json        # Catalogue produits
├── categories.json      # Catégories de produits
├── orders.json          # Commandes clients
├── panier.json          # Paniers utilisateurs
├── favorites.json       # Favoris utilisateurs
├── reviews.json         # Avis et commentaires
├── flash-sales.json     # Ventes flash
├── contacts.json        # Messages de contact
└── client-chat.json     # Historique du chat
```

### Patterns de Données
- **ID Generation** : Timestamps + prefixes
- **Relationships** : IDs de référence entre entités
- **Validation** : Schémas TypeScript stricts
- **Backup** : Sauvegarde automatique

---

## 🚀 Performance et Optimisation

### Frontend
- **Code Splitting** : Chargement modulaire
- **Lazy Loading** : Composants et images
- **Memoization** : React.memo et useMemo
- **Bundle Optimization** : Vite build optimized

### Backend
- **Middleware Optimizations** : Compression, cache
- **File Handling** : Streaming pour gros fichiers
- **Error Handling** : Gestion centralisée des erreurs
- **Security Headers** : Helmet.js

---

## 🔧 Configuration et Déploiement

### Variables d'Environnement
- `VITE_API_BASE_URL` : URL de l'API backend
- `JWT_SECRET` : Secret pour signature JWT
- `PORT` : Port du serveur (défaut: 10000)

### Scripts de Développement
```bash
npm run dev      # Démarrage frontend
npm run server   # Démarrage backend
npm run build    # Build production
```

### Déploiement
- **Frontend** : Déploiement Lovable
- **Backend** : Server Node.js compatible
- **Assets** : Gestion des uploads et images

---

## 🧪 Tests et Qualité

### Types de Tests Prévus
- **Tests Unitaires** : Composants React
- **Tests d'Intégration** : Services API
- **Tests E2E** : Parcours utilisateur
- **Tests de Performance** : Charge et vitesse

### Outils de Test
- **Jest** : Framework de test
- **React Testing Library** : Tests composants
- **Supertest** : Tests API backend
- **Coverage** : Rapports de couverture

---

Ce document technique fournit une vue d'ensemble complète de l'architecture et des patterns utilisés dans le projet Riziky-Boutic.
