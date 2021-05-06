import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { dataHistoricoPersonal } from '../mock/data-historico-personal';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from '../../shared/util/paginacion-util';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import { HistoricoApiService } from 'src/app/services/impl/historico-api.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { ResponseObject } from 'src/app/models/response/response-object';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { ExcelService } from 'src/app/services/impl/excel.service';
import StorageUtil from '../../shared/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class HistoricoPersonalService {

  private historicoPersonalSubject: Subject<PersonalContratista[]> = new Subject<PersonalContratista[]>();
  private paginacionSubject: Subject<Paginacion> = new Subject<Paginacion>();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public historicoPersonal$ = this.historicoPersonalSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public paginacion$ = this.paginacionSubject.asObservable();



  constructor(private historicoApi: HistoricoApiService,
    private toastrUtil: ToastrUtilService,
    private excelService: ExcelService) { }

  public async consultarHistorico(request: HistoricoPersonalRequest, paginacion: Paginacion) {
    this.mostrarLoader();
    await this.historicoApi.consultarHistoricoPersonal(request, paginacion.pagina, paginacion.registros)
      .toPromise()
      .then((response: ResponseObject) => {
        if (response.estado === ResponseStatus.OK) {
          const dataPersonal: PersonalContratista[] = response.resultado.lista;
          if (dataPersonal.length === 0) {
            this.toastrUtil.showWarning(response.mensaje);
          } else {
            this.historicoPersonalSubject.next(dataPersonal);
            this.paginacionSubject.next(new Paginacion({ pagina: response.resultado.pagina,
              registros: response.resultado.registros, totalRegistros: response.resultado.totalRegistros }));
          }
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
        }
        this.ocultarLoader();
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.ocultarLoader();
      });
  }

  private exportarExcel(data: PersonalContratista[]): void {
    if (data.length > 0) {
      this.excelService.exportarExcel(data.map(item => {
        return {
          'Nro.': item.nro,
          'D.N.I': item.numeroDocumento,
          'Nombres y Apellidos': item.nombresCompletos,
          'Código SEDAPAL': item.codigoEmpleado,
          'Contratista': item.contratista.descripcion,
          'Fecha de Ingreso': item.fechaIngreso,
          'Fecha de Alta Personal': item.fechaAlta,
          'Fecha de Baja Personal': item.fechaBaja
        };
      }), 'Histórico_personal');
    } else {
      this.excelService.exportarExcel(data.map(item => {
        return {
          'Nro.': 'Nro.',
          'D.N.I': 'D.N.I',
          'Nombres y Apellidos': 'Nombres y Apellidos',
          'Código SEDAPAL': 'Código SEDAPAL',
          'Contratista': 'Contratista',
          'Fecha de Ingreso': 'Fecha de Ingreso',
          'Fecha de Alta Personal': 'Fecha de Alta Personal',
          'Fecha de Baja Personal': 'Fecha de Baja Personal'
        };
      }), 'Histórico_personal');
    }
  }

  public async exportarResultados() {
    this.mostrarLoader();
    let data: PersonalContratista[] = [];
    const request: HistoricoPersonalRequest = StorageUtil.recuperarObjetoSession('historicoPersonalRequest');
    if (request !== null && request !== undefined) {
      await this.historicoApi.consultarHistoricoPersonal(request, 0, 0).toPromise()
      .then((response: ResponseObject) => {
        if (response.estado === ResponseStatus.OK) {
          data = response.resultado.lista;
          this.exportarExcel(data);
        } else {
          this.toastrUtil.showError(response.error.mensaje);
          console.error(response.error);
          this.ocultarLoader();
        }
        this.ocultarLoader();
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MSG_ERROR_EXPORTAR_DATA);
        this.ocultarLoader();
      });
    } else {
      this.exportarExcel(data);
      this.ocultarLoader();
    }
  }

  public limpiarConsulta(): void {
    const dataPersonal: PersonalContratista[] = [];
    dataPersonal.length = 0;
    this.historicoPersonalSubject.next(dataPersonal);
    this.paginacionSubject.next(PaginacionUtil.paginacionCero());
  }

  public mostrarLoader(): void {
    this.isLoadingSubject.next(true);
  }

  public ocultarLoader(): void {
    this.isLoadingSubject.next(false);
  }

}
