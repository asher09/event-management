import React from 'react';

export interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

const baseClasses = "px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[#0f0f0f] bg-white text-[#000] placeholder-[#0f0f0f]";

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, type = 'text', required, min, max, className }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type={type}
    required={required}
    min={min}
    max={max}
    className={className ? `${baseClasses} ${className}` : baseClasses}
  />
);

export default TextInput;
