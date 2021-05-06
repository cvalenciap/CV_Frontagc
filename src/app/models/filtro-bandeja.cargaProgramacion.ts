import { Actividad, Oficina, Contratista, EstadoAsignacion, Zona, Empresa, Trabajador } from "src/app/models";

export class FiltrosBandejaCargaProgramacion {
    contratista?: Contratista;
    actividad?: Actividad;
    archivo?: File;
    codEmpleado?:string;
    oficina?:Oficina;
    nroCarga?:string;
    idDetalle?:number;
    fecReasignacion?:Date;
  }