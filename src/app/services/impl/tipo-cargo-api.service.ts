import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoCargoApiService {

  TipoCargoEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.buildApiUrl();
  }

  private buildApiUrl(): void {
    this.TipoCargoEndpoint = `${environment.serviceEndpoint}/api/tipo-cargo`;
  }

  public obtenerListaTipoCargo(): Observable<any> {
      return this.httpClient.get(`${this.TipoCargoEndpoint}/listar-tipos-cargo`);
  }

}
