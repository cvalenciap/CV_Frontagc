import { Cargo } from './cargo';
import { Oficina, Empresa } from '..';
import { Estado } from './estado';

export interface BusquedaPersonalContratista {
  dni?: string;
  codigoSedapal?: string;
  nombres?: string;
  apePaterno?: string;
  apeMaterno?: string;
  cargo?: Cargo;
  empresa?: Empresa;
  oficina?: Oficina;
  fecIngreso?: string;
  estadoLaboral?: Estado;
  estadoPersonal?: Estado;
  motivoCese?: Estado;
  fecCese?: string;
  solicitud?: Estado;
  estadoSolicitud?: Estado;
}
