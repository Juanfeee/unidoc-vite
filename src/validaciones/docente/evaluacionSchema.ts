import { z } from "zod";

export const evaluacionSchema = z.object({
  promedio_evaluacion_docente: z
    .number()
    .positive("El promedio debe ser un número positivo")
    .max(100, "El promedio no puede ser mayor a 100")
    .refine((value) => Number(value.toFixed(2)) === value, {
      message: "Solo se permiten hasta dos decimales",
    }),
});
