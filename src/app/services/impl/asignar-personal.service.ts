import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Empresa, Oficina, Trabajador} from '../../models';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {delay, map} from 'rxjs/operators';
import {GrupoOficina} from '../../models/grupo-oficina';
import {GrupoPersonal} from '../../models/grupo-personal';
import {RequestAsignarPersonal} from '../../models/request-asignar-personal';
import {ValidacionAsignarPersonal} from '../../models/validacion-asignar-personal';
import { ResponseObject } from 'src/app/models/response/response-object';

@Injectable({
  providedIn: 'root'
})
export class AsignarPersonalService {


  constructor(private httpClient: HttpClient) {
  }

  private ENDPOINT_COMBOS: string = `${environment.serviceEndpoint}/responsable`;
  private ENDPOINT_ASIGNAR_PERSONAL: string = `${environment.serviceEndpoint}/api/asignacion-personal`;

  obtenerEmpresas(): Observable<Array<Empresa>> {
    const URL = `${this.ENDPOINT_COMBOS}/obtenerEmpresas`;
    return this.httpClient.get(URL)
      .pipe(map(data => data['resultado']));
  }

  obtenerGruposFuncionales(idEmpresa: number, idOficina: number, idGrupo: number): Observable<Array<GrupoOficina>> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/grupo-oficina/${idEmpresa}/${idOficina}/${idGrupo}`;
    return this.httpClient.get(URL).pipe(map(response => response['resultado']));
  }

  obtenerOficinas(idEmpresa: number): Observable<Array<Oficina>> {
    const URL: string = `${this.ENDPOINT_COMBOS}/obtenerOficina/${idEmpresa}`;
    return this.httpClient.get(URL).pipe(map(data => data['resultado']));
  }

  buscarGruposDeOficina(idEmpresa: number, idOficina: number, idGrupo: number): Observable<Array<GrupoOficina>> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/grupo-oficina/${idEmpresa}/${idOficina}/${idGrupo}`;
    return this.httpClient.get(URL).pipe(map(response => response['resultado']));
  }

  obtenerPersonalPorGrupo(idEmpresa: number, idOficina: number, idGrupo: number): Observable<Array<GrupoPersonal>> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/personal-grupo/${idEmpresa}/${idOficina}/${idGrupo}`;
    return this.httpClient.get(URL).pipe(map(response => response['resultado']));
  }

  obtenerPersonalPorCodigo(codUsuario: string, tipoEmpresa: string): Observable<Trabajador> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/trabajador/${codUsuario}/${tipoEmpresa}`;
    return this.httpClient.get(URL).pipe(map(response => response['resultado']));
  }

  agregarPersonal(request: RequestAsignarPersonal): Observable<ResponseObject> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/registro`;
    return this.httpClient.post<ResponseObject>(URL, request);
  }

  eliminarPersonal(request: RequestAsignarPersonal): Observable<Array<GrupoPersonal>> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/eliminar`;
    return this.httpClient.post(URL, request).pipe(map(response => response['resultado']));
  }

  validarEliminarPersonal(request: RequestAsignarPersonal): Observable<ValidacionAsignarPersonal> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/validar/eliminar`;
    return this.httpClient.post(URL, request).pipe(map(response => response['resultado']));
  }

  validarExistenciadePersonal(request: RequestAsignarPersonal): Observable<ValidacionAsignarPersonal> {
    const URL: string = `${this.ENDPOINT_ASIGNAR_PERSONAL}/validar/agregar`;
    return this.httpClient.post(URL, request).pipe(map(response => response['resultado']));
  }

}
