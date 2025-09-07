# 🌐 Documentation API - Riziky-Boutic

## 📋 Vue d'Ensemble de l'API

L'API REST de Riziky-Boutic fournit tous les endpoints nécessaires pour les opérations e-commerce, la gestion des utilisateurs, et les fonctionnalités temps réel. Cette documentation détaille chaque endpoint avec exemples de requêtes et réponses.

**Base URL**: `http://localhost:10000` (développement) | `https://api.riziky-boutic.com` (production)

---

## 🔐 Authentification

### POST /api/auth/login

Connexion utilisateur avec génération de token JWT.

**Requête:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "client",
      "avatar": "/avatars/user123.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Erreurs:**
- `400`: Données manquantes
- `401`: Identifiants incorrects
- `423`: Compte verrouillé (trop de tentatives)

### POST /api/auth/register

Inscription d'un nouvel utilisateur.

**Requête:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+33123456789"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "user": {
      "id": "user124",
      "email": "newuser@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "client"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/logout

Déconnexion utilisateur.

**Headers requis:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### POST /api/auth/refresh

Rafraîchissement du token JWT.

**Requête:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": "24h"
  }
}
```

### POST /api/auth/reset-password

Demande de réinitialisation de mot de passe.

**Requête:**
```json
{
  "email": "user@example.com"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Code de réinitialisation envoyé par email"
}
```

---

## 📦 Produits

### GET /api/products

Récupération de tous les produits avec filtres optionnels.

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `category` (optionnel): ID de catégorie
- `search` (optionnel): Terme de recherche
- `minPrice` (optionnel): Prix minimum
- `maxPrice` (optionnel): Prix maximum
- `inStock` (optionnel): `true` pour produits en stock uniquement
- `onPromo` (optionnel): `true` pour produits en promotion

**Exemple:**
```
GET /api/products?page=1&limit=10&category=cat123&search=cheveux&inStock=true
```

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod123",
      "name": "Perruque Naturelle Premium",
      "description": "Perruque 100% cheveux naturels...",
      "price": 299.99,
      "originalPrice": 399.99,
      "promotion": 25,
      "stock": 15,
      "category": {
        "id": "cat123",
        "name": "Perruques",
        "slug": "perruques"
      },
      "images": [
        "/uploads/images/prod123-1.jpg",
        "/uploads/images/prod123-2.jpg"
      ],
      "variants": [
        {
          "id": "var123",
          "name": "Couleur",
          "values": ["Noir", "Châtain", "Blond"]
        }
      ],
      "reviews": {
        "average": 4.5,
        "count": 23
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/products/:id

Récupération d'un produit spécifique.

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "prod123",
    "name": "Perruque Naturelle Premium",
    "description": "Description complète du produit...",
    "price": 299.99,
    "stock": 15,
    "images": ["/uploads/images/prod123-1.jpg"],
    "category": {
      "id": "cat123",
      "name": "Perruques"
    },
    "reviews": [
      {
        "id": "rev123",
        "userId": "user456",
        "userName": "Marie D.",
        "rating": 5,
        "comment": "Excellent produit !",
        "photos": ["/uploads/reviews/rev123-1.jpg"],
        "createdAt": "2024-01-10T14:00:00Z"
      }
    ],
    "relatedProducts": [
      {
        "id": "prod124",
        "name": "Perruque Similar",
        "price": 249.99,
        "image": "/uploads/images/prod124-1.jpg"
      }
    ]
  }
}
```

### POST /api/products (Admin uniquement)

Création d'un nouveau produit.

**Headers requis:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Requête:**
```json
{
  "name": "Nouveau Produit",
  "description": "Description du produit",
  "price": 199.99,
  "stock": 50,
  "categoryId": "cat123",
  "images": ["file1.jpg", "file2.jpg"]
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "id": "prod125",
    "name": "Nouveau Produit",
    "price": 199.99,
    "stock": 50
  }
}
```

### PUT /api/products/:id (Admin uniquement)

Mise à jour d'un produit existant.

**Requête:**
```json
{
  "name": "Nom modifié",
  "price": 249.99,
  "stock": 25
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Produit mis à jour",
  "data": {
    "id": "prod123",
    "name": "Nom modifié",
    "price": 249.99,
    "stock": 25
  }
}
```

### DELETE /api/products/:id (Admin uniquement)

Suppression d'un produit.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Produit supprimé avec succès"
}
```

---

## 🛒 Panier

### GET /api/panier

Récupération du panier de l'utilisateur connecté.

**Headers requis:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart123",
    "userId": "user123",
    "items": [
      {
        "id": "item123",
        "productId": "prod123",
        "product": {
          "id": "prod123",
          "name": "Perruque Premium",
          "price": 299.99,
          "image": "/uploads/images/prod123-1.jpg",
          "stock": 15
        },
        "quantity": 2,
        "unitPrice": 299.99,
        "totalPrice": 599.98,
        "addedAt": "2024-01-20T10:00:00Z"
      }
    ],
    "summary": {
      "totalItems": 2,
      "subtotal": 599.98,
      "shipping": 9.99,
      "tax": 119.99,
      "total": 729.96,
      "savings": 100.00
    },
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### POST /api/panier/add

Ajout d'un produit au panier avec quantité spécifiée.

**Requête:**
```json
{
  "productId": "prod123",
  "quantity": 2,
  "variantId": "var123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Produit ajouté au panier",
  "data": {
    "cartId": "cart123",
    "item": {
      "productId": "prod123",
      "quantity": 2,
      "totalPrice": 599.98
    },
    "cartSummary": {
      "totalItems": 3,
      "total": 929.95
    }
  }
}
```

**Erreurs:**
- `400`: Données invalides
- `409`: Stock insuffisant
- `404`: Produit non trouvé

### PUT /api/panier/update

Mise à jour de la quantité d'un article.

**Requête:**
```json
{
  "productId": "prod123",
  "quantity": 3
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Quantité mise à jour",
  "data": {
    "item": {
      "productId": "prod123",
      "quantity": 3,
      "totalPrice": 899.97
    },
    "cartSummary": {
      "totalItems": 4,
      "total": 1229.94
    }
  }
}
```

### DELETE /api/panier/remove/:productId

Suppression d'un article du panier.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Article supprimé du panier",
  "data": {
    "cartSummary": {
      "totalItems": 1,
      "total": 329.97
    }
  }
}
```

### DELETE /api/panier/clear

Vidage complet du panier.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Panier vidé",
  "data": {
    "cartSummary": {
      "totalItems": 0,
      "total": 0
    }
  }
}
```

### POST /api/panier/apply-promo

Application d'un code promo.

**Requête:**
```json
{
  "promoCode": "WELCOME10"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Code promo appliqué",
  "data": {
    "discount": {
      "code": "WELCOME10",
      "type": "percentage",
      "value": 10,
      "amount": 59.98
    },
    "cartSummary": {
      "subtotal": 599.98,
      "discount": 59.98,
      "total": 669.96
    }
  }
}
```

---

## 📋 Commandes

### GET /api/orders

Récupération des commandes de l'utilisateur.

**Paramètres de requête:**
- `status` (optionnel): Filtrer par statut
- `page` (optionnel): Pagination
- `limit` (optionnel): Nombre par page

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "order123",
      "orderNumber": "ORD-2024-001",
      "status": "confirmed",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2024-01-20T10:00:00Z"
        },
        {
          "status": "confirmed",
          "timestamp": "2024-01-20T11:00:00Z"
        }
      ],
      "items": [
        {
          "productId": "prod123",
          "productName": "Perruque Premium",
          "quantity": 2,
          "unitPrice": 299.99,
          "totalPrice": 599.98
        }
      ],
      "shipping": {
        "address": {
          "firstName": "John",
          "lastName": "Doe",
          "street": "123 Rue Example",
          "city": "Paris",
          "postalCode": "75001",
          "country": "France"
        },
        "method": "standard",
        "cost": 9.99,
        "trackingNumber": "TR123456789"
      },
      "payment": {
        "method": "card",
        "status": "paid",
        "transactionId": "txn_123456"
      },
      "summary": {
        "subtotal": 599.98,
        "shipping": 9.99,
        "tax": 119.99,
        "total": 729.96
      },
      "createdAt": "2024-01-20T10:00:00Z",
      "estimatedDelivery": "2024-01-25T18:00:00Z"
    }
  ]
}
```

### GET /api/orders/:id

Récupération d'une commande spécifique.

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "order123",
    "orderNumber": "ORD-2024-001",
    "status": "shipped",
    "tracking": {
      "carrier": "La Poste",
      "trackingNumber": "TR123456789",
      "url": "https://tracking.laposte.fr/TR123456789",
      "updates": [
        {
          "status": "in_transit",
          "location": "Centre de tri Paris",
          "timestamp": "2024-01-22T09:00:00Z"
        }
      ]
    },
    "timeline": [
      {
        "event": "order_placed",
        "timestamp": "2024-01-20T10:00:00Z",
        "description": "Commande placée"
      },
      {
        "event": "payment_confirmed",
        "timestamp": "2024-01-20T10:05:00Z",
        "description": "Paiement confirmé"
      },
      {
        "event": "shipped",
        "timestamp": "2024-01-21T14:00:00Z",
        "description": "Commande expédiée"
      }
    ]
  }
}
```

### POST /api/orders

Création d'une nouvelle commande.

**Requête:**
```json
{
  "shipping": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+33123456789",
    "street": "123 Rue Example",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "payment": {
    "method": "card",
    "cardToken": "tok_123456789"
  },
  "promoCode": "WELCOME10",
  "notes": "Livraison en points relais"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "id": "order124",
    "orderNumber": "ORD-2024-002",
    "status": "pending",
    "paymentUrl": "https://payment.provider.com/pay/order124",
    "total": 729.96
  }
}
```

### PUT /api/orders/:id/status (Admin uniquement)

Mise à jour du statut d'une commande.

**Requête:**
```json
{
  "status": "shipped",
  "trackingNumber": "TR987654321",
  "notes": "Expédié via La Poste"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Statut mis à jour",
  "data": {
    "orderId": "order123",
    "status": "shipped",
    "trackingNumber": "TR987654321"
  }
}
```

---

## 💬 Chat (NOUVEAU)

### GET /api/client-chat/:userId

Récupération des messages de chat pour un utilisateur.

**Headers requis:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv123",
    "messages": [
      {
        "id": "msg123",
        "senderId": "user123",
        "senderType": "client",
        "content": "Bonjour, j'ai une question sur ma commande",
        "type": "text",
        "timestamp": "2024-01-20T10:00:00Z",
        "read": true
      },
      {
        "id": "msg124",
        "senderId": "admin456",
        "senderType": "admin",
        "content": "Bonjour ! Je peux vous aider. Quel est votre numéro de commande ?",
        "type": "text",
        "timestamp": "2024-01-20T10:05:00Z",
        "read": false
      }
    ],
    "unreadCount": 1,
    "lastActivity": "2024-01-20T10:05:00Z"
  }
}
```

### POST /api/client-chat/send

Envoi d'un message de chat.

**Requête:**
```json
{
  "content": "Ma commande ORD-2024-001",
  "type": "text",
  "replyTo": "msg124"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Message envoyé",
  "data": {
    "id": "msg125",
    "content": "Ma commande ORD-2024-001",
    "timestamp": "2024-01-20T10:10:00Z",
    "conversationId": "conv123"
  }
}
```

### POST /api/chat-files/upload

Upload de fichiers pour le chat.

**Headers requis:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Requête:**
```
FormData:
- file: [fichier]
- type: "image" | "document" | "audio"
- conversationId: "conv123"
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Fichier uploadé",
  "data": {
    "id": "file123",
    "filename": "photo_commande.jpg",
    "originalName": "photo_commande.jpg",
    "mimeType": "image/jpeg",
    "size": 1024000,
    "url": "/uploads/chat-files/file123.jpg",
    "type": "image"
  }
}
```

### GET /api/admin-chat (Admin uniquement)

Récupération de toutes les conversations pour admin.

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv123",
      "userId": "user123",
      "user": {
        "id": "user123",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "/avatars/user123.jpg"
      },
      "lastMessage": {
        "content": "Ma commande ORD-2024-001",
        "timestamp": "2024-01-20T10:10:00Z",
        "senderType": "client"
      },
      "unreadCount": 2,
      "status": "active",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

### POST /api/admin-chat/reply (Admin uniquement)

Réponse admin à un message client.

**Requête:**
```json
{
  "conversationId": "conv123",
  "content": "Votre commande a été expédiée aujourd'hui.",
  "type": "text"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Réponse envoyée",
  "data": {
    "id": "msg126",
    "content": "Votre commande a été expédiée aujourd'hui.",
    "timestamp": "2024-01-20T10:15:00Z"
  }
}
```

---

## 👤 Utilisateurs et Profils

### GET /api/users/profile

Récupération du profil utilisateur.

**Headers requis:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33123456789",
    "avatar": "/uploads/avatars/user123.jpg",
    "addresses": [
      {
        "id": "addr123",
        "type": "billing",
        "firstName": "John",
        "lastName": "Doe",
        "street": "123 Rue Example",
        "city": "Paris",
        "postalCode": "75001",
        "country": "France",
        "isDefault": true
      }
    ],
    "preferences": {
      "newsletter": true,
      "smsNotifications": false,
      "language": "fr",
      "currency": "EUR"
    },
    "stats": {
      "totalOrders": 12,
      "totalSpent": 2499.88,
      "favoriteCategory": "Perruques"
    },
    "createdAt": "2023-06-15T09:00:00Z"
  }
}
```

### PUT /api/users/profile

Mise à jour du profil utilisateur.

**Requête:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33123456789",
  "preferences": {
    "newsletter": true,
    "smsNotifications": false
  }
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Profil mis à jour",
  "data": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33123456789"
  }
}
```

### POST /api/profile-images

Upload de photo de profil.

**Headers requis:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Requête:**
```
FormData:
- profileImage: [fichier image]
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Photo de profil mise à jour",
  "data": {
    "avatarUrl": "/uploads/profile-images/profile-user123-timestamp.jpg"
  }
}
```

### GET /api/users (Admin uniquement)

Liste des utilisateurs pour administration.

**Paramètres de requête:**
- `page`, `limit`: Pagination
- `role`: Filtrer par rôle
- `search`: Recherche par nom/email
- `status`: Filtrer par statut

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "client",
      "status": "active",
      "lastLogin": "2024-01-20T08:00:00Z",
      "totalOrders": 12,
      "totalSpent": 2499.88,
      "createdAt": "2023-06-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 1250,
    "totalPages": 63
  }
}
```

---

## ⭐ Avis et Reviews

### GET /api/reviews

Récupération des avis avec filtres.

**Paramètres de requête:**
- `productId`: Avis pour un produit spécifique
- `rating`: Filtrer par note (1-5)
- `withPhotos`: `true` pour avis avec photos uniquement

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rev123",
      "userId": "user123",
      "productId": "prod123",
      "user": {
        "firstName": "Marie",
        "lastName": "D.",
        "avatar": "/avatars/user123.jpg"
      },
      "product": {
        "name": "Perruque Premium",
        "image": "/uploads/images/prod123-1.jpg"
      },
      "rating": 5,
      "title": "Excellent produit !",
      "comment": "Très satisfaite de mon achat, la qualité est au rendez-vous.",
      "photos": [
        "/uploads/review-photos/rev123-1.jpg",
        "/uploads/review-photos/rev123-2.jpg"
      ],
      "helpful": 15,
      "verified": true,
      "createdAt": "2024-01-15T14:00:00Z"
    }
  ]
}
```

### POST /api/reviews

Création d'un nouvel avis.

**Headers requis:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Requête:**
```
FormData:
- productId: "prod123"
- rating: 5
- title: "Excellent produit !"
- comment: "Très satisfaite de mon achat..."
- photos: [file1, file2] (optionnel)
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Avis publié avec succès",
  "data": {
    "id": "rev124",
    "rating": 5,
    "title": "Excellent produit !",
    "photos": ["/uploads/review-photos/rev124-1.jpg"]
  }
}
```

### PUT /api/reviews/:id/helpful

Marquer un avis comme utile.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Merci pour votre retour",
  "data": {
    "reviewId": "rev123",
    "helpfulCount": 16
  }
}
```

---

## 🏷️ Catégories

### GET /api/categories

Récupération de toutes les catégories.

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Perruques",
      "slug": "perruques",
      "description": "Collection de perruques naturelles et synthétiques",
      "image": "/uploads/categories/cat123.jpg",
      "productCount": 45,
      "subcategories": [
        {
          "id": "subcat123",
          "name": "Perruques Naturelles",
          "slug": "perruques-naturelles",
          "productCount": 25
        }
      ],
      "featured": true,
      "sortOrder": 1
    }
  ]
}
```

### POST /api/categories (Admin uniquement)

Création d'une nouvelle catégorie.

**Requête:**
```json
{
  "name": "Nouvelle Catégorie",
  "slug": "nouvelle-categorie",
  "description": "Description de la catégorie",
  "parentId": null,
  "featured": false
}
```

### PUT /api/categories/:id (Admin uniquement)

Mise à jour d'une catégorie.

**Requête:**
```json
{
  "name": "Nom modifié",
  "description": "Description modifiée",
  "featured": true
}
```

---

## 🎁 Codes Promo et Promotions

### GET /api/code-promos (Admin uniquement)

Liste des codes promo.

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "promo123",
      "code": "WELCOME10",
      "description": "10% de réduction pour les nouveaux clients",
      "type": "percentage",
      "value": 10,
      "minAmount": 50,
      "maxDiscount": 100,
      "validFrom": "2024-01-01T00:00:00Z",
      "validUntil": "2024-12-31T23:59:59Z",
      "usageLimit": 1000,
      "usageCount": 245,
      "active": true,
      "applicableCategories": ["cat123", "cat124"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/code-promos (Admin uniquement)

Création d'un code promo.

**Requête:**
```json
{
  "code": "SUMMER20",
  "description": "20% de réduction été",
  "type": "percentage",
  "value": 20,
  "minAmount": 100,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z",
  "usageLimit": 500
}
```

### POST /api/code-promos/validate

Validation d'un code promo.

**Requête:**
```json
{
  "code": "WELCOME10",
  "cartTotal": 150.00
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount": {
      "type": "percentage",
      "value": 10,
      "amount": 15.00
    },
    "newTotal": 135.00
  }
}
```

---

## 📊 Analytics et Statistiques (Admin)

### GET /api/analytics/dashboard

Données du tableau de bord admin.

**Headers requis:**
```
Authorization: Bearer <admin_token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalOrders": 1250,
      "totalRevenue": 125000.50,
      "totalCustomers": 850,
      "conversionRate": 3.2,
      "averageOrderValue": 100.00
    },
    "recentOrders": [
      {
        "id": "order123",
        "orderNumber": "ORD-2024-001",
        "customerName": "John Doe",
        "total": 299.99,
        "status": "confirmed",
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "topProducts": [
      {
        "id": "prod123",
        "name": "Perruque Premium",
        "sales": 45,
        "revenue": 13499.55
      }
    ],
    "salesChart": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "data": [12500, 15000, 18000, 16500, 20000]
    }
  }
}
```

### GET /api/analytics/sales

Données de ventes détaillées.

**Paramètres de requête:**
- `startDate`: Date de début (YYYY-MM-DD)
- `endDate`: Date de fin (YYYY-MM-DD)
- `groupBy`: `day` | `week` | `month`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "groupBy": "day"
    },
    "summary": {
      "totalRevenue": 45000.00,
      "totalOrders": 450,
      "averageOrderValue": 100.00,
      "growth": {
        "revenue": 15.5,
        "orders": 12.3
      }
    },
    "data": [
      {
        "date": "2024-01-01",
        "revenue": 1500.00,
        "orders": 15,
        "customers": 12
      }
    ]
  }
}
```

---

## 🔔 Notifications

### GET /api/notifications

Notifications utilisateur.

**Headers requis:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif123",
      "type": "order_update",
      "title": "Commande expédiée",
      "message": "Votre commande ORD-2024-001 a été expédiée",
      "data": {
        "orderId": "order123",
        "trackingNumber": "TR123456789"
      },
      "read": false,
      "createdAt": "2024-01-20T14:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

### PUT /api/notifications/:id/read

Marquer une notification comme lue.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

---

## 🌐 WebSocket Events

### Connection

```javascript
// Connexion WebSocket
const socket = io('/chat', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Événements clients
socket.emit('client:message', {
  content: 'Hello',
  type: 'text',
  conversationId: 'conv123'
});

socket.emit('client:typing', {
  conversationId: 'conv123',
  typing: true
});

// Événements reçus
socket.on('message:received', (data) => {
  console.log('Nouveau message:', data);
});

socket.on('admin:reply', (data) => {
  console.log('Réponse admin:', data);
});

socket.on('connection:status', (data) => {
  console.log('Statut connexion:', data.status);
});
```

### Admin WebSocket

```javascript
// Connexion admin
const adminSocket = io('/admin', {
  auth: {
    token: 'admin_jwt_token'
  }
});

// Événements admin
adminSocket.on('admin:new-client-message', (data) => {
  console.log('Nouveau message client:', data);
});

adminSocket.on('admin:client-connected', (data) => {
  console.log('Client connecté:', data.userId);
});

adminSocket.emit('admin:reply', {
  conversationId: 'conv123',
  content: 'Bonjour, comment puis-je vous aider ?',
  type: 'text'
});
```

---

## 🚨 Codes d'Erreur

### Erreurs Génériques

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Données de requête invalides |
| 401 | Unauthorized | Authentification requise |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit de données (ex: stock insuffisant) |
| 422 | Unprocessable Entity | Données valides mais non traitables |
| 429 | Too Many Requests | Limite de taux dépassée |
| 500 | Internal Server Error | Erreur serveur interne |

### Erreurs Spécifiques

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stock insuffisant pour ce produit",
    "details": {
      "productId": "prod123",
      "requestedQuantity": 5,
      "availableStock": 2
    }
  }
}
```

### Codes d'Erreur E-commerce

- `PRODUCT_NOT_FOUND`: Produit non trouvé
- `INSUFFICIENT_STOCK`: Stock insuffisant
- `INVALID_PROMO_CODE`: Code promo invalide
- `PROMO_CODE_EXPIRED`: Code promo expiré
- `CART_EMPTY`: Panier vide
- `PAYMENT_FAILED`: Échec du paiement
- `ORDER_NOT_FOUND`: Commande non trouvée
- `INVALID_SHIPPING_ADDRESS`: Adresse de livraison invalide

---

## 🔐 Sécurité API

### Rate Limiting

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Headers de Sécurité

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Token JWT

```json
{
  "iss": "riziky-boutic",
  "sub": "user123",
  "aud": "riziky-boutic-users",
  "exp": 1640995200,
  "iat": 1640908800,
  "role": "client"
}
```

---

Cette documentation couvre tous les endpoints disponibles dans l'API Riziky-Boutic. Elle est maintenue à jour avec chaque version de l'API et inclut des exemples pratiques pour faciliter l'intégration.