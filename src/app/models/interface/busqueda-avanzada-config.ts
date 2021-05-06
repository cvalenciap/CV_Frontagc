import { TipoEmpresa } from '../enums/tipo-empresa';

export interface BusquedaAvanzadaConfig {
  opcionTipoEmpresa?: string;
  mostrarEstadoSedapal?: boolean;
  mostrarComboContratista?: boolean;
  mostrarComboUsuarios?: boolean;
  mostrarGrupo?: boolean;
  clearOficina?: boolean;
  clearGrupo?: boolean;
  clearContratista?: boolean;
  clearActividad?: boolean;
  mostrarOpcionAdministrador?: boolean;
}
