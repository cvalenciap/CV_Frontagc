import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { RequestItem } from 'src/app/models/request/request-item';


@Component({
    selector: 'app-busqueda-avanzada-item',
    templateUrl: './busqueda-avanzada-item.component.html',
    styleUrls: ['./busqueda-avanzada-item.component.scss']
})
export class BusquedaAvanzadaItemComponent implements OnInit, OnDestroy {

  @Output() destroy = new EventEmitter();
    listaEstados: Object[];
    requestItem: RequestItem;

    ngOnDestroy(): void {
      if (!this.requestItem.descripcion) {
        this.requestItem.descripcion = '';
      }
      if (!this.requestItem.estado) {
        this.requestItem.estado = '';
      }
      this.destroy.emit(this.requestItem);
    }

    ngOnInit(): void {
        this.listaEstados = [{ id: 'A', descripcion: 'Activo' }, { id: 'I', descripcion: 'Inactivo' }];
        this.requestItem = {};
    }

}
