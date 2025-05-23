
import React, { ReactNode } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { Boxes, Package, Users, MessageSquare, Settings, ShoppingCart, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Package className="w-5 h-5 mr-3" />
                Produits
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Commandes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Users className="w-5 h-5 mr-3" />
                Utilisateurs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/messages"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/chat"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Chat
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/code-promos"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Tag className="w-5 h-5 mr-3" />
                Codes Promo
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                Paramètres
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
