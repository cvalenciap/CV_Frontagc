import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IoficinasService} from '../interfaces/ioficinas-service';
import {RequestOficina} from '../../models/request/request-oficina';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OficinasService implements IoficinasService {
  private apiEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/ofi';
  }

  consultarOficinas(requestOficinas: RequestOficina) {
    return this.httpClient.post(`${this.apiEndpoint}/listar-oficina`, requestOficinas);
  }

  retornarOficinaLogin(n_idpers: number) {
    let params: HttpParams = new HttpParams()
    .append('n_idpers', n_idpers.toString());
    return this.httpClient.get(`${this.apiEndpoint}/retornar-oficina`, {params});
  }
}
