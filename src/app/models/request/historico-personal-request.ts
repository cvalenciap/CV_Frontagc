import { Estado } from '../interface/estado';
import { Empresa } from '..';

export interface HistoricoPersonalRequest {
  numeroDocumento?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  empresa?: Empresa;
  estadoEmpresa?: Estado;
  estadoLaboral?: Estado;
  estadoCargo?: Estado;
  fechaDesde?: string;
  fechaHasta?: string;
}
