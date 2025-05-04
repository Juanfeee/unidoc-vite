"use client";
import { LabelRadio } from "./LabelRadio";

type Props = {
  id: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  register?: any;
  value?: string;
};

export const AdjuntarArchivo = ({
  id,
  className = "",
  onChange,
  register,
  value,
  ...props
}: Props) => {
  return (
    <div className="col-span-full border-2 border-dashed border-gray-400 p-6 rounded-md w-full flex flex-col items-center">
      <LabelRadio htmlFor="certificado" className="text-lg font-extrabold">
        {value}
      </LabelRadio>

      <input
        id="inputCertificado"
        type="file"
        className="hidden"
        accept=".pdf"
        {...register}
      />

      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-md mt-4 hover:bg-gray-300 transition"
      >
        Subir certificado
      </button>
    </div>
  );
};
