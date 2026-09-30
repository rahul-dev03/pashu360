import React from 'react';
import { HealthStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export type ExtendedStatus =
  | HealthStatus
  | 'Pending'
  | 'Synced'
  | 'Review'
  | 'Completed'
  | 'Scheduled';

interface StatusChipProps {
  status: ExtendedStatus | string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className = '' }) => {
  const { t } = useApp();

  const getLabel = () => {
    switch (status) {
      case 'Healthy':
        return t.healthy;
      case 'Recovering':
        return 'सुधार (Recovering)';
      case 'Attention':
        return t.attention;
      case 'Veterinary Review':
      case 'Review':
        return t.veterinaryReview;
      case 'Urgent':
        return t.urgent;
      case 'Pending':
        return t.pending;
      case 'Synced':
        return t.synced;
      case 'Completed':
        return 'Completed';
      case 'Scheduled':
        return 'Scheduled';
      default:
        return status;
    }
  };

  switch (status) {
    case 'Healthy':
    case 'Recovering':
    case 'Synced':
      // Green -> Healthy / Recovering
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#166534] border border-[#C6F1D5] ${className}`}
        >
          {getLabel()}
        </span>
      );

    case 'Attention':
    case 'Veterinary Review':
    case 'Review':
    case 'Pending':
      // Amber -> Review / Attention
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        >
          {getLabel()}
        </span>
      );

    case 'Urgent':
    case 'Outbreak':
      // Red -> Urgent
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 ${className}`}
        >
          {getLabel()}
        </span>
      );

    case 'Completed':
      // Blue -> Completed
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 ${className}`}
        >
          {getLabel()}
        </span>
      );

    case 'Scheduled':
      // Yellow -> Scheduled
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 ${className}`}
        >
          {getLabel()}
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 ${className}`}
        >
          {status}
        </span>
      );
  }
};
