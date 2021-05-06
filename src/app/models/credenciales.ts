import { PerfilSedapal } from "./enums";

export class Credenciales {
  usuario: string;
  clave: string;
  token: string;
  perfil: String;
  ip: string;
  constructor() {
    this.usuario = '';
    this.clave = '';
    this.token = '';
    this.ip='';
  }
}

export class ActualizarClave {
  usuario: string;
  claveActual: string;
  nuevaClave: string;
  nuevaClaveR: string;

  constructor() {
    this.usuario = '';
    this.claveActual = '';
    this.nuevaClave = '';
    this.nuevaClaveR = '';
  }
}
