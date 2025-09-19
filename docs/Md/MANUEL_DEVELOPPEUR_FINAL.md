# 👨‍💻 Manuel Développeur Final - Riziky-Boutic

## 🚀 Démarrage Rapide

### Installation
```bash
git clone <repo>
npm install
cd server && npm install
```

### Développement
```bash
# Backend
cd server && npm start

# Frontend
npm run dev
```

## 📁 Structure du Code

### Frontend React
- `src/app/` - Configuration application
- `src/components/` - Composants réutilisables
- `src/pages/` - Pages application
- `src/hooks/` - Hooks personnalisés
- `src/services/` - APIs et services
- `src/types/` - Types TypeScript

### Backend Node.js
- `server/routes/` - Routes API
- `server/services/` - Logique métier
- `server/middlewares/` - Middlewares Express
- `server/config/` - Configuration
- `server/data/` - Base de données JSON

## 🛠️ Conventions

### Composants
- PascalCase pour les noms
- Props typées avec interfaces
- Hooks au début des composants
- Export default en fin de fichier

### API
- Routes RESTful
- Validation Zod
- Gestion d'erreurs centralisée
- Réponses JSON standardisées

### État
- Context API pour état global
- React Query pour cache serveur
- Local state pour UI

## 🧪 Tests
```bash
npm run test        # Tests unitaires
npm run test:e2e    # Tests end-to-end
npm run coverage    # Couverture de code
```

## 📦 Build et Déploiement
```bash
npm run build       # Build production
npm run preview     # Prévisualisation
```

---

*Guide développeur avec toutes les informations essentielles*