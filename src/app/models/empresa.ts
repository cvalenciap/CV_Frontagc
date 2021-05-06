import {Estado} from './enums/estado';
import {EstadoEmpresa} from './enums/estado-empresa';
import {TipoEmpresa} from './enums/tipo-empresa';
import { Min, MinLength, IsNotEmpty, ValidateIf,IsDate, IsDateString, MaxLength, IsOptional } from 'class-validator';

export class Empresa {
  codigo: number;
  codigoOpen: number;
  @MinLength(3, { message: 'Debe ingresar la Razón Social' })
  descripcion: string;
  direccion?: string;
  estado?: EstadoEmpresa;
  comentario?: string;
  @IsOptional()
  @MaxLength(10, {message: 'Teléfono muy largo'})
  telefono?: string;
  @MinLength(11, {message: 'RUC inválido'})  
  nroRUC?: string;
  @IsNotEmpty({message: 'Debe seleccionar el tipo de Empresa'})  
  tipoEmpresa?: TipoEmpresa;
  numeroContrato?: string;
  @IsDate({message: 'Debe ingresar la fecha de vigencia Desde'})
  fechaInicioVigencia?: Date;
  @IsDate({message: 'Debe ingresar la fecha de vigencia Hasta'})
  fechaFinVigencia?: Date;
  indCesePersonal?: number;
  constructor() {
    this.codigo = 0;
    this.descripcion = '';
    this.direccion = '';
    this.comentario = '';
    this.telefono = '';
    this.nroRUC = '';
    this.numeroContrato = '';
    this.estado = EstadoEmpresa.ACTIVO;
    this.fechaInicioVigencia = new Date();
    this.fechaFinVigencia = new Date();
  }
}
