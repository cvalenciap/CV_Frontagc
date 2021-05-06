import { IDigitalizado } from "src/app/services/interfaces/iDigitalizados.service";
import { Injectable } from "@angular/core";
import { FiltrosBandejaDigitalizados } from "src/app/models/filtro-bandeja.digitalizado";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HttpParams } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { RequestVisorDigitalizado } from "src/app/models/request/request-visor-digitalizado";

@Injectable({
  providedIn: 'root'
})
export class DigitalizadoService implements IDigitalizado {

  private apiEndpoint: string;

  constructor(private httpClient: HttpClient,
    private datePipe: DatePipe) {
    this.apiEndpoint = environment.serviceEndpoint + '/digitalizado';
  }

  registrarLogDigitalizado(request: RequestVisorDigitalizado) {
    const url = `${this.apiEndpoint}/registrar`;
    return this.httpClient.post(url, request);
  }

  obtenerDigitalizados(request: FiltrosBandejaDigitalizados, pagina: number, registros: number) {
    const url = `${this.apiEndpoint}/digitalizados`;

    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    return this.httpClient.post(url, request, { params });
  }

  generarArchivoExcelDigitalizados(request: FiltrosBandejaDigitalizados, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (request.suministro) { params = params.set('suministro', request.suministro.toString()); }
    if (request.numeroCarga) { params = params.set('numeroCarga', request.numeroCarga); }
    if (request.ordenServicio) { params = params.set('ordenServicio', request.ordenServicio); }
    if (request.ordenTrabajo) { params = params.set('ordenTrabajo', request.ordenTrabajo); }
    if (request.numeroCedula) { params = params.set('numeroCedula', request.numeroCedula); }
    if (request.numeroReclamo) { params = params.set('numeroReclamo', request.numeroReclamo); }
    if (request.digitalizado) { params = params.set('digitalizado', request.digitalizado.toString()); }
    // Actividad y Oficina
    let idActividad = "0";
    let idOficina = 0;
    /* DESACTIVAR PARA QUE SIEMPRE TRAIGA TODO */
    if (request.actividad.codigo) { idActividad = request.actividad.codigo; }
    if (request.oficina.codigo) { idOficina = request.oficina.codigo; }

    // Fecha Inicio/Fin
    let fecInicio: string;
    let fecFin: string;
    if (request.fechaInicio) { fecInicio = this.datePipe.transform(request.fechaInicio, 'dd-MM-yyyy').toString() } else { fecInicio = "NULO" };
    if (request.fechaFin) { fecFin = this.datePipe.transform(request.fechaFin, 'dd-MM-yyyy').toString()} else { fecFin = "NULO" };

    const url = `${this.apiEndpoint}/digitalizados.excel/${idActividad}/${idOficina}/${fecInicio}/${fecFin}`;

    return this.httpClient.get(url, { responseType: 'arraybuffer', params: params });
  }
  consultarParametrosBusquedaDigitalizados() {
    let params: HttpParams = new HttpParams()
      .set('idPers', sessionStorage.getItem("codigoTrabajador"))
      .set('idPerfil', sessionStorage.getItem("perfilAsignado"));
    const url = `${this.apiEndpoint}/parametros-busqueda`;
    return this.httpClient.get(url, { params });
  }

  visualizarAdjuntosDigitalizados(request: RequestVisorDigitalizado) {
    const url = `${this.apiEndpoint}/visor-digitalizado`;
    return this.httpClient.post(url, request);
  }
  visualizarAdjuntosDigitalizadosJpg(request: RequestVisorDigitalizado) {
    const url = `${this.apiEndpoint}/visor-digitalizado-jpg`;
    return this.httpClient.post(url, request);
  }
  obtenerParametrosPeriodo() {
    const url = `${this.apiEndpoint}/digitalizados/obtener-parametros-periodo`;
    return this.httpClient.get(url);
  }

}
