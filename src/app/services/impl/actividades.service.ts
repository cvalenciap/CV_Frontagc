import { Injectable } from '@angular/core';
import {IactividadesService} from '../interfaces/iactividades-service';
import {RequestActividad} from '../../models/request/request-actividad';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService implements IactividadesService {
  private apiEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/act';
  }

  consultarActividades(requestActividad: RequestActividad) {
    return this.httpClient.post(`${this.apiEndpoint}/listar-actividad`, requestActividad);
  }
}
