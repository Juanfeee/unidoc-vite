import { z } from "zod";

const tipo_produccion = [
  "evaluacion_par",
  "revision_tema",
  "reportes_caso",
  "carta_editor",
  "distincion_trabajo_grado",
  "ponencia_plenaria",
  "ensayo_articulo",
  "video_cinematografico_fotografico",
  "libro",
  "patente_invencion",
  "estudio_pos_doctoral",
  "reseña_critica",
  "traduccion",
  "obra_artistica",
  "premio",
  "articulo_corto",
  "produccion_tecnica",
  "produccion_software",
  "capitulo_libro",
  "arreglo_musical",
  "comunicacion_procesos_organizacionales",
] as const;


export type TipoProduccion = (typeof tipo_produccion)[number];


export const mappeoTipoProduccion: { [key in TipoProduccion]: string } = {
  ensayo_articulo: "Ensayo/Artículo",
  evaluacion_par: "Evaluación par",
  revision_tema: "Revisión de tema",
  reportes_caso: "Reportes de caso",
  carta_editor: "Carta editor",
  distincion_trabajo_grado: "Distinción trabajo de grado",
  ponencia_plenaria: "Ponencia/Plenaria",
  video_cinematografico_fotografico: "Video cinematográfico/fotográfico",
  libro: "Libro",
  patente_invencion: "Patente/Invención",
  estudio_pos_doctoral: "Estudio posdoctoral",
  reseña_critica: "Reseña crítica",
  traduccion: "Traducción",
  obra_artistica: "Obra artística",
  premio: "Premio",
  articulo_corto: "Artículo corto",
  produccion_tecnica: "Producción técnica",
  produccion_software: "Producción de software",
  capitulo_libro: "Capítulo de libro",
  arreglo_musical: "Arreglo musical",
  comunicacion_procesos_organizacionales:
    "Comunicación de procesos organizacionales",
};

export const productionSchema = z.object({
  tipo_produccion: z.enum(tipo_produccion, {
    errorMap: () => ({ message: "Seleccione una opcion" }),
  }),
  titulo: z.string().nonempty({ message: "El titulo es requerido" }),
  tipo_ambito_divulgacion: z.string().nonempty({ message: "El ambito de divulgacion es requerido" }),

  numero_autores: z
    .string()
    .nonempty({ message: "El numero de autores es requerido" }),
  medio_divulgacion: z
    .string()
    .nonempty({ message: "El medio de divulgacion es requerido" }),
  fecha_divulgacion: z
    .string({
      invalid_type_error: "Esa no es una fecha",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Formato de fecha incorrecto",
    }),
});
