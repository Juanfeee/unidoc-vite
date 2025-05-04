import React from 'react';

type Props = {
  htmlFor: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
};

export const LabelRadio = ({
  htmlFor,
  value,
  className = '',
  children,
  inputProps = {},
  label,
}: Props) => {
  return (
    
    <label htmlFor={htmlFor} className={`flex items-center gap-2 text-sm ${className}`}>
      <input
        type="radio"
        value={value}
        id={htmlFor}
        className="accent-blue-600 h-4 w-4 flex"
        {...inputProps}
      />
      <span className="text-slate-800 text-sm">{label ?? children}</span>
    </label>
  );
};
