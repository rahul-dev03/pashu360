import React from 'react';
import { HealthStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface RiskBadgeProps {
  level: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const { t } = useApp();

  const getBadgeStyle = () => {
    switch (level) {
      case 'Healthy':
        return 'bg-[#22C55E] text-white';
      case 'Attention':
        return 'bg-[#D97706] text-white';
      case 'Veterinary Review':
        return 'bg-[#EA580C] text-white';
      case 'Urgent':
        return 'bg-[#DC2626] text-white animate-pulse';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'Healthy':
        return t.healthy.toUpperCase();
      case 'Attention':
        return t.attention.toUpperCase();
      case 'Veterinary Review':
        return t.veterinaryReview.toUpperCase();
      case 'Urgent':
        return t.urgent.toUpperCase();
      default:
        return '';
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold tracking-wider',
    md: 'text-[11px] px-3 py-1 font-bold tracking-wider',
    lg: 'text-xs px-3.5 py-1.5 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full uppercase shadow-xs ${getBadgeStyle()} ${sizeClasses[size]}`}
    >
      {getLabel()}
    </span>
  );
};
