"use client";
import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-4 rounded-full";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-orange-500 to-[#F27005] text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;