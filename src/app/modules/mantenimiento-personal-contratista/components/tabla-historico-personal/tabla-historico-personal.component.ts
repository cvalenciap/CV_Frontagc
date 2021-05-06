import { Component, OnInit, ViewChild } from '@angular/core';
import { HistoricoPersonalService } from '../../services/historico-personal.service';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Component({
  selector: 'app-tabla-historico-personal',
  templateUrl: './tabla-historico-personal.component.html',
  styleUrls: ['./tabla-historico-personal.component.scss']
})
export class TablaHistoricoPersonalComponent implements OnInit {

  @ViewChild('modalVerDetalle') modalVerDetalle: SwalComponent;

  dataHistorico: PersonalContratista[] = [];
  paginacion: Paginacion;
  personalDetalle: PersonalContratista;

  constructor(private historicoPersonalService: HistoricoPersonalService) {
    this.suscribirDataHistorico();
    this.suscribirPaginacion();
  }

  ngOnInit() {
    this.paginacion = PaginacionUtil.paginacionCero();
  }

  private obtenerData(): void {
    // this.historicoPersonalService.consultarHistorico();
  }

  private suscribirDataHistorico(): void {
    this.historicoPersonalService.historicoPersonal$.subscribe(data => {
      this.dataHistorico = data;
    });
  }

  private suscribirPaginacion(): void {
    this.historicoPersonalService.paginacion$.subscribe(paginacion => {
      this.paginacion = paginacion;
    });
  }

  public onCambioPagina(event): void {
    this.paginacion.pagina = event.page;
    this.paginacion.registros = event.itemsPerPage;
    this.historicoPersonalService.consultarHistorico(StorageUtil.recuperarObjetoSession('historicoPersonalRequest'), this.paginacion);
  }

  public onCambioRegistros(event): void {
    this.paginacion = new Paginacion({ pagina: 1, registros: event.rows, totalRegistros: this.dataHistorico.length });
    this.historicoPersonalService.consultarHistorico(StorageUtil.recuperarObjetoSession('historicoPersonalRequest'), this.paginacion);
  }

  public verDetallePersonal(personal: PersonalContratista): void {
    sessionStorage.setItem('accionMantenimiento', 'VISUALIZAR');
    StorageUtil.almacenarObjetoSession(personal, 'dataPersonalDetalle');
    this.personalDetalle = personal;
    this.modalVerDetalle.show();
  }

}
