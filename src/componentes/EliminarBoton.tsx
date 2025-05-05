// EliminarBoton.tsx
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Modal from './Modal';

type Props = {
  id: number;
  onConfirmDelete: (id: number) => void;
};

const EliminarBoton = ({ id, onConfirmDelete }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center justify-center w-10 h-10 bg-[#F0F2F5] rounded-lg text-[#121417] hover:bg-[#E0E4E8] transition duration-300 ease-in-out"
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="size-12 p-2 text-[#121417]" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-56">
          <TrashIcon className="mx-auto text-red-500 size-12" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Borrar</h3>
            <p className="text-sm text-gray-500">
              Seguro que quieres eliminar?
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className=""
              onClick={() => {
                onConfirmDelete(id);
                setOpen(false);
              }}
            >
              Eliminar
            </button>
            <button className="btn btn-light w-full" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EliminarBoton;
