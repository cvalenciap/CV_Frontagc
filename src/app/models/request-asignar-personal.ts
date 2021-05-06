import { Trabajador } from '.';

export class RequestAsignarPersonal {
  idPersona: number;
  idEmpresa: number;
  idOficina: number;
  idGrupo: number;
  trabajador: Trabajador;
  usuarioAgcPers: string;
  usuarioAuditoria: string;
}
