import {Parametro} from '../parametro';
import { Paginacion } from '..';

export class ResponseParametro {
  estado: string;
  paginacion: Paginacion;
  error: string;
  resultado: Parametro[];
}
