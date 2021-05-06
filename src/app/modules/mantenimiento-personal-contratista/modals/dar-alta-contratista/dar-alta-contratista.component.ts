import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BandejaPersonalService } from '../../services/bandeja-personal.service';
import { BandejaPersonalEvents } from 'src/app/models/enums/bandeja-personal-events.enum';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { DarAltaResponse } from 'src/app/models/interface/dar-alta-response';
import { ResultadoCarga } from 'src/app/models/enums/resultado-carga.enum';
import { Router } from '@angular/router';
import { Mensajes } from 'src/app/models/enums/mensajes';

@Component({
  selector: 'app-dar-alta-contratista',
  templateUrl: './dar-alta-contratista.component.html',
  styleUrls: ['./dar-alta-contratista.component.scss']
})
export class DarAltaContratistaComponent implements OnInit {

  @Input() personalPendiente: PersonalContratista[] = [];
  @Output() darAltaCompletado = new EventEmitter();
  cantidadPendientes: number = 0;
  comboMotivosAlta: Array<any>;

  isLoading: boolean = false;
  listaPaginada: PersonalContratista[] = [];
  listaResultados: string[] = [];
  mostrarConfirmacion: boolean = false;
  mostrarResultados: boolean = false;
  paginacion: Paginacion;

  constructor(private bandejaService: BandejaPersonalService,
    private personalApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService,
    private router: Router) {
    this.obtenerDataCombo();
    this.paginacion = PaginacionUtil.paginacionVacia(5);
  }

  ngOnInit() {
    this.cantidadPendientes = this.personalPendiente.length;
    this.paginarResultados();
  }

  public onChangeMotivoAlta(event, personal: PersonalContratista): void {
    const codMotivoAlta = event.target.value;
    personal.motivoAlta.codigo = codMotivoAlta;
  }

  private obtenerDataCombo() {
    this.comboMotivosAlta = StorageUtil.recuperarObjetoSession('parametrosBandejaPersonal').motivosAlta;
  }

  public onCancelar() {
    this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.CLOSE_DAR_ALTA });
  }

  public onCambioPagina(event) {
    this.paginarResultados(event.page);
  }

  public onComboTodosChange(event) {
    if (event === undefined) {
      this.personalPendiente.forEach(item => item.motivoAlta.codigo = 0);
    } else {
      this.personalPendiente.forEach(item => item.motivoAlta.codigo = event.id);
    }
  }

  public async onConfirmarAlta() {
    this.isLoading = true;
    await this.personalApi.validarAltaPersonal(this.personalPendiente).toPromise()
      .then((response) => {
        if (response.estado === ResponseStatus.OK) {
          this.isLoading = false;
          const resultado: DarAltaResponse = response.resultado;
          if (resultado.estado === ResultadoCarga.INCORRECTO) {
            this.listaResultados = resultado.errores;
            this.mostrarResultados = !this.mostrarResultados;
          } else {
            this.bandejaService.emiteEvento({evento: BandejaPersonalEvents.COMPLETE_DAR_ALTA});
            this.darAltaCompletado.emit();
          }
        } else {
          this.isLoading = false;
          this.mostrarConfirmacion = !this.mostrarConfirmacion;
          this.toastrUtil.showError(response.mensaje);
          console.error(response.error);
        }
      })
      .catch(err => {
        console.error(err);
        this.isLoading = false;
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
      });
  }

  public onMostrarConfirmacion() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  public onOcultarConfirmacion() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  public onRegresarEmit() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
    this.mostrarResultados = !this.mostrarResultados;
  }

  private paginarResultados(pagina: number = 1) {
    this.paginacion = new Paginacion({ pagina: pagina, registros: 5, totalRegistros: this.personalPendiente.length });
    this.listaPaginada = PaginacionUtil.paginarData(this.personalPendiente, this.paginacion);
  }

}
