
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className = "",
  headerActions 
}) => {
  return (
    <Card className={`shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${className}`}>
      {(title || description || Icon || headerActions) && (
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                {title && (
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>
            {headerActions && (
              <div>{headerActions}</div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default AdminCard;
