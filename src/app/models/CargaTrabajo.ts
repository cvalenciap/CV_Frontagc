import { Min, IsInt, IsEmpty, MinLength, ValidateIf, IsNotEmpty } from 'class-validator';
import { Parametro } from 'src/app/models/enums/parametro';

export class CargaTrabajo {
  uidCargaTrabajo: string;
  // @IsInt({message: 'Se requiere ingresar el Contratista válido'})
  // @Min(1, {message: 'Se requiere ingresar el Contratista'})
  uidContratista: number;
  descContratista: string;
  uidOficina?: number;
  descOficina?: string;
  uidGrupo?: number;
  uidActividad?: string;
  descActividad?: string;
  descCarga?: string;
  uidEstado?: string;
  estado?: string;
  fechaCarga?: string;
  fechaSedapal?: string;
  fechaContratista?: string;
  cantidadCarga?: string;
  cantidadEjecutada?: string;
  uidUsuarioC?: string;
  comentario: string;
  motivoAnula: string;
  vdescripcion: string;
  numeroCarga: string;

  constructor(){
  }
}
