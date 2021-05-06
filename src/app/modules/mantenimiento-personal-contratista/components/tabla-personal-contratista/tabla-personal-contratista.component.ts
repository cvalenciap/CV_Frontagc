import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BandejaPersonalService } from '../../services/bandeja-personal.service';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { Paginacion } from 'src/app/models';
import { Router } from '@angular/router';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { BandejaPersonalEvents } from 'src/app/models/enums/bandeja-personal-events.enum';
import { BandejaPersonalConfig } from 'src/app/models/interface/bandeja-personal-config';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import { EstadoLaboral } from 'src/app/models/enums/estado-laboral.enum';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { IndicadorAlta } from 'src/app/models/enums/indicador-alta.enum';
import { MatCheckbox } from '@angular/material/checkbox';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';
import { Parametro } from 'src/app/models/enums/parametro';

@Component({
  selector: 'app-tabla-personal-contratista',
  templateUrl: './tabla-personal-contratista.component.html',
  styleUrls: ['./tabla-personal-contratista.component.scss']
})
export class TablaPersonalContratistaComponent implements OnInit {

  @ViewChild('modalVerDetalle') modalVerDetalle: SwalComponent;
  @ViewChild('checkBoxAll') checkBoxAll: MatCheckbox;
  @Input() config: BandejaPersonalConfig;

  dataBandejaPersonal: PersonalContratista[] = [];
  paginacion: Paginacion;

  esPersonalInterno: boolean;
  esPersonalExterno: boolean;
  existenPendientes: boolean;

  codigoOficina: number = 0;

  checkAll: boolean = false;
  personalSeleccionado: PersonalContratista[] = [];
  selectedRow: number = -1;

  personalDetalle: PersonalContratista = {};

  tooltipText = '';

  constructor(private bandejaService: BandejaPersonalService,
    private perfilService: PerfilService,
    private toastrUtil: ToastrUtilService,
    private router: Router,
    private mantenimientoPersonalService: MantenimientoPersonalService) {
    this.esPersonalInterno = this.perfilService.esAnalistaInterno() || this.perfilService.esResponsableInterno();
    this.esPersonalExterno = this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno();
    this.obtenerCodigoOficina();
    this.suscribirDataPersonal();
    this.suscribirPaginacion();
  }

  ngOnInit() {
    this.setTooltipText();
    this.suscribirDarAlta();
    this.suscribirCesarPersonal();
    this.suscribirBandeja();
  }

  editarPersonal(personal: any) {
    sessionStorage.setItem('personalContratista', JSON.stringify(personal));
    sessionStorage.setItem('accionMantenimiento', 'MODIFICAR');
    this.router.navigate(['/mantenimiento-personal-contratista/modificar']);
  }

  private buscarIndice(codigoEmpleado: number): number {
    for (let i = 0; i < this.personalSeleccionado.length; i++) {
      const item = this.personalSeleccionado[i];
      if (item.codigoEmpleado === codigoEmpleado) {
        return i;
      }
    }
  }

  public getEstadosPersonal() {
    return EstadoPersonal;
  }

  public getEstadosLaboral() {
    return EstadoLaboral;
  }

  public getIndicadorAlta() {
    return IndicadorAlta;
  }

  public getParametros() {
    return Parametro;
  }

  private obtenerCodigoOficina() {
    this.codigoOficina = Number.parseInt(StorageUtil.recuperarObjetoSession('codOficina'));
  }

  private onCancelarAlta() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.CLOSE_DAR_ALTA, () => {
      this.checkAll = false;
      this.onCheckAll();
    });
  }

  public onCambioPagina(event): void {
    this.paginacion.pagina = event.page;
    this.paginacion.registros = event.itemsPerPage;
    this.bandejaService.cambiarPagina(this.paginacion);
  }

  public onCambioRegistros(event): void {
    this.paginacion = new Paginacion({ pagina: 1, registros: event.rows, totalRegistros: this.dataBandejaPersonal.length });
    this.bandejaService.cambiarPagina(this.paginacion);
  }

  private onCerrarModalCesarPersonal() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.CLOSE_CESAR_PERSONAL, () => {
      this.selectedRow = -1;
    });
  }

  public onCheckAll() {
    if (this.checkAll) {
      const personalPendienteAlta: PersonalContratista[] = this.bandejaService.obtenerPersonalPendiente();
      this.bandejaService.ocultarLoader();
      if (personalPendienteAlta.length > 0) {
        this.personalSeleccionado = personalPendienteAlta;
      } else {
        this.checkBoxAll.checked = false;
        this.toastrUtil.showWarning(Mensajes.MENSAJE_NO_PERSONAL_PENDIENTE);
      }
    } else {
      this.personalSeleccionado.length = 0;
      this.bandejaService.deseleccionarPersonalPendiente();
    }
    this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.SELECT_DAR_ALTA, data: this.personalSeleccionado });
  }

  private onCompleteDarAlta() {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.COMPLETE_DAR_ALTA, () => {
      this.checkBoxAll.checked = false;
      this.personalSeleccionado.length = 0;
    });
  }

  private onLimpiarSeleccion(): void {
    this.bandejaService.capturaEvento(BandejaPersonalEvents.CLEAN_SELECT_ROW, () => {
      this.selectedRow = -1;
    });
  }

  public onPersonalChecked(event, personalCheck: PersonalContratista) {
    if (personalCheck.checked) {
      this.personalSeleccionado.push(personalCheck);
    } else {
      const personalIndex: number = this.buscarIndice(personalCheck.codigoEmpleado);
      this.personalSeleccionado.splice(personalIndex, 1);
    }
    this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.SELECT_DAR_ALTA, data: this.personalSeleccionado });
  }

  private setTooltipText(): void {
    this.tooltipText = this.perfilService.esAdministradorOficina() ? 'AprobarSolicitud' : 'Editar Personal';
  }

  // Capturar eventos de bandeja
  private suscribirBandeja() {
    this.onLimpiarSeleccion();
  }

  // Capturar eventos de cesarPersonal
  private suscribirCesarPersonal() {
    this.onCerrarModalCesarPersonal();
  }

  // Capturar Eventos de darAlta
  private suscribirDarAlta() {
    this.onCancelarAlta();
    this.onCompleteDarAlta();
  }

  private suscribirDataPersonal() {
    this.bandejaService.bandeja$.subscribe((data) => {
      this.dataBandejaPersonal = data;
    });
  }

  private suscribirPaginacion() {
    this.bandejaService.paginacion$.subscribe(paginacion => {
      this.paginacion = paginacion;
    });
  }

  public onRowClicked(personal: PersonalContratista, index: number) {
    if (this.esPersonalExterno) {
      if (this.selectedRow === index) {
        this.selectedRow = -1;
      } else {
        this.selectedRow = index;
        this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.SELECT_ROW, data: personal });
      }
    }
  }

  public validarBotonModificar(personal: PersonalContratista): boolean {
    if (this.perfilService.validarAccion(AccionesMantPersonal.MODIFICAR_PERSONAL)) {
      if (this.perfilService.esAdministradorOficina()) {
        return personal.estadoLaboral.id === EstadoLaboral.ACTIVO && personal.estadoPersonal.id === EstadoPersonal.ALTA;
      } else if ((this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) &&
                    personal.estadoLaboral.id !== this.getEstadosLaboral().CESADO) {
        return true;
      }
    } else {
      return false;
    }
  }

  public validCheckAll(event) {
    if (true) {
      this.checkBoxAll.checked = false;
    }
  }

  public verDetalle(personal: PersonalContratista) {
    sessionStorage.setItem('accionMantenimiento', 'VISUALIZAR');
    StorageUtil.almacenarObjetoSession(personal, 'dataPersonalDetalle');
    this.personalDetalle = personal;
    this.modalVerDetalle.show();
  }

}
