import { z } from "zod";

const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;

//definimos los tipos que vamos a usar

//validacion de los datos
export const studySchema = z.object({

  tipo_estudio: z.string().min(1, { message: "Campo vacio" }),

  graduado: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opcion" }),
  }),

  institucion: z
    .string()
    .min(7, { message: "Campo vacio" })
    .max(100, { message: "Campo demasiado largo" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

  titulo_estudio: z
    .string()
    .min(7, { message: "Campo vacio" })
    .max(100, { message: "Campo demasiado largo" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

  titulo_convalidado: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opcion" }),
  }),

  fecha_inicio: z
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
        fileList.length > 0 &&
        fileList[0].type === "application/pdf",
      {
        message: "Formato de archivo inválido (solo PDF permitido)",
      }
    ),
});
