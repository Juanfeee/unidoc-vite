import { z } from "zod";

const areas_contratacion = [
  "Facultad de Ciencias Administrativas, Contables y Economicas",
  "Facultad de Ciencias Ambientales y Desarrollo Sostenible",
  "Facultad de Derecho, Ciencias Sociales y Politicas",
  "Facultad de Educacion",
  "Facultad de Ingenieria",
] as const;
const tipoContratacion = ["Planta", "Ocasional", "Cátedra"] as const;

export type AreaContratacion = (typeof areas_contratacion)[number];
export type TipoContratacion = (typeof tipoContratacion)[number];

export const mappeoAreaContratacion: {
  [key in AreaContratacion]: string;
} = {
  "Facultad de Ciencias Administrativas, Contables y Economicas":
    "Facultad de Ciencias Administrativas, Contables y Económicas",
  "Facultad de Ciencias Ambientales y Desarrollo Sostenible":
    "Facultad de Ciencias Ambientales y Desarrollo Sostenible",
  "Facultad de Derecho, Ciencias Sociales y Politicas":
    "Facultad de Derecho, Ciencias Sociales y Políticas",
  "Facultad de Educacion": "Facultad de Educación",
  "Facultad de Ingenieria": "Facultad de Ingeniería",
};

export const mappeoTipoContratacion: {
  [key in TipoContratacion]: string;
} = {
  Planta: "Planta",
  Ocasional: "Ocasional",
  Cátedra: "Cátedra",
};

// Esquema base para creación
export const contratacionSchema = z
  .object({
    tipo_contrato: z.enum(tipoContratacion, {
      errorMap: () => ({ message: "Seleccione un tipo de contrato válido" }),
    }),

    area: z.enum(areas_contratacion, {
      errorMap: () => ({ message: "Seleccione un área válida" }),
    }),

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

    valor_contrato: z
      .number({ invalid_type_error: "Debe ser un número" })
      .int({ message: "Debe ser un número entero" })
      .positive({ message: "Debe ser un número positivo" }),

    observaciones: z
      .string()
      .min(1, { message: "Campo vacío" })
      .max(1000, { message: "Máximo 1000 caracteres" }),
  })
  .refine(
    (data) => {
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);
      return fechaFin >= fechaInicio;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_fin"],
    }
  );

// Esquema para actualización (campos opcionales)
export const contratacionSchemaUpdate = z
  .object({
    tipo_contrato: z.enum(tipoContratacion, {
      errorMap: () => ({ message: "Seleccione un tipo de contrato válido" }),
    }),

    area: z.enum(areas_contratacion, {
      errorMap: () => ({ message: "Seleccione un área válida" }),
    }),

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

    valor_contrato: z.preprocess(
      (val) => Number(val),
      z.number().positive({
        message: "El valor del contrato debe ser mayor que cero",
      })
    ),

    observaciones: z
      .string()
      .min(1, { message: "Campo vacío" })
      .max(1000, { message: "Máximo 1000 caracteres" }),
  })
  .refine(
    (data) => {
      if (!data.fecha_inicio || !data.fecha_fin) return true;
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);
      return fechaFin >= fechaInicio;
    },
    {
      message:
        "La fecha de finalización no puede ser menor que la fecha de inicio",
      path: ["fecha_fin"],
    }
  );
