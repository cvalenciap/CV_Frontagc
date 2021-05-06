import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoricoPersonalService } from '../../services/historico-personal.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { CustomFiltroBasicoData } from 'src/app/models/interface/custom-filtro-basico-data';
import { TipoOpcion } from 'src/app/models/enums/tipo-opcion.enum';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { HistoricoPersonalRequest } from 'src/app/models/request/historico-personal-request';
import { Paginacion } from 'src/app/models';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Component({
  selector: 'app-historico-personal',
  templateUrl: './historico-personal.component.html',
  styleUrls: ['./historico-personal.component.scss']
})
export class HistoricoPersonalComponent implements OnInit {

  configFiltroBasico: CustomFiltroBasicoData[] = [];
  dataFiltrosSeleccionados: FiltroSalida[] = [];
  isLoading: boolean;
  consultaRequest: HistoricoPersonalRequest = {};
  showFiltrosBusqueda: boolean = false;
  titulo: string = '';
  tipoHistorico: string;

  @ViewChild('modalBusquedaAvanzada') modalBusquedaAvanzada: SwalComponent;

  constructor(private activatedRoute: ActivatedRoute,
    private historicoPersonalService: HistoricoPersonalService) {
    this.suscribirLoading();
  }

  ngOnInit() {
    this.configurarFiltroBasico();
    this.recuperarDatosRouting();
    this.limpiarRequestSession();
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

  public onBusquedaAvanzadaEmit(data: any): void {
    this.modalBusquedaAvanzada.nativeSwal.close();
    this.dataFiltrosSeleccionados.length = 0;
    this.consultaRequest = data.request;
    this.dataFiltrosSeleccionados = data.filtros;
    this.showFiltrosBusqueda = true;
    this.realizaConsulta();
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

  public onCerrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.nativeSwal.close();
  }

  public onExportar(): void {
    this.historicoPersonalService.exportarResultados();
  }

  public onLimpiarFiltrosSeleccionadosEmit(): void {
    this.showFiltrosBusqueda = false;
    this.dataFiltrosSeleccionados.length = 0;
    this.historicoPersonalService.limpiarConsulta();
    this.limpiarRequestSession();
  }

  public onMostrarBusquedaAvanzadaEmit(): void {
    this.modalBusquedaAvanzada.show();
  }

  private realizaConsulta(pagina: number = 1, registros: number = 10): void {
    const paginacion: Paginacion = new Paginacion({ pagina: pagina, registros: registros });
    StorageUtil.almacenarObjetoSession(this.consultaRequest, 'historicoPersonalRequest');
    this.historicoPersonalService.consultarHistorico(this.consultaRequest, paginacion);
  }

  private recuperarDatosRouting() {
    this.activatedRoute.data.subscribe(data => {
      this.titulo = data.titulo;
      this.tipoHistorico = data.tipoHistorico;
    });
  }

  private suscribirLoading(): void {
    this.historicoPersonalService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

}
