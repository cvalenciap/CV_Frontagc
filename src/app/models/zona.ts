import {Estado} from './enums';

export class Zona {
  codigo: number;
  detalle: string;
  estado?: Estado;
  fechaCreacion?: Date;
  usuarioCreacion?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
}
