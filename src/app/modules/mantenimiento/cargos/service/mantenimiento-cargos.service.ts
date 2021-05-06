import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { dataCargos } from '../mock/data-mantenimiento-cargos';
import { Cargo } from 'src/app/models/interface/cargo';
import { CargoApiService } from 'src/app/services/impl/cargo-api.service';
import { CargoOpenRequest } from 'src/app/models/request/cargo-open-request';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseObject } from 'src/app/models/response/response-object';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoCargosService {

  private dataCargosSubject: Subject<Cargo[]> = new Subject<Cargo[]>();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private paginacionSubject: BehaviorSubject<Paginacion> =
    new BehaviorSubject<Paginacion>(PaginacionUtil.paginacionVacia());

  public dataCargos$ = this.dataCargosSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public paginacion$ = this.paginacionSubject.asObservable();

  private data: Cargo[] = [];
  paginacionActual: Paginacion;
  request: CargoOpenRequest;

  constructor(private cargosApi: CargoApiService,
              private toastrUtil: ToastrUtilService) { }

  public cambiarPagina(paginacion: Paginacion): void {
    this.dataCargosSubject.next(this.paginarResultado(paginacion));
  }

  public async consultarCargos(nuevaConsulta: boolean, requestCargo?: CargoOpenRequest, paginacion?: Paginacion) {
    this.mostrarloader();
    this.request = nuevaConsulta ? requestCargo : StorageUtil.recuperarObjetoSession('requestCargosOpen');
    if (nuevaConsulta) {
      StorageUtil.almacenarObjetoSession(this.request, 'requestCargosOpen');
    }
    await this.cargosApi.obtenerListaCargosOpen(this.request).toPromise()
    .then((response: ResponseObject) => {
      if (response.estado === ResponseStatus.OK) {
        const dataResponse: Cargo[] = response.resultado.lista;
        this.data = dataResponse;
        this.paginacionActual = nuevaConsulta ? PaginacionUtil.devolverPaginacion(paginacion, this.data.length)
          : PaginacionUtil.recuperarPaginacionSession(StorageUtil.recuperarObjetoSession('paginacionBandejaCargos'));
        if (nuevaConsulta) {
          StorageUtil.almacenarObjetoSession(this.paginacionActual, 'paginacionBandejaCargos');
        }
        this.dataCargosSubject.next(this.paginarResultado(this.paginacionActual));
        this.paginacionSubject.next(this.paginacionActual);
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

  public mostrarloader(): void {
    this.isLoadingSubject.next(true);
  }

  public ocultarLoader(): void {
    this.isLoadingSubject.next(false);
  }

  private paginarResultado(paginacion: Paginacion): Array<any> {
    this.paginacionActual = paginacion;
    return PaginacionUtil.paginarData(this.data, paginacion);
  }

}
