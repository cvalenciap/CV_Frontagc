import {PerfilSistema} from './perfil_sistema';

export class Trabajador {
  codigo: number;
  nombre: string;
  ficha: number;
  codUsuario: string;
  perfil: PerfilSistema;
  dirElectronica: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCompleto?:string;
  estado: string;
  estadoTrabajador?:string;
  estadoTabla?:boolean = true;
  origen?: string;
  flagCompletarAlta?: number;
  usuarioAgc?: string;
  documento?:number;
}
