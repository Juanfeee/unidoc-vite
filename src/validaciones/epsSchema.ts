import { z } from "zod";



export const epsSchema = z.object({
  nombre_eps: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),

  tipo_afiliacion: z
    .string()
    .min(1, { message: "Selecciona una opción" }),
  estado_afiliacion: z
    .string()
    .min(1, { message: "Selecciona una opción" }),
  tipo_afiliado: z
    .string()
    .min(1, { message: "Selecciona una opción" }),

  numero_afiliado: z
    .string()
    .max(100, { message: "Máximo 100 caracteres" })
    .optional()
    .or(z.literal("")),

  fecha_afiliacion_efectiva: z
    .string({ invalid_type_error: "Esa no es una fecha" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),

  fecha_finalizacion_afiliacion: z
    .string()
    .optional()
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),

    archivo: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: "Debes subir un archivo",
    })
    .refine(
      (fileList) =>
        fileList instanceof FileList &&
        fileList[0].size <= 2 * 1024 * 1024,
      {
        message: "Archivo demasiado grande (máx 2MB)",
      }
    )
    .refine(
      (fileList) =>
        fileList instanceof FileList &&
        ["application/pdf", "image/png", "image/jpeg"].includes(fileList[0].type),
      {
        message: "Formato de archivo inválido (solo PDF, JPG, PNG)",
      }
    )
  
});
