import { EstadoAsignacion, Zona, Parametro } from "src/app/models";

export class CierreReapertura {
    direccion: string;
    suministro: number;
    lectura: string;
    ordenServicio: string;
    tipOrdServicio: string;
    tipoActividad: Parametro;
    codigoActividad: string;
    codObservacion: string;
    lecturaCierre: string;
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