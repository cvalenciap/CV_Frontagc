import { Actividad, Oficina, Contratista, EstadoAsignacion, Zona, Empresa, Trabajador } from "src/app/models";

export class FiltrosBandejaAsignacion {
    idDetalle?: number;
    idCabecera?:number;
    contratista?: Contratista;
    estado?: EstadoAsignacion; 
    actividad?: Actividad;
    fechaAsignacionInicio?: Date;
    fechaAsignacionFin?: Date;
    fechaAsignacionDetalle?:String;
    fechaAsignacionManual?:String;
    zona?: Zona;
    oficina?: Oficina;
    suministro?: number;
    trabajador?: Trabajador;
    trabajadorAnt?: Trabajador;
    nroCarga?:string;
    trabReemplazar?:string;
  }