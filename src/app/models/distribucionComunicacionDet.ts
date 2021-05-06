import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class DistribucionComunicacionDet {
    direccion: string;
    suministro: number;
    nroCarta: number;
    nroVisita: string;
    fechaNotificacion: string;
    horaNotificacion: string;
    tipoEntrega: Parametro;
    incidencia: Parametro;
    estadoVisita: string;
    estado: Parametro;
    zona: Zona;
    completa: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }