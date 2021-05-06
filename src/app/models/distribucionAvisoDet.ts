import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class DistribucionAvisoDet {
    direccion: string;
    suministro: number;
    incidencia: Parametro;
    tipoEntrega: Parametro;
    fechaDistribucion: string;
    horaDistribucion: string;
    estado: EstadoAsignacion;
    zona: Zona;
    completa: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }