
import React from 'react';
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Produits', path: '/admin/produits', icon: Package },
    { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users },
    { name: 'Messages', path: '/admin/messages', icon: MessageCircle },
    { name: 'Commandes', path: '/admin/commandes', icon: Truck },
    { name: 'Chat Admin', path: '/admin/chat', icon: ShoppingBag },
    // Nouvel élément pour le chat client, visible uniquement par le service client
    { 
      name: 'Chat Client', 
      path: '/admin/chat-client', 
      icon: MessageSquare,
      isServiceClientOnly: true 
    },
    { name: 'Paramètres', path: '/admin/parametres', icon: Settings },
  ];

  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => {
    // Si c'est un élément réservé au service client, vérifier que l'utilisateur est le service client
    if (item.isServiceClientOnly) {
      return user && user.email === 'service.client@example.com';
    }
    // Sinon, afficher l'élément normalement
    return true;
  });

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
            <h1 className="text-2xl font-bold mb-1">FranceBoutique</h1>
            <p className="text-gray-400 text-sm">Administration</p>
          </div>
          
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
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
