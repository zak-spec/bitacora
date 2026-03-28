import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string({
            required_error: "usuario es requerido",
        })
        .min(3, {
            message: "usuario debe tener al menos 3 caracteres",
        })
        .max(20, {
            message: "usuario no debe tener más de 20 caracteres",
        }),
    email: z
        .string({
            required_error: "Email es requerido",
        })
        .email({
            message: "Email invalido",
        }),
    password: z
        .string({
            required_error: "Contraseña es requerida",
        })
        .min(6, {
            message: "Contraseña debe tener al menos 6 caracteres",
        }),
    rol: z.enum(["administrador", "investigador", "colaborador"], {
        required_error: "Rol es requerido",
    }),
});

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Email es requerido",
        })
        .email({
            message: "Email invalido",
        }),
    password: z
        .string({
            required_error: "Contraseña es requerida",
        })
        .min(6, {
            message: "Contraseña debe tener al menos 6 caracteres",
        }),
});
