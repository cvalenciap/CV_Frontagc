import { Actividad, Oficina, Contratista, EstadoAsignacion, Zona, Empresa, Trabajador, Parametro } from "src/app/models";

export class FiltrosBandejaMonitoreo {
    contratista?: Contratista;
    estado?: Parametro; 
    fechaProgramacionInicio?: Date;
    fechaProgramacionFin?: Date;
    suministro?: number;
    numMedidor?: number;
    operario?: Trabajador;
    oficina?: Oficina;
    periodo?: Parametro;
    ciclo?: Parametro;
    tipoActividad?: Parametro;
    imposibilidad?: Parametro;
    foto?: Parametro;
    semaforo?: Parametro;
    ordenServicio?: number;
    cedulaNotificacion?: number;
    numeroLote?: number;
    ordenTrabajo?: number;
    tipoNotificacion?: Parametro;
  }