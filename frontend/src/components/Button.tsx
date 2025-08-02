import React from 'react';

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const baseClasses = "bg-[#99b898] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#000] transition-colors";

export const Button: React.FC<ButtonProps> = ({ onClick, children, type = "button", disabled, className }) => (
  <button 
    type={type} 
    onClick={onClick} 
    disabled={disabled} 
    className={className ? `${baseClasses} ${className}` : baseClasses}
  >
    {children}
  </button>
);

