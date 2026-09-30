import React, { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  icon,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = true,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#166534] hover:bg-[#14532D] active:scale-[0.985] text-white shadow-sm border border-emerald-900/10';
      case 'secondary':
        return 'bg-white hover:bg-gray-50 active:scale-[0.985] text-gray-800 border border-gray-200 shadow-2xs';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 active:scale-[0.985] text-white shadow-sm';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 active:scale-[0.985] text-gray-700';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-[18px] font-semibold text-sm transition-all duration-150 cursor-pointer ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${getVariantStyles()} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
