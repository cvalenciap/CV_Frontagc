import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResponseObject } from 'src/app/models/response/response-object';
import { PersonalContratistaRequest } from 'src/app/models/interface/personal-contratista-request';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { DarAltaRequest } from 'src/app/models/interface/dar-alta-request';
import { TramaPersonal } from 'src/app/models/interface/trama-personal';
import { CesarPersonalRequest } from 'src/app/models/request/cesar-personal-request';
import { PerfilService } from './perfil.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalContratistaApiService {

  personaContratistaEndpoint: string;

  constructor(private httpClient: HttpClient,
              private perfilService: PerfilService) {
    this.buildApiUrl();
  }

  private buildApiUrl(): void {
    this.personaContratistaEndpoint = `${environment.serviceEndpoint}/api/personal-contratista`;
  }

  public cesarPersonal(request: CesarPersonalRequest): Observable<ResponseObject> {
    request.usuarioMod = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    const url: string = `${this.personaContratistaEndpoint}/cesar-personal`;
    return this.httpClient.post<ResponseObject>(url, request);
  }

  public ceseMasivoPersonal(idEmpresa: number): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/cese-masivo`;
    const httpParams: HttpParams = new HttpParams()
    .append('idEmpresa', idEmpresa.toString())
    .append('usuarioPeticion', StorageUtil.recuperarObjetoSession('credenciales').usuario);
    return this.httpClient.get<ResponseObject>(url, {params: httpParams});
  }
  public descargarPlantilla() {
    const url: string = `${this.personaContratistaEndpoint}/plantilla`;
    return this.httpClient.get(url, { responseType: 'arraybuffer'});
  }

  public obtenerParametrosBandeja(): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/parametros`;
    const params: HttpParams = new HttpParams()
      .append('idPersonal', sessionStorage.getItem('codigoTrabajador'))
      .append('idPerfil', sessionStorage.getItem('perfilAsignado'));
    return this.httpClient.get<ResponseObject>(url, { params });
  }

  public obtenerListaPersonalContratista(request: PersonalContratistaRequest,
    paginacion: Paginacion): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/listar`;
    const params: HttpParams = new HttpParams()
      .append('pagina', PaginacionUtil.devolverPagina(paginacion).toString())
      .append('registros', PaginacionUtil.devolverNroRegistros(paginacion).toString());
    request.idPerfil = StorageUtil.recuperarObjetoSession('perfilAsignado');
    request.idPersonal = StorageUtil.recuperarObjetoSession('codigoTrabajador');
    if (this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) {
      request.idEmpresa = StorageUtil.recuperarObjetoSession('idEmpresa');
    }
    return this.httpClient.post<ResponseObject>(url, request, { params });
  }

  public registrarPersonalContratista(personalContratista: PersonalContratista): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/registrar`;
    return this.httpClient.post<ResponseObject>(url, personalContratista);
  }

  public actualizarPersonalContratista(personalContratista: PersonalContratista): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/actualizar`;
    return this.httpClient.post<ResponseObject>(url, personalContratista);
  }

  public procesarArchivoDataPersonal(formData: FormData): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/procesar`;
    const params: HttpParams = new HttpParams()
    .append('idEmpresa', StorageUtil.recuperarObjetoSession('idEmpresa').toString())
    .append('idOficina', StorageUtil.recuperarObjetoSession('codOficina').toString())
    .append('idGrupo', StorageUtil.recuperarObjetoSession('idGrupo').toString())
    .append('nomEmpresa', StorageUtil.recuperarObjetoSession('parametrosUsuario').nomEmpresa)
    .append('usuarioCarga', StorageUtil.recuperarObjetoSession('credenciales').usuario);
    return this.httpClient.post<ResponseObject>(url, formData, { params });
  }

  public cargaMasivaPersonal(tramaPersonal: TramaPersonal[], nombreArchivo: string): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/carga-masiva`;
    const params: HttpParams = new HttpParams()
    .append('idEmpresa', StorageUtil.recuperarObjetoSession('idEmpresa').toString())
    .append('idOficina', StorageUtil.recuperarObjetoSession('codOficina').toString())
    .append('idGrupo', StorageUtil.recuperarObjetoSession('idGrupo').toString())
    .append('nomEmpresa', StorageUtil.recuperarObjetoSession('parametrosUsuario').nomEmpresa)
    .append('usuarioCarga', StorageUtil.recuperarObjetoSession('credenciales').usuario)
    .append('nombreArchivo', nombreArchivo);
    return this.httpClient.post<ResponseObject>(url, tramaPersonal, { params });
  }

  public cargarAdjuntosPersonal(formData: FormData, dni: string, codEmpleado1: number, codEmpleado2: number): Observable<ResponseObject> {
      const url: string = `${this.personaContratistaEndpoint}/carga-archivos`;
      const params: HttpParams = new HttpParams()
      .append('dni', dni)
      .append('codEmpleado1', codEmpleado1.toString())
      .append('codEmpleado2', (codEmpleado2 !== null && codEmpleado2 !== undefined) ? codEmpleado2.toString() : '0')
      .append('idEmpresa', StorageUtil.recuperarObjetoSession('idEmpresa').toString())
      .append('usuario', StorageUtil.recuperarObjetoSession('credenciales').usuario);
      return this.httpClient.post<ResponseObject>(url, formData, {params});
  }

  public validarAltaPersonal(personal: PersonalContratista[]): Observable<ResponseObject> {
    const url: string = `${this.personaContratistaEndpoint}/alta`;
    const request: DarAltaRequest = {
      listaPersonal: personal,
      usuarioAlta: StorageUtil.recuperarObjetoSession('credenciales').usuario,
      idEmpresa: StorageUtil.recuperarObjetoSession('idEmpresa'),
      idOficina: StorageUtil.recuperarObjetoSession('codOficina')
    };
    return this.httpClient.post<ResponseObject>(url, request);
  }

}
