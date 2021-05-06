import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class Sostenibilidad {
    direccion: string;
    suministro: number;
    lecturaCierre: string;
    ordenServicio: string;
    tipoOrdServicio: Parametro;
    tipoActividad: Parametro;
    codAcvtividad: Parametro;
    codObservacion: string;
    fechaEjecucion: string;
    horaEjecucion: string;
    estado: Parametro;
    zona: Zona;
    completa: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }