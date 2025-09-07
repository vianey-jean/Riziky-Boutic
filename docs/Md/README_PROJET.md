# 🏪 Riziky-Boutic - Plateforme E-commerce Complète

## 📋 Vue d'Ensemble du Projet

**Riziky-Boutic** est une plateforme e-commerce moderne et sécurisée développée avec React/TypeScript pour le frontend et Node.js/Express pour le backend. Cette application offre une expérience d'achat en ligne professionnelle avec toutes les fonctionnalités essentielles d'un commerce électronique moderne, incluant un système de chat en temps réel, des sélecteurs de quantité avancés, et une sécurité renforcée.

### 🎯 Objectif Principal
Créer une plateforme e-commerce robuste, sécurisée et évolutive permettant aux entreprises de vendre leurs produits en ligne avec une expérience utilisateur exceptionnelle et une interface d'administration complète.

### 👥 Public Cible
- **Clients finaux** : Particuliers et professionnels souhaitant acheter des produits en ligne
- **Administrateurs** : Gestionnaires de boutique pour la gestion des produits, commandes et clients
- **Développeurs** : Équipe technique pour la maintenance et l'évolution du système

---

## 🏗️ Architecture Générale

### Stack Technologique

#### Frontend (Client)
```
React 18.3.1          → Framework UI moderne
TypeScript 5.0+       → Sécurité des types
Tailwind CSS 3.3+     → Framework CSS utilitaire
Shadcn/UI             → Composants UI pré-construits
React Router 6.26+    → Routing côté client
Axios                 → Client HTTP
Socket.io-client      → Communication temps réel
Framer Motion 12.12   → Animations
Zod 3.23              → Validation des schémas
React Query 5.56      → Gestion d'état serveur
```

#### Backend (Serveur)
```
Node.js 18+           → Runtime JavaScript serveur
Express.js 4.18+      → Framework web
Socket.io 4.8         → WebSocket serveur
JWT                   → Authentification
Helmet.js 7.1         → Sécurité headers
Multer               → Upload fichiers
Bcrypt 5.1           → Hachage mots de passe
Express Rate Limit   → Protection contre spam
XSS Clean            → Protection XSS
```

#### Base de Données et Stockage
```
JSON Files           → Stockage actuel (développement)
PostgreSQL/MongoDB   → Migration prête (production)
LocalStorage         → Cache côté client
```

### Nouvelles Fonctionnalités Ajoutées

#### Sélecteur de Quantité Avancé
- Contrôles +/- avec validation de stock
- Prévention des dépassements de stock en temps réel
- Interface utilisateur intuitive avec indication visuelle
- Intégration complète dans tous les composants produits

#### Système de Chat Temps Réel
- Chat client-admin bidirectionnel
- Support des fichiers et médias
- Notifications en temps réel
- Interface moderne avec états de lecture

#### Sécurité Renforcée
- Routes sécurisées avec IDs obfusqués
- Protection CSRF et XSS
- Validation stricte des entrées
- Middleware de sécurité multicouche

### Structure des Répertoires

```
riziky-boutic/
├── src/                    # Code source frontend React
│   ├── components/         # Composants réutilisables
│   │   ├── ui/            # Composants UI de base (shadcn)
│   │   ├── layout/        # Composants de mise en page
│   │   ├── products/      # Composants produits
│   │   ├── cart/          # Composants panier
│   │   ├── chat/          # Composants chat temps réel
│   │   ├── admin/         # Composants administration
│   │   └── auth/          # Composants authentification
│   ├── pages/             # Pages de l'application
│   ├── hooks/             # Hooks personnalisés
│   ├── services/          # Services API et logique métier
│   ├── contexts/          # Contextes React
│   ├── types/             # Définitions TypeScript
│   └── lib/               # Utilitaires et helpers
├── server/                # Code source backend Node.js
│   ├── routes/            # Routes API REST
│   ├── services/          # Logique métier serveur
│   ├── middlewares/       # Middlewares Express
│   ├── socket/            # Gestion WebSocket
│   ├── data/              # Fichiers JSON (base de données)
│   ├── uploads/           # Fichiers uploadés
│   └── config/            # Configuration serveur
├── tests/                 # Tests unitaires et e2e
├── cypress/               # Tests end-to-end Cypress
├── public/                # Fichiers statiques
└── docs/                  # Documentation projet
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ installé
- NPM ou Yarn
- Git
- Navigateur web moderne

### Installation

1. **Cloner le projet**
```bash
git clone [URL_DU_DEPOT]
cd riziky-boutic
```

2. **Installer les dépendances frontend**
```bash
npm install
```

3. **Installer les dépendances backend**
```bash
cd server
npm install
cd ..
```

4. **Configuration des variables d'environnement**
```bash
# Créer .env à la racine
VITE_API_BASE_URL=http://localhost:10000

# Créer server/.env
JWT_SECRET=votre_secret_jwt_securise
PORT=10000
NODE_ENV=development
```

5. **Démarrer en mode développement**

Terminal 1 (Backend) :
```bash
cd server
npm run dev
```

Terminal 2 (Frontend) :
```bash
npm run dev
```

6. **Accéder à l'application**
- Frontend : http://localhost:8080
- Backend API : http://localhost:10000

### Comptes de Test

**Administrateur :**
- Email : admin@riziky-boutic.com
- Mot de passe : Admin123!

**Client :**
- Email : vianey.jean@ymail.com
- Mot de passe : [voir fichier users.json]

---

## 📖 Utilisation de la Plateforme

### Pour les Clients

#### 1. Inscription et Connexion
- Créer un compte via la page d'inscription
- Se connecter avec email/mot de passe
- Récupération de mot de passe disponible
- Protection par force brute intégrée

#### 2. Navigation et Shopping
- Parcourir le catalogue par catégories
- Utiliser la recherche avancée avec filtres
- Filtrer par prix, disponibilité, promotions
- **NOUVEAU**: Sélectionner quantités avec contrôles +/-
- Ajouter des produits au panier avec validation de stock
- Gérer sa liste de favoris

#### 3. Fonctionnalités Avancées
- **Chat en temps réel** avec le service client
- Notifications d'achat en temps réel
- Recommandations personnalisées
- Historique de navigation sauvegardé

#### 4. Processus d'Achat
- Réviser le contenu du panier avec quantités
- Saisir les informations de livraison
- Choisir le mode de paiement sécurisé
- Confirmer la commande
- Suivi en temps réel de la commande

### Pour les Administrateurs

#### 1. Accès à l'Administration
- Se connecter avec un compte administrateur
- Accéder au panel d'administration via routes sécurisées
- Interface moderne avec tableaux de bord

#### 2. Gestion des Produits
- Créer/modifier/supprimer des produits
- Gérer les catégories et sous-catégories
- Upload d'images multiples avec compression
- Gestion avancée des stocks avec alertes
- Configuration des promotions et flash sales

#### 3. Gestion des Commandes
- Traiter les nouvelles commandes en temps réel
- Mettre à jour les statuts de livraison
- Gérer les remboursements avec workflow
- **NOUVEAU**: Chat direct avec les clients

#### 4. Analytics et Reporting
- Tableaux de bord des ventes
- Statistiques des visiteurs
- Rapports de performance
- Gestion des notifications système

---

## 🔧 Configuration et Personnalisation

### Variables d'Environnement

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:10000
NODE_ENV=development
```

#### Backend (server/.env)
```env
JWT_SECRET=votre_secret_jwt_securise_complexe
PORT=10000
NODE_ENV=development
UPLOAD_MAX_SIZE=10485760
SESSION_SECRET=votre_session_secret
BCRYPT_ROUNDS=12
```

### Personnalisation du Design

#### Couleurs de la Marque
Modifier `src/index.css` :
```css
:root {
  --primary: 0 84% 60%;        /* Rouge principal */
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96%;
  --accent: 0 84% 70%;         /* Rouge accent */
  --muted: 0 0% 96%;
  --border: 0 0% 89%;
}

.dark {
  --primary: 0 84% 60%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 15%;
  --accent: 0 84% 70%;
}
```

#### Configuration Tailwind
Modifier `tailwind.config.ts` pour les thèmes personnalisés et les animations.

---

## 📊 Fonctionnalités Principales Détaillées

### Authentification et Sécurité

#### Système d'Authentification JWT
```typescript
// Hook d'authentification sécurisé
const { user, login, logout, isAuthenticated, isAdmin } = useAuth();

// Connexion avec validation
await login(email, password);

// Routes protégées
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

#### Sécurité des Routes
```typescript
// Routes sécurisées avec IDs obfusqués
<SecureRoute>
  <ProductDetail />
</SecureRoute>

// Validation automatique des IDs
const secureId = generateSecureId(productId);
const realId = getRealId(secureId);
```

### Gestion du Panier avec Sélecteur de Quantité

#### Composant QuantitySelector
```typescript
// Nouveau composant avec validation de stock
<QuantitySelector
  productId={product.id}
  maxStock={product.stock}
  onQuantityChange={(quantity) => setSelectedQuantity(quantity)}
  size="default"
  disabled={product.stock === 0}
/>
```

#### Hook du Panier Avancé
```typescript
const { 
  cart, 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  getTotalItems,
  getTotalPrice 
} = useCart();

// Ajouter avec quantité spécifique
await addToCart(productId, quantity);
```

### Chat Temps Réel

#### Composants Chat
```typescript
// Widget de chat client
<ClientServiceChatWidget 
  isOpen={isChatOpen}
  onToggle={() => setIsChatOpen(!isChatOpen)}
/>

// Interface admin de chat
<AdminServiceChatWidget
  conversations={conversations}
  activeConversation={activeConversation}
/>
```

#### Socket.io Integration
```javascript
// Configuration WebSocket sécurisée
const socketConfig = {
  cors: {
    origin: allowedOrigins,
    credentials: true
  },
  middleware: [authMiddleware]
};
```

### Recherche et Filtrage Avancés

#### Hook de Filtres Produits
```typescript
const {
  searchTerm,
  priceRange,
  sortOption,
  sortedProducts,
  showInStock,
  showPromoOnly,
  activeFilters,
  resetFilters
} = useProductFilters({ products });
```

### Système de Reviews avec Photos

#### Composant de Review Moderne
```typescript
<ModernReviewForm
  productId={productId}
  onSubmit={handleReviewSubmit}
  allowPhotos={true}
  maxPhotos={4}
/>
```

---

## 🛡️ Sécurité Avancée

### Protection Multicouche

#### Middleware de Sécurité
```javascript
// Chain de sécurité appliquée à toutes les routes
const securityChain = new SecurityChainBuilder()
  .addIPValidation()
  .addRateLimit()
  .addJWTValidation()
  .addPermissionCheck()
  .addDataSanitization()
  .build();
```

#### Validation des Données
```typescript
// Schémas Zod pour validation stricte
const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().min(0),
  description: z.string().optional()
});
```

#### Protection XSS et CSRF
```javascript
// Configuration Helmet pour sécurité headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: true
}));
```

---

## 🧪 Tests et Qualité

### Tests Unitaires avec Vitest

#### Configuration des Tests
```javascript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  }
});
```

#### Exemples de Tests Composants
```typescript
// Test du QuantitySelector
describe('QuantitySelector', () => {
  it('should increase quantity when plus button is clicked', async () => {
    const onQuantityChange = vi.fn();
    render(<QuantitySelector onQuantityChange={onQuantityChange} />);
    
    const plusButton = screen.getByRole('button', { name: /plus/i });
    await userEvent.click(plusButton);
    
    expect(onQuantityChange).toHaveBeenCalledWith(2);
  });
});
```

### Tests E2E avec Cypress

#### Configuration Cypress
```javascript
// cypress.config.js
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
});
```

#### Tests de Parcours Utilisateur
```typescript
// cypress/e2e/shopping-flow.cy.ts
describe('Shopping Flow', () => {
  it('should complete full purchase flow', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="quantity-plus"]').click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="checkout-button"]').click();
    // ... continue the flow
  });
});
```

---

## 🚀 Déploiement Production

### Préparation Build

#### Optimisation Frontend
```bash
# Build optimisé avec Vite
npm run build

# Analyse du bundle
npm run build:analyze
```

#### Configuration Production
```env
# Variables production
NODE_ENV=production
VITE_API_BASE_URL=https://api.votre-domaine.com
JWT_SECRET=secret_production_ultra_securise_64_chars_minimum
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://redis-host:6379
```

### Optimisations Performance

#### Code Splitting
```typescript
// Lazy loading des pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));

// Suspense avec fallback
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

#### Mise en Cache
```typescript
// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
});
```

### Hébergement Recommandé

#### Frontend
- **Vercel** (recommandé) - Déploiement automatique
- **Netlify** - Alternative avec plugins
- **AWS S3 + CloudFront** - Contrôle total

#### Backend
- **Railway** (recommandé) - Configuration simple
- **Heroku** - Classic mais reliable
- **DigitalOcean App Platform** - Bon rapport qualité/prix
- **AWS EC2/ECS** - Contrôle maximal

#### Base de Données
- **PostgreSQL**: Supabase, Neon, AWS RDS
- **MongoDB**: MongoDB Atlas
- **Redis**: Upstash, AWS ElastiCache

---

## 📚 Documentation pour Développeurs

### Structure du Code

#### Conventions de Nommage
```typescript
// Composants: PascalCase
const ProductCard = () => {};

// Hooks: camelCase avec préfixe 'use'
const useProducts = () => {};

// Services: camelCase avec suffixe 'Service'
const authService = {};

// Types: PascalCase avec suffixe 'Type' ou interface
interface ProductType {}
type OrderStatus = 'pending' | 'confirmed' | 'shipped';
```

#### Architecture des Composants
```typescript
// Structure standard d'un composant
interface ComponentProps {
  // Props typées
}

const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
};

export default Component;
```

### APIs et Services

#### Configuration Axios
```typescript
// Configuration centralisée avec intercepteurs
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour l'authentification
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Services Métier
```typescript
// Service produits avec gestion d'erreurs
export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      throw new ApiError('Failed to fetch products', error);
    }
  },
  
  async create(product: CreateProductDto): Promise<Product> {
    const response = await apiClient.post('/products', product);
    return response.data;
  }
};
```

---

## ⚠️ Ce qu'il NE FAUT PAS Faire

### Sécurité Critique
- ❌ Exposer les clés API dans le code client
- ❌ Stocker des mots de passe en clair
- ❌ Ignorer la validation des entrées utilisateur
- ❌ Utiliser HTTP en production
- ❌ Désactiver les middlewares de sécurité
- ❌ Exposer les stack traces en production

### Performance et Bonnes Pratiques
- ❌ Charger tous les produits d'un coup sans pagination
- ❌ Faire des requêtes API dans des boucles
- ❌ Oublier la mise en cache des données
- ❌ Négliger l'optimisation des images
- ❌ Utiliser des re-renders inutiles
- ❌ Ignorer le code splitting

### Maintenance et Code
- ❌ Modifier directement les fichiers JSON en production
- ❌ Déployer sans tests
- ❌ Supprimer les logs d'audit
- ❌ Ignorer les sauvegardes automatiques
- ❌ Utiliser `any` en TypeScript
- ❌ Dupliquer la logique métier

---

## ✅ Bonnes Pratiques Avancées

### Développement
- ✅ Utiliser TypeScript avec strict mode
- ✅ Implémenter des tests pour toutes les fonctionnalités critiques
- ✅ Suivre les conventions de commit (Conventional Commits)
- ✅ Utiliser ESLint et Prettier pour la cohérence du code
- ✅ Documenter les APIs avec JSDoc
- ✅ Implémenter la gestion d'erreurs robuste

### Performance
- ✅ Implémenter la pagination pour toutes les listes
- ✅ Utiliser le lazy loading pour les images et composants
- ✅ Mettre en cache les données avec React Query
- ✅ Optimiser les requêtes base de données
- ✅ Implémenter le debouncing pour les recherches
- ✅ Utiliser les Web Workers pour les calculs lourds

### UX/UI
- ✅ Maintenir une cohérence visuelle avec le design system
- ✅ Implémenter des états de chargement significatifs
- ✅ Fournir des messages d'erreur clairs et actionnables
- ✅ Assurer la responsivité sur tous les appareils
- ✅ Implémenter l'accessibilité (ARIA, navigation clavier)
- ✅ Tester sur différents navigateurs

### Sécurité
- ✅ Valider toutes les entrées côté client ET serveur
- ✅ Implémenter une authentification robuste
- ✅ Utiliser HTTPS en production
- ✅ Implémenter la protection CSRF
- ✅ Auditer régulièrement les dépendances
- ✅ Logger les actions sensibles

---

## 🔍 Maintenance et Monitoring

### Logs et Monitoring

#### Logs Frontend
```typescript
// Logger structuré pour le frontend
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Envoyer à un service de monitoring
  }
};
```

#### Logs Backend
```javascript
// Winston pour logs serveur
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Base de Données et Migrations

#### Sauvegarde Automatique
```bash
#!/bin/bash
# Script de sauvegarde quotidienne
DATE=$(date +%Y%m%d_%H%M%S)
cp -r server/data/ backups/data_backup_$DATE/
```

#### Migration vers PostgreSQL
```sql
-- Script de migration exemple
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📞 Support et Documentation Technique

### Ressources Développeur
- **Architecture**: Voir `docs/Md/ARCHITECTURE_TECHNIQUE.md`
- **API Reference**: Voir `docs/Md/API_DOCUMENTATION.md`
- **Composants**: Voir `docs/Md/GUIDE_COMPOSANTS.md`
- **Tests**: Voir `docs/Md/GUIDE_TESTS.md`

### Résolution de Problèmes
1. **Erreurs de Build**: Vérifier les versions des dépendances
2. **Erreurs de Runtime**: Consulter les logs browser et serveur
3. **Problèmes de Performance**: Utiliser React DevTools Profiler
4. **Problèmes de Sécurité**: Auditer avec `npm audit`

### Scripts Utiles
```bash
# Développement
npm run dev              # Démarrer le dev serveur
npm run build           # Build production
npm run preview         # Prévisualiser le build
npm run test           # Exécuter les tests
npm run test:e2e       # Tests end-to-end
npm run lint           # Linter le code
npm run type-check     # Vérification TypeScript

# Maintenance
npm run analyze        # Analyser le bundle
npm run update-deps    # Mettre à jour les dépendances
npm run security-audit # Audit de sécurité
```

---

## 🆕 Changelog et Versions

### Version 2.0.0 (Actuelle)
- ✅ Sélecteur de quantité avec validation de stock
- ✅ Chat temps réel client-admin
- ✅ Sécurité renforcée avec routes obfusquées
- ✅ Tests unitaires et e2e complets
- ✅ Documentation technique mise à jour
- ✅ Performance optimisée
- ✅ UI/UX améliorée

### Roadmap Future
- 🔄 Migration vers base de données relationnelle
- 🔄 Système de paiement Stripe complet
- 🔄 PWA avec notifications push
- 🔄 Système de cache Redis
- 🔄 API GraphQL
- 🔄 Microservices architecture

---

*Cette documentation constitue le guide principal pour comprendre, utiliser et maintenir la plateforme Riziky-Boutic. Elle doit être mise à jour à chaque modification importante du système. Pour les développeurs : suivez toujours les bonnes pratiques énumérées et consultez la documentation technique spécialisée pour les détails d'implémentation.*

**Version de la documentation**: 2.0.0  
**Dernière mise à jour**: 2024  
**Prochaine révision prévue**: Avec la prochaine version majeure