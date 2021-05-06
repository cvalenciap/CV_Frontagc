import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestItem } from 'src/app/models/request/request-item';
import { ItemOficina } from 'src/app/models/item-oficina';

@Injectable()
export class ItemApiService {

  private ItemEndpoint: string;

  buildApiUrl(): void {
    this.ItemEndpoint = `${environment.serviceEndpoint}/api/items`;
  }

  constructor(private httpClient: HttpClient) { this.buildApiUrl(); }

  eliminarItem(requestItem: RequestItem): Observable<any> {
    const api = `${this.ItemEndpoint}/eliminar-item`;
    return this.httpClient.post(api, requestItem);
  }

  listarItems(requestItem: RequestItem): Observable<any> {
    const api = `${this.ItemEndpoint}/listar-item`;
    const params: HttpParams = new HttpParams()
      .set('descripcion', requestItem.descripcion)
      .set('estado', requestItem.estado);
    return this.httpClient.get(api, { params });
  }

  listarItemOficinas(idItem: number): Observable<any> {
    const api = `${this.ItemEndpoint}/listar-item-oficinas`;
    const params: HttpParams = new HttpParams().set('idItem', idItem.toString());
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get(api, { headers: headers, params: params });
  }

  modificarItem(requestItem: RequestItem): Observable<any> {
    const api = `${this.ItemEndpoint}/modificar-item`;
    return this.httpClient.post(api, requestItem);
  }

  obtenerListaItemEmpresa(codigoContratista: number, codigoOficina: number): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('codigoContratista', codigoContratista.toString())
      .set('codigoOficina', codigoOficina.toString());
    return this.httpClient.get(`${this.ItemEndpoint}/listar-item-empresa`, { params });
  }

  registrarItem(requestItem: RequestItem): Observable<any> {
    const api = `${this.ItemEndpoint}/agregar-item`;
    return this.httpClient.post(api, requestItem);
  }

  registrarItemOficina(listaItemOficina: ItemOficina[]): Observable<any> {
    const api = `${this.ItemEndpoint}/registrar-item-oficina`;
    return this.httpClient.post(api, listaItemOficina);
  }
}
