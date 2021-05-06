import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class Monitoreo {
    idMonitoreo: number;
    trabajador: Trabajador;
    actividad: Actividad;
    cargaProgramada: number;
    cargaEjecutada: number;
    cargaPendiente: number;
    fechaProgramacion: string;
    fechaEjecucionInicio: string;
    fechaEjecucionFin: string;
    horaEjecucionInicio: string;
    horaEjecucionFin: string;
    avance:string;
    semaforo:number;
  }