
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface DataStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

const DataStatsCard: React.FC<DataStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  status = 'info'
}) => {
  const getStatusGradient = () => {
    switch (status) {
      case 'success': return 'from-emerald-500 via-green-500 to-teal-500';
      case 'warning': return 'from-amber-500 via-orange-500 to-yellow-500';
      case 'error': return 'from-red-500 via-pink-500 to-rose-500';
      default: return 'from-blue-500 via-indigo-500 to-purple-500';
    }
  };

  const getCardGradient = () => {
    switch (status) {
      case 'success': return 'from-emerald-50 via-green-50 to-teal-50 border-emerald-200/60';
      case 'warning': return 'from-amber-50 via-orange-50 to-yellow-50 border-amber-200/60';
      case 'error': return 'from-red-50 via-pink-50 to-rose-50 border-red-200/60';
      default: return 'from-blue-50 via-indigo-50 to-purple-50 border-blue-200/60';
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${getCardGradient()} hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2`}>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient()} rounded-xl blur opacity-60 group-hover:opacity-80 transition-opacity`}></div>
            <div className={`relative p-3 bg-gradient-to-r ${getStatusGradient()} rounded-xl shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          
          <div className="flex items-baseline space-x-3">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"} 
                className={`text-xs font-semibold ${
                  trend.isPositive 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 font-medium">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DataStatsCard;
