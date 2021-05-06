import { Actividad, Oficina, Contratista, EstadoAsignacion, Zona, Empresa, Trabajador, Parametro } from "src/app/models";

export class FiltrosBandejaMonitoreoDetalle {
    contratista?: Contratista;
    fechaProgramacion?:Date;
    trabajador?: Trabajador;
    incidencia?: Parametro;
    subIncidencia?: Parametro;
    estado?: Parametro; 
    foto?: Parametro;
    periodo?: Parametro;
    ciclo?: Parametro;
    cumplimiento?: Parametro;
    imposibilidad?: Parametro;
    estadoServicio?: Parametro;
    estadoMedidor?: Parametro;
    tipoInspeccion?: Parametro;
    resultadoInspeccion?: Parametro;
    tipoEntrega?: Parametro;
    fechaEjecucion?: Date;
    ordenServicio?: string;    
    tipoActividad?: Parametro;
    zona?: Zona;
    medidorInstalado?: string;
    medidorRetirado?: string;
    tipoOrdenServicio?: Parametro;
    tipoCarga?: Parametro;
    tipoInstalacion?: Parametro;
    codObservacion?: Parametro;
    suministro?: number;
    operarioCodNombre?: string;
  }