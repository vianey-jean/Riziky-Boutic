
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminPageTitleProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

const AdminPageTitle: React.FC<AdminPageTitleProps> = ({ 
  title, 
  icon: Icon, 
  description, 
  className = "" 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-8 border border-slate-200/60 shadow-xl">
        <div className="flex items-center space-x-4 mb-3">
          {Icon && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 text-lg mt-2 font-medium">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageTitle;
