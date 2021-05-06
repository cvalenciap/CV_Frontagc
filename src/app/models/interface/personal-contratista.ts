import { TipoCargo } from './tipo-cargo';
import { Cargo } from './cargo';
import { Oficina, Empresa, Parametro } from '..';
import { Item } from '../item';
import { Estado } from './estado';
import { Archivo } from './archivo';
import { CamposAuditoria } from './campos-auditoria';

export interface PersonalContratista extends CamposAuditoria {

  nro?: number;
  codigoEmpleado?: number;
  tipoCargo?: TipoCargo;
  cargo?: Cargo;
  oficina?: Oficina;
  item?: Item;
  contratista?: Empresa;
  codigoEmpleadoContratista?: string;
  fechaIngreso?: string;
  numeroDocumento?: string;
  nombres?: string;
  nombresCompletos?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  direccion?: string;
  fechaNacimiento?: string;
  telefonoPersonal?: string;
  telefonoAsignado?: string;
  correoElectronico?: string;
  fechaAlta?: string;
  fechaBaja?: string;
  motivoBaja?: Parametro;
  motivoAlta?: Parametro;
  observacionBaja?: string;
  estadoPersonal?: Estado;
  estadoLaboral?: Estado;
  usuario?: string;
  archivoFotoPersonal?: Archivo;
  archivoCvPersonal?: Archivo;
  checked?: boolean;
  archivoFotoPersonalAnterior?: Archivo;
  archivoCvPersonalAnterior?: Archivo;
  indicadorAlta?: string;
}
