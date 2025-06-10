
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecureRoute from '@/components/SecureRoute';
import { initSecureRoutes, getSecureRoute } from '@/services/secureIds';
import MaintenanceChecker from './MaintenanceChecker';
import RegistrationChecker from './RegistrationChecker';
import LoadingFallback from './LoadingFallback';

// Chargement paresseux des pages pour optimiser les performances
const HomePage = lazy(() => import('@/pages/HomePage'));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage'));
const MaintenanceLoginPage = lazy(() => import('@/pages/MaintenanceLoginPage'));
const RegisterBlockPage = lazy(() => import('@/pages/RegisterBlockPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const DeliveryPage = lazy(() => import('@/pages/DeliveryPage'));
const ReturnsPage = lazy(() => import('@/pages/ReturnsPage'));
const AllProductsPage = lazy(() => import('@/pages/AllProductsPage'));
const Promotions = lazy(() => import('@/pages/PromotionalProductsPage'));
const Nouveautes = lazy(() => import('@/pages/NewArrivalsPage'));
const Populaires = lazy(() => import('@/pages/PopularityPage'));
const CustomerServicePage = lazy(() => import('@/pages/CustomerServicePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const CarriersPage = lazy(() => import('@/pages/CarriersPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const CookiesPage = lazy(() => import('@/pages/CookiesPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderPage = lazy(() => import('@/pages/OrderPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FlashSalePage = lazy(() => import('@/pages/FlashSalePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Pages Admin
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminMessagesPage = lazy(() => import('@/pages/admin/AdminMessagesPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminChatPage = lazy(() => import('@/pages/admin/AdminChatPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminClientChatPage = lazy(() => import('@/pages/admin/AdminClientChatPage'));
const AdminCodePromosPage = lazy(() => import('@/pages/admin/AdminCodePromosPage'));
const AdminPubLayoutPage = lazy(() => import('@/pages/admin/AdminPubLayoutPage'));
const AdminRemboursementsPage = lazy(() => import('@/pages/admin/AdminRemboursementsPage'));
const AdminFlashSalesPage = lazy(() => import('@/pages/admin/AdminFlashSalesPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));

// Initialiser les routes sécurisées
const secureRoutes = initSecureRoutes();

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  // Remonter la page au changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Navigation vers:", location.pathname);
  }, [location.pathname]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Route sécurisée pour la page de maintenance-login */}
        <Route path={secureRoutes.get('/maintenance-login')?.substring(1)} element={<MaintenanceLoginPage />} />
        <Route path="/maintenance-login" element={<Navigate to={secureRoutes.get('/maintenance-login') || '/'} replace />} />
        
        {/* Route principale avec vérification de maintenance */}
        <Route path="/" element={
          <MaintenanceChecker>
            <HomePage />
          </MaintenanceChecker>
        } />
        
        {/* Routes d'authentification sécurisées */}
        <Route path={secureRoutes.get('/login')?.substring(1)} element={
          <MaintenanceChecker>
            <LoginPage />
          </MaintenanceChecker>
        } />
        <Route path="/login" element={<Navigate to={secureRoutes.get('/login') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/register')?.substring(1)} element={
          <MaintenanceChecker>
            <RegistrationChecker>
              <RegisterPage />
            </RegistrationChecker>
          </MaintenanceChecker>
        } />
        <Route path="/register" element={<Navigate to={secureRoutes.get('/register') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/forgot-password')?.substring(1)} element={
          <MaintenanceChecker>
            <ForgotPasswordPage />
          </MaintenanceChecker>
        } />
        <Route path="/forgot-password" element={<Navigate to={secureRoutes.get('/forgot-password') || '/'} replace />} />
        
        <Route path="/categorie/:categoryName" element={
          <MaintenanceChecker>
            <CategoryPage />
          </MaintenanceChecker>
        } />
        
        <Route path="/livraison" element={
          <MaintenanceChecker>
            <DeliveryPage />
          </MaintenanceChecker>
        } />
        <Route path="/mentions-legales" element={
          <MaintenanceChecker>
            <ReturnsPage />
          </MaintenanceChecker>
        } />
        <Route path="/retours" element={
          <MaintenanceChecker>
            <ReturnsPage />
          </MaintenanceChecker>
        } />

        <Route path={secureRoutes.get('/tous-les-produits')?.substring(1)} element={
          <MaintenanceChecker>
            <AllProductsPage />
          </MaintenanceChecker>
        } />
        <Route path="/tous-les-produits" element={<Navigate to={secureRoutes.get('/tous-les-produits') || '/'} replace />} />
        

        <Route path={secureRoutes.get('/promotions')?.substring(1)} element={
          <MaintenanceChecker>
            <Promotions />
          </MaintenanceChecker>
        } />
        <Route path="/promotions" element={<Navigate to={secureRoutes.get('/promotions') || '/'} replace />} />

        <Route path={secureRoutes.get('/nouveautes')?.substring(1)} element={
          <MaintenanceChecker>
            <Nouveautes />
          </MaintenanceChecker>
        } />
        <Route path="/nouveautes" element={<Navigate to={secureRoutes.get('/nouveautes') || '/'} replace />} />

         <Route path={secureRoutes.get('/populaires')?.substring(1)} element={
          <MaintenanceChecker>
            <Populaires />
          </MaintenanceChecker>
        } />
        <Route path="/populaires" element={<Navigate to={secureRoutes.get('/populaires') || '/'} replace />} />

        
        <Route path={secureRoutes.get('/flash-sale/:id')?.substring(1)} element={
          <MaintenanceChecker>
            <FlashSalePage />
          </MaintenanceChecker>
        } />
        <Route path="/flash-sale/:id" element={<Navigate to={secureRoutes.get('/flash-sale/:id') || '/'} replace />} />
        
        <Route path="/service-client" element={
          <MaintenanceChecker>
            <CustomerServicePage />
          </MaintenanceChecker>
        } />
        <Route path="/contact" element={
          <MaintenanceChecker>
            <ContactPage />
          </MaintenanceChecker>
        } />
        <Route path="/blog" element={
          <MaintenanceChecker>
            <BlogPage />
          </MaintenanceChecker>
        } />
        <Route path="/carrieres" element={
          <MaintenanceChecker>
            <CarriersPage />
          </MaintenanceChecker>
        } />
        <Route path="/notre-histoire" element={
          <MaintenanceChecker>
            <HistoryPage />
          </MaintenanceChecker>
        } />
        <Route path="/conditions-utilisation" element={
          <MaintenanceChecker>
            <TermsPage />
          </MaintenanceChecker>
        } />
        <Route path="/politique-confidentialite" element={
          <MaintenanceChecker>
            <PrivacyPage />
          </MaintenanceChecker>
        } />
        <Route path="/politique-cookies" element={
          <MaintenanceChecker>
            <CookiesPage />
          </MaintenanceChecker>
        } />
        <Route path="/faq" element={
          <MaintenanceChecker>
            <FAQPage />
          </MaintenanceChecker>
        } />

        <Route path="/chat" element={
          <MaintenanceChecker>
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          </MaintenanceChecker>
        } />
        
        <Route path={secureRoutes.get('/panier')?.substring(1)} element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        <Route path="/panier" element={<Navigate to={secureRoutes.get('/panier') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/favoris')?.substring(1)} element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        <Route path="/favoris" element={<Navigate to={secureRoutes.get('/favoris') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/paiement')?.substring(1)} element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        <Route path="/paiement" element={<Navigate to={secureRoutes.get('/paiement') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/commandes')?.substring(1)} element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        <Route path="/commandes" element={<Navigate to={secureRoutes.get('/commandes') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/profil')?.substring(1)} element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        <Route path="/profil" element={<Navigate to={secureRoutes.get('/profil') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/produits')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminProductsPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/produits" element={<Navigate to={secureRoutes.get('/admin/produits') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/categories')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminCategoriesPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/categories" element={<Navigate to={secureRoutes.get('/admin/categories') || '/'} replace />} />
        
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

        <Route path={getSecureRoute('/admin/code-promos')} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminCodePromosPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/service-client" element={<Navigate to={secureRoutes.get('/admin/service-client') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/pub-layout')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminPubLayoutPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/pub-layout" element={<Navigate to={secureRoutes.get('/admin/pub-layout') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/remboursements')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminRemboursementsPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/remboursements" element={<Navigate to={secureRoutes.get('/admin/remboursements') || '/'} replace />} />
        
        <Route path={secureRoutes.get('/admin/flash-sales')?.substring(1)} element={
          <SecureRoute>
            <ProtectedRoute requireAdmin>
              <AdminFlashSalesPage />
            </ProtectedRoute>
          </SecureRoute>
        } />
        <Route path="/admin/flash-sales" element={<Navigate to={secureRoutes.get('/admin/flash-sales') || '/'} replace />} />
        
        <Route path="/page/notfound" element={<NotFound />} />
        
        <Route path="/:secureOrderId" element={
          <MaintenanceChecker>
            <SecureRoute>
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            </SecureRoute>
          </MaintenanceChecker>
        } />
        
        <Route path="/produit/:productId" element={
          <MaintenanceChecker>
            <ProductDetail />
          </MaintenanceChecker>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
