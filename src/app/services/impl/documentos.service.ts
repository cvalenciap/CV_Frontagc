import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Adjunto, Paginacion, PageRequest} from '../../models';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json; charset=UTF-8' })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private apiEndpointService: string;
  private apiEndpointServiceDocument: string;

  constructor(private httpClient: HttpClient) {
    this.apiEndpointService = environment.fileServerServiceEndpoint;
    this.apiEndpointServiceDocument = environment.serviceEndpoint;
  }

  public getFile(extensionArchivo: string, rutaArchivo: string): Observable<any> {
    let apiEndpoint = this.apiEndpointService+rutaArchivo+'?download=1';
    let headers;
    if(extensionArchivo.toLocaleUpperCase() == 'PDF'){
      headers = new HttpHeaders().set('Content-Type', 'application/pdf');
    }else{
      headers = new HttpHeaders().set('Content-Type', 'image/jpeg');
    }
    return this.httpClient.get(apiEndpoint, { headers, responseType: 'arraybuffer'});
  }

  public verificarExistenciaArchivoCargado(idCarga: string, idRegistro: number, nombreAdjunto: string): Observable<any>{
    const apiEndpoint = this.apiEndpointServiceDocument + '/init/buscar-adjunto';
    let params: HttpParams = new HttpParams()
    .set('carga', idCarga)
    .set('registro', idRegistro.toString())
    .set('nombre', nombreAdjunto);
    return this.httpClient.get(apiEndpoint, {params});
  }

  // Comentado por bloqueo de peticion HEAD en el servidor de produccion
  /*public verificarEstadoFileserver(): Observable<any> {
    const urlFileserver = this.apiEndpointService;
    return this.httpClient.head(urlFileserver);
  }*/

  public saveDocument(formData: FormData): Observable<any> {
    return this.httpClient.put(this.apiEndpointService, formData);
  }

  public deleteAttachFile(parameters: Map<string, any>): Observable<any> {
    const apiEndpoint = this.apiEndpointServiceDocument + '/adjunto/carga-trabajo';
    return this.httpClient.delete(apiEndpoint, {params: this.readParameters(parameters)});
  }

  public deleteAttachFileDetails(parameters: Map<string, any>): Observable<any> {
    const apiEndpoint = this.apiEndpointServiceDocument + '/adjunto/detalle';
    return this.httpClient.delete(apiEndpoint, {params: this.readParameters(parameters)});
  }

  public getAttachFile(apiEndpoint: string): Observable<any> {
    return this.httpClient.get(apiEndpoint, { responseType: 'text'});
  }

  public deleteAttachFileServer(apiEndpoint: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {},
    };
    return this.httpClient.delete(apiEndpoint, options);
  }

  public saveInformationDocument(adjunto: Adjunto): Observable<any> {
    const apiEndpoint = this.apiEndpointServiceDocument + '/adjunto/carga-trabajo';
    return this.httpClient.put(apiEndpoint, adjunto);
  }

  public getAttachFiles(parameters: Map<string, any>): Observable<any> {
    const apiEndpint = this.apiEndpointServiceDocument + '/init/cargas-trabajos/obtener-adjuntos-carga';
    return this.httpClient.get(apiEndpint, {params: this.readParameters(parameters)});
  }

  public getAttachFilesSedapal(parameters: Map<string, any>, paginacionSedapal: PageRequest): Observable<any> {
    const apiEndpint = this.apiEndpointServiceDocument + '/init/cargas-trabajos/obtener-adjuntos-sedapal';
    return this.httpClient.post(apiEndpint, paginacionSedapal, {params: this.readParameters(parameters)});
  }

  public getAttachFilesContratista(parameters: Map<string, any>, paginacionContratista: PageRequest): Observable<any> {
    const apiEndpint = this.apiEndpointServiceDocument + '/init/cargas-trabajos/obtener-adjuntos-contratista';
    return this.httpClient.post(apiEndpint, paginacionContratista, {params: this.readParameters(parameters)});
  }

  public getAttachFilesDetails(parameters: Map<string, any>): Observable<any> {
    const apiEndpint = this.apiEndpointServiceDocument + '/adjuntos/detalle';
    return this.httpClient.get(apiEndpint, {params: this.readParameters(parameters)});
  }

  public saveAttchFileToDetails(data: FormData, parameters: Map<string, any>): Observable<any> {
    return this.httpClient.post(`${this.apiEndpointServiceDocument}/piloto/documentos`, data, {params: this.readParameters(parameters)});
  }

  private readParameters(parameters: Map<string, any>): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    parameters.forEach((value, key) => {
      if (value) {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  obtenerArchivoBase64FileServer(urlArchivo: string): Observable<any> {
    const obj: any = { url: urlArchivo };
    const url = `${this.apiEndpointServiceDocument}/adjunto/obtener-archivo`;
    return this.httpClient.post(url, obj);
  }
}
