import { z } from "zod";

// Regex que no permite emojis
const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;

export const epsSchema = z.object({
  nombre_eps: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

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
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" })
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
    .custom<FileList | undefined>((val) => {
      // Si no hay archivo, es válido (opcional)
      if (!(val instanceof FileList) || val.length === 0) return true;
      return true;
    }, {
      message: "Debes subir un archivo",
    })
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length === 0) return true;
      return fileList[0].size <= 2 * 1024 * 1024;
    }, {
      message: "Archivo demasiado grande (máx 2MB)",
    })
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length === 0) return true;
      return ["application/pdf", "image/png", "image/jpeg"].includes(fileList[0].type);
    }, {
      message: "Formato de archivo inválido (solo PDF, JPG, PNG)",
    })
    .optional(),
  
  
});
