import {CargaTrabajo} from '../CargaTrabajo';
import { Paginacion } from '..';

export class ResponseCarga {
  estado: string;
  paginacion: Paginacion;
  error: string;
  resultado: CargaTrabajo[];
}
