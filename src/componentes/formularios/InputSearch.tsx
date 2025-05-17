import React, { forwardRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type InputSearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClass?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      type = "text",
      className = "",
      containerClass = "",
      icon = <MagnifyingGlassIcon className="h-5 w-5 text-slate-950/60" />,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const hasIcon = !!icon;
    const iconPadding = hasIcon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "px-3";

    return (
      <div className={`relative ${containerClass}`}>
        {hasIcon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          ref={ref}
          type={type}
          className={`${className} ${iconPadding}         
            h-11 w-[500px] rounded-lg border-[1.8px] border-[#266AAE] 
            bg-slate-100/40
            py-2.5 text-sm text-slate-950/90
            placeholder-slate-950/60 outline-none
            focus:border-blue-700 focus:ring-1 focus:ring-blue-700
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        
        {hasIcon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

InputSearch.displayName = "InputSearch";

export default InputSearch;