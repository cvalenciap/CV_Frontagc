import { CamposAuditoria } from './campos-auditoria';

export interface CargaMasivaPersonal extends CamposAuditoria {

  idCarga?: number;
  loteCarga?: string;
  fechaCarga?: string;
  nombreArchivoCarga?: string;
  cantidadRegistros?: number;
  cantidadRegistrosIncorrectos?: number;
  cantidadRegistrosCorrectos?: number;

}
