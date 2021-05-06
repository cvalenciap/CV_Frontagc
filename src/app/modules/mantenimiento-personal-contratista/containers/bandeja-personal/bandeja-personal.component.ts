import { Component, OnInit, ViewChild } from '@angular/core';
import { BandejaPersonalConfig } from 'src/app/models/interface/bandeja-personal-config';
import { BandejaPersonalService } from '../../services/bandeja-personal.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { Router } from '@angular/router';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { BandejaPersonalEvents } from 'src/app/models/enums/bandeja-personal-events.enum';
import { PersonalContratistaRequest } from 'src/app/models/interface/personal-contratista-request';
import { Paginacion } from 'src/app/models';
import { NavegacionService } from 'src/app/services/impl/navegacion.service';
import { CustomFiltroBasicoData } from 'src/app/models/interface/custom-filtro-basico-data';
import { TipoOpcion } from 'src/app/models/enums/tipo-opcion.enum';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { EstadoLaboral } from 'src/app/models/enums/estado-laboral.enum';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';
import { CargaPersonalResponse } from 'src/app/models/interface/carga-personal-response';

@Component({
  selector: 'app-bandeja-personal',
  templateUrl: './bandeja-personal.component.html',
  styleUrls: ['./bandeja-personal.component.scss']
})
export class BandejaPersonalComponent implements OnInit {

  @ViewChild('modalBusquedaAvanzada') modalBusquedaAvanzada: SwalComponent;
  @ViewChild('modalDarAlta') modalDarAlta: SwalComponent;
  @ViewChild('modalCesarPersonal') modalCesarPersonal: SwalComponent;
  @ViewChild('modalCargaMasiva') modalCargaMasiva: SwalComponent;

  config: BandejaPersonalConfig = {};
  paginacion: Paginacion;
  personalRequest: PersonalContratistaRequest = {};
  isLoading: boolean = false;

  personalSeleccionado: PersonalContratista;
  personalPendiente: PersonalContratista[] = [];

  dataBusquedaSimple: CustomFiltroBasicoData[] = [];
  showFiltrosBusqueda: boolean = false;
  dataFiltrosBusqueda: FiltroSalida[] = [];

  constructor(
    private bandejaService: BandejaPersonalService,
    private toastrService: ToastrService,
    private router: Router,
    private navegacionService: NavegacionService,
    private toastrUtil: ToastrUtilService,
    private perfilService: PerfilService) {
    this.onContructComponent();
  }

  ngOnInit() {
    this.limpiarObjetosSession();
    this.configurarBusquedaSimple();
    this.realizarConsulta(true);
    this.suscribirDarAlta();
    this.suscribirBandeja();
    this.suscribirCesarPersonal();
  }

  public configurarBusquedaSimple() {
    if (this.perfilService.esAdministradorOficina()) {
      this.dataBusquedaSimple = [
        {
          codigo: 1,
          descripcion: 'D.N.I',
          placeholder: 'Ingrese D.N.I',
          tipoOpcion: TipoOpcion.NUMERICO
        },
        {
          codigo: 2,
          descripcion: 'Código SEDAPAL',
          placeholder: 'Ingrese Código SEDAPAL',
          tipoOpcion: TipoOpcion.NUMERICO
        },
        {
          codigo: 3,
          descripcion: 'Código Carga Masiva',
          placeholder: 'Ingrese Código de Carga Masiva',
          tipoOpcion: TipoOpcion.NUMERICO
        }
      ];
    } else {
      this.dataBusquedaSimple = [
        {
          codigo: 1,
          descripcion: 'D.N.I',
          placeholder: 'Ingrese D.N.I',
          tipoOpcion: TipoOpcion.NUMERICO
        },
        {
          codigo: 2,
          descripcion: 'Código SEDAPAL',
          placeholder: 'Ingrese Código SEDAPAL',
          tipoOpcion: TipoOpcion.NUMERICO
        }
      ];
    }
  }

  private getConfig(): void {
    this.config = this.bandejaService.configBandejaPorPerfil();
  }

  private limpiarObjetosSession(): void {
    StorageUtil.removerSession('resultadoCargaMasiva');
  }

  private limpiarSeleccionTabla(): void {
    this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.CLEAN_SELECT_ROW });
  }

  private navegacionRetorno() {
    this.personalRequest = StorageUtil.recuperarObjetoSession('requestBandejaPersonal');
    this.bandejaService.consultarPersonal(false);
    this.dataFiltrosBusqueda = StorageUtil.recuperarObjetoSession('dataFiltrosBandejaPersonal') || [];
    this.showFiltrosBusqueda =
      (this.dataFiltrosBusqueda !== null && this.dataFiltrosBusqueda !== undefined) ? this.dataFiltrosBusqueda.length > 0 : false;
  }

  private navegacionRetornoModificar() {
    const personalModificado: PersonalContratista = StorageUtil.recuperarObjetoSession('personalSolicitudAprobada');
    if (personalModificado !== null && personalModificado !== undefined) {
      this.personalRequest.codigoEmpleado = personalModificado.codigoEmpleado;
      this.personalRequest.numeroDocumento = personalModificado.numeroDocumento;
      this.bandejaService.consultarPersonal(true, this.personalRequest);
    } else {
      this.navegacionRetorno();
    }
  }

  public nuevoPersonal() {
    sessionStorage.setItem('accionMantenimiento', 'REGISTRAR');
    this.router.navigate(['/mantenimiento-personal-contratista/registrar']);
  }

  public onBusquedaAvanzadaEmit(data: any): void {
    this.dataFiltrosBusqueda.length = 0;
    this.modalBusquedaAvanzada.nativeSwal.close();
    this.personalRequest = data.dataBusqueda;
    this.dataFiltrosBusqueda = data.dataFiltros;
    StorageUtil.almacenarObjetoSession(this.dataFiltrosBusqueda, 'dataFiltrosBandejaPersonal');
    this.showFiltrosBusqueda = true;
    this.realizarConsulta(false);
  }

  public onBusquedaSimpleEmit(filtro: FiltroSalida): void {
    this.dataFiltrosBusqueda.length = 0;
    this.personalRequest = this.bandejaService.configurarParametros();
    switch (filtro.codigoTipoFiltro) {
      case 1: {
        this.personalRequest.numeroDocumento = filtro.value;
        this.realizarConsulta(false);
        break;
      }
      case 2: {
        this.personalRequest.codigoEmpleado = filtro.value;
        this.realizarConsulta(false);
        break;
      }
      case 3: {
        this.personalRequest.codLote = filtro.value;
        this.realizarConsulta(false);
        break;
      }
    }
    this.dataFiltrosBusqueda.push(filtro);
    StorageUtil.almacenarObjetoSession(this.dataFiltrosBusqueda, 'dataFiltrosBandejaPersonal');
    this.showFiltrosBusqueda = true;
  }

  public onCloseModalCargaMasiva() {
    const resultadoMasivo: CargaPersonalResponse = StorageUtil.recuperarObjetoSession('resultadoCargaMasiva');
    if (resultadoMasivo !== null && resultadoMasivo !== undefined) {
      const requestTemp = this.personalRequest;
      this.personalRequest = this.bandejaService.configurarParametros();
      this.personalRequest.codLote = resultadoMasivo.loteCarga;
      this.realizarConsulta(false);
    }
  }

  // Eventos que se ejecutan en el constructor
  private onContructComponent(): void {
    this.getConfig();
    this.suscribirLoading();
  }

  private onCerrarModalDarAlta() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.CLOSE_DAR_ALTA, () => {
      this.modalDarAlta.nativeSwal.close();
    });
  }

  public onCerrarModalBusquedaEmit(): void {
    this.modalBusquedaAvanzada.nativeSwal.close();
  }

  private onCerrarModalCesarPersonal() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.CLOSE_CESAR_PERSONAL, () => {
      this.modalCesarPersonal.nativeSwal.close();
    });
  }

  public onCesarPersonalEmit(event: string) {
    this.modalCesarPersonal.nativeSwal.close();
    this.realizarConsulta(false);
    this.toastrUtil.showSuccess(event);
  }

  public onDarAltaCompletadoEmit() {
    this.modalDarAlta.nativeSwal.close();
    this.realizarConsulta(false);
    this.toastrUtil.showSuccess(Mensajes.MENSAJE_DAR_ALTA);
  }

  public onLimpiarFiltrosEmit() {
    this.dataFiltrosBusqueda.length = 0;
    StorageUtil.removerSession('dataFiltrosBandejaPersonal');
    this.showFiltrosBusqueda = false;
    this.personalRequest = this.bandejaService.configurarParametros();
    this.realizarConsulta(false);
  }

  // Mostrar modal dar alta
  public onMostrarModalDarAlta(): void {
    if (this.personalPendiente !== null && this.personalPendiente !== undefined) {
      if (this.personalPendiente.length > 0) {
        this.modalDarAlta.show();
      } else {
        this.toastrService.warning(Mensajes.MENSAJE_PERSONAL_PENDIENTE_NO_SELEC, Mensajes.CAB_MESSAGE_AVISO);
      }
    } else {
      this.toastrService.warning(Mensajes.MENSAJE_PERSONAL_PENDIENTE_NO_SELEC, Mensajes.CAB_MESSAGE_AVISO);
    }
  }

  // Mostrar modal cesar personal
  public onMostrarModalCesarPersonal(): void {
    if (this.personalSeleccionado !== null && this.personalSeleccionado !== undefined) {
      if (this.personalSeleccionado.estadoLaboral.id === EstadoLaboral.CESADO) {
        this.toastrService.warning(Mensajes.PERSONAL_SELECCIONADO_CESADO, Mensajes.CAB_MESSAGE_AVISO);
        this.limpiarSeleccionTabla();
      } else {
        this.modalCesarPersonal.show();
      }
    } else {
      this.toastrService.warning(Mensajes.PERSONAL_CESE_NO_SELEC, Mensajes.CAB_MESSAGE_AVISO);
    }
  }

  // Mostrar Modal Carga Masiva
  public onMostrarModalCargaMasiva(): void {
    this.modalCargaMasiva.show();
  }

  // Captura de EventEmitters
  public onMostrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.show();
  }

  private onRegistroTablaClick() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.SELECT_ROW, (data: PersonalContratista) => {
      this.personalSeleccionado = data;
    });
  }

  private onSeleccionarPersonal() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.SELECT_DAR_ALTA, (personal) => {
      this.personalPendiente = personal;
    });
  }

  private suscribirLoading(): void {
    this.bandejaService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
  }

  // Capturar eventos de DarAlta
  private suscribirDarAlta() {
    this.onCerrarModalDarAlta();
    this.onSeleccionarPersonal();
  }

  // Capturar eventos de tabla personal
  private suscribirBandeja() {
    this.onRegistroTablaClick();
  }

  // Capturar eventos de cesarpersonal
  private suscribirCesarPersonal() {
    this.onCerrarModalCesarPersonal();
  }

  public realizarConsulta(validarNavegacion: boolean) {
    if (validarNavegacion) {
      const rutaAnterior: string = this.navegacionService.previousUrl;
      if (rutaAnterior === '/mantenimiento-personal-contratista/modificar') {
        this.navegacionRetornoModificar();
      } else if (rutaAnterior === '/mantenimiento-personal-contratista/registrar') {
        if (StorageUtil.recuperarObjetoSession('flagRegistrado') === 'REGISTRADO') {
          const personalRegistrado: PersonalContratista = StorageUtil.recuperarObjetoSession('registroPersonalRequest');
          this.personalRequest = this.bandejaService.configurarParametros();
          this.personalRequest.numeroDocumento = personalRegistrado.numeroDocumento;
          this.personalRequest.idEmpresa = personalRegistrado.contratista.codigo;
          this.personalRequest.codigoOficina = personalRegistrado.oficina.codigo.toString();
          this.personalRequest.nombres = personalRegistrado.nombres;
          this.personalRequest.apellidoPaterno = personalRegistrado.apellidoPaterno;
          this.personalRequest.apellidoMaterno = personalRegistrado.apellidoMaterno;
          this.bandejaService.consultarPersonal(true, this.personalRequest);
        } else {
          this.navegacionRetorno();
        }
      } else {
        this.personalRequest = this.bandejaService.configurarParametros();
        this.bandejaService.consultarPersonal(true, this.personalRequest);
      }
    } else {
      this.bandejaService.consultarPersonal(true, this.personalRequest);
    }
  }

}
