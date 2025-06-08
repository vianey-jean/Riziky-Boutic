
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (user && user.email === "service.client@example.com") {
      setIsServiceAdmin(true);
    }
  }, [user]);
  
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
    { name: 'Catégories', path: secureRoutes.categories, realPath: '/admin/categories', icon: FolderOpen, color: 'from-purple-500 to-purple-600' },
    { name: 'Utilisateurs', path: secureRoutes.utilisateurs, realPath: '/admin/utilisateurs', icon: Users, color: 'from-green-500 to-green-600' },
    { name: 'Messages', path: secureRoutes.messages, realPath: '/admin/messages', icon: MessageCircle, color: 'from-yellow-500 to-orange-500' },
    { name: 'Commandes', path: secureRoutes.commandes, realPath: '/admin/commandes', icon: Truck, color: 'from-indigo-500 to-indigo-600' },
    { name: 'CodePromo', path: secureRoutes.codePromo, realPath: '/admin/code-promos', icon: Percent, color: 'from-pink-500 to-rose-500' },
    { name: 'Publicités', path: secureRoutes.pubLayout, realPath: '/admin/pub-layout', icon: Megaphone, color: 'from-cyan-500 to-cyan-600' },
    { name: 'Remboursements', path: secureRoutes.remboursements, realPath: '/admin/remboursements', icon: RefreshCw, color: 'from-red-500 to-red-600' },
    { name: 'Ventes Flash', path: secureRoutes.flashSales, realPath: '/admin/flash-sales', icon: Zap, color: 'from-amber-500 to-yellow-500' },
    { name: 'Chat Admin', path: secureRoutes.chat, realPath: '/admin', icon: ShoppingBag, color: 'from-emerald-500 to-emerald-600' },
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: secureRoutes.serviceClient, 
      realPath: '/admin/service-client',
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600'
    }] : []),
    { name: 'Paramètres', path: secureRoutes.parametres, realPath: '/admin/parametres', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  const isActivePath = (realPath: string) => {
    return location.pathname === realPath || location.pathname.startsWith(realPath + '/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-1.5 rounded-xl shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Riziky-Boutic</h1>
              <p className="text-xs text-gray-300">Administration</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-30 w-full md:w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen transition-transform duration-300 ease-in-out shadow-2xl flex flex-col`}>
        
        {/* Desktop Header */}
        <div className="hidden md:block p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-xl shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Riziky-Boutic
              </h1>
              <p className="text-gray-400 text-xs font-medium">Panneau d'Administration</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-sm ${
                isActivePath(item.realPath)
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className={`p-1.5 rounded-lg mr-2 transition-all duration-300 ${
                isActivePath(item.realPath) 
                  ? 'bg-white/20 shadow-lg' 
                  : `bg-gradient-to-r ${item.color} opacity-80 group-hover:opacity-100`
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-xs">{item.name}</span>
              {isActivePath(item.realPath) && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 flex-shrink-0">
          <Link 
            to="/" 
            className="flex items-center px-3 py-2 text-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300 group text-sm"
          >
            <div className="p-1.5 rounded-lg mr-2 bg-gradient-to-r from-gray-600 to-gray-500 group-hover:from-white/20 group-hover:to-white/20 transition-all duration-300">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium text-xs">Retour au site</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-3 md:p-4 h-screen overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-full p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
