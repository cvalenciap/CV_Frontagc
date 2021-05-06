import {Adjunto} from  './adjunto';

type Estados = 'OK'|'ERROR';

export class Error {
  codigo: string;
  mensaje: string;
  mensajeInterno: string;
}

export class ResponseAdjuntos {
    estado: Estados;
    error?: Error;  
    resultado: Adjunto[];
}
