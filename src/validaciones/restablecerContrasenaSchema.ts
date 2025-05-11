import { z } from "zod";

export const restablecerContrasenaSchema = z.object({
  email: z.string().email({ message: "Correo no valido" }),
});
