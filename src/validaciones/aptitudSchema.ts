import {z} from "zod";

export const aptitudSchema = z.object({
  nombre_aptitud: z
    .string()
    .min(1, { message: "Campo vacio" })
    .max(50, { message: "Máximo 50 caracteres" }),
  descripcion_aptitud: z
    .string()
    .min(1, { message: "Campo vacio" })
    .max(500, { message: "Máximo 500 caracteres" })
});