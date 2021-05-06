import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RequestItem } from 'src/app/models/request/request-item';

@Component({
    selector: 'app-busqueda-basica-item',
    templateUrl: './busqueda-basica-item.component.html',
    styleUrls: ['./busqueda-basica-item.component.scss']
})
export class BusquedaBasicaItemComponent implements OnInit {

    requestItem: RequestItem;
    @Output() busqueda = new EventEmitter();
    @Output() mostrarBusquedaAvanzada = new EventEmitter();

    buscar(): void {
        if (!this.requestItem.descripcion) {
            this.requestItem.descripcion = '';
        }
        if (!this.requestItem.estado) {
            this.requestItem.estado = '';
        }
        this.busqueda.emit(this.requestItem);
    }

    buscarAvanzado(): void {
        this.mostrarBusquedaAvanzada.emit();
    }

    borrarFiltro(): void {
        this.requestItem = { descripcion: '', estado: 'A' };
    }

    ngOnInit(): void {
        this.borrarFiltro();
    }

}
