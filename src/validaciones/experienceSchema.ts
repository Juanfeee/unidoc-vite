import { z } from "zod";

const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;

export const experienciaSchema = z
  .object({
    tipo_experiencia: z
      .string()
      .min(1, { message: "Seleccione un tipo de experiencia" }),

    institucion_experiencia: z
      .string()
      .min(3, { message: "Campo vacío" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),

    cargo: z
      .string()
      .min(3, { message: "Campo vacío" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),

    trabajo_actual: z.enum(["Si", "No"], {
      errorMap: () => ({ message: "Seleccione una opción" }),
    }),
    intensidad_horaria: z.string().min(1, { message: "Campo vacío" }),
    fecha_inicio: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),
    fecha_finalizacion: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),
    fecha_expedicion_certificado: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .optional(),
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
  .refine(
    (data) => {
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFinalizacion = new Date(data.fecha_finalizacion);
      if (fechaFinalizacion < fechaInicio) {
        return false;
      }
      return true;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_finalizacion"], // Esto asegura que el error se asocie con fecha_finalizacion
    }
  );

export const experienciaSchemaUpdate = z
  .object({
    tipo_experiencia: z
      .string()
      .min(1, { message: "Seleccione un tipo de experiencia" }),

    institucion_experiencia: z
      .string()
      .min(3, { message: "Campo vacío" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),

    cargo: z
      .string()
      .min(3, { message: "Campo vacío" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(regexSinEmojis, {
        message: "No se permiten emojis ni caracteres especiales",
      }),

    trabajo_actual: z.enum(["Si", "No"], {
      errorMap: () => ({ message: "Seleccione una opción" }),
    }),

    intensidad_horaria: z.coerce.string().nonempty({ message: "Campo vacío" }),

    fecha_inicio: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),
    fecha_finalizacion: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),
    fecha_expedicion_certificado: z
      .string({
        invalid_type_error: "Esa no es una fecha válida",
      })
      .refine((val) => val === "" || !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .optional(),
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
  })
  .refine(
    (data) => {
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFinalizacion = new Date(data.fecha_finalizacion);
      if (fechaFinalizacion < fechaInicio) {
        return false;
      }
      return true;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_finalizacion"], // Esto asegura que el error se asocie con fecha_finalizacion
    }
  );
