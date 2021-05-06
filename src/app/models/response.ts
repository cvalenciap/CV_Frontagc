type Estados = 'OK'|'ERROR';

export class Error {
  codigo: string;
  mensaje: string;
  mensajeInterno: string;
}

export class Response {
  estado: Estados;
  paginacion: any;
  error?: Error;
  resultado?: any;
}
