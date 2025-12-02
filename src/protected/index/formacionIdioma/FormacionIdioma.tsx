
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import EstadoDocumento from "../../../componentes/Estado";
import { GlobeIcon } from "../../../assets/icons/Iconos";
import Cookies from "js-cookie";
import { RolesValidos } from "../../../types/roles";
import { jwtDecode } from "jwt-decode";
import ButtonAgregar from "../../../componentes/formularios/buttons/ButtonAgregar";
import ButtonEditar from "../../../componentes/formularios/buttons/ButtonPreEditar";
import ButtonAgregarVacio from "../../../componentes/formularios/buttons/ButtonAgregarVacio";
import CustomDialog from "../../../componentes/CustomDialogForm";
import AgregarIdioma from "../../agregar/AgregarIdioma";
import PreIdioma from "../../editar/idioma/pre-idioma";

const FormacionIdioma = () => {
  const [idiomas, setIdiomas] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 1. Cargar desde caché primero
        const cached = sessionStorage.getItem("idiomas");
        if (cached) {
          setIdiomas(JSON.parse(cached));
        }

        // 2. Obtener datos actualizados del servidor
        const token = Cookies.get("token");
        if (!token) throw new Error("No authentication token found");
        const decoded = jwtDecode<{ rol: RolesValidos }>(token);
        const rol = decoded.rol;

        const ENDPOINTS = {
          Aspirante: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_IDIOMAS_ASPIRANTE
          }`,
          Docente: `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_ENDPOINT_OBTENER_IDIOMAS_DOCENTE
          }`,
        };

        const endpoint = ENDPOINTS[rol];
        const response = await axiosInstance.get(endpoint);

        // 3. Actualizar estado y caché si hay cambios
        if (response.data?.idiomas) {
          setIdiomas(response.data.idiomas);
          sessionStorage.setItem(
            "idiomas",
            JSON.stringify(response.data.idiomas)
          );
        }
      } catch (error) {
        console.error("Error al cargar idiomas:", error);
        // Opcional: Mostrar notificación si falla la conexión
      }
    };

    fetchDatos();
  }, []);

  if (!idiomas) {
    return (
      <div className="flex justify-center items-center h-full">Cargando...</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full max-w-[400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-bold text-xl">Formación idioma</h4>
        <div className="flex gap-1">
          <ButtonAgregar onClick={() => setOpenAdd(true)} />
          <ButtonEditar onClick={() => setOpenEdit(true)} />
        </div>
      </div>
      <div>
        {idiomas.length === 0 ? (
          <ButtonAgregarVacio onClick={() => setOpenAdd(true)} />
        ) : (
          <ul className="flex flex-col gap-6">
            {idiomas.map((item, index) => (
              <li className="flex flex-col sm:flex-row gap-6" key={index}>
                <GlobeIcon />
                <div className="text-[#637887]">
                  <p className="font-semibold text-[#121417]">{item.idioma}</p>
                  <p>{item.institucion_idioma}</p>
                  <p>{item.nivel}</p>
                  <p>{item.fecha_certificado}</p>
                  <EstadoDocumento documentos={item.documentos_idioma} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* MODAL AGREGAR */}
      <CustomDialog
        title="Agregar Idioma"
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      >
        <AgregarIdioma />
      </CustomDialog>
      {/* MODAL EDITAR */}
      <CustomDialog
        title="Editar Idioma"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      >
        <PreIdioma />
      </CustomDialog>
    </div>
  );
};

export default FormacionIdioma;
