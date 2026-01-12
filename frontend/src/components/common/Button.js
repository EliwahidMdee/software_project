/**
 * Button Component
 * 
 * A reusable button component with different variants and sizes.
 * 
 * Props:
 * - variant: 'primary', 'secondary', 'danger', 'success' (default: 'primary')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - children: Button text/content
 * - onClick: Click handler function
 * - disabled: Boolean to disable button
 * - type: 'button', 'submit', 'reset' (default: 'button')
 * - className: Additional CSS classes
 */

import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabled ? disabledStyles : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
