import React from 'react';

export interface NumberInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

const baseClasses = "px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[#0f0f0f] bg-white text-[#000] placeholder-[#99b898]";

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder, required, min, max, className }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type="number"
    required={required}
    min={min}
    max={max}
    className={className ? `${baseClasses} ${className}` : baseClasses}
  />
);

export default NumberInput;
