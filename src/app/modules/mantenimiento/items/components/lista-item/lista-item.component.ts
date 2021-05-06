import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Paginacion } from 'src/app/models';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item';
import { BusquedaItemSesionService } from '../../../items/services/busqueda-item-sesion.service';

@Component({
    selector: 'app-lista-item',
    templateUrl: './lista-item.component.html',
    styleUrls: ['./lista-item.component.scss']
})
export class ListaItemComponent implements OnInit, OnDestroy, OnChanges {

    listaItemsGrilla: Item[];
    paginacion: Paginacion;
    salirOpcionItem: boolean;
    public loading = false;
    @Input() listaItems: Item[];
    @Output() eliminar = new EventEmitter();

    cambiarPagina(event: any) {
        this.paginacion.pagina = event.page;
        this.listarItemsPagina();
    }

    cambiarRegistrosPorPagina(event: any) {
        this.paginacion.registros = event.rows;
        this.listarItemsPagina();
    }

    constructor(private router: Router, private busquedaItemSesionService: BusquedaItemSesionService) {}

    editarItem(item: Item): void {
      sessionStorage.setItem('objetoItem', JSON.stringify(item));
      this.salirOpcionItem = false;
      this.router.navigate(['/mantenimiento/item/editar']);
      this.busquedaItemSesionService.paginacion = this.paginacion;
    }

    eliminarItem(item: Item): void {
        // this.toastrService.success('Se ha eliminado el item correctamente', Mensajes.CAB_MESSAGE_OK, { closeButton: true });
        this.eliminar.emit(item);
    }

    listarItemsPagina(): void {
      this.loading = true;
        if (this.listaItems) {
            const inicio = (this.paginacion.pagina - 1) * this.paginacion.registros;
            const fin = (this.paginacion.registros * this.paginacion.pagina);
            this.listaItemsGrilla = this.listaItems.slice(inicio, fin);
            this.loading = false;
          }
    }

    ngOnDestroy(): void {
      if (this.salirOpcionItem) {
        this.busquedaItemSesionService.accionBusqueda = false;
        this.busquedaItemSesionService.accionVerDetalle = false;
        this.busquedaItemSesionService.requestItem = null;
        this.busquedaItemSesionService.paginacion = null;
      }
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (this.listaItems) {
        this.paginacion.totalRegistros = this.listaItems.length;
        this.listarItemsPagina();
      }
    }

    ngOnInit(): void {
        this.salirOpcionItem = true;
        if (this.busquedaItemSesionService.accionVerDetalle) {
          this.paginacion = this.busquedaItemSesionService.paginacion;
        } else {
          this.paginacion = new Paginacion({ pagina: 1, registros: 10, totalRegistros: 0 });
        }
    }

    registrarOficina(item: Item) {
        sessionStorage.setItem('itemMantenimiento', JSON.stringify(item));
        this.salirOpcionItem = false;
        this.router.navigate(['/mantenimiento/item/asignar-oficina']);
        this.busquedaItemSesionService.paginacion = this.paginacion;
        this.busquedaItemSesionService.accionVerDetalle = true;
    }

}
