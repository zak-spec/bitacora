import e from "express";
import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string({
            required_error: "usuario es requerido",
        })
        .min(3)
        .max(20),
    email: z
        .string({
            required_error: "Email es requerido",
        })
        .email({
            required_error: "Email invalido",
        }),
    password: z
        .string({
            required_error: "Contraseña es requerida",
        })
        .min(6, {
            required_error: "Contraseña debe tener al menos 6 caracteres",
        }),
    rol: z.enum(["administrador", "investigador", "colaborador"], {
        required_error: "Rol es requerido",
    }),
});


export const loginSchema = z.object({
email:z.string({
    required_error: "Email es requerido",
}).email({
    required_error: "Email invalido",
}),
password:z.string({
    required_error: "Contraseña es requerida",
}).min(6, {
    required_error: "Contraseña debe tener al menos 6 caracteres",
}),

});
