import {Trabajador} from './trabajador';
import {Empresa} from './empresa';
import {Oficina} from './oficina';
import {Grupo} from './grupo';

export class GrupoPersonal {
  indice: number;
  trabajador: Trabajador;
  empresa: Empresa;
  oficina: Oficina;
  grupo: Grupo;
}
