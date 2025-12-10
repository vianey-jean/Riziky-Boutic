
# 📘 Documentation - Système de Paiement de Remboursement

## Vue d'Ensemble

Le système de **Paiement de Remboursement** permet de gérer le suivi et le traitement des remboursements acceptés pour les clients de Riziky-Boutic. Il comprend une interface client pour suivre l'état des remboursements et une interface administrateur pour gérer les paiements.

---

## 🎯 Fonctionnalités

### Côté Client

1. **Visualisation des remboursements acceptés**
   - Affichage de tous les remboursements dont la demande a été acceptée
   - Statuts visibles : "Début", "En cours", "Payé"

2. **Suivi en temps réel**
   - Notifications flottantes lors du passage au statut "Payé"
   - Mise à jour automatique via WebSocket (Socket.IO)
   - Barre de progression visuelle

3. **Détails complets de la commande**
   - Liste des produits avec images
   - Sous-total, TVA, frais de livraison
   - Adresse de livraison
   - Mode de paiement utilisé

4. **Confirmation de réception**
   - Bouton "Confirmer réception" lorsque le statut est "Payé"
   - Disparition du remboursement après confirmation

5. **Contact support**
   - Bouton pour contacter le service client via chat

### Côté Administrateur

1. **Tableau de bord des remboursements**
   - Vue d'ensemble avec statistiques :
     - Nombre de remboursements actifs
     - En attente / En cours / Payés / Confirmés
     - Montant total à rembourser

2. **Gestion des statuts**
   - Modification du statut via menu déroulant
   - Transitions : Début → En cours → Payé
   - Notification automatique au client

3. **Recherche avancée**
   - Recherche par ID remboursement, commande, nom ou email
   - Résultats en temps réel (min. 3 caractères)
   - Accès à l'historique des remboursements validés

4. **Modal de détails**
   - Informations complètes du client
   - Détails financiers complets
   - Historique des dates

---

## 🏗️ Architecture Technique

### Structure des Fichiers

```
src/
├── components/
│   └── refund-payment/              # Composants réutilisables
│       ├── index.ts                 # Point d'entrée exports
│       ├── PaymentStatusBadge.tsx   # Badge de statut coloré
│       ├── PaymentMethodDisplay.tsx # Affichage mode de paiement
│       ├── RefundProgressBar.tsx    # Barre de progression
│       ├── RefundNotification.tsx   # Notification flottante
│       ├── RefundOrderDetails.tsx   # Détails de commande
│       ├── RefundEmptyState.tsx     # État vide
│       ├── RefundPageHeader.tsx     # En-tête premium
│       └── RefundPaidAlert.tsx      # Alerte paiement effectué
├── pages/
│   ├── PaiementRemboursementPage.tsx    # Page client
│   └── admin/
│       └── AdminPaiementRemboursementPage.tsx  # Page admin
├── services/
│   └── paiementRemboursementAPI.ts  # API service
├── types/
│   └── paiementRemboursement.ts     # Types TypeScript
└── utils/
    └── refundUtils.ts               # Utilitaires partagés

server/
├── routes/
│   └── paiement-remboursement.js    # Routes API Express
└── data/
    └── paiement-remboursement.json  # Base de données JSON
```

### Types de Données

```typescript
interface PaiementRemboursement {
  id: string;                    // Ex: "PR-1765286683479"
  remboursementId: string;       // ID de la demande de remboursement
  orderId: string;               // ID de la commande originale
  userId: string;                // ID de l'utilisateur
  userName: string;              // Nom complet
  userEmail: string;             // Email
  order: {
    id: string;
    totalAmount: number;         // Montant total à rembourser
    originalAmount: number;
    discount: number;
    subtotalProduits?: number;
    taxRate?: number;
    taxAmount?: number;
    deliveryPrice?: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    items: OrderItem[];
    createdAt: string;
  };
  reason: string;                // Raison du remboursement
  customReason?: string;         // Raison personnalisée
  status: 'debut' | 'en cours' | 'payé';
  decision: 'accepté' | 'refusé';
  clientValidated: boolean;      // Confirmation client reçue
  createdAt: string;
  updatedAt: string;
}
```

### API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/paiement-remboursement/check` | Vérifie si remboursements en attente | User |
| GET | `/api/paiement-remboursement/user` | Liste remboursements utilisateur | User |
| GET | `/api/paiement-remboursement` | Liste tous les remboursements | Admin |
| GET | `/api/paiement-remboursement/:id` | Détails d'un remboursement | User/Admin |
| PUT | `/api/paiement-remboursement/:id/status` | Modifier le statut | Admin |
| PUT | `/api/paiement-remboursement/:id/validate` | Confirmer réception | User |

### Événements Socket.IO

| Événement | Direction | Payload | Description |
|-----------|-----------|---------|-------------|
| `paiement-remboursement-created` | Server → Client | PaiementRemboursement | Nouveau remboursement créé |
| `paiement-remboursement-updated` | Server → Client | PaiementRemboursement | Statut mis à jour |

---

## 🎨 Composants Réutilisables

### PaymentStatusBadge

Badge coloré affichant le statut d'un remboursement.

```tsx
import { PaymentStatusBadge } from '@/components/refund-payment';

<PaymentStatusBadge status="payé" isPaid={true} />
<PaymentStatusBadge status="en cours" />
<PaymentStatusBadge status="debut" />
```

### RefundProgressBar

Barre de progression visuelle en 3 étapes.

```tsx
import { RefundProgressBar } from '@/components/refund-payment';

<RefundProgressBar status="en cours" />
```

### RefundOrderDetails

Affiche tous les détails d'une commande.

```tsx
import { RefundOrderDetails } from '@/components/refund-payment';

<RefundOrderDetails order={paiement.order} />
```

### RefundNotification

Notification flottante pour alerter le client.

```tsx
import { RefundNotification } from '@/components/refund-payment';

<RefundNotification 
  paiement={paiementData}
  onDismiss={(id) => handleDismiss(id)}
/>
```

---

## 🔄 Flux de Traitement

```
┌─────────────────────────────────────────────────────────────┐
│                    DEMANDE DE REMBOURSEMENT                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN: ACCEPTER/REFUSER                  │
└─────────────────────────────────────────────────────────────┘
                              │
                    Si accepté │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CRÉATION PAIEMENT REMBOURSEMENT                │
│                     status: "debut"                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                ADMIN: TRAITEMENT EN COURS                   │
│                    status: "en cours"                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN: PAIEMENT EFFECTUÉ                  │
│                      status: "payé"                         │
│          → Notification temps réel au client                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                CLIENT: CONFIRMER RÉCEPTION                  │
│                  clientValidated: true                      │
│          → Disparition de la liste active                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

Le système est entièrement responsive avec :

- **Mobile** : Cartes empilées, boutons pleine largeur
- **Tablette** : Grille 2 colonnes pour les statistiques
- **Desktop** : Affichage complet avec sidebar admin

---

## 🔒 Sécurité

1. **Authentification requise** pour toutes les routes
2. **Vérification propriétaire** : Un client ne peut voir que ses propres remboursements
3. **Rôle admin requis** pour modifier les statuts
4. **Validation des données** côté serveur

---

## 📊 Statistiques Admin

Le tableau de bord admin affiche :

- **Actifs** : Remboursements non confirmés
- **En attente** : Statut "debut"
- **En cours** : Statut "en cours"
- **Confirmés** : clientValidated = true
- **Montant** : Somme totale des remboursements actifs
