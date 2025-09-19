# 🌐 API Documentation Complète - Riziky-Boutic

## 📋 API Endpoints

### 🔐 Authentification
```javascript
// POST /api/auth/login - Connexion utilisateur
// POST /api/auth/register - Inscription utilisateur
// POST /api/auth/logout - Déconnexion
// POST /api/auth/refresh - Rafraîchissement token
// POST /api/auth/reset-password - Réinitialisation mot de passe
```

### 🛍️ Produits
```javascript
// GET /api/products - Liste des produits avec filtres
// GET /api/products/:id - Détails d'un produit
// POST /api/products - Créer un produit (Admin)
// PUT /api/products/:id - Modifier un produit (Admin)
// DELETE /api/products/:id - Supprimer un produit (Admin)
```

### 🛒 Panier
```javascript
// GET /api/panier - Récupérer le panier utilisateur
// POST /api/panier/add - Ajouter un produit au panier
// PUT /api/panier/update - Mettre à jour la quantité
// DELETE /api/panier/remove/:productId - Supprimer un article
// DELETE /api/panier/clear - Vider le panier
// POST /api/panier/apply-promo - Appliquer un code promo
```

### 📦 Commandes
```javascript
// GET /api/orders - Liste des commandes utilisateur
// GET /api/orders/:id - Détails d'une commande
// POST /api/orders - Créer une nouvelle commande
// PUT /api/orders/:id/status - Mettre à jour le statut (Admin)
```

### 💬 Chat
```javascript
// GET /api/client-chat/:userId - Messages chat utilisateur
// POST /api/client-chat/send - Envoyer un message
// POST /api/chat-files/upload - Upload fichier chat
// GET /api/admin-chat - Conversations admin
// POST /api/admin-chat/reply - Réponse admin
```

### 👤 Utilisateurs
```javascript
// GET /api/users/profile - Profil utilisateur
// PUT /api/users/profile - Modifier le profil
// POST /api/profile-images - Upload photo de profil
// GET /api/users - Liste utilisateurs (Admin)
```

### ⭐ Avis
```javascript
// GET /api/reviews - Liste des avis
// POST /api/reviews - Créer un avis
// PUT /api/reviews/:id/helpful - Marquer utile
```

### 🏷️ Catégories
```javascript
// GET /api/categories - Liste des catégories
// POST /api/categories - Créer une catégorie (Admin)
// PUT /api/categories/:id - Modifier une catégorie (Admin)
```

### 🎟️ Codes Promo
```javascript
// GET /api/code-promos - Liste codes promo (Admin)
// POST /api/code-promos - Créer un code promo (Admin)
// POST /api/code-promos/validate - Valider un code promo
```

---

*Documentation API complète avec tous les endpoints disponibles*