import {Empresa} from './empresa';
import {Estado} from './enums';

export class Oficina {
  codigo: number;
  empresa?: Empresa;
  descripcion: string;
  direccion?: string;
  estado?: Estado;
  fechaCreacion?: Date;
  usuarioCreacion?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
  estadoSeleccion?: string;
}
