import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CargoOpenRequest } from 'src/app/models/request/cargo-open-request';
import { ResponseObject } from 'src/app/models/response/response-object';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { retryWhen } from 'rxjs/operators';
import { Cargo } from 'src/app/models/interface/cargo';

@Injectable({
    providedIn: 'root'
})
export class CargoApiService {

    cargoEndpoint: string;

    constructor(private httpClient: HttpClient) {
        this.buildApiUrl();
    }

    private buildApiUrl(): void {
        this.cargoEndpoint = `${environment.serviceEndpoint}/api/cargo`;
    }

    public obtenerListaCargos(codigoTipoCargo: string): Observable<any> {
        const params: HttpParams = new HttpParams()
            .set('codigoTipoCargo', codigoTipoCargo);
        return this.httpClient.get(`${this.cargoEndpoint}/listar-cargo`, { params });
    }

    public obtenerListaCargosOpen(request: CargoOpenRequest): Observable<ResponseObject> {
      const url: string = `${this.cargoEndpoint}/consultar-cargos-open`;
      return this.httpClient.post<ResponseObject>(url, request);
    }

    public obtenerActividadesDisponibles(codigoCargo: string): Observable<ResponseObject> {
      const url: string = `${this.cargoEndpoint}/consultar-acti-disponible`;
      const params = new HttpParams()
      .append('codCargo', codigoCargo);
      return this.httpClient.get<ResponseObject>(url, {params});
    }

    public actualizarActividadesCargo(cargo: Cargo): Observable<ResponseObject> {
      const url: string = `${this.cargoEndpoint}/actualizar-actividades`;
      const params: HttpParams = new HttpParams()
      .append('usuario', StorageUtil.recuperarObjetoSession('credenciales').usuario);
      return this.httpClient.post<ResponseObject>(url, cargo, {params});
    }

}
