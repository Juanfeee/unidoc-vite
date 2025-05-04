import { z } from "zod";

export const rutSchema = z.object({

  numero_rut: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),

  razon_social: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),

  tipo_persona: z
    .string()
    .min(1, { message: "Selecciona una opción" }),

  codigo_ciiu: z
    .string()
    .min(1, { message: "Selecciona una opción" }),

  responsabilidades_tributarias: z
    .string()
    .min(7, { message: "Mínimo 7 caracteres" })
    .max(100, { message: "Máximo 100 caracteres" }),
  
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
