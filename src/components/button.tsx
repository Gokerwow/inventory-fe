import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'outline' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}: ButtonProps) {

  // Base styles (Layout, Focus, Transition)
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variants (Colors) - Using your new CSS variables
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
    danger: "bg-danger hover:bg-red-600 text-white focus:ring-danger",
    success: "bg-success hover:bg-teal-600 text-white focus:ring-success", // (If you added this previously)

    // ✅ ADD THIS LINE:
    warning: "bg-warning hover:bg-orange-600 text-white focus:ring-warning",

    outline: "border-2 border-gray-300 bg-transparent text-gray-700 hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  // Sizes
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⚪</span> // You can replace with your Loader icon
      ) : null}
      {children}
    </button>
  );
}