import { Link } from "react-router";

const TalentoHumano = () => {
  return (
    <div className="grid grid-cols-2 gap-8  w-[1000px] m-auto h-screen bg-white p-8">
      <Link className="col-span-full" to="convocatorias">
        <div className="relative flex flex-col gap-4  text-white rounded-lg bg-red-500 items-end justify-end fondo-image2 w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300">
          <div className="backdrop-brightness-20 p-4 rounded bottom-0 w-full">
            <h3 className="text-2xl font-bold">Convocatorias</h3>
            <p>
              Gestiona convocatorias: crea, edita, consulta y elimina
              fácilmente.
            </p>
          </div>
        </div>
      </Link>
      <Link to="postulaciones">
        <div className=" relative flex flex-col gap-4 text-white rounded-lg bg-red-500 items-end justify-end fondo-image h-full bg-cover bg-center hover:scale-105 transition-transform duration-300">
          <div className="backdrop-brightness-20 p-4 rounded bottom-0 w-full">
            <h3 className="text-2xl font-bold">Postulaciones</h3>
            <p>¡Descubre quién quiere ser parte de nuestra institución!</p>
          </div>
        </div>
      </Link>

      <div className=" relative flex flex-col gap-4  text-white rounded-lg bg-red-500 items-end justify-end fondo-image  h-full bg-cover bg-center hover:scale-105 transition-transform duration-300">
        <div className="backdrop-brightness-20 p-4 rounded bottom-0 w-full">
          <h3 className="text-2xl font-bold">Postulaciones</h3>
          <p>Mira quien esta interesado en entrar a nuestra instucion.</p>
        </div>
      </div>
    </div>
  );
};
export default TalentoHumano;
