import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class Detalle {
    idDetalle: number;
    contratista: Empresa;
    oficina: Oficina;
    actividad: Actividad;  
    trabajador: Trabajador;
    zona: Zona;
    fechaAsignacion: string;
    fechaProgramacion: string;
    fechaEjecucion: string;
    estadoAsignacion: EstadoAsignacion;
    estadoProgramacion: string;
    suministro: number;
    numeroCarga: string;
  }