import {Estado} from './enums';

export class Actividad {
  codigo: string;
  descripcion: string;
  estado?: Estado;
  fechaCreacion?: Date;
  usuarioCreacion?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;

  seleccionado?: boolean;
  agregado?: boolean;
  retirado?: boolean;
}
