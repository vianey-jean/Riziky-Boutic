
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  stats?: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
  }>;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  action,
  stats 
}) => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Icon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-red-100 text-lg">{description}</p>
          </div>
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 h-12 px-6 rounded-xl font-semibold"
            variant="outline"
          >
            {action.icon && <action.icon className="h-5 w-5 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
      
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-red-100 text-sm">{stat.label}</p>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
