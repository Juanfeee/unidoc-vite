import { z } from "zod";

export const informacionContacto = z.object({

  categoria_libreta_militar: z.string().min(1, { message: "Es requerido" }),
  municipio_id: z.number({ invalid_type_error: "El municipio es requerido" }),
  numero_libreta_militar: z.string().optional(),
  numero_distrito_militar: z.string().optional(),
  direccion_residencia: z.string().max(100).optional(),
  barrio: z.string().max(100).optional(),
  correo_alterno: z
    .string()
    .email({ message: "Correo no valido" })
    .max(100, { message: "El correo no puede tener más de 100 caracteres" }),
  telefono_movil: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Formato inválido para celular alternativo")
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
});
