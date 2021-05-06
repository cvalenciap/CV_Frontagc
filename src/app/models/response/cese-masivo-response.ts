import { ResultadoCarga } from '../enums/resultado-carga.enum';

export interface CeseMasivoResponse {
  resultado?: ResultadoCarga;
  mensaje?: string;
  detalle?: string[];
}
