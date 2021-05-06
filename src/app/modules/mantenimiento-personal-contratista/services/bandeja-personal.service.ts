import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { dataBandejaPersonal } from '../mock/data-bandeja-personal';
import { BandejaPersonalConfig } from 'src/app/models/interface/bandeja-personal-config';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { EventInterface } from 'src/app/models/interface/event-interface';
import { filter, map } from 'rxjs/operators';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { PersonalContratistaRequest } from 'src/app/models/interface/personal-contratista-request';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { Paginacion } from 'src/app/models';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import PaginacionUtil from '../../shared/util/paginacion-util';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { BusquedaAvanzadaConfig } from 'src/app/models/interface/busqueda-avanzada-config';
import StorageUtil from '../../shared/util/storage-util';
import { estadosSedapal } from '../mock/data-busqueda-avanzada-personal';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import { IndicadorAlta } from 'src/app/models/enums/indicador-alta.enum';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';
import { Parametro } from 'src/app/models/enums/parametro';

@Injectable({
  providedIn: 'root'
})
export class BandejaPersonalService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private bandejaPersonalSubject: Subject<PersonalContratista[]> = new Subject<PersonalContratista[]>();
  private paginacionSubject: BehaviorSubject<Paginacion> = new BehaviorSubject<Paginacion>(PaginacionUtil.paginacionVacia());
  private subject$ = new Subject();

  public isLoading$ = this.isLoading.asObservable();
  public bandeja$ = this.bandejaPersonalSubject.asObservable();
  public paginacion$ = this.paginacionSubject.asObservable();

  public data: PersonalContratista[] = [];
  request: PersonalContratistaRequest;
  paginacionActual: Paginacion;

  constructor(private perfilService: PerfilService,
    private personaContratistaApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService) { }

  public cambiarPagina(paginacion: Paginacion): void {
    this.bandejaPersonalSubject.next(this.paginarResultado(paginacion));
  }

  async consultarPersonal(nuevaconsulta: boolean = true, request?: PersonalContratistaRequest, paginacion?: Paginacion) {
    this.mostrarLoader();
    this.request = nuevaconsulta ? request : StorageUtil.recuperarObjetoSession('requestBandejaPersonal');
    if (nuevaconsulta) {
      StorageUtil.almacenarObjetoSession(this.request, 'requestBandejaPersonal');
    }
    await this.personaContratistaApi.obtenerListaPersonalContratista(this.request, paginacion)
      .toPromise()
      .then((response) => {
        if (response.estado === ResponseStatus.OK) {
          if (response.resultado.lista.length > 0) {
            this.data = response.resultado.lista;
            this.paginacionActual = nuevaconsulta ? PaginacionUtil.devolverPaginacion(paginacion, this.data.length)
              : PaginacionUtil.recuperarPaginacionSession(StorageUtil.recuperarObjetoSession('paginacionBandejaPersonal'));
            if (nuevaconsulta) {
              StorageUtil.almacenarObjetoSession(this.paginacionActual, 'paginacionBandejaPersonal');
            }
            this.bandejaPersonalSubject.next(this.paginarResultado(this.paginacionActual));
            this.paginacionSubject.next(this.paginacionActual);
          } else {
            this.data.length = 0;
            this.bandejaPersonalSubject.next([]);
            this.paginacionSubject.next(PaginacionUtil.paginacionVacia());
            this.toastrUtil.showWarning(response.mensaje);
          }
        } else if (response.estado === ResponseStatus.ERROR) {
          this.toastrUtil.showError(response.mensaje);
        }
        this.ocultarLoader();
      })
      .catch((err) => {
        console.error(err);
        this.ocultarLoader();
      });
  }

  configBandejaPorPerfil(): BandejaPersonalConfig {
    const config: BandejaPersonalConfig = {
      btnNuevo: this.perfilService.validarAccion(AccionesMantPersonal.REGISTRAR_PERSONAL),
      btnCargaMasiva: this.perfilService.validarAccion(AccionesMantPersonal.CARGAR_MASIVA_PERSONAL),
      btnCesarPersonal: this.perfilService.validarAccion(AccionesMantPersonal.CESAR_PERSONAL),
      btnDarAlta: this.perfilService.validarAccion(AccionesMantPersonal.DAR_ALTA_PERSONAL),
      btnEditar: this.perfilService.validarAccion(AccionesMantPersonal.MODIFICAR_PERSONAL),
      btnVerDetalle: this.perfilService.validarAccion(AccionesMantPersonal.VER_DETALLE_PERSONAL),
      selPersonal: this.perfilService.validarAccion(AccionesMantPersonal.DAR_ALTA_PERSONAL)
    };
    if (this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) {
      config.title = 'Mantenimiento de Personal';
      config.comboFiltro = true;
    } else {
      config.title = 'Consulta de Personal';
      config.comboFiltro = true;
      config.colContratista = true;
    }
    return config;
  }

  capturaEvento(nombreEvento: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventInterface) => e.evento === nombreEvento),
      map((e: EventInterface) => e['data'])
    ).subscribe(action);
  }

  configurarParametros(): PersonalContratistaRequest {
    const request: PersonalContratistaRequest = {};
    if (this.perfilService.esAdministrador() || this.perfilService.esAdministradorOficina() ||
      this.perfilService.esAquafono() || this.perfilService.esConsultaGeneral() || this.perfilService.esConsultaPersonal()) {
      return {
        codigoEmpleado: 0,
        idEmpresa: 0,
        codMotivoCese: 0,
        tipoSolicitud: null,
        idPerfil: 0,
        idPersonal: 0
      };
    } else if (this.perfilService.esResponsableInterno() || this.perfilService.esAnalistaInterno()) {
      return {
        codigoEmpleado: 0,
        idEmpresa: 0,
        codigoOficina: sessionStorage.getItem('codOficina'),
        codMotivoCese: 0,
        tipoSolicitud: null,
        idPersonal: StorageUtil.recuperarObjetoSession('codigoTrabajador'),
        idPerfil: StorageUtil.recuperarObjetoSession('perfilAsignado')
      };
    } else if (this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) {
      return {
        codigoEmpleado: 0,
        idEmpresa: Number.parseInt(sessionStorage.getItem('idEmpresa')),
        codigoOficina: sessionStorage.getItem('codOficina'),
        codMotivoCese: 0,
        tipoSolicitud: null,
        idPerfil: 0,
        idPersonal: 0
      }
    }
  }

  public deseleccionarPersonalPendiente(): void {
    const personalPendiente: PersonalContratista[] = this.data
      .filter(item => item.oficina.codigo === Number.parseInt(StorageUtil.recuperarObjetoSession('codOficina'))
        || item.oficina.codigo === Parametro.OFI_GRANDES_CLIENTES)
      .filter(item => item.estadoPersonal.id === EstadoPersonal.PENDIENTE_DE_ALTA);
    if (personalPendiente.length > 0) {
      personalPendiente.forEach(item => item.checked = false);
    }
  }

  emiteEvento(event: EventInterface) {
    this.subject$.next(event);
  }

  mostrarLoader(): void {
    this.isLoading.next(true);
  }

  public obtenerPersonalPendiente(): PersonalContratista[] {
    this.mostrarLoader();
    console.log('data', this.data);
    const personalPendiente: PersonalContratista[] = this.data
      .filter(item => item.oficina.codigo === Number.parseInt(StorageUtil.recuperarObjetoSession('codOficina'))
        || item.oficina.codigo === Parametro.OFI_GRANDES_CLIENTES)
      .filter(item => item.estadoPersonal.id === EstadoPersonal.PENDIENTE_DE_ALTA && item.indicadorAlta === IndicadorAlta.PENDIENTE);
    if (personalPendiente.length > 0) {
      personalPendiente.forEach(item => {
        item.checked = true;
        item.motivoAlta = { codigo: 0 };
      });
    }
    return personalPendiente;
  }

  ocultarLoader(): void {
    this.isLoading.next(false);
  }

  private paginarResultado(paginacion: Paginacion): PersonalContratista[] {
    this.paginacionActual = paginacion;
    StorageUtil.almacenarObjetoSession(this.paginacionActual, 'paginacionBandejaPersonal');
    return PaginacionUtil.paginarData(this.data, paginacion);
  }

}
