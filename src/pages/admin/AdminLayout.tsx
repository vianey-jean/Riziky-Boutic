
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag,
  Package,
  MessageCircle,
  Users,
  Truck,
  Settings,
  LogOut,
  Percent,
  MessageSquare,
  Megaphone,
  RefreshCw,
  Zap,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureRoute } from '@/services/secureIds';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isServiceAdmin, setIsServiceAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Check if the current user is a service client admin
    if (user && user.email === "service.client@example.com") {
      setIsServiceAdmin(true);
    }
  }, [user]);
  
  // Obtenir les routes sécurisées
  const secureRoutes = {
    produits: getSecureRoute('/admin/produits'),
    utilisateurs: getSecureRoute('/admin/utilisateurs'),
    messages: getSecureRoute('/admin/messages'),
    commandes: getSecureRoute('/admin/commandes'),
    chat: getSecureRoute('/admin'),
    serviceClient: getSecureRoute('/admin/service-client'),
    codePromo: getSecureRoute('/admin/code-promos'),
    parametres: getSecureRoute('/admin/parametres'),
    pubLayout: getSecureRoute('/admin/pub-layout'),
    remboursements: getSecureRoute('/admin/remboursements'),
    flashSales: getSecureRoute('/admin/flash-sales'),
    categories: getSecureRoute('/admin/categories'),
  };
  
  const navItems = [
    { name: 'Produits', path: secureRoutes.produits, realPath: '/admin/produits', icon: Package, color: 'from-blue-500 to-blue-600' },
    { name: 'Catégories', path: secureRoutes.categories, realPath: '/admin/categories', icon: FolderOpen, color: 'from-green-500 to-green-600' },
    { name: 'Utilisateurs', path: secureRoutes.utilisateurs, realPath: '/admin/utilisateurs', icon: Users, color: 'from-purple-500 to-purple-600' },
    { name: 'Messages', path: secureRoutes.messages, realPath: '/admin/messages', icon: MessageCircle, color: 'from-orange-500 to-orange-600' },
    { name: 'Commandes', path: secureRoutes.commandes, realPath: '/admin/commandes', icon: Truck, color: 'from-indigo-500 to-indigo-600' },
    { name: 'CodePromo', path: secureRoutes.codePromo, realPath: '/admin/code-promos', icon: Percent, color: 'from-pink-500 to-pink-600' },
    { name: 'Publicités', path: secureRoutes.pubLayout, realPath: '/admin/pub-layout', icon: Megaphone, color: 'from-yellow-500 to-yellow-600' },
    { name: 'Remboursements', path: secureRoutes.remboursements, realPath: '/admin/remboursements', icon: RefreshCw, color: 'from-teal-500 to-teal-600' },
    { name: 'Ventes Flash', path: secureRoutes.flashSales, realPath: '/admin/flash-sales', icon: Zap, color: 'from-red-500 to-red-600' },
    { name: 'Chat Admin', path: secureRoutes.chat, realPath: '/admin', icon: ShoppingBag, color: 'from-cyan-500 to-cyan-600' },
    // Conditional item for service client admin
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: secureRoutes.serviceClient, 
      realPath: '/admin/service-client',
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600'
    }] : []),
    { name: 'Paramètres', path: secureRoutes.parametres, realPath: '/admin/parametres', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  // Verifier si le chemin actuel correspond à un chemin réel (pour la mise en surbrillance du menu)
  const isActivePath = (realPath: string) => {
    return location.pathname === realPath || location.pathname.startsWith(realPath + '/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed md:relative w-80 md:w-72 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 md:min-h-screen z-40 shadow-2xl"
          >
            {/* Header */}
            <motion.div 
              className="p-6 border-b border-gray-200/50 dark:border-gray-700/50"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Riziky-Boutic
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Administration</p>
                </div>
              </div>
            </motion.div>
            
            {/* Navigation */}
            <nav className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActivePath(item.realPath)
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div className="relative z-10 flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isActivePath(item.realPath) && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-xl"
                        layoutId="activeBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Footer */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <LogOut className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Quitter</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        <motion.div 
          className="p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLayout;
