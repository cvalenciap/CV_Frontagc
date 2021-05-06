import { Solicitud } from './solicitud';
import { Cargo } from './cargo';
import { Oficina, Empresa } from '..';
import { Item } from '../item';
import { CamposAuditoria } from './campos-auditoria';
import { PersonalContratista } from './personal-contratista';

export interface Movimiento extends CamposAuditoria {

  nro?: number;
  idMovimiento?: number;
  codigoEmpleado?: number;
  numeroDocumento?: string;
  nombreEmpleado?: string;
  empresa?: Empresa;
  // personal?: PersonalContratista;
  solicitud?: Solicitud;
  cargoActual?: Cargo;
  oficinaActual?: Oficina;
  itemActual?: Item;
  fechaBajaCargo?: string;
  cargoDestino?: Cargo;
  oficinaDestino?: Oficina;
  itemDestino?: Item;
  fechaAltaCargo?: string;

}
