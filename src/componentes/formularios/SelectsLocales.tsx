
import { mappeoAreasContratacion, mappeoTipoContratacion } from "../../validaciones/talento-humano.ts/contratacionSchema";
import { mappeoEstadoConvocatoria } from "../../validaciones/talento-humano.ts/convocatoriaSchema";

type Props = {
  className?: string;
  register?: any;
  id: string;
};

export const SelectLocales = ({ id, className, register }: Props) => {
  const optionsMap: { [key: string]: Record<string, string> } = {
    estado_convocatoria: mappeoEstadoConvocatoria,
    tipo_contrato: mappeoTipoContratacion,
    area: mappeoAreasContratacion,
  };

  const options = optionsMap[id];

  return (
    <div className="flex flex-col">
      <select
        defaultValue=""
        {...register}
        id={id}
        className={`${className} h-11 w-full rounded-lg border-[1.8px] border-blue-600
        bg-slate-100/40 p-3 text-sm text-slate-950/90
        placeholder-slate-950/60 outline-none
        focus:border-blue-700 focus:ring-1 focus:ring-blue-700
        transition duration-300 ease-in-out`}
      >
        <option value="" disabled>
          Seleccione una opción
        </option>
        {options &&
          Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
      </select>
    </div>
  );
};