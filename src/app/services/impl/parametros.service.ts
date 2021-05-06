import { Injectable } from '@angular/core';
import {RequestParametro} from '../../models/request/request-parametro';
import {HttpClient} from '@angular/common/http';
import {IparametrosService} from '../interfaces/iparametros-service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService implements IparametrosService {
  private apiEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/par';
  }
  consultarParametros(requestParametros: RequestParametro,pagina: number, registros: number) {
    let url = `${this.apiEndpoint}/listar-parametro?pagina=${pagina}&registros=${registros}`;
    return this.httpClient.post(url, requestParametros);
  }
  obtenerParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/obtener-parametro`;
    return this.httpClient.post(url, requestParametros);
  }
  nuevoParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/registrar-parametro`;
    return this.httpClient.post(url, requestParametros);
  }
  modificarParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/modificar-parametro`;
    return this.httpClient.post(url, requestParametros);
  }
  eliminarParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/eliminar-parametro/${requestParametros.tipo}/${requestParametros.codigo}/${requestParametros.usuario}`;
    return this.httpClient.delete(url);
  }
  obtenerTipoParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/obtener-tipoparametro`;
    return this.httpClient.post(url, requestParametros);
  }
  consultarTipoParametros(requestParametros: RequestParametro, pagina: number, registros: number) {
    let url = `${this.apiEndpoint}/listar-tipoparametro?pagina=${pagina}&registros=${registros}`;
    return this.httpClient.post(url, requestParametros);
  }
  nuevoTipoParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/registrar-tipoparametro`;
    return this.httpClient.post(url, requestParametros);
  }
  modificarTipoParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/modificar-tipoparametro`;
    return this.httpClient.post(url, requestParametros);
  }
  eliminarTipoParametro(requestParametros: RequestParametro){
    let url = `${this.apiEndpoint}/eliminar-tipoparametro/${requestParametros.codigo}/${requestParametros.usuario}`;
    return this.httpClient.delete(url);
  }
 
}
