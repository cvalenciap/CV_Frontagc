import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpParams } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { IMonitoreo } from "src/app/services/interfaces/iMonitoreo.service";
import { FiltrosBandejaAsignacion } from "src/app/models/filtro-bandeja.asignacion";
import { FiltrosBandejaMonitoreo } from "src/app/models/filtro-bandeja.monitoreo";
import { Observable } from "rxjs";
import { FiltrosBandejaCargaProgramacion } from "src/app/models/filtro-bandeja.cargaProgramacion";
import { map } from "rxjs/operators";
import { Monitoreo } from "src/app/models/monitoreo";
import { FiltrosBandejaMonitoreoDetalle } from "src/app/models/filtro-bandeja.monitoreo-detalle";
import { Oficina, RequestExcel } from "src/app/models";
import { RequestReasignacion } from "src/app/models/request/request-visor-monitoreo copy";

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService implements IMonitoreo {

  obtenerAsignaciones(request: FiltrosBandejaAsignacion): Observable<any> {
    const url = `${this.apiEndpoint}/listaCargaTrabajo`;
    return this.httpClient.post(url, request);
  }
  consultarParametrosBusquedaAsignaciones(): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('idPers', sessionStorage.getItem("codigoTrabajador"))
      .set('idPerfil', sessionStorage.getItem("perfilAsignado"));
    const url = `${this.apiEndpoint}/parametros-busqueda`;
    return this.httpClient.get(url, { params });
  }

  obtenerDetalles(request: number): Observable<any> {
    const url = `${this.apiEndpoint}/listaDetalleCargaTrabajoXCab`;
    return this.httpClient.post(url, request);
  }

  obtenerDetallesMonitoreo(monitoreo: Monitoreo): Observable<any> {
    let params: HttpParams = new HttpParams()
    .set('fechaProgramacion', monitoreo.fechaProgramacion)
    .set('idEmp', monitoreo.trabajador.codigo+"")
    .set('idActividad', monitoreo.actividad.codigo);
    const url = `${this.apiEndpoint}/listaMonitoreoDetalle`;
    return this.httpClient.post(url, monitoreo);
  }
  obtenerDetallesBusqueda(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleTE`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaIC(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleIC`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaDC(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleDC`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaDA(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleDA`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaME(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleME`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaCR(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleCR`;
    return this.httpClient.post(url, request);
  }
  obtenerDetallesBusquedaSO(request: FiltrosBandejaMonitoreoDetalle): Observable<any> {
     const url = `${this.apiEndpoint}/listaMonitoreoDetalleSO`;
    return this.httpClient.post(url, request);
  }

  obtenerDetallesXFiltro(request: FiltrosBandejaAsignacion): Observable<any> {
    const url = `${this.apiEndpoint}/listaDetalleCargaTrabajoXFiltro`;
    return this.httpClient.post(url, request);
  }

  anularCabecera(request: number): Observable<any> {
    const url = `${this.apiEndpoint}/anularCabecera`;
    let params: HttpParams = new HttpParams()
      .set('codEmp', sessionStorage.getItem("codigoTrabajador"));
    return this.httpClient.post(url, request, { params });
  }

  cargarArchivoProgramacion(request: FiltrosBandejaCargaProgramacion, data: FormData): Observable<any> {
    const url = `${this.apiEndpoint}/cargaArchivoProgramacion`;
    request.codEmpleado = sessionStorage.getItem("codigoTrabajador");
    let params: HttpParams = new HttpParams()
      .set('codEmp', sessionStorage.getItem("codigoTrabajador"))
      .set('codActividad', request.actividad.codigo)
      .set('codEmpresa', request.contratista.codigo + "")
      .set('codOficina', request.oficina.codigo + "");
    return this.httpClient.post(url, data, { params });
  }

  cargarArchivoProgramacionMasiva(request: FiltrosBandejaCargaProgramacion, data: FormData): Observable<any> {
    const url = `${this.apiEndpoint}/cargaArchivoProgramacionMasiva`;
    request.codEmpleado = sessionStorage.getItem("codigoTrabajador");
    let params: HttpParams = new HttpParams()
      .set('codEmp', sessionStorage.getItem("codigoTrabajador"))
      .set('codActividad', request.actividad.codigo)
      .set('codEmpresa', request.contratista.codigo + "")
      .set('nroCarga', request.nroCarga + "")
      .set('fecReasignacion', request.fecReasignacion + "")
      .set('idDetalle', request.idDetalle + "");
    return this.httpClient.post(url, data, { params });
  }


  consultarParametrosBusquedaMonitoreo(idActividad: string): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('idPers', sessionStorage.getItem("codigoTrabajador"))
      .set('idPerfil', sessionStorage.getItem("perfilAsignado"))
      .set('idActividad', idActividad);
    const url = `${this.apiEndpoint}/parametros-busqueda-monitoreo`;
    return this.httpClient.get(url, { params });
  }

  consultarParametroCiclo(idPeriodo: string, oficina: Oficina, idActividad: string): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('idOficina', oficina.codigo+"")
      .set('idPeriodo', idPeriodo)
      .set('idActividad', idActividad);
    const url = `${this.apiEndpoint}/parametros-busqueda-ciclo`;
    return this.httpClient.get(url, { params });
  }


  obtenerParametrosPeriodo() {
    const url = `${this.apiEndpoint}/periodoMonitoreo`;
    return this.httpClient.get(url);
  }


  obtenerMonitoreos(request: FiltrosBandejaMonitoreo, idActividad: string): Observable<any> {
    const url = `${this.apiEndpoint}/listaMonitoreoCabecera`;
    let params: HttpParams = new HttpParams()
    .set('idActividad', idActividad);
    return this.httpClient.post(url, request, {params});
  }

  visualizarAdjuntosMonitoreoJpg(request: any){
    const url = `${this.apiEndpoint}/visor-monitoreo-jpg`;
    return this.httpClient.post(url, request);
}

generaExcelDetalle(monitoreo: Monitoreo, detalle: any,
    idActividad: string): Observable<any> {
  let request: RequestExcel = new RequestExcel;/*
  request.monitoreo = new Monitoreo; */
  request.monitoreo = monitoreo;
  request.listaObjetos = detalle;
  const url = `${this.apiEndpoint}/genera-excel-monitoreo-detalle`;
  let params: HttpParams = new HttpParams()
  .set('idActividad', idActividad);
  return this.httpClient.post(url,request, {responseType: 'arraybuffer', params: params} );
}

generaExcel(request: FiltrosBandejaMonitoreo, idActividad: string): Observable<any> {
  const url = `${this.apiEndpoint}/genera-excel-monitoreo`;
  let params: HttpParams = new HttpParams()
  .set('idActividad', idActividad);
  return this.httpClient.post(url,request, {responseType: 'arraybuffer', params: params} );
}

  private apiEndpoint: string;

  constructor(private httpClient: HttpClient,
    private datePipe: DatePipe) {
    this.apiEndpoint = environment.serviceEndpoint + '/monitoreo';
  }

  reasignarTrabajador(request: RequestReasignacion): Observable<any> {
    const url = `${this.apiEndpoint}/reasignarTrabajadorManual`;
    return this.httpClient.post(url, request);
  }

  obtenerTrabajadoresManual(request: FiltrosBandejaAsignacion): Observable<any> {
    const url = `${this.apiEndpoint}/listaTrabajadoresManual`;
    return this.httpClient.post(url, request);
  }

  obtenerReasignaciones(request: FiltrosBandejaAsignacion): Observable<any> {
    const url = `${this.apiEndpoint}/listaDetalleReasignaciones`;
    return this.httpClient.post(url, request);
  }
}
