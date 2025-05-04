import { BeakerIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'


type Props = {
  className?: string
}

const FormacionProduccion: React.FC<Props> = ({ className = '' }) => {
  return (
    <>
      <div className={"flex flex-col gap-4 h-full max-w-[400px] "+ className}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-bold text-xl">Formación Producción</h4>
          <div className="flex gap-1">
            <Link to={'/agregar/produccion'}>
              <PlusIcon className="size-10 p-2 stroke-2" />
            </Link>
            <Link to={'/editar/produccion'}>
              <PencilSquareIcon className="size-10 p-2 stroke-2" />
            </Link>
          </div>
        </div>
        <div>
          <ul>
            <li className="flex flex-col sm:flex-row gap-6">
              <BeakerIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
              <div className="text-[#637887]">
                <p className="font-semibold text-[#121417]">Tipo</p>
                <p>Titulo</p>
                <p>Rol</p>
                <p>Medio distribucion</p>
                <p>Autores</p>
                <p>Fecha</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
export default FormacionProduccion