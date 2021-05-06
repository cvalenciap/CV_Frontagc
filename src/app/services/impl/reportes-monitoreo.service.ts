import {Directive, Injectable, ɵConsole} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RepoInfActiEjec, RequestReportes, ProgramaValores, Rendimiento, RepoEfecActiTomaEst, RepoEfecNotificaciones,
RepoEfecInspeComer, RepoEfecActiAvisCob, RepoEfecInspeInt, RepoEfecCierre, RepoCumpCicloLector, RepoEfecApertura,
RepoCumpActiNoti, RepoCumpActiReci, RepoCumpActiInsp, RepoCumpActiCierre, RepoCumpActiReapertura, RepoEfecSostenibilidad} from '../../models';
import {environment} from '../../../environments/environment';
import {Response} from '../../models/';
import {Observable, BehaviorSubject} from 'rxjs';
import { ReportesRequest } from '../../models/request/reporte-request';
import { Credenciales } from 'src/app/models/credenciales';

@Injectable({
  providedIn: 'root',
})
export class ReportesMonitoreoService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public  isLoading$ = this.isLoading.asObservable();
  private apiEndpoint: string;
  private apiEndpointExcel: string;
  private apiEndpointPDF: string;
  private apiEndpointTomaEstadoExcel: string;
  private apiEndpointTomaEstadoPDF: string;
  private apiEndpointTomaLectorEstadoExcel: string;
  private apiEndpointTomaLectorEstadoPDF: string;
  private apiEndpointNotificacionesPDF: string;
  private apiEndpointNotificacionesExcel: string;
  private apiEndpointRepoEfecInspeComerPDF: string;
  private apiEndpointRepoEfecInspeComerExcel: string;
  private apiEndpointRepoEfecActiAvisCobPDF: string;
  private apiEndpointRepoEfecActiAvisCobExcel: string;
  private apiEndpointRepoEfecInspeIntPDF: string;
  private apiEndpointRepoEfecInspeIntExcel: string;
  private apiEndpointRepoEfecCierrePDF: string;
  private apiEndpointRepoEfecCierreExcel: string;
  private apiEndpointRepoEfecAperturaPDF: string;
  private apiEndpointRepoEfecAperturaExcel: string;
  private apiEndpointRepoEfecSostenibilidadPDF: string;
  private apiEndpointRepoEfecSostenibilidadExcel : string;
  private apiEndpointRepoCumpCicloLectorPDF: string;
  private apiEndpointRepoCumpCicloLectorExcel: string;
  private apiEndpointRepoCumpActiNotiPDF: string;
  private apiEndpointRepoCumpActiNotiExcel: string;
  private apiEndpointRepoCumpActiReciPDF: string;
  private apiEndpointRepoCumpActiReciExcel: string;
  private apiEndpointRepoCumpActiInspPDF: string;
  private apiEndpointRepoCumpActiInspExcel: string;
  private apiEndpointRepoCumpActiCierrePDF: string;
  private apiEndpointRepoCumpActiCierreExcel: string;
  private apiEndpointRepoCumpActiReaperturaPDF: string;
  private apiEndpointRepoCumpActiReaperturaExcel: string;



  private apiEndpointPDFcons: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/reportes';
    this.apiEndpointPDF = environment.serviceEndpoint + '/reportes/repoinfactiejec.pdf';
    this.apiEndpointExcel = environment.serviceEndpoint + '/reportes/repoinfactiejec.xls';
    this.apiEndpointPDFcons = environment.serviceEndpoint + '/reportes/repoinfactiejeccons.pdf';
    this.apiEndpointTomaEstadoPDF = environment.serviceEndpoint + '/reportes/repoefecactitomaest.pdf';
    this.apiEndpointTomaEstadoExcel = environment.serviceEndpoint + '/reportes/repoefecactitomaest.xls';
    this.apiEndpointTomaLectorEstadoPDF = environment.serviceEndpoint + '/reportes/repoefeclectortomaest.pdf';
    this.apiEndpointTomaLectorEstadoExcel = environment.serviceEndpoint + '/reportes/repoefeclectortomaest.xls';
    this.apiEndpointNotificacionesPDF = environment.serviceEndpoint + '/reportes/repoefecnotificaciones.pdf';
    this.apiEndpointNotificacionesExcel = environment.serviceEndpoint + '/reportes/repoefecnotificaciones.xls';
    this.apiEndpointRepoEfecInspeComerPDF = environment.serviceEndpoint + '/reportes/repoefecinspecomer.pdf';
    this.apiEndpointRepoEfecInspeComerExcel = environment.serviceEndpoint + '/reportes/repoefecinspecomer.xls';
    this.apiEndpointRepoEfecActiAvisCobPDF = environment.serviceEndpoint + '/reportes/repoefecactiaviscob.pdf';
    this.apiEndpointRepoEfecActiAvisCobExcel = environment.serviceEndpoint + '/reportes/repoefecactiaviscob.xls';
    this.apiEndpointRepoEfecInspeIntPDF = environment.serviceEndpoint + '/reportes/repoefecinspeint.pdf';
    this.apiEndpointRepoEfecInspeIntExcel = environment.serviceEndpoint + '/reportes/repoefecinspeint.xls';
    this.apiEndpointRepoEfecCierrePDF = environment.serviceEndpoint + '/reportes/repoefeccierre.pdf';
    this.apiEndpointRepoEfecCierreExcel = environment.serviceEndpoint + '/reportes/repoefeccierre.xls';
    this.apiEndpointRepoEfecAperturaPDF = environment.serviceEndpoint + '/reportes/repoefecapertura.pdf';
    this.apiEndpointRepoEfecAperturaExcel = environment.serviceEndpoint + '/reportes/repoefecapertura.xls';
    this.apiEndpointRepoEfecSostenibilidadPDF = environment.serviceEndpoint + '/reportes/repoefecsostenibilidad.pdf';
    this.apiEndpointRepoEfecSostenibilidadExcel = environment.serviceEndpoint + '/reportes/repoefecsostenibilidad.xls';


    this.apiEndpointRepoCumpCicloLectorPDF = environment.serviceEndpoint + '/reportes/repocumpciclolector.pdf';
    this.apiEndpointRepoCumpCicloLectorExcel = environment.serviceEndpoint + '/reportes/repocumpciclolector.xls';
    this.apiEndpointRepoCumpActiNotiPDF = environment.serviceEndpoint + '/reportes/repocumpactinoti.pdf';
    this.apiEndpointRepoCumpActiNotiExcel = environment.serviceEndpoint + '/reportes/repocumpactinoti.xls';
    this.apiEndpointRepoCumpActiReciPDF = environment.serviceEndpoint + '/reportes/repocumpactireci.pdf';
    this.apiEndpointRepoCumpActiReciExcel = environment.serviceEndpoint + '/reportes/repocumpactireci.xls';
    this.apiEndpointRepoCumpActiInspPDF = environment.serviceEndpoint + '/reportes/repocumpactiinsp.pdf';
    this.apiEndpointRepoCumpActiInspExcel = environment.serviceEndpoint + '/reportes/repocumpactiinsp.xls';
    this.apiEndpointRepoCumpActiCierrePDF = environment.serviceEndpoint + '/reportes/repocumpacticierre.pdf';
    this.apiEndpointRepoCumpActiCierreExcel = environment.serviceEndpoint + '/reportes/repocumpacticierre.xls';
    this.apiEndpointRepoCumpActiReaperturaPDF = environment.serviceEndpoint + '/reportes/repocumpactireapertura.pdf';
    this.apiEndpointRepoCumpActiReaperturaExcel = environment.serviceEndpoint + '/reportes/repocumpactireapertura.xls';

  }

  obtenerPeriodo(): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-periodos`;
    return this.http.get<Response>(url);
  }

  obtenerTipoInspe(): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-tipo-inspe`;
    return this.http.get<Response>(url);
  }

  obtenerFrecAlerta() : Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-frecuencia-alerta`;
    return this.http.get<Response>(url);
  }


  obtenerCiclos(periodo: string): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-ciclos`;
    const params: HttpParams = new HttpParams()
      .set('periodo', periodo);
    return this.http.get<Response>(url, { params });
  }

  obtenerItems(oficina: string): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-item`;
    const params: HttpParams = new HttpParams()
      .set('n_idofic', oficina);
    return this.http.get<Response>(url, { params });
  }

  obtenerActividades(item: number): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-actividad`;
    const params: HttpParams = new HttpParams()
      .set('v_n_item', item.toString());
    return this.http.get<Response>(url, { params });
  }


  obtenerSubactividadesRend(item: number, actividad: string): Observable<Response> {
    const url = `${this.apiEndpoint}/obtener-subactividad`;
    const params: HttpParams = new HttpParams()
      .set('v_n_item', item.toString())
      .set('v_idacti', actividad);
    return this.http.get<Response>(url, { params });
  }



  obtenerRepoInfActiEjec(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoinfactiejec`;
    return this.http.post(url, reporteRequest);
  }

  obtenerUsuariosContratista(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/obtener-usuarios`;
    return this.http.post(url, reporteRequest);
  }

  obtenerSubactividades(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/obtener-subactividad`;
    return this.http.post(url, reporteRequest);
  }

  subirUsuarios(N_IDCONTRATI: Number, lstUsuarios: String): Observable<any> {
    const credenciales: Credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    const cadena = {v_usuario: credenciales.usuario, n_idcontrati: N_IDCONTRATI.toString(), lstUsuarios: lstUsuarios};
    const url = `${this.apiEndpoint}/cargar-usuarios`;
    return this.http.post(url, cadena);
  }
//generarEfectividadTomaEstadoPDF
  generarPDF(items: RepoInfActiEjec[]): Observable<any> {
    const url = `${this.apiEndpointPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarPDFcons(items: RepoInfActiEjec[]): Observable<any> {
    const url = `${this.apiEndpointPDFcons}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarExcel(items: RepoInfActiEjec[]): Observable<any> {
    const url = `${this.apiEndpointExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  listarProgramaValores(request: ProgramaValores): Observable<any> {
    const url = `${this.apiEndpoint}/listar-programa-valores`;
    return this.http.post(url, request);
  }

  updateProgramaValores(programaValores: ProgramaValores): Observable<any> {
    const url = `${this.apiEndpoint}/programa-valores`;
    return this.http.put(url, programaValores);
  }

  eliminarProgramaValores(request: ProgramaValores): Observable<any> {
    const url = `${this.apiEndpoint}/eliminar-programa-valores`;
    return this.http.post(url, request);
  }

  crearProgramaValores(request: ProgramaValores): Observable<any> {
    const url = `${this.apiEndpoint}/programa-valores`;
    return this.http.post(url, request);
  }

  listarRendimiento(request: Rendimiento): Observable<any> {
    const url = `${this.apiEndpoint}/listar-rendimientos`;
    return this.http.post(url, request);
  }

  crearRendimiento(request: Rendimiento): Observable<any> {
    const url = `${this.apiEndpoint}/rendimientos`;
    return this.http.post(url, request);
  }

  updateRendimiento(rendimiento: Rendimiento): Observable<any> {
    const url = `${this.apiEndpoint}/rendimientos`;
    return this.http.put(url, rendimiento);
  }

  eliminarRendimientos(request: Rendimiento): Observable<any> {
    const url = `${this.apiEndpoint}/eliminar-rendimientos`;
    return this.http.post(url, request);
  }

  obtenerRepoEfecActiTomaEst(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecactitomaest`;
    return this.http.post(url, reporteRequest);
  }

  generarEfectividadTomaEstadoPDF(items: RepoEfecActiTomaEst[]): Observable<any> {
    const url = `${this.apiEndpointTomaEstadoPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarEfectividadTomaEstadoExcel(items: RepoEfecActiTomaEst[]): Observable<any> {
    const url = `${this.apiEndpointTomaEstadoExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecLectorTomaEst(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefeclectortomaest`;
    return this.http.post(url, reporteRequest);
  }
  generarEfectividadTomaLectorEstadoPDF(items: RepoEfecActiTomaEst[]): Observable<any> {
    const url = `${this.apiEndpointTomaLectorEstadoPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarEfectividadTomaLectorEstadoExcel(items: RepoEfecActiTomaEst[]): Observable<any> {
    const url = `${this.apiEndpointTomaLectorEstadoExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecNotificaciones(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecnotificaciones`;
    return this.http.post(url, reporteRequest);
  }
  generarEfectividadNotificacionesPDF(items: RepoEfecNotificaciones[]): Observable<any> {
    const url = `${this.apiEndpointNotificacionesPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarEfectividadNotificacionesExcel(items: RepoEfecNotificaciones[]): Observable<any> {
    const url = `${this.apiEndpointNotificacionesExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecInspeComer(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecinspecomer`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoEfecInspeComerPDF(items: RepoEfecInspeComer[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecInspeComerPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoEfecInspeComerExcel(items: RepoEfecInspeComer[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecInspeComerExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecActiAvisCob(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecactiaviscob`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoEfecActiAvisCobPDF(items: RepoEfecActiAvisCob[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecActiAvisCobPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoEfecActiAvisCobExcel(items: RepoEfecActiAvisCob[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecActiAvisCobExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecInspeInt(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecinspeint`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoEfecInspeIntPDF(items: RepoEfecInspeInt[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecInspeIntPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoEfecInspeIntExcel(items: RepoEfecInspeInt[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecInspeIntExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }


  obtenerRepoEfecCierre(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefeccierre`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoEfecCierrePDF(items: RepoEfecCierre[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecCierrePDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoEfecCierreExcel(items: RepoEfecCierre[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecCierreExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoEfecApertura(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecapertura`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoEfecAperturaPDF(items: RepoEfecApertura[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecAperturaPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoEfecAperturaExcel(items: RepoEfecApertura[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecAperturaExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  reporteEfecSostenibilidad(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repoefecsostenibilidad`;
    return this.http.post(url, reporteRequest);
  }
  reporteEfecSostenibilidadPDF(items: RepoEfecSostenibilidad[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecSostenibilidadPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  reporteEfecSostenibilidadExcel(items: RepoEfecSostenibilidad[]): Observable<any> {
    const url = `${this.apiEndpointRepoEfecSostenibilidadExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }





  obtenerRepoCumpCicloLector(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpciclolector`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpCicloLectorPDF(items: RepoCumpCicloLector[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpCicloLectorPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpCicloLectorExcel(items: RepoCumpCicloLector[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpCicloLectorExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoCumpActiNoti(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpactinoti`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpActiNotiPDF(items: RepoCumpActiNoti[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiNotiPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpActiNotiExcel(items: RepoCumpActiNoti[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiNotiExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoCumpActiReci(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpactireci`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpActiReciPDF(items: RepoCumpActiReci[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiReciPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpActiReciExcel(items: RepoCumpActiReci[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiReciExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoCumpActiInsp(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpactiinsp`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpActiInspPDF(items: RepoCumpActiInsp[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiInspPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpActiInspExcel(items: RepoCumpActiInsp[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiInspExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoCumpActiCierre(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpacticierre`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpActiCierrePDF(items: RepoCumpActiCierre[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiCierrePDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpActiCierreExcel(items: RepoCumpActiCierre[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiCierreExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

  obtenerRepoCumpActiReapertura(reporteRequest: ReportesRequest): Observable<any> {
    const url = `${this.apiEndpoint}/repocumpactireapertura`;
    return this.http.post(url, reporteRequest);
  }
  generarRepoCumpActiReaperturaPDF(items: RepoCumpActiReapertura[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiReaperturaPDF}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'});
  }
  generarRepoCumpActiReaperturaExcel(items: RepoCumpActiReapertura[]): Observable<any> {
    const url = `${this.apiEndpointRepoCumpActiReaperturaExcel}`;
    return this.http.post(url, items, {responseType: 'arraybuffer'} );
  }

}
