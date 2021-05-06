import { CamposAuditoria } from './campos-auditoria';

export interface Archivo extends CamposAuditoria {
  id?: number;
  codigoEmpleado?: number;
  tipoArchivo?: string;
  nombreArchivo?: string;
  rutaArchivo?: string;
  dataArchivo?: string;
}
