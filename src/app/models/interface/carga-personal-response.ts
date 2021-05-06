import { ResultadoCarga } from '../enums/resultado-carga.enum';

export interface CargaPersonalResponse {
  loteCarga: string;
  nro: number;
  nroRegistro: number;
  fechaDeCarga: string;
  numeroDocumento: string;
  codEmpleado1: number;
  codEmpleado2?: number;
  detalle: string[];
  resultado: ResultadoCarga;
}
