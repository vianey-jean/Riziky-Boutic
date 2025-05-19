
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
  MessageSquare
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
    parametres: getSecureRoute('/admin/parametres'),
  };
  
  const navItems = [
    { name: 'Produits', path: secureRoutes.produits, realPath: '/admin/produits', icon: Package },
    { name: 'Utilisateurs', path: secureRoutes.utilisateurs, realPath: '/admin/utilisateurs', icon: Users },
    { name: 'Messages', path: secureRoutes.messages, realPath: '/admin/messages', icon: MessageCircle },
    { name: 'Commandes', path: secureRoutes.commandes, realPath: '/admin/commandes', icon: Truck },
    { name: 'Chat Admin', path: secureRoutes.chat, realPath: '/admin', icon: ShoppingBag },
    // Conditional item for service client admin
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: secureRoutes.serviceClient, 
      realPath: '/admin/service-client',
      icon: MessageSquare 
    }] : []),
    { name: 'Paramètres', path: secureRoutes.parametres, realPath: '/admin/parametres', icon: Settings },
  ];

  // Verifier si le chemin actuel correspond à un chemin réel (pour la mise en surbrillance du menu)
  const isActivePath = (realPath: string) => {
    return location.pathname === realPath || location.pathname.startsWith(realPath + '/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-900 text-white md:min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
          <span className="font-bold text-lg">Admin Dashboard</span>
          <button className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Riziky-Boutic</h1>
            <p className="text-gray-400 text-sm">Administration</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActivePath(item.realPath)
                    ? 'bg-red-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-8 border-t border-gray-700 mt-8">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Quitter
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
