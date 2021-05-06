export class Modulo {
    codigo: number;
    descripcion: string;
    formularios: Formulario[];
  }

export class Formulario {
    codigo: number;
    codigoPadre: number;
    descripcion: string;
    descripcionEstado: string;
    estado: number;
    nivel: number;
    orden: number;
    url: string;
  }
