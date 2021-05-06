type Estados = 'OK'|'ERROR';

class Error {
  codigo: string;
  mensaje: string;
  mensajeInterno: string;
}

export class CargaMasivaResponse {

  estado?: Estados;
  total?: number;
  procesados?: number;
  fallidos?: number;
  mensaje?: string;
  error?: Error;
  listaErrores?: Array<Error>;

}
