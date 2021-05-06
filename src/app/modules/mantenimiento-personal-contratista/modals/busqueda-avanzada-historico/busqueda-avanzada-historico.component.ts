import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { dataComboContratista, dataComboEstadoCargo, dataComboEstadoLaboral, dataComboEstadoContratista } from '../../mock/data-historico-cargos';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { Empresa } from 'src/app/models';
import { Estado } from 'src/app/models/interface/estado';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { DatePipe } from '@angular/common';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';

@Component({
  selector: 'app-busqueda-avanzada-historico',
  templateUrl: './busqueda-avanzada-historico.component.html',
  styleUrls: ['./busqueda-avanzada-historico.component.scss']
})
export class BusquedaAvanzadaHistoricoComponent implements OnInit {

  @Input() tipoHistorico: string;
  @Output() busquedaAvanzadaEvent = new EventEmitter();
  @Output() cerrarBusquedaAvanzadaEvent = new EventEmitter();

  comboEstadoContratista: Estado[] = [];
  comboContratista: Empresa[] = [];
  comboEstadoLaboral: Estado[] = [];
  comboEstadoCargo: Estado[] = [];

  dataFiltrosSeleccionados: FiltroSalida[] = [];

  flagFiltroSeleccionado: boolean = false;
  flagFechaObligatoria: boolean = false;

  historicoRequest: HistoricoPersonalRequest = {};

  constructor(private toastrUtil: ToastrUtilService,
    private datePipe: DatePipe,
    private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.onConstructor();
  }

  ngOnInit() {
  }

  private agregarDataFiltro(campo: string, value: any): void {
    this.eliminarFiltroRepetido(campo);
    const filtro: FiltroSalida = { tipoFiltro: campo, codigoTipoFiltro: 0, value };
    this.dataFiltrosSeleccionados.push(filtro);
    this.dataFiltrosSeleccionados.sort((a, b) => {
      if (a.tipoFiltro > b.tipoFiltro) { return 1; }
      if (a.tipoFiltro < b.tipoFiltro) { return -1; }
      return 0;
    });
  }

  private buscarIndiceFiltroRepetido(campo: string) {
    for (let i = 0; i < this.dataFiltrosSeleccionados.length; i++) {
      const item = this.dataFiltrosSeleccionados[i];
      if (item.tipoFiltro === campo) {
        return i;
      }
    }
  }

  public busquedaAvanzada() {
    if (!this.flagFiltroSeleccionado) {
      this.toastrUtil.showWarning(Mensajes.MSG_FILTROS_NO_SELECCIONADOS);
    } else if (this.flagFechaObligatoria) {
      if (this.historicoRequest.fechaDesde === undefined || this.historicoRequest.fechaDesde === null) {
        this.toastrUtil.showWarning(Mensajes.MSG_FECHA_DESDE_OBLIGATORIA);
      } else if (this.historicoRequest.fechaHasta === undefined || this.historicoRequest.fechaHasta === null) {
        this.toastrUtil.showWarning(Mensajes.MSG_FECHA_HASTA_OBLIGATORIA);
      } else {
        this.busquedaAvanzadaEvent.emit({
          request: this.historicoRequest,
          filtros: this.dataFiltrosSeleccionados
        });
      }
    } else {
      this.busquedaAvanzadaEvent.emit({
        request: this.historicoRequest,
        filtros: this.dataFiltrosSeleccionados
      });
    }
  }

  private cargarComboContratista(estado: string = 'N') {
    this.historicoRequest.empresa = null;
    switch (estado) {
      case 'I':
        this.comboContratista = this.filtrarListaContratista(estado);
        break;
      case 'A':
        this.comboContratista = this.filtrarListaContratista(estado);
        break;
      case 'N':
        this.comboContratista = StorageUtil.recuperarObjetoSession('parametrosUsuario').listaEmpresa;
        break;
    }
  }

  public cerrarModal(): void {
    this.cerrarBusquedaAvanzadaEvent.emit();
  }

  private eliminarDataFiltro(filtro: string): void {
    let indiceEncontrado = -1;
    for (let index = 0; index < this.dataFiltrosSeleccionados.length; index++) {
      const element = this.dataFiltrosSeleccionados[index];
      if (element.tipoFiltro === filtro) {
        indiceEncontrado = index;
        break;
      }
    }
    if (indiceEncontrado >= 0) {
      this.dataFiltrosSeleccionados.splice(indiceEncontrado, 1);
    }
  }

  private eliminarFiltroRepetido(campo: string): void {
    const indice: number = this.buscarIndiceFiltroRepetido(campo);
    if (indice > -1) {
      this.dataFiltrosSeleccionados.splice(indice, 1);
    }
  }

  private filtrarListaContratista(estado: string): Empresa[] {
    const listaEmpresas: Empresa[] = StorageUtil.recuperarObjetoSession('parametrosUsuario').listaEmpresa;
    const listaEmpresasDevuelta: Empresa[] = [];
    for (let index = 0; index < listaEmpresas.length; index++) {
      const element = listaEmpresas[index];
      if (element.estado === estado) {
        listaEmpresasDevuelta.push(element);
      }
    }
    return listaEmpresasDevuelta;
  }

  private onConstructor(): void {
    this.cargarComboContratista();
    this.comboEstadoContratista = [{ id: 'A', descripcion: 'ACTIVO' }, { id: 'I', descripcion: 'INACTIVO' }];
    this.comboEstadoCargo = [{ id: 'A', descripcion: 'ALTA' }, { id: 'B', descripcion: 'BAJA' }];
    this.comboEstadoLaboral = StorageUtil.recuperarObjetoSession('parametrosBandejaPersonal').estadoLaboral;
  }

  public onChangeFiltro(filtro: string, event: any) {
    this.flagFiltroSeleccionado = true;
    switch (filtro) {
      case 'D.N.I':
        this.historicoRequest.numeroDocumento = event.target.value.trim();
        this.agregarDataFiltro(filtro, event.target.value);
        break;
      case 'Nombres':
        this.historicoRequest.nombres = event.target.value.trim();
        this.agregarDataFiltro(filtro, event.target.value);
        break;
      case 'Apellido Paterno':
        this.historicoRequest.apellidoPaterno = event.target.value.trim();
        this.agregarDataFiltro(filtro, event.target.value);
        break;
      case 'Apellido Materno':
        this.historicoRequest.apellidoMaterno = event.target.value.trim();
        this.agregarDataFiltro(filtro, event.target.value);
        break;
      case 'Estado Contratista':
        // this.historicoRequest.estadoEmpresa = event;
        if (event !== undefined && event !== null) {
          this.agregarDataFiltro(filtro, event.descripcion);
          this.cargarComboContratista(event.id);
        } else {
          this.eliminarDataFiltro(filtro);
          this.cargarComboContratista();
        }
        this.eliminarDataFiltro('Contratista');
        break;
      case 'Contratista':
        // this.historicoRequest.empresa = event;
        if (event !== undefined && event !== null) {
          this.agregarDataFiltro(filtro, event.descripcion);
        } else {
          this.eliminarDataFiltro(filtro);
        }
        break;
      case 'Estado Laboral':
        // this.historicoRequest.estadoLaboral = event;
        if (event !== undefined && event !== null) {
          this.agregarDataFiltro(filtro, event.descripcion);
          this.flagFechaObligatoria = true;
        } else {
          this.eliminarDataFiltro(filtro);
          this.flagFechaObligatoria = false;
        }
        break;
      case 'Estado Cargo':
        if (event !== undefined && event !== null) {
          this.agregarDataFiltro(filtro, event.descripcion);
          this.flagFechaObligatoria = true;
        } else {
          this.eliminarDataFiltro(filtro);
          this.flagFechaObligatoria = false;
        }
        break;
      case 'Fecha Desde':
        const fechaDesde: string = this.datePipe.transform(event, 'dd/MM/yyyy');
        this.historicoRequest.fechaDesde = fechaDesde;
        this.agregarDataFiltro(filtro, fechaDesde);
        break;
      case 'Fecha Hasta':
        const fechaHasta: string = this.datePipe.transform(event, 'dd/MM/yyyy');
        this.historicoRequest.fechaHasta = fechaHasta;
        this.agregarDataFiltro(filtro, fechaHasta);
    }
  }

  public onLimpiarFiltros(): void {
    this.flagFiltroSeleccionado = false;
    this.flagFechaObligatoria = false;
    this.dataFiltrosSeleccionados.length = 0;
    this.historicoRequest = {};
  }

}
