import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccionesService } from '../interfaces/iacciones-service';

@Injectable({
    providedIn: 'root'
  })
export class AccionesService implements IAccionesService {
    private apiEndpoint: string;

    constructor(private httpClient: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/permisos';
      }

      consultarPermisos(N_IDPERFIL: number) {
        let params: HttpParams = new HttpParams()
        .set('N_IDPERFIL', N_IDPERFIL.toString());          
        return this.httpClient.get(`${this.apiEndpoint}`, {params});
      }
  }