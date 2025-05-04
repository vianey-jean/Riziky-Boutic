
import React from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';

import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import ChatPage from './pages/ChatPage';
import ContactPage from './pages/ContactPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import DeliveryPage from './pages/DeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import CustomerServicePage from './pages/CustomerServicePage';
import BlogPage from './pages/BlogPage';
import CarriersPage from './pages/CarriersPage';
import HistoryPage from './pages/HistoryPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import FAQPage from './pages/FAQPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminClientChatPage from './pages/admin/AdminClientChatPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/produit/:productId" element={<ProductDetail />} />
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
          <Route path="/panier" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/favoris" element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } />
          {/* Routes protégées */}
          <Route path="/paiement" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/commandes" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/commande/:orderId" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          
              {/* Pages Admin */}
              <Route path="/admin/produits" element={
                <ProtectedRoute requireAdmin>
                  <AdminProductsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/utilisateurs" element={
                <ProtectedRoute requireAdmin>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/messages" element={
                <ProtectedRoute requireAdmin>
                  <AdminMessagesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/parametres" element={
                <ProtectedRoute requireAdmin>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/chat" element={
                <ProtectedRoute requireAdmin>
                  <AdminChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/chat-client" element={
                <ProtectedRoute requireAdmin>
                  <AdminClientChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="admin/commandes" element={
                <ProtectedRoute requireAdmin>
                  <AdminOrdersPage />
                </ProtectedRoute>
              } />


        
          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
