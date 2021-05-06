import { ResultadoCarga } from '../enums/resultado-carga.enum';

export interface DarAltaResponse {
  errores?: string[];
  estado: ResultadoCarga;
}
