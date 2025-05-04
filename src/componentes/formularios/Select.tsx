
import { mappeoTipoExperiencia } from "@/validaciones/experienceSchema";
import { mappeoTipoProduccion } from "@/validaciones/productionSchema";
import { mappeoTipoEstudio } from "@/validaciones/studySchema";
type Props = {
  className?: string;
  register?: any;
  id: string;

}

export const Select = ({ id, className, register }: Props) => {
  //mappeo de opciones
  const optionsMap = {
    
  };


  //mapeamos las opciones dependiendo del id
  const options = Object.entries(optionsMap[id as keyof typeof optionsMap] || {}).map(([key, value]) => (
    <option key={key} value={key}>{value}</option>
  ));

  return (
    <>
      <div className="flex flex-col">
        <select
          defaultValue=""
          {...register}
          key={id}
          id={id}
          className={`${className} 
                  
          h-11 w-full rounded-lg  border-[1.8px] border-blue-600 
        bg-slate-100/40
        p-3 text-sm text-slate-950/90
        placeholder-slate-950/60 outline-none
        focus:border-blue-700 focus:ring-1  focus:ring-blue-700
        transition duration-300 ease-in-out}`}>
          <option key={id} value="" disabled>Seleccione una opcion</option>
          //mostramos las opciones
          {options}
        </select>
      </div>
    </>
  )
}