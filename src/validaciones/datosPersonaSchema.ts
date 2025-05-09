import { z } from "zod";
// Regex sin emojis
const regexSinEmojis = /^[\p{L}\p{N}\s-]+$/u;
//definimos los tipos que vamos a usar

//definimos el tipo de los datos

//definimos el mappeo de los datos

//array definido con los tipos de identificaciones exportamos para usar en otros archivos

//definimos el esquema de validacion de los datos del usuario
export const userSchema = z.object({
  tipo_identificacion: z
    .string()
    .min(1, { message: "Seleccione un tipo de identificación" }),

  numero_identificacion: z
    .string()
    .min(1, { message: "Campo vacio" })
    .max(50, { message: "El número de identificación no puede tener más de 50 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

  estado_civil: z
    .string()
    .min(1, { message: "Seleccione un estado civil" }),

  primer_nombre: z
    .string()
    .min(1, { message: "Campo vacio" })
    .max(100, { message: "El nombre no puede tener más de 100 caracteres" })
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


  primer_apellido: z
    .string()
    .min(1, { message: "Campo vacio" })
    .max(100, { message: "El apellido no puede tener más de 100 caracteres" })
    .regex(regexSinEmojis, { message: "No se permiten emojis ni caracteres especiales" }),

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

  fecha_nacimiento: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),

  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    errorMap: () => ({ message: "El genero no es valido" }),
  }),
  archivo: z
    .custom<FileList | undefined>((val) => {
      // Si no hay archivo, es válido (opcional)
      if (!(val instanceof FileList) || val.length === 0) return true;
      return true;
    }, {
      message: "Debes subir un archivo",
    })
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length === 0) return true;
      return fileList[0].size <= 2 * 1024 * 1024;
    }, {
      message: "Archivo demasiado grande (máx 2MB)",
    })
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length === 0) return true;
      return fileList[0].type=="application/pdf";
    }, {
      message: "Formato de archivo inválido (solo PDF permitido)",
    })
    .optional(),


});
