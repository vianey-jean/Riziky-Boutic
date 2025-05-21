
import React, { useEffect, lazy, Suspense } from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecureRoute from './components/SecureRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initSecureRoutes, getSecureRoute } from './services/secureIds';

// Composant de chargement
import { Skeleton } from './components/ui/skeleton';

const LoadingFallback = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="space-y-8 max-w-5xl mx-auto">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Chargement paresseux des pages pour optimiser les performances
const Index = lazy(() => import('./pages/Index'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const CarriersPage = lazy(() => import('./pages/CarriersPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Pages Admin
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminChatPage = lazy(() => import('./pages/admin/AdminChatPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminClientChatPage = lazy(() => import('./pages/admin/AdminClientChatPage'));

// Création d'un nouveau QueryClient avec configuration optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute (données considérées fraiches pendant 1 min)
      cacheTime: 5 * 60 * 1000, // 5 minutes (conserver les données en cache 5 min)
    },
  },
});

// Initialiser les routes sécurisées
const secureRoutes = initSecureRoutes();

function AppRoutes() {
  const location = useLocation();
  
  // Remonter la page au changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Navigation vers:", location.pathname);
  }, [location.pathname]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Routes d'authentification sécurisées */}
        <Route path={secureRoutes.get('/login')?.substring(1)} element={<LoginPage />} />
        <Route path="/login" element={<Navigate to={secureRoutes.get('/login') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/register')?.substring(1)} element={<RegisterPage />} />
        <Route path="/register" element={<Navigate to={secureRoutes.get('/register') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/forgot-password')?.substring(1)} element={<ForgotPasswordPage />} />
        <Route path="/forgot-password" element={<Navigate to={secureRoutes.get('/forgot-password') || '/'} replace />} />
        
        {/* Route de détail produit avec l'ID sécurisé directement dans le chemin */}
        <Route path="/:productId" element={<ProductDetail />} />
        <Route path="/produit/:productId" element={<Navigate to="/:productId" replace />} />
        
        <Route path="/categorie/:categoryName" element={<CategoryPage />} />
        
        {/* Pages d'information */}
        <Route path="/livraison" element={<DeliveryPage />} />
        <Route path="/retours" element={<ReturnsPage />} />
        <Route path="/service-client" element={<CustomerServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/carrieres" element={<CarriersPage />} />
        <Route path="/notre-histoire" element={<HistoryPage />} />
        <Route path="/conditions-utilisation" element={<TermsPage />} />
        <Route path="/politique-confidentialite" element={<PrivacyPage />} />
        <Route path="/politique-cookies" element={<CookiesPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        
        {/* Routes protégées avec URLs sécurisées */}
        <Route path={secureRoutes.get('/panier')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/panier" element={<Navigate to={secureRoutes.get('/panier') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/favoris')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/favoris" element={<Navigate to={secureRoutes.get('/favoris') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/paiement')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/paiement" element={<Navigate to={secureRoutes.get('/paiement') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/commandes')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/commandes" element={<Navigate to={secureRoutes.get('/commandes') || '/'} replace />} />
        
        <Route path="/commande/:orderId" element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        } />
        
        <Route path={secureRoutes.get('/profil')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/profil" element={<Navigate to={secureRoutes.get('/profil') || '/'} replace />} />
        
        {/* Pages Admin avec URLs sécurisées */}
        <Route path={secureRoutes.get('/admin/produits')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminProductsPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/produits" element={<Navigate to={secureRoutes.get('/admin/produits') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/utilisateurs')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminUsersPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/utilisateurs" element={<Navigate to={secureRoutes.get('/admin/utilisateurs') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/messages')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminMessagesPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/messages" element={<Navigate to={secureRoutes.get('/admin/messages') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/parametres')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminSettingsPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/parametres" element={<Navigate to={secureRoutes.get('/admin/parametres') || '/'} replace />} />
        
        <Route path={`${secureRoutes.get('/admin')?.substring(1)}/:adminId?`} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminChatPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/:adminId?" element={<Navigate to={secureRoutes.get('/admin') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/commandes')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminOrdersPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/commandes" element={<Navigate to={secureRoutes.get('/admin/commandes') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/service-client')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminClientChatPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/service-client" element={<Navigate to={secureRoutes.get('/admin/service-client') || '/'} replace />} />
        
        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
          <Toaster closeButton richColors position="top-center" />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
