import { CamposAuditoria } from './campos-auditoria';
import { PersonalContratista } from './personal-contratista';

export interface DetalleCargaMasivaPersonal extends CamposAuditoria {

  idCarga?: number;
  idDetalle?: number;
  personaContratista?: PersonalContratista;
  fechaCarga?: string;
  estadoCarga?: number;
  detalleError?: string;
  resultado?: string;

}
