import { LabelText } from "../../componentes/formularios/LabelText";
import { Puntaje } from "../../componentes/formularios/puntaje";
import { Texto } from "../../componentes/formularios/Texto";


const InformacionPersonalDocente = () => {
  const carga = "pendiente";
  return (
    <>
      <div className="flex flex-col w-full rounded-md lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white py-12 px-8 rounded-xl gap-7">
          <div className="flex flex-col md:flex-row gap-y-2 col-span-full justify-between">
            <h2 className="font-bold text-3xl">Hoja de vida</h2>
            <p className="font-medium text-lg">Estado de validación Académica: <span>{carga}</span> </p>
          </div>
          <div className="grid items-center sm:grid-cols-2 col-span-full gap-y-4">
            <h3 className="col-span-full font-semibold text-lg">Datos personales</h3>
            <div className="flex gap-x-4 items-center">
              <img src="https://img.freepik.com/fotos-premium/retrato-hombre-negocios-expresion-cara-seria-fondo-estudio-espacio-copia-bengala-persona-corporativa-enfoque-pensamiento-duda-mirada-facial-dilema-o-concentracion_590464-84924.jpg" alt="" className="size-14 object-cover rounded-full" />
              <Texto
                value="Aurora Morales Gómez"
              />
            </div>
            <div className="flex sm:justify-end">
              <Puntaje
                value="0.0"
              />
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 col-span-full gap-x-8 gap-y-6 border-t-1 py-4 border-gray-200">
            <div>
              <LabelText
                value="Correo electrónico"
              />
              <Texto
                className="break-words"
                value="auroramorales@uniautonoma.edu.co"
              />
            </div>
            <div>
              <LabelText
                value="Ubicación"
              />
              <Texto
                value="Popayán, Cauca"
              />
            </div>
            <div>
              <LabelText
                value="Facultades"
              />
              <Texto
                value="Facultad de Ingenieria, Facultad de Ciencias ambientales"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default InformacionPersonalDocente