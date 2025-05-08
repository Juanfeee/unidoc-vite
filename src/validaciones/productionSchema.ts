import { z } from "zod";

export const productionSchema = z.object({
  titulo: z.string().nonempty({ message: "El titulo es requerido" }),
  ambito_divulgacion_id: z
  .number({ invalid_type_error: "El municipio es requerido" })
  .int("El municipio debe ser un entero")
  .positive("Selecciona un municipio válido"),

  numero_autores: z
    .string()
    .nonempty({ message: "El numero de autores es requerido" }),
  medio_divulgacion: z
    .string()
    .nonempty({ message: "El medio de divulgacion es requerido" }),
  fecha_divulgacion: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),
  archivo: z
    .custom<FileList | undefined>(
      (val) => {
        // Si no hay archivo, es válido (opcional)
        if (!(val instanceof FileList) || val.length === 0) return true;
        return true;
      },
      {
        message: "Debes subir un archivo",
      }
    )
    .refine(
      (fileList) => {
        if (!(fileList instanceof FileList) || fileList.length === 0)
          return true;
        return fileList[0].size <= 2 * 1024 * 1024;
      },
      {
        message: "Archivo demasiado grande (máx 2MB)",
      }
    )
    .refine(
      (fileList) => {
        if (!(fileList instanceof FileList) || fileList.length === 0)
          return true;
        return ["application/pdf", "image/png", "image/jpeg"].includes(
          fileList[0].type
        );
      },
      {
        message: "Formato de archivo inválido (solo PDF, JPG, PNG)",
      }
    )
    .optional(),
});
