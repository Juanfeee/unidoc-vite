import { z } from "zod";

const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;


export const registerSchema = z
  .object({

    numero_identificacion: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(50, { message: "El número de identificación no puede tener más de 50 caracteres" })
      .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

    primer_nombre: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(100, { message: "El nombre no puede tener más de 100 caracteres" })
      .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

    primer_apellido: z
      .string()
      .min(1, { message: "Campo vacio" })
      .max(100, { message: "El apellido no puede tener más de 100 caracteres" })
      .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

    segundo_nombre: z
      .string()
      .nullable()
      .optional()
      .refine(val => val === null || val === undefined || val === '' || val.length >= 1, {
        message: "Debe tener mínimo 1 caracter.",
      })
      .refine(val => val === null || val === undefined || val === '' || val.length <= 100, {
        message: "Debe tener máximo 100 caracteres.",
      })
      .refine(val => val === null || val === undefined || val === '' || regexSinEmojis.test(val), {
        message: "No se permiten emojis ni caracteres especiales.",
      }),

    segundo_apellido: z
      .string()
      .nullable()
      .optional()
      .refine(val => val === null || val === undefined || val === '' || val.length >= 1, {
        message: "Debe tener mínimo 1 caracter.",
      })
      .refine(val => val === null || val === undefined || val === '' || val.length <= 100, {
        message: "Debe tener máximo 100 caracteres.",
      })
      .refine(val => val === null || val === undefined || val === '' || regexSinEmojis.test(val), {
        message: "No se permiten emojis ni caracteres especiales.",
      }),

    email: z
      .string().email({ message: "Correo no valido" })
      .max(100, { message: "El correo no puede tener más de 100 caracteres" }),

    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

    password_confirmation: z
      .string()
      .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" })
      .min(1, { message: "La confirmación de contraseña es requerida" }),

    fecha_nacimiento: z
      .string({
        invalid_type_error: "Esa no es una fecha",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha incorrecto",
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: "La fecha no puede ser mayor a la actual",
      }),
    genero: z.enum(["Masculino", "Femenino", "Otro"], {
      errorMap: () => ({ message: "Seleccione un genero" }),
    }),
    tipo_identificacion: z
      .string()
      .min(1, { message: "Seleccione un tipo de identificación" }),

    estado_civil: z
      .string()
      .min(1, { message: "Seleccione un estado civil" }),
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"]
  });

