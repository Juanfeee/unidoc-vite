"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const InputPassword = ({ className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${className}         
          h-11 w-full rounded-lg border-[1.8px] border-blue-600 
          bg-slate-100/40
          p-3 pr-10 text-sm text-slate-950/90
          placeholder-slate-950/60 outline-none
          focus:border-blue-700 focus:ring-1 focus:ring-blue-700
          transition duration-300 ease-in-out`}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-950/60 hover:text-slate-950/90"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? (
          <EyeIcon className="h-5 w-5" />
        ) : (
          <EyeSlashIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default InputPassword;