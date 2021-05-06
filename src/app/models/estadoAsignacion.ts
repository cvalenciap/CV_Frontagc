import {Estado} from './enums';

export class EstadoAsignacion {
  codigo: string;
  descripcion: string;
  estado?: Estado;
  fechaCreacion?: Date;
  usuarioCreacion?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
}
