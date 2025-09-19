# 🛍️ Riziky-Boutic - Documentation Complète du Projet

## 📋 Table des Matières
- [Vue d'ensemble du projet](#vue-densemble-du-projet)
- [Architecture technique](#architecture-technique)
- [Structure du projet](#structure-du-projet)
- [Installation et configuration](#installation-et-configuration)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies utilisées](#technologies-utilisées)
- [Sécurité](#sécurité)
- [Guide développeur](#guide-développeur)

## 🎯 Vue d'ensemble du projet

**Riziky-Boutic** est une plateforme e-commerce moderne et complète développée avec React et Node.js. Elle offre une expérience d'achat fluide et sécurisée avec des fonctionnalités avancées comme le chat en temps réel, les notifications de ventes, et un système d'administration complet.

### Objectifs principaux
- Fournir une expérience utilisateur moderne et intuitive
- Offrir des outils d'administration complets
- Garantir la sécurité des données et des transactions
- Supporter la croissance et la scalabilité

### Public cible
- **Clients finaux** : Interface d'achat moderne et sécurisée
- **Administrateurs** : Panneau d'administration complet
- **Développeurs** : Code maintenable et documenté

## 🏗️ Architecture technique

### Frontend (React + TypeScript)
```
src/
├── app/                      # Configuration application
│   ├── AppProviders.tsx      # Providers globaux (Auth, Store, Query)
│   ├── AppRoutes.tsx         # Configuration des routes
│   ├── LoadingFallback.tsx   # Composant de chargement
│   ├── MaintenanceChecker.tsx # Vérification mode maintenance
│   └── RegistrationChecker.tsx # Vérification statut inscription
├── components/               # Composants réutilisables
│   ├── ui/                   # Composants UI de base (shadcn/ui)
│   ├── admin/                # Composants administration
│   ├── auth/                 # Composants authentification
│   ├── cart/                 # Composants panier
│   ├── chat/                 # Composants chat en temps réel
│   ├── checkout/             # Composants processus commande
│   ├── engagement/           # Composants engagement utilisateur
│   ├── filters/              # Composants filtres produits
│   ├── flash-sale/           # Composants ventes flash
│   ├── home/                 # Composants page d'accueil
│   ├── layout/               # Composants layout (Header, Footer)
│   ├── orders/               # Composants gestion commandes
│   ├── products/             # Composants produits
│   ├── profile/              # Composants profil utilisateur
│   ├── promotions/           # Composants promotions
│   ├── reviews/              # Composants avis clients
│   └── search/               # Composants recherche
├── contexts/                 # Contextes React
│   ├── AuthContext.tsx       # Gestion authentification
│   ├── StoreContext.tsx      # État global application
│   └── VideoCallContext.tsx  # Gestion appels vidéo
├── hooks/                    # Hooks personnalisés
├── services/                 # Services API et logique métier
├── types/                    # Définitions TypeScript
├── utils/                    # Utilitaires
└── pages/                    # Pages de l'application
```

### Backend (Node.js + Express)
```
server/
├── config/                   # Configuration serveur
│   ├── auth.js              # Configuration authentification JWT
│   ├── cors.js              # Configuration CORS
│   ├── dataFiles.js         # Gestion fichiers de données
│   ├── errorHandlers.js     # Gestionnaires d'erreurs
│   ├── routes.js            # Configuration des routes
│   └── security.js          # Configuration sécurité
├── core/                    # Modules core
│   └── database.js          # Gestionnaire base de données JSON
├── data/                    # Fichiers JSON (base de données)
├── middlewares/             # Middlewares Express
├── routes/                  # Définition des routes API
├── services/                # Services métier backend
├── socket/                  # Configuration WebSocket
│   ├── socketAuth.js        # Authentification WebSocket
│   ├── socketConfig.js      # Configuration Socket.io
│   └── socketHandlers.js    # Gestionnaires événements
└── uploads/                 # Fichiers uploadés
```

## 🚀 Installation et configuration

### Prérequis
- Node.js (v18+)
- NPM ou Yarn
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/your-repo/riziky-boutic.git
cd riziky-boutic

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server
npm install
cd ..

# Configuration des variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos configurations

# Démarrer le serveur backend
cd server
npm start

# Dans un nouveau terminal, démarrer le frontend
npm run dev
```

### Variables d'environnement
```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=ws://localhost:3001

# Backend (server/.env)
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## ✨ Fonctionnalités principales

### 🛒 E-commerce
- Catalogue produits avec filtres avancés
- Panier d'achat persistant
- Processus de commande sécurisé
- Gestion des favoris
- Système de reviews avec photos
- Codes promotionnels
- Ventes flash avec timer

### 👥 Gestion utilisateurs
- Inscription/Connexion sécurisée
- Profils utilisateurs avec photos
- Historique des commandes
- Suivi des livraisons
- Gestion des remboursements

### 💬 Communication
- Chat client-service en temps réel
- Support fichiers et audio
- Notifications en temps réel
- Système d'alertes

### 🔧 Administration
- Dashboard avec statistiques
- Gestion des produits
- Gestion des commandes
- Gestion des utilisateurs
- Chat administrateur
- Paramètres système

### 🔒 Sécurité
- Authentification JWT
- Protection des routes
- IDs obfusqués
- Validation des données (Zod)
- Rate limiting
- Protection XSS/CSRF

## 🛠️ Technologies utilisées

### Frontend
- **React 18.3.1** : Framework principal
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **Shadcn/UI** : Composants UI modernes
- **React Router** : Navigation
- **React Query** : Gestion état serveur
- **Framer Motion** : Animations
- **Socket.io Client** : Communication temps réel
- **Zod** : Validation données
- **Axios** : Requêtes HTTP

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **Socket.io** : WebSocket temps réel
- **JWT** : Authentification
- **Helmet.js** : Sécurité headers HTTP
- **Multer** : Upload fichiers
- **Bcrypt** : Hashage mots de passe
- **Express Rate Limit** : Limitation requêtes
- **XSS Clean** : Protection XSS

### Base de données
- **JSON Files** : Stockage actuel
- **Migration prévue** : PostgreSQL/MongoDB

## 🔐 Sécurité

### Authentification
- JWT avec refresh tokens
- Hashage sécurisé des mots de passe (bcrypt)
- Expiration automatique des sessions

### Protection des données
- Validation stricte avec Zod
- Sanitisation des entrées
- Protection contre XSS/CSRF
- IDs obfusqués pour les routes sensibles

### Sécurité réseau
- CORS configuré
- Rate limiting
- Headers de sécurité (Helmet.js)
- HTTPS en production

## 👨‍💻 Guide développeur

### Structure des composants
```tsx
// Exemple de structure de composant
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props avec types stricts
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Logique du composant
  
  return (
    <div className={cn("default-classes", props.className)}>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Hooks personnalisés
- `useAuth` : Gestion authentification
- `useCart` : Gestion panier
- `useProducts` : Gestion produits
- `useFavorites` : Gestion favoris
- `useOrders` : Gestion commandes

### Services API
- Configuration centralisée avec Axios
- Intercepteurs pour gestion tokens
- Types TypeScript pour toutes les réponses
- Gestion d'erreurs unifiée

### État global
- AuthContext pour l'authentification
- StoreContext pour les données globales
- React Query pour le cache serveur

### Tests
- Tests unitaires avec Vitest
- Tests e2e avec Cypress
- Couverture de code

### Déploiement
- Build optimisé avec Vite
- Variables d'environnement par environnement
- CI/CD avec GitHub Actions

## 📈 Performances

### Optimisations frontend
- Code splitting par route
- Lazy loading des composants
- Optimisation images
- Cache intelligent avec React Query

### Optimisations backend
- Compression responses
- Cache statique
- Rate limiting
- Optimisation requêtes

## 🐛 Debugging

### Outils de développement
- React Developer Tools
- Redux DevTools
- Network monitoring
- Console logging structuré

### Gestion d'erreurs
- Error boundaries React
- Logging centralisé
- Monitoring erreurs production

## 📝 Maintenance

### Sauvegarde
- Scripts automatiques de sauvegarde
- Versioning des données
- Restauration rapide

### Monitoring
- Logs structurés
- Métriques performances
- Alertes automatiques

### Mises à jour
- Dépendances régulièrement mises à jour
- Tests automatisés avant déploiement
- Rollback rapide si nécessaire

## 🔮 Roadmap

### Court terme
- Migration vers PostgreSQL
- API GraphQL
- Tests automatisés étendus

### Moyen terme
- Architecture microservices
- Cache Redis
- CDN pour les assets

### Long terme
- App mobile React Native
- Intelligence artificielle recommandations
- Internationalisation complète

---

*Documentation mise à jour le : [Date actuelle]*
*Version du projet : 2.0.0*