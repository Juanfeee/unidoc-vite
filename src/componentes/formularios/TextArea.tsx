import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      {...props}
      className={`${className}         
        h-32 w-full rounded-lg border-[1.8px] border-blue-600 
        bg-slate-100/40
        p-3 text-sm text-slate-950/90
        placeholder-slate-950/60 outline-none
        focus:border-blue-700 focus:ring-1  focus:ring-blue-700
        transition duration-300 ease-in-out resize-none`}
    />
  );
};

export default TextArea;
