import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { HistoricoCargosService } from '../../services/historico-cargos.service';
import { CustomFiltroBasicoData } from 'src/app/models/interface/custom-filtro-basico-data';
import { TipoOpcion } from 'src/app/models/enums/tipo-opcion.enum';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { Paginacion } from 'src/app/models';

@Component({
  selector: 'app-historico-cargos',
  templateUrl: './historico-cargos.component.html',
  styleUrls: ['./historico-cargos.component.scss']
})
export class HistoricoCargosComponent implements OnInit {

  @ViewChild('modalBusquedaAvanzada') modalBusquedaAvanzada: SwalComponent;

  configFiltroBasico: CustomFiltroBasicoData[] = [];
  consultaRequest: HistoricoPersonalRequest = {};
  dataFiltrosSeleccionados: FiltroSalida[] = [];
  isLoading: boolean = false;
  showFiltrosBusqueda: boolean = false;
  titulo: string = '';
  tipoHistorico: string;

  constructor(private activatedRoute: ActivatedRoute,
    private historicoCargosService: HistoricoCargosService) { }

  ngOnInit() {
    this.configurarFiltroBasico();
    this.suscribirLoading();
    this.recuperarDatosRouting();
  }

  private configurarFiltroBasico(): void {
    this.configFiltroBasico = [{
      codigo: 1,
      descripcion: 'D.N.I',
      placeholder: 'Ingrese D.N.I',
      tipoOpcion: TipoOpcion.NUMERICO
    }];
  }

  private limpiarRequestSession(): void {
    StorageUtil.removerSession('historicoPersonalRequest');
  }

  public onBusquedaSimpleEmit(filtro: FiltroSalida): void {
    this.dataFiltrosSeleccionados.length = 0;
    switch (filtro.codigoTipoFiltro) {
      case 1:
        this.consultaRequest.numeroDocumento = filtro.value;
        this.realizaConsulta();
        break;
    }
    this.dataFiltrosSeleccionados.push(filtro);
    this.showFiltrosBusqueda = true;
  }

  public onBusquedaAvanzadaEmit(data: any): void {
    this.modalBusquedaAvanzada.nativeSwal.close();
    this.dataFiltrosSeleccionados.length = 0;
    this.consultaRequest = data.request;
    this.dataFiltrosSeleccionados = data.filtros;
    this.showFiltrosBusqueda = true;
    this.realizaConsulta();
  }

  public onCerrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.nativeSwal.close();
  }

  public onExportar(): void {
    this.historicoCargosService.exportarResultados();
  }

  public onLimpiarFiltrosSeleccionadosEmit(): void {
    this.showFiltrosBusqueda = false;
    this.dataFiltrosSeleccionados.length = 0;
    this.historicoCargosService.limpiarConsulta();
    this.limpiarRequestSession();
  }

  public onMostrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.show();
  }

  private realizaConsulta(pagina: number = 1, registros: number = 10): void {
    const paginacion: Paginacion = new Paginacion({ pagina: pagina, registros: registros });
    StorageUtil.almacenarObjetoSession(this.consultaRequest, 'historicoPersonalRequest');
    this.historicoCargosService.consultarHistorico(this.consultaRequest, paginacion);
  }

  private recuperarDatosRouting() {
    this.activatedRoute.data.subscribe(data => {
      this.titulo = data.titulo;
      this.tipoHistorico = data.tipoHistorico;
    });
  }

  private suscribirLoading() {
    this.historicoCargosService.isLoading$.subscribe(loading => this.isLoading = loading);
  }

}
