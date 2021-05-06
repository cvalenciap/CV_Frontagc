import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { RequestItem } from 'src/app/models/request/request-item';

@Component({
    selector: 'app-info-busqueda-item',
    templateUrl: './info-busqueda-item.component.html',
    styleUrls: ['./info-busqueda-item.component.scss']
})
export class InfoBusquedaItemComponent implements OnInit {

    mostrarFiltroAplicado: boolean;
    @Output() limpiarFiltro = new EventEmitter<any>();
    @Input() requestItem: RequestItem;

    eliminarFiltro(): void {
        this.limpiarFiltro.emit();
        this.mostrarFiltroAplicado = false;
    }

    ngOnInit(): void {
        this.mostrarFiltroAplicado = false;
    }

}
