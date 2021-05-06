import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { dataHistoricoCargos } from '../mock/data-historico-cargos';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from '../../shared/util/paginacion-util';
import { Movimiento } from 'src/app/models/interface/movimiento';
import { HistoricoApiService } from 'src/app/services/impl/historico-api.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { ExcelService } from 'src/app/services/impl/excel.service';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import { ResponseObject } from 'src/app/models/response/response-object';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { Mensajes } from 'src/app/models/enums/mensajes';
import StorageUtil from '../../shared/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class HistoricoCargosService {

  private historicoMovimientoSubject: Subject<Movimiento[]> = new Subject<Movimiento[]>();
  private paginacionSubject: Subject<Paginacion> = new Subject<Paginacion>();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public historicoMovimiento$ = this.historicoMovimientoSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public paginacion$ = this.paginacionSubject.asObservable();



  constructor(private historicoApi: HistoricoApiService,
    private toastrUtil: ToastrUtilService,
    private excelService: ExcelService) { }

  public async consultarHistorico(request: HistoricoPersonalRequest, paginacion: Paginacion) {
    this.mostrarLoader();
    await this.historicoApi.consultarHistoricoCargosPersonal(request, paginacion.pagina, paginacion.registros)
      .toPromise()
      .then((response: ResponseObject) => {
        if (response.estado === ResponseStatus.OK) {
          const dataMovimiento: Movimiento[] = response.resultado.lista;
          if (dataMovimiento.length === 0) {
            this.toastrUtil.showWarning(response.mensaje);
          } else {
            this.historicoMovimientoSubject.next(dataMovimiento);
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

  private exportarExcel(data: Movimiento[]): void {
    if (data.length > 0) {
      this.excelService.exportarExcel(data.map(item => {
        return {
          'Id Mov': item.idMovimiento,
          'DNI': item.numeroDocumento,
          'Nombres y Apellidos': item.nombreEmpleado,
          'Código SEDAPAL': item.codigoEmpleado,
          'Motivo': item.solicitud.descripcionSolicitud,
          'Cargo Origen': item.cargoActual.descripcion,
          'Oficina Origen': item.oficinaActual.descripcion,
          'Item Origen': item.itemActual.descripcion,
          'Cargo Destino': item.cargoDestino.descripcion,
          'Oficina Destino': item.oficinaDestino.descripcion,
          'Item Destino': item.itemActual.descripcion,
          'Fecha de Alta': item.fechaAltaCargo,
          'Fecha de Baja': item.fechaBajaCargo
        };
      }), 'Histórico_cargos');
    } else {
      this.excelService.exportarExcel(data.map(item => {
        return {
          'Id Mov': null,
          'DNI': null,
          'Nombres y Apellidos': item.nombreEmpleado,
          'Código SEDAPAL': null,
          'Motivo': null,
          'Cargo Origen': null,
          'Oficina Origen': null,
          'Item Origen': null,
          'Cargo Destino': null,
          'Oficina Destino': null,
          'Item Destino': null,
          'Fecha de Alta': null,
          'Fecha de Baja': null
        };
      }), 'Histórico_cargos');
    }
  }

  public async exportarResultados() {
    this.mostrarLoader();
    let data: Movimiento[] = [];
    const request: HistoricoPersonalRequest = StorageUtil.recuperarObjetoSession('historicoPersonalRequest');
    if (request !== null && request !== undefined) {
      await this.historicoApi.consultarHistoricoCargosPersonal(request, 0, 0).toPromise()
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
    const dataMovimiento: Movimiento[] = [];
    dataMovimiento.length = 0;
    this.historicoMovimientoSubject.next(dataMovimiento);
    this.paginacionSubject.next(PaginacionUtil.paginacionCero());
  }

  public mostrarLoader(): void {
    this.isLoadingSubject.next(true);
  }

  public ocultarLoader(): void {
    this.isLoadingSubject.next(false);
  }

}
