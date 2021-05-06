import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MantenimientoCargosService } from '../../service/mantenimiento-cargos.service';
import { CustomFiltroBasicoData } from 'src/app/models/interface/custom-filtro-basico-data';
import { TipoOpcion } from 'src/app/models/enums/tipo-opcion.enum';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { CargoOpenRequest } from 'src/app/models/request/cargo-open-request';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { NavegacionService } from 'src/app/services/impl/navegacion.service';

@Component({
  selector: 'app-bandeja-cargos',
  templateUrl: './bandeja-cargos.component.html',
  styleUrls: ['./bandeja-cargos.component.scss']
})
export class BandejaCargosComponent implements OnInit {

  @ViewChild('modalBusquedaAvanzada') modalBusquedaAvanzada: SwalComponent;

  configFiltroBasico: CustomFiltroBasicoData[] = [];
  dataFiltrosSeleccionados: FiltroSalida[] = [];
  showFiltrosBusqueda: boolean = false;
  titulo: string = 'Consulta de Cargos OPENSGC';
  isLoading: boolean = false;

  request: CargoOpenRequest = {};

  constructor(private mantenimientoCargosService: MantenimientoCargosService,
    private navegacionService: NavegacionService) {
    this.suscribirIsLoading();
  }

  ngOnInit() {
    this.limpiarParametrosSession();
    this.configurarFiltroBasico();
    this.realizarConsulta(true);
  }

  private configurarFiltroBasico(): void {
    this.configFiltroBasico = [
      {
        tipoOpcion: TipoOpcion.TEXTO,
        codigo: 1,
        descripcion: 'Descripcion',
        placeholder: 'Ingrese Descripción'
      }
    ];
  }

  private limpiarParametrosSession(): void {
    const rutaAnterior = this.navegacionService.previousUrl;
    if (rutaAnterior !== '/mantenimiento/cargos-open/asignar') {
      StorageUtil.removerSession('requestCargosOpen');
      StorageUtil.removerSession('dataFiltrosBandejaCargos');
      StorageUtil.removerSession('cargoBandejaSeleccionado');
    }
  }

  private navegacionRetorno() {
    this.request = StorageUtil.recuperarObjetoSession('requestCargosOpen');
    this.mantenimientoCargosService.consultarCargos(false);
    if (StorageUtil.recuperarObjetoSession('dataFiltrosBandejaCargos')) {
      this.dataFiltrosSeleccionados = StorageUtil.recuperarObjetoSession('dataFiltrosBandejaCargos');
    } else {
      this.dataFiltrosSeleccionados = [];
    }
    this.showFiltrosBusqueda = (this.dataFiltrosSeleccionados !== null && this.dataFiltrosSeleccionados !== undefined) ? this.dataFiltrosSeleccionados.length > 0 : false;
  }

  public onBusquedaAvanzadaEmit(data: any): void {
    this.dataFiltrosSeleccionados.length = 0;
    this.modalBusquedaAvanzada.nativeSwal.close();
    this.request = data.request;
    this.dataFiltrosSeleccionados = data.filtros;
    StorageUtil.almacenarObjetoSession(this.dataFiltrosSeleccionados, 'dataFiltrosBandejaCargos');
    this.showFiltrosBusqueda = true;
    this.realizarConsulta(false);
  }

  public onBusquedaSimpleEmit(filtro: FiltroSalida): void {
    this.dataFiltrosSeleccionados.length = 0;
    switch (filtro.codigoTipoFiltro) {
      case 1: {
        this.request.descripcion = filtro.value.trim();
      }
    }
    this.realizarConsulta(false);
    this.dataFiltrosSeleccionados.push(filtro);
    StorageUtil.almacenarObjetoSession(this.dataFiltrosSeleccionados, 'dataFiltrosBandejaCargos');
    this.showFiltrosBusqueda = true;
  }

  public onCerrarBusquedaAvanzadaEmit() {
    this.modalBusquedaAvanzada.nativeSwal.close();
  }

  public onLimpiarFiltrosSeleccionadosEmit(): void {
    this.dataFiltrosSeleccionados.length = 0;
    StorageUtil.removerSession('dataFiltrosBandejaCargos');
    this.showFiltrosBusqueda = false;
    this.request = {};
    this.realizarConsulta(false);
  }

  public onMostrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.show();
  }

  private realizarConsulta(validarNavegacion: boolean) {
    if (validarNavegacion) {
      const rutaAnterior: string = this.navegacionService.previousUrl;
      if (rutaAnterior === '/mantenimiento/cargos-open/asignar') {
        this.navegacionRetorno();
      } else {
        this.mantenimientoCargosService.consultarCargos(true, this.request);
      }
    } else {
      this.mantenimientoCargosService.consultarCargos(true, this.request);
    }
  }

  public suscribirIsLoading(): void {
    this.mantenimientoCargosService.isLoading$.subscribe(loading => this.isLoading = loading);
  }

}
