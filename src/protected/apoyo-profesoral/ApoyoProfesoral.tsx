import { Link } from "react-router";

const ApoyoProfesoral = () => {
  return (
    <div className="grid grid-cols-2 gap-8  w-[1000px] m-auto h-screen bg-white p-8">
      <Link className="col-span-full" to="docentes">
        <div className="relative flex flex-col gap-4  text-white rounded-lg bg-red-500 items-end justify-end fondo-image2 w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300">
          <div className="backdrop-brightness-20 p-4 rounded bottom-0 w-full">
            <h3 className="text-2xl font-bold">Docentes</h3>
            <p>Lista a todos los docentes de la institución y sus documentos</p>
          </div>
        </div>
      </Link>
      <Link to="certificados">
        <div className=" relative flex flex-col gap-4 text-white rounded-lg bg-red-500 items-end justify-end fondo-image h-full bg-cover bg-center hover:scale-105 transition-transform duration-300">
          <div className="backdrop-brightness-20 p-4 rounded bottom-0 w-full">
            <h3 className="text-2xl font-bold">Crear certificados</h3>
            <p>
              Genera certificados para los docentes de la institución, puedes
              elegir entre varios tipos de certificados.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ApoyoProfesoral;
