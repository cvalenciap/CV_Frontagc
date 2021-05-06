import { Parametro, Oficina } from '..';
import { Cargo } from './cargo';
import { Item } from '../item';
import { CamposAuditoria } from './campos-auditoria';
import { Estado } from './estado';
import { PersonalContratista } from './personal-contratista';

export interface Solicitud extends CamposAuditoria {

  idSolicitud?: number;
  codigoEmpleado?: number;
  tipoSolicitud?: string;
  fechaSolicitud?: string;
  descripcionSolicitud?: string;
  motivoSolicitud?: Parametro;
  estadoSolicitud?: Estado;
  fechaAprobacion?: string;
  fechaRechazo?: string;
  observacionRechazo?: string;
  cargoActual?: Cargo;
  oficinaActual?: Oficina;
  itemActual?: Item;
  oficinaDestino?: Oficina;
  cargoDestino?: Cargo;
  itemDestino?: Item;
  personal?: PersonalContratista;

}
