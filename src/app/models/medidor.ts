import { Actividad, Empresa, EstadoAsignacion, Zona, Trabajador, Parametro } from "src/app/models";
import { Oficina } from "src/app/models/oficina";


export class Medidor {
    direccion: string;
    suministro: number;
    ordenServicio: string;
    tipologia: string;
    tipoActividad: Parametro;
    codObservacion: string;
    tipoInstalacion: Parametro;
    medidorInstalado: string;
    medidorRetirado: string;
    fechaEjecucion: string;
    horaEjecucion: string;
    estado: Parametro;
    zona: Zona;
    completa: Parametro;
    foto: Parametro;
    imagen1: string;
    imagen2: string;
    imagen3: string;
  }