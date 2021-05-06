import { Actividad, Oficina } from "src/app/models";

export class FiltrosBandejaDigitalizados {
    suministro?: number;
    numeroCarga?: string;
    actividad?: Actividad;
    ordenServicio?: string;
    ordenTrabajo?: string;
    numeroCedula?: string;
    numeroReclamo?: string;
    oficina?: Oficina;
    fechaInicio?: Date;
    fechaFin?: Date;
    digitalizado?: number;
  }