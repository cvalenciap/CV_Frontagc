import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {IcargasTrabajo} from '../interfaces/icargas-trabajo';
import {RequestCarga} from '../../models/request/request-carga';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CargaTrabajo } from 'src/app/models/CargaTrabajo';
import { Responsable } from 'src/app/models/responsable';
import { Credenciales } from 'src/app/models/credenciales';
import { Paginacion, Adjunto } from 'src/app/models';
import { RequestEnvio } from 'src/app/models/request/request-envio';
import {Parametro} from '../../models/enums/parametro';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8',
  'Accept': 'application/json; charset=UTF-8' })
};

@Injectable({
  providedIn: 'root'
})
export class CargasTrabajoService implements IcargasTrabajo {
  private apiEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/init';
  }

  obtenerSize(){
    const url = `${this.apiEndpoint}/cargas-trabajos/obtener-size`;
    return this.httpClient.get(url);
  }

  modificarEstadoCarga(requestCarga: RequestCarga){
    const url = `${this.apiEndpoint}/modificarEstadoCarga`;
    return this.httpClient.post(url,requestCarga);
  }

  consultarCargasTrabajo(requestCarga: RequestCarga, pagina: number, registros: number) {
    const url = `${this.apiEndpoint}/listar-cargas-trabajos?pagina=${pagina}&registros=${registros}&uidCarga=1`;
    const idPerfil: string = sessionStorage.getItem('perfilAsignado');
    if (idPerfil === Parametro.PERFIL_ANALISTA_EXTERNO || idPerfil === Parametro.PERFIL_SUPERVISOR_EXTERNO) {
      requestCarga.uidContratista = sessionStorage.getItem('idEmpresa');
    }
    return this.httpClient.post(url, requestCarga);
  }

  anularCargaTrabajo(V_IDCARGA: string, V_USUMOD: string, V_MOTIVMOV: string): Observable<any>{
    const url = `${this.apiEndpoint}/cargas-trabajos/anular-carga-trabajo`;
    let params: HttpParams = new HttpParams()
    .set('V_IDCARGA', V_IDCARGA)
    .set('V_USUMOD', V_USUMOD)
    .set('V_MOTIVMOV', V_MOTIVMOV);
    return this.httpClient.delete(url, {params});
  }

  consultarParametros(): Observable<any>{
    let params: HttpParams = new HttpParams()
    .set('V_N_IDPERS', sessionStorage.getItem("codigoTrabajador"))
    .set('V_N_IDPERFIL', sessionStorage.getItem("perfilAsignado"));
    const url = `${this.apiEndpoint}/cargas-trabajos/obtener-parametros`;
    return this.httpClient.get(url, {params});
  }

  procesarTrama(): Observable<any> {
    return this.httpClient.get(`${this.apiEndpoint}/listar-cargas`);
  }

  obtenerTrama(uidCarga: string, uidActividad: string, idPerfil: string, filtro:number, usuario: string){
    const headers = new HttpHeaders().set('Content-Type', 'application/zip; charset=utf-8');
    return this.httpClient.get(`${this.apiEndpoint}/cargas-trabajos/trama/${uidCarga}/${uidActividad}/${idPerfil}/${filtro}/${usuario}`, { headers, responseType: 'arraybuffer'});
    // const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // return this.httpClient.get(`${this.apiEndpoint}/cargas-trabajos/trama/${uidCarga}/${uidActividad}/${idPerfil}`, { headers, responseType: 'text'});
  }

  cargarArchivoEjecucion(formData: FormData, uidActividad: string, uidCargaTrabajo: string, usuario: string, codOficExt: number) {
    const httpOptions2 = { headers: new HttpHeaders({ 'Accept': 'application/json; charset=UTF-8' }) };
    const url = `${this.apiEndpoint}/cargas-trabajos/archivo-ejecucion/${uidActividad}/${uidCargaTrabajo}/${usuario}/${codOficExt}`;
    return this.httpClient.post(url, formData, httpOptions2);
  }


  obtenerDetalleCarga(uidCarga: string) {
    const url = `${this.apiEndpoint}/cargas-trabajos/trama/?uidCarga=${uidCarga}`;
    return this.httpClient.get(url, httpOptions);
  }

  obtenerDetalleTrabajoMedidores(codigoCarga: string, codigoRegistro: number, paginacion: Paginacion){
    let myApiEndpoint = environment.serviceEndpoint + `/medidores/consultar-detalle-medidores?V_IDCARGA=${codigoCarga}&N_IDREG=${codigoRegistro}&V_N_CON_ADJ=${localStorage.getItem("viewAdjuntos")}`;

    let params: HttpParams = new HttpParams()
    .set('pagina', paginacion.pagina.toString())
    .set('registros', paginacion.registros.toString());

    return this.httpClient.get(myApiEndpoint, {params});
  }

  obtenerDetalleTrabajoDistribucionComunicaciones(codigoCarga: string, codigoRegistro: number, paginacion: Paginacion){
    let myApiEndpoint = environment.serviceEndpoint + `/distribucion-comunicaciones/consultar-distribucion-comunicaciones?V_IDCARGA=${codigoCarga}&N_IDREG=${codigoRegistro}&V_N_CON_ADJ=${localStorage.getItem("viewAdjuntos")}`;

    let params: HttpParams = new HttpParams()
    .set('pagina', paginacion.pagina.toString())
    .set('registros', paginacion.registros.toString());

    return this.httpClient.get(myApiEndpoint, {params});
  }

  obtenerDetalleTrabajoInspeccionesComerciales(codigoCarga: string, codigoRegistro: number, paginacion: Paginacion){
    let myApiEndpoint = environment.serviceEndpoint + `/inspecciones-comerciales/consultar-inspecciones-comerciales?V_IDCARGA=${codigoCarga}&N_IDREG=${codigoRegistro}&V_N_CON_ADJ=${localStorage.getItem("viewAdjuntos")}`;

    let params: HttpParams = new HttpParams()
    .set('pagina', paginacion.pagina.toString())
    .set('registros', paginacion.registros.toString());

    return this.httpClient.get(myApiEndpoint, {params});
  }

  obtenerDetalleTrabajoTomaEstados(codigoCarga: string, codigoRegistro: number, paginacion: Paginacion){
    let myApiEndpoint = environment.serviceEndpoint + `/toma-estados/consultar-toma-estados?V_IDCARGA=${codigoCarga}&N_IDREG=${codigoRegistro}&V_N_CON_ADJ=${localStorage.getItem("viewAdjuntos")}`;

    let params: HttpParams = new HttpParams()
    .set('pagina', paginacion.pagina.toString())
    .set('registros', paginacion.registros.toString());

    return this.httpClient.get(myApiEndpoint, {params});
  }

  obtenerDetalleTrabajoAvisoCobranza(codigoCarga: string, codigoRegistro: number, paginacion: Paginacion){
    let myApiEndpoint = environment.serviceEndpoint + `/distribucion-aviso-cobranza/consultar-distribucion-aviso-cobranza?V_IDCARGA=${codigoCarga}&N_IDREG=${codigoRegistro}&V_N_CON_ADJ=${localStorage.getItem("viewAdjuntos")}`;

    let params: HttpParams = new HttpParams()
    .set('pagina', paginacion.pagina.toString())
    .set('registros', paginacion.registros.toString());

    return this.httpClient.get(myApiEndpoint, {params});
  }

  obtenerResponsablesEnvio(responsable: Responsable, carga: String, V_V_IDESTADO: String, V_V_LISTA_ADJ: Adjunto[], V_V_NOMCONTRA: String):Observable<any> {
    let requestEnvio = new RequestEnvio();
    requestEnvio.listaAdjuntos = V_V_LISTA_ADJ;
    requestEnvio.responsable = responsable;
    let params: HttpParams = new HttpParams()
    .set('carga', carga.toString())
    .set('V_V_IDESTADO', V_V_IDESTADO.toString())
    .set('V_V_NOMCONTRA', V_V_NOMCONTRA.toString());
    const url = `${this.apiEndpoint}/cargas-trabajos/obtener-responsables-envio`;
    return this.httpClient.post(url, requestEnvio, {params});
  }

  obtenerListaAdjuntosDetalle(V_V_IDCARGA: String): Observable<any> {
    let params: HttpParams = new HttpParams()
    .set('V_V_IDCARGA', V_V_IDCARGA.toString());
    const url = `${this.apiEndpoint}/cargas-trabajos/obtener-adjuntos-carga`;
    return this.httpClient.get(url, {params});
  }
}
