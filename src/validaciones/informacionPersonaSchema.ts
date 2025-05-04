import { z } from "zod";
export const datosPersonaSchema = z.object({
  telefono_movil: z.string().min(7, { message: "Campo requerido" })
});
