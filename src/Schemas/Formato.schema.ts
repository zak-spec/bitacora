import { z } from "zod";

export const NoteSchema = z.object({
  bitacoraId: z.string({ required_error: "BitacoraId es requerido" }),
  content: z.string({ required_error: "Contenido es requerido" }).min(1),
  isPrivate: z.boolean().optional().default(true),
});

export const CommentSchema = z.object({
  bitacoraId: z.string({ required_error: "BitacoraId es requerido" }),
  content: z.string({ required_error: "Contenido es requerido" }).min(1),
});
