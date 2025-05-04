"use client";

import { DatosPersonales } from "../../datosPersona/DatosPersonales";
import { EpsFormulario } from "../../datosPersona/Eps";
import { InformacionContacto } from "../../datosPersona/InformacionContacto";
import { Rut } from "../../datosPersona/Rut";



const InformacionPersona = () => {

  return (
    <>
      <div className="flex w-full flex-col gap-y-8 lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] m-auto relative">
        <DatosPersonales/>
        <InformacionContacto/>
        <EpsFormulario/>
        <Rut/>
      </div>
    </>
  );
};
export default InformacionPersona;