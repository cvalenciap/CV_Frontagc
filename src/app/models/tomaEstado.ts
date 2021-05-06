import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class TomaEstado {
    direccion: string;
    suministro: number;
    lectura: string;
    medidor: string;
    incLectura1: string;
    incLectura2: string;
    incLectura3: string;
    medidorObservado: string;
    fechaEjecucion: string;
    horaEjecucion: string;
    estado: Parametro;
    zona: Zona;
    cumplimiento: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }