import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
   title: string;
   value: string | number;
   change: string;
   changeType: 'positive' | 'negative' | 'neutral';
   icon: typeof LucideIcon;
   color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

const colorStyles = {
   blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
   },
   green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-200',
   },
   purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-200',
   },
   amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      border: 'border-amber-200',
   },
   red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-200',
   },
};

const changeStyles = {
   positive: 'text-green-600 bg-green-50',
   negative: 'text-red-600 bg-red-50',
   neutral: 'text-gray-600 bg-gray-50',
};

export default function StatsCard({
   title,
   value,
   change,
   changeType,
   icon: Icon,
   color,
}: StatsCardProps) {
   const styles = colorStyles[color];

   return (
      <div
         className={`bg-white rounded-xl shadow-sm border ${styles.border} p-6 hover:shadow-md transition-shadow duration-200`}
      >
         <div className="flex items-center justify-between">
            <div className="flex-1">
               <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
               <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
               <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeStyles[changeType]}`}
               >
                  {change}
               </span>
            </div>
            <div className={`${styles.iconBg} p-3 rounded-lg`}>
               <Icon className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
         </div>
      </div>
   );
}
