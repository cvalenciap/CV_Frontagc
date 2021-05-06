import { Injectable } from '@angular/core';
import { RequestParametro } from '../../models/request/request-parametro';
import { HttpClient } from '@angular/common/http';
import { IparametrosService } from '../interfaces/iparametros-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesService {
  private apiEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/responsable';
  }

  consultarEmpresas() {
    let url = `${this.apiEndpoint}/obtenerEmpresas`;
    return this.httpClient.get(url);
  }

  consultarOficina(codigo: number) {
    let url = `${this.apiEndpoint}/obtenerOficina/${codigo}`;
    return this.httpClient.get(url);
  }
  consultarActividad(codigoEmpresa: number, codigoOficina: number) {
    let url = `${this.apiEndpoint}/obtenerActividad/${codigoEmpresa}/${codigoOficina}`;
    return this.httpClient.get(url);
  }
  consultarPersonal(codigoEmpresa: number, codigoOficina: number, codigoActividad: string) {
    let url = `${this.apiEndpoint}/obtenerPersonal/${codigoEmpresa}/${codigoOficina}/${codigoActividad}`;
    return this.httpClient.get(url);
  }
  consultarPersonalSeleccionado(codigoEmpresa: number, codigoOficina: number, codigoActividad: string) {
    let url = `${this.apiEndpoint}/obtenerPersonalSelec/${codigoEmpresa}/${codigoOficina}/${codigoActividad}`;
    return this.httpClient.get(url);
  }
  guaradarPersonal(listaCodigo: Array<Number>, codigoEmpresa: number, codigoOficina: number, codigoActividad: string, usuario: string) {
    let url = `${this.apiEndpoint}/guardarPersonal/${codigoEmpresa}/${codigoOficina}/${codigoActividad}/${usuario}`;
    return this.httpClient.post(url, listaCodigo);
  }

}
