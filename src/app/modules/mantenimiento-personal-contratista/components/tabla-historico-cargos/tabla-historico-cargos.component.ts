import { Component, OnInit } from '@angular/core';
import { HistoricoCargosService } from '../../services/historico-cargos.service';
import { BehaviorSubject } from 'rxjs';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { Movimiento } from 'src/app/models/interface/movimiento';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Component({
  selector: 'app-tabla-historico-cargos',
  templateUrl: './tabla-historico-cargos.component.html',
  styleUrls: ['./tabla-historico-cargos.component.scss']
})
export class TablaHistoricoCargosComponent implements OnInit {

  dataHistorico: Movimiento[] = [];
  paginacion: Paginacion;

  constructor(private historicoCargoService: HistoricoCargosService) {
    this.suscribirDataHistorico();
    this.suscribirPaginacion();
  }

  ngOnInit() {
    this.paginacion = PaginacionUtil.paginacionCero();
  }

  public onCambioPagina(event): void {
    this.paginacion.pagina = event.page;
    this.paginacion.registros = event.itemsPerPage;
    this.historicoCargoService.consultarHistorico(StorageUtil.recuperarObjetoSession('historicoPersonalRequest'), this.paginacion);
  }

  public onCambioRegistros(event): void {
    this.paginacion = new Paginacion({ pagina: 1, registros: event.rows, totalRegistros: this.dataHistorico.length });
    this.historicoCargoService.consultarHistorico(StorageUtil.recuperarObjetoSession('historicoPersonalRequest'), this.paginacion);
  }

  private suscribirDataHistorico(): void {
    this.historicoCargoService.historicoMovimiento$.subscribe(data => {
      this.dataHistorico = data;
    });
  }

  private suscribirPaginacion(): void {
    this.historicoCargoService.paginacion$.subscribe(paginacion => {
      this.paginacion = paginacion;
    });
  }

}
