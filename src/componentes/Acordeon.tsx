"use client";
import { useState } from "react";

type AcordeonProps = {
  titulo: string;
  children: React.ReactNode;
  abiertoInicialmente?: boolean;
};

export const Acordeon = ({
  titulo,
  children,
  abiertoInicialmente = false,
}: AcordeonProps) => {
  const [abierto, setAbierto] = useState(abiertoInicialmente);

  return (
    <div className="acordeon rounded-xl overflow-hidden mb-4 bg-white">
      <div
        className={`acordeon-titulo flex justify-between items-center p-6 cursor-pointer ${
          abierto ? "active" : ""
        }`}
        onClick={() => setAbierto(!abierto)}
      >
        <h3 className="font-bold text-3xl">{titulo}</h3>
        <span className="acordeon-icono text-2xl">
          {abierto ? "−" : "+"}
        </span>
      </div>
      <div
        className={`acordeon-contenido px-8 transition-all duration-300 ease-in-out ${
          abierto ? "block pb-6" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};