import { ResultadoCarga } from '../enums/resultado-carga.enum';

export interface ResponseCargaArchivo {

  nombreArchivo?: string;
  url?: string;
  mensaje?: string;
  resultado?: ResultadoCarga;

}
