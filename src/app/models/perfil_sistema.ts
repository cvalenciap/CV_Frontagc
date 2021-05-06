export class PerfilSistema {
    codigo: string;
    descripcion: string;
    abreviatura?: string;
    constructor(codigo?:string, descripcion?:string, abreviatura?:string){
      this.codigo = codigo;
      this.descripcion = descripcion;
      this.abreviatura = abreviatura;
    }
  }
  