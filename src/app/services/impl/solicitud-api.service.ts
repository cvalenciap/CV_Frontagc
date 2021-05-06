import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseObject } from 'src/app/models/response/response-object';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Solicitud } from 'src/app/models/interface/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudApiService {

  solicitudEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.buildApiUrl();
  }

  private buildApiUrl(): void {
    this.solicitudEndpoint = `${environment.serviceEndpoint}/api/solicitud`;
  }

  public obtenerListaItemEmpresa(codigoEmpresa: number): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/listar-item-empresa`;
    const params: HttpParams = new HttpParams().append('idEmpresa', codigoEmpresa.toString());
    return this.httpClient.get<ResponseObject>(url, { params });
  }

  public obtenerListaOficinaItem(codigoEmpresa: number, codigoItem: number): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/listar-oficina-item`;
    const params: HttpParams = new HttpParams()
      .append('idEmpresa', codigoEmpresa.toString())
      .append('idItem', codigoItem.toString());
    return this.httpClient.get<ResponseObject>(url, { params });
  }

  public obtenerListaSolicitudCambioCargo(codigoEmpleado: number): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/listar-solicitud-cambio-cargo`;
    const params: HttpParams = new HttpParams()
      .append('codigoEmpleado', codigoEmpleado.toString());
    return this.httpClient.get<ResponseObject>(url, { params });
  }

  public obtenerListaSolicitudMovimiento(codigoEmpleado: number): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/listar-solicitud-movimiento`;
    const params: HttpParams = new HttpParams()
      .append('codigoEmpleado', codigoEmpleado.toString());
    return this.httpClient.get<ResponseObject>(url, { params });
  }

  public registrarSolicitudCambioCargo(solicitud: Solicitud): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/registrar-solicitud-cambio-cargo`;
    return this.httpClient.post<ResponseObject>(url, solicitud);
  }

  public registrarSolicitudMovimiento(solicitud: Solicitud): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/registrar-solicitud-movimiento`;
    return this.httpClient.post<ResponseObject>(url, solicitud);
  }

  public aprobarSolicitud(solicitud: Solicitud): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/aprobar-solicitud`;
    return this.httpClient.post<ResponseObject>(url, solicitud);
  }

  public rechazarSolicitud(solicitud: Solicitud): Observable<ResponseObject> {
    const url: string = `${this.solicitudEndpoint}/rechazar-solicitud`;
    return this.httpClient.post<ResponseObject>(url, solicitud);
  }

}
