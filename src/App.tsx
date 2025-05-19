
import React, { useEffect } from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecureRoute from './components/SecureRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initSecureRoutes, getSecureRoute } from './services/secureIds';

// Page imports
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import DeliveryPage from './pages/DeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import CustomerServicePage from './pages/CustomerServicePage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import CarriersPage from './pages/CarriersPage';
import HistoryPage from './pages/HistoryPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import FAQPage from './pages/FAQPage';
import ChatPage from './pages/ChatPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

// Admin page imports
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminClientChatPage from './pages/admin/AdminClientChatPage';

// Création d'un nouveau QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialiser les routes sécurisées
const secureRoutes = initSecureRoutes();

function AppRoutes() {
  const location = useLocation();
  
  // Ne pas réinitialiser les IDs sécurisés à chaque changement de route
  // Cela permet de conserver les liens pendant la navigation
  useEffect(() => {
    // On ne reset plus les IDs pour éviter que les liens ne deviennent invalides
    console.log("Navigation vers:", location.pathname);
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
          <Toaster />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
