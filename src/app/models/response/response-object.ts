type Estados = 'OK'|'ERROR';

class Error {
    codigo: string;
    mensaje: string;
    mensajeInterno: string;
}

export class ResponseObject {
    estado: Estados;
    paginacion: any;
    error?: Error;
    resultado?: any;
    mensaje: string;
}
