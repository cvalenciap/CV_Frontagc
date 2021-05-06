import { CamposAuditoria } from './interface/campos-auditoria';

export interface Item extends CamposAuditoria {
  estadoItem?: string;
  codigo?: number;
  estadoTabla?: boolean;
  id?: number;
  descripcion?: string;
  estado?: string;
  estadoSeleccion?: string;
}
