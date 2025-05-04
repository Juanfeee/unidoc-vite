import { z } from 'zod';

export const experienciaSchema = z.object({
  tipo_experiencia: z.string().min(1, { message: "Seleccione un tipo de experiencia" }),
  institucion_experiencia: z.string().min(3, { message: "Campo vacío" }). max(100, { message: "Máximo 100 caracteres" }),
  cargo: z.string().min(3, { message: "Campo vacío" }).max(100, { message: "Máximo 100 caracteres" }),
  trabajo_actual: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opción" })
  }),
  intensidad_horaria: z.string().min(1, { message: "Campo vacío" }),
  experiencia_radio: z.enum(["Si", "No"], {
    errorMap: () => ({ message: "Seleccione una opción" })
  }),
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
})
  .refine((data) => {
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFinalizacion = new Date(data.fecha_finalizacion);
    if (fechaFinalizacion < fechaInicio) {
      return false;
    }
    return true;
  }, {
    message: "La fecha de finalización no puede ser menor que la fecha de inicio",
    path: ["fecha_finalizacion"], // Esto asegura que el error se asocie con fecha_finalizacion
  });
