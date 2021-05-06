import {MinLength, MaxLength,Matches} from 'class-validator';
import {Estado} from './enums';

export class  Parametro {
  codigo?: number;
  id?: number;
  @MinLength(1, {message: 'Debe ingresar el valor del parámetro'})
  @MaxLength(2500, {message: 'La longitud del campo Valor es mayor a $constraint1 caracteres'})
  valor?: string;
  @MinLength(1, {message: ' Debe ingresar descripción'})
  @MaxLength(250, {message: 'La longitud del nombre del Parámetro es mayor a $constraint1 caracteres'})
  detalle?: string;
  @MinLength(1, {message: ' Debe ingresar la descripción corta'})
  @MaxLength(250, {message: 'La longitud de Descripción Corta es mayor a $constraint1 caracteres'})
  descripcionCorta?: string;
  estado?: Estado;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}
