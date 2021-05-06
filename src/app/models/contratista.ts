import {Estado} from './enums';

export class Contratista {
  codigo?: number;
  descripcion: string;
  direccion?: string;
  estado?: Estado;
  fechaCreacion?: Date;
  usuarioCreacion?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
}
