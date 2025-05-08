import { z } from "zod";
const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;

export const rutSchema = z.object({

  numero_rut: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

  razon_social: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

  tipo_persona: z
    .string()
    .min(1, { message: "Selecciona una opción" }),

  codigo_ciiu: z
    .string()
    .min(1, { message: "Selecciona una opción" }),

  responsabilidades_tributarias: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),
  
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
      return fileList[0].type =="application/pdf";
    }, {
      message: "Formato de archivo inválido (solo PDF permitido)",
    })
    .optional(),
  
});
