import { PersonalContratista } from './personal-contratista';

export interface DarAltaRequest {
  listaPersonal: PersonalContratista[];
  usuarioAlta: string;
  idEmpresa: number;
  idOficina: number;
}
