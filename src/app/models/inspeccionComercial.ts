import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class InspeccionComercial {
    direccion: string;
    suministro: number;
    medidor: string;
    ordenServicio: Parametro;
    tipologiaOrdServ: string;
    fechaVisita: string;
    horaInicio: string;
    horaFin: string;
    servicio: string;
    lectura: string;
    estadoMedidor: Parametro;
    incidenciaMedidor: Parametro;
    imposibilidad: Parametro;
    inspeccionRealidada: string;
    detalle: string;
    estado: Parametro;
    zona: Zona;
    completa: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }