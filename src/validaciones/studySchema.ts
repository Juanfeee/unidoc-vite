import { z } from "zod";

const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;

//definimos los tipos que vamos a usar

//validacion de los datos
export const studySchema = z
  .object({
    tipo_estudio: z.string().min(1, { message: "Campo vacio" }),

    graduado: z.enum(["Si", "No"], {
      errorMap: () => ({ message: "Seleccione una opcion" }),
    }),

    institucion: z
      .string()
      .min(7, { message: "Minimo 7 caracteres" })
      .max(100, { message: "Campo demasiado largo" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),

    titulo_estudio: z
      .string()
      .min(7, { message: "Minimo 7 caracteres" })
      .max(100, { message: "Campo demasiado largo" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),
    resolucion_convalidacion: z
      .string()
      .min(7, { message: "Minimo 7 caracteres" })
      .max(100, { message: "Campo demasiado largo" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      })
      .optional(),

    titulo_convalidado: z.enum(["Si", "No"], {
      errorMap: () => ({ message: "Seleccione una opcion" }),
    }),

    fecha_graduacion: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .optional(),

    posible_fecha_graduacion: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .optional(),

    fecha_convalidacion: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .optional(),

    fecha_inicio: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),
    fecha_fin: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),

    archivo: z
      // 1) forzamos que venga un FileList
      .instanceof(FileList, { message: "Debes subir un archivo" })

      // 2) al menos un fichero
      .refine((files) => files.length > 0, {
        message: "Debes subir un archivo",
      })

      // 3) tamaño máximo 2MB, pero sólo si hay fichero
      .refine(
        (files) =>
          files.length === 0 ? true : files[0].size <= 2 * 1024 * 1024,
        {
          message: "Archivo demasiado grande (máx 2MB)",
        }
      )

      // 4) solo PDF, pero sólo si hay fichero
      .refine(
        (files) =>
          files.length === 0 ? true : files[0].type === "application/pdf",
        {
          message: "Formato de archivo inválido (solo PDF permitido)",
        }
      ),
  })


export const studySchemaUpdate = z.object({
  tipo_estudio: z.string().min(1, { message: "Campo vacio" }),

  graduado: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opcion" }),
  }),

  institucion: z
    .string()
    .min(7, { message: "Minimo 7 caracteres" })
    .max(100, { message: "Campo demasiado largo" })
    .regex(regexSinEmojis, {
      message: "No se permiten emojis ni caracteres especiales",
    }),

  titulo_estudio: z
    .string()
    .min(7, { message: "Minimo 7 caracteres" })
    .max(100, { message: "Campo demasiado largo" })
    .regex(regexSinEmojis, {
      message: "No se permiten emojis ni caracteres especiales",
    }),
  resolucion_convalidacion: z
    .string()
    .min(7, { message: "Minimo 7 caracteres" })
    .max(100, { message: "Campo demasiado largo" })
    .regex(regexSinEmojis, {
      message: "No se permiten emojis ni caracteres especiales",
    })
    .optional(),

  titulo_convalidado: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opcion" }),
  }),

  fecha_graduacion: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    })
    .optional(),

  posible_fecha_graduacion: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    })
    .optional(),

  fecha_convalidacion: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    })
    .optional(),

  fecha_inicio: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),
  fecha_fin: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),

  archivo: z
    .instanceof(FileList, {
      message: "Debes subir un archivo si quieres reemplazar el existente",
    })
    .optional()
    // 1) tamaño máximo 2MB, solo si hay fichero
    .refine(
      (files) =>
        (files?.length ?? 0) === 0 || files![0].size <= 2 * 1024 * 1024,
      { message: "Archivo demasiado grande (máx 2MB)" }
    )
    // 2) solo PDF, solo si hay fichero
    .refine(
      (files) =>
        (files?.length ?? 0) === 0 || files![0].type === "application/pdf",
      { message: "Formato de archivo inválido (solo PDF permitido)" }
    ),
});
