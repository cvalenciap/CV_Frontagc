import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import { ResponseObject } from 'src/app/models/response/response-object';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoApiService {

  private historicoApi: string;

  constructor(private httpClient: HttpClient) {
    this.historicoApi = `${environment.serviceEndpoint}/api/consulta-historico`;
  }

  public consultarHistoricoPersonal(request: HistoricoPersonalRequest,
    pagina: number,
    registros: number): Observable<ResponseObject> {
    const url: string = `${this.historicoApi}/listar-movimiento-persona`;
    const httpParams: HttpParams = new HttpParams()
      .append('pagina', pagina.toString())
      .append('registros', registros.toString());
    return this.httpClient.post<ResponseObject>(url, request, { params: httpParams });
  }

  public consultarHistoricoCargosPersonal(request: HistoricoPersonalRequest,
    pagina: number, registros: number): Observable<ResponseObject> {
    const url: string = `${this.historicoApi}/listar-mov-cargo`;
    const httpParams: HttpParams = new HttpParams()
      .append('pagina', pagina.toString())
      .append('registros', registros.toString());
    return this.httpClient.post<ResponseObject>(url, request, {params: httpParams});
  }


}
