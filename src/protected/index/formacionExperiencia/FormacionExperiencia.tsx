import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'



const FormacionExperiencia = () => {
  return (
    <>
      <div className="flex flex-col gap-4 h-full max-w-[400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center" >
          <h4 className="font-bold text-xl">Formación experiencia</h4>
          <div className="flex gap-1">
            <Link to={'/agregar/experiencia'}>
              <PlusIcon className="size-10 p-2 stroke-2" />
            </Link>
            <Link to={'/editar/experiencia'}>
              <PencilSquareIcon className="size-10 p-2 stroke-2" />
            </Link>
          </div>
        </div>
        <div>
          <ul>
            <li className="flex flex-col sm:flex-row gap-6">
              <BriefcaseIcon className="size-12 p-2 rounded-lg bg-[#F0F2F5] text-[#121417]" />
              <div className="text-[#637887]">
                <p className="font-semibold text-[#121417]">Tipo</p>
                <p>Titulo</p>
                <p>Institucion</p>
                <p>fecha</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
export default FormacionExperiencia