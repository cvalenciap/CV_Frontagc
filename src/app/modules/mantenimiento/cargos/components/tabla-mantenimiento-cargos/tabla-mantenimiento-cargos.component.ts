import { Component, OnInit } from '@angular/core';
import { Paginacion } from 'src/app/models';
import { MantenimientoCargosService } from '../../service/mantenimiento-cargos.service';
import { Router } from '@angular/router';
import { Cargo } from 'src/app/models/interface/cargo';
import { Estado } from 'src/app/models/enums';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Component({
  selector: 'app-tabla-mantenimiento-cargos',
  templateUrl: './tabla-mantenimiento-cargos.component.html',
  styleUrls: ['./tabla-mantenimiento-cargos.component.scss']
})
export class TablaMantenimientoCargosComponent implements OnInit {

  dataCargos: Cargo[];
  paginacion: Paginacion;

  constructor(private mantenimientoCargosService: MantenimientoCargosService,
    private router: Router,
    private cargoService: MantenimientoCargosService) {
    this.suscribirDataSubject();
    this.suscribirPaginacionSubject();
  }

  ngOnInit() {
    StorageUtil.removerSession('cargoBandejaSeleccionado');
  }

  public getEstado() {
    return Estado;
  }

  public onCambioPagina(event) {
    this.paginacion.pagina = event.page;
    this.paginacion.registros = event.itemsPerPage;
    this.cargoService.cambiarPagina(this.paginacion);
  }

  public onCambioRegistros(event) {
    this.paginacion = new Paginacion({pagina: 1, registros: event.rows, totalPaginas: this.dataCargos.length});
    this.cargoService.cambiarPagina(this.paginacion);
  }

  public onNavegarAsignarActividades(item: Cargo): void {
    StorageUtil.almacenarObjetoSession(item, 'cargoBandejaSeleccionado');
    this.router.navigate(['/mantenimiento/cargos-open/asignar']);
  }

  private suscribirDataSubject(): void {
    this.mantenimientoCargosService.dataCargos$.subscribe(data => {
      this.dataCargos = data;
    });
  }

  private suscribirPaginacionSubject(): void {
    this.mantenimientoCargosService.paginacion$.subscribe(paginacion => {
      this.paginacion = paginacion;
    });
  }

}
