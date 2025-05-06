import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormTrigger } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  trigger: UseFormTrigger<any>; // 👈 agrega trigger
};

const AdjuntarArchivo = ({ register, errors, trigger }: Props) => {
  const [fileName, setFileName] = useState<string>("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }

    // 👇 Forzar la validación al cambiar el archivo
    await trigger("archivo");
  };

  return (
    <div className="col-span-full border-2 border-dashed border-gray-400 p-6 rounded-md w-full flex flex-col items-center">
      <label htmlFor="archivo" className="text-lg font-bold text-gray-700 mb-2">
        Cargar archivo
      </label>

      <input
        id="archivo"
        type="file"
        accept=".pdf,application/pdf,.png,image/png,.jpg,image/jpeg"
        {...register("archivo")}
        onChange={handleChange}
        className="file:bg-gray-200 file:text-gray-700 file:rounded-md file:px-4 file:py-2 file:border-none file:shadow-sm file:hover:bg-gray-300 transition text-sm"
      />

      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          Archivo seleccionado: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {errors.archivo && (
        <p className="mt-1 text-sm text-red-500">{(errors.archivo as any).message}</p>
      )}
    </div>
  );
};

export default AdjuntarArchivo;
