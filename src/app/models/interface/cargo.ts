import { Estado } from './estado';
import { TipoCargo } from './tipo-cargo';
import { Actividad } from '../actividad';

export interface Cargo {
  id?: string;
  descripcion?: string;

  codigo?: string;
  descripcionCargo?: string;
  estadoCargo?: Estado;
  tipoCargo?: TipoCargo;
  actividades?: Actividad[];

}
