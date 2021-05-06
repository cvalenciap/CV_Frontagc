import {Estado} from './enums';
import {Parametro} from './parametro';
import { Min, MinLength, IsNotEmpty, ValidateIf } from 'class-validator';

export class TipoParametro {
  codigo: number;
  @MinLength(3, {message: 'La longitud mínima del Nombre del Parámetro es 3'})
  nombre?: string;
  parametros?: Parametro[];
  estado?: Estado;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;

  constructor() {
    this.codigo = 0;
    this.nombre = "";
  }
}
