import React from 'react';

export type UniversalStatusType =
  | 'Healthy'
  | 'Recovering'
  | 'Attention'
  | 'Review'
  | 'Veterinary Review'
  | 'Urgent'
  | 'Outbreak'
  | 'Completed'
  | 'completed'
  | 'En Route'
  | 'en_route'
  | 'Scheduled'
  | 'scheduled'
  | 'Up to Date'
  | 'up_to_date'
  | 'Due Soon'
  | 'due_soon'
  | 'Overdue'
  | 'overdue'
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | string;

interface StatusBadgeProps {
  status: UniversalStatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showDot = true,
}) => {
  const normalized = (status || '').toLowerCase().replace(/_/g, ' ');

  // Universal Color Hierarchy:
  // Green: Healthy, Recovering, Completed, Up to Date, Low
  // Amber: Review, Veterinary Review, Attention, Due Soon, Medium
  // Red: Urgent, Outbreak, Overdue, Critical
  // Blue: En Route, Dispatched
  // Yellow: Scheduled, Pending
  let colorStyles = 'bg-stone-100 text-stone-700 border-stone-200';
  let dotColor = 'bg-stone-400';
  let isPulsing = false;
  let label = status;

  if (
    normalized.includes('health') ||
    normalized.includes('recover') ||
    normalized === 'completed' ||
    normalized.includes('up to date') ||
    normalized === 'low'
  ) {
    colorStyles = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-600';
    label = normalized === 'recovering' ? 'Recovering' : normalized === 'completed' ? 'Completed' : 'Healthy';
  } else if (
    normalized.includes('review') ||
    normalized.includes('attention') ||
    normalized.includes('due soon') ||
    normalized === 'medium'
  ) {
    colorStyles = 'bg-amber-100 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-600';
    label = normalized.includes('veterinary') ? 'Veterinary Review' : normalized.includes('due') ? 'Due Soon' : 'Review';
  } else if (
    normalized.includes('urgent') ||
    normalized.includes('outbreak') ||
    normalized.includes('overdue') ||
    normalized === 'critical'
  ) {
    colorStyles = 'bg-red-100 text-red-800 border-red-200';
    dotColor = 'bg-red-600';
    isPulsing = true;
    label = normalized.includes('outbreak') ? 'Outbreak' : normalized.includes('overdue') ? 'Overdue' : normalized === 'critical' ? 'Critical' : 'Urgent';
  } else if (normalized.includes('en route') || normalized.includes('dispatch')) {
    colorStyles = 'bg-blue-100 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-600';
    isPulsing = true;
    label = 'En Route';
  } else if (normalized.includes('schedul') || normalized.includes('pending')) {
    colorStyles = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    dotColor = 'bg-yellow-600';
    label = 'Scheduled';
  }

  const sizeStyles =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-xs'
      : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border transition-all select-none ${sizeStyles} ${colorStyles} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {isPulsing && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>
      )}
      <span>{label}</span>
    </span>
  );
};
