import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  samplingDateTime: z.string().transform((str) => new Date(str)), // Cambiar a string y transformar
  location: z.object({
    latitude: z.number({ required_error: "La latitud es obligatoria" }),
    longitude: z.number({ required_error: "La longitud es obligatoria" }),
  }),
  weatherConditions: z
    .string()
    .min(1, { message: "Las condiciones meteorológicas son obligatorias" }),
  habitatDescription: z
    .string()
    .min(1, { message: "La descripción del hábitat es obligatoria" }),
  samplingPhotos: z
    .array(z.string())
    .min(1, { message: "Se requiere al menos una foto de muestreo" }),
  speciesDetails: z.array(
    z.object({
      scientificName: z
        .string()
        .min(1, { message: "El nombre científico es obligatorio" }),
      commonName: z
        .string()
        .min(1, { message: "El nombre común es obligatorio" }),
      family: z.string().min(1, { message: "La familia es obligatoria" }),
      sampleQuantity: z.number({
        required_error: "La cantidad de muestras es obligatoria",
      }),
      plantState: z
        .string()
        .min(1, { message: "El estado de la planta es obligatorio" }),
      speciesPhotos: z.array(z.string()),
    })
  ),
  additionalObservations: z.string().optional(),
});
