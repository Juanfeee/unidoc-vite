import { z } from "zod";

const estado_convocatoria = ["Abierta", "Cerrada", "Finalizada"] as const;

export type EstadoConvocatoria = (typeof estado_convocatoria)[number];

export const mappeoEstadoConvocatoria: { [key in EstadoConvocatoria]: string } =
  {
    Abierta: "Abierta",
    Cerrada: "Cerrada",
    Finalizada: "Finalizada",
  };

export const convocatoriaSchema = z
  .object({
    nombre_convocatoria: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(255, { message: "Máximo 255 caracteres" }),

    estado_convocatoria: z.enum(estado_convocatoria, {
      errorMap: () => ({ message: "Seleccione una opcion" }),
    }),

    tipo: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(255, { message: "Máximo 255 caracteres" }),

    fecha_publicacion: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),

    fecha_cierre: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),

    descripcion: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(1000, { message: "Máximo 1000 caracteres" }),

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
      const fechaPublicacion = new Date(data.fecha_publicacion);
      const fechaCierre = new Date(data.fecha_cierre ?? "");
      if (fechaCierre < fechaPublicacion) {
        return false;
      }
      return true;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_cierre"],
    }
  );

export const convocatoriaSchemaUpdate = z
  .object({
    nombre_convocatoria: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(255, { message: "Máximo 255 caracteres" }),

    estado_convocatoria: z.enum(estado_convocatoria, {
      errorMap: () => ({ message: "Seleccione una opcion" }),
    }),

    tipo: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(255, { message: "Máximo 255 caracteres" }),

    fecha_publicacion: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),

    fecha_cierre: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      }),

    descripcion: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(1000, { message: "Máximo 1000 caracteres" }),

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
      const fechaPublicacion = new Date(data.fecha_publicacion);
      const fechaCierre = new Date(data.fecha_cierre ?? "");
      if (fechaCierre < fechaPublicacion) {
        return false;
      }
      return true;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_cierre"],
    }
  );
