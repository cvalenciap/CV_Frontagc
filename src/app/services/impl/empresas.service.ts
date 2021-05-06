import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {IempresasService} from '../interfaces/iempresas-service';
import {RequestEmpresa} from '../../models/request/request-empresa';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import { Item } from 'src/app/models/item';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService implements IempresasService {
  private apiEndpoint: string;
  private apiEndpointCompanies: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/cont';
    this.apiEndpointCompanies = environment.serviceEndpoint + '/empresas';
  }

  consultarEmpresas(requestEmpresa: RequestEmpresa) {
    return this.httpClient.post(`${this.apiEndpoint}/lista-contratistas`, requestEmpresa);
  }

  public saveCompany(requestEmpresa: RequestEmpresa): Observable<any> {
    if (requestEmpresa.codigo === 0) {
      return this.httpClient.put(this.apiEndpointCompanies, requestEmpresa);
    } else {
      return this.httpClient.post(this.apiEndpointCompanies, requestEmpresa);
    }
  }

  public deleteCompany(companyCode: number, parameters: Map<string, any>): Observable<any> {
    const apiEndpoint = this.apiEndpointCompanies + '/' + companyCode;
    return this.httpClient.delete(apiEndpoint, {params: this.readParameters(parameters)});
  }

  public findCompanyByCode(companyCode: number): Observable<any> {
    const apiEndpoint = this.apiEndpointCompanies + '/' + companyCode;
    return this.httpClient.get(apiEndpoint);
  }

  public getAllCompanies(parameters: Map<string, any>): Observable<any> {
    return this.httpClient.get(this.apiEndpointCompanies, {params: this.readParameters(parameters)});
  }

  private readParameters(parameters: Map<string, any>): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    parameters.forEach((value, key) => {
      if (value) {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  public listarEmpresaPersonal(idPers: number) {
    const myApiEndpoint = this.apiEndpoint + `/lista-contratistas-personal?idPers=${idPers}`;
    return this.httpClient.get(myApiEndpoint);
  }

  obtenerListaEmpresaItem(idEmpresa: number): Observable<any> {
    const api = `${this.apiEndpointCompanies}/listar-empresa-item`;
    const params: HttpParams = new HttpParams().set('idEmpresa', idEmpresa.toString());
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get(api, { headers: headers, params: params });
  }

  registrarEmpresaItem(listaEmpresaItem: Item[], idEmpresa: number): Observable<any> {
    const api = `${this.apiEndpointCompanies}/registrar-empresa-item/${idEmpresa}`;
    return this.httpClient.post(api, listaEmpresaItem);
  }

}
