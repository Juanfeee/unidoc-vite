import { AcademicCapIcon, BeakerIcon, BriefcaseIcon, GlobeAmericasIcon, PencilSquareIcon, XMarkIcon,PlusIcon } from '@heroicons/react/24/outline'


export const AcademicIcono = () => {
  return (
    <AcademicCapIcon className="size-10 p-2 rounded-lg bg-[#266AAE] text-white" />
  )
}
export const BriefIcon = () => {
  return (
    <BriefcaseIcon className="size-10 p-2 rounded-lg bg-[#266AAE] text-white" />
  )
}
export const GlobeIcon = () => {
  return (
    <GlobeAmericasIcon className="size-10 p-2 rounded-lg bg-[#266AAE] text-white" />
  )
}
export const BeakerIcons = () => {
  return (
    <BeakerIcon className="size-10 p-2 rounded-lg bg-[#266AAE] text-white" />
  )
}

export const PencilIcon = () => {
  return (
    <PencilSquareIcon className="size-10 p-2 rounded-lg bg-orange-400 text-white" />

  )
  
}
//Cerrar Icon
export const CloseIcon = () => {
  return (
    <XMarkIcon className="size-8 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer " />
  );
};
// Agregar Icon
export const AddIcon = () => {
  return (
    <PlusIcon className="size-10 p-2 stroke-2 cursor-pointer hover:bg-gray-200 hover:rounded-xl" />
  );
}
// Editar Icon Index
export const EditIcon = () => {
  return (
    <PencilSquareIcon className="size-10 p-2 stroke-2 cursor-pointer hover:bg-gray-200 hover:rounded-xl" />
  );
}

interface VerDocumentosProps {
  texto: string;
}
export const VerDocumentos = ({ texto }: VerDocumentosProps
) => {
  return (
    <p className=" p-2 rounded-lg bg-blue-500 text-white" >
      {texto}
    </p>

  )
}