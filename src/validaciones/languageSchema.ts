import { z } from "zod";

export const languageSchema = z.object({
  idioma: z.string().min(1, { message: "Campo vacío" }).max(50, {
    message: "Máximo 50 caracteres"}),
  institucion_idioma: z.string().min(1, { message: "Campo vacío" }).max(50, {
    message: "Máximo 50 caracteres"}),
  nivel: z.string().min(1, { message: "Seleccione un nivel" }),
  fecha_certificado: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),
  archivo: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: "Debes subir un archivo",
    })
    .refine(
      (fileList) =>
        fileList instanceof FileList && fileList[0].size <= 2 * 1024 * 1024,
      {
        message: "Archivo demasiado grande (máx 2MB)",
      }
    )
    .refine(
      (fileList) =>
        fileList instanceof FileList &&
        ["application/pdf"].includes(fileList[0].type),
      {
        message: "Formato de archivo inválido (solo PDF permitido)",
      }
    ),
});