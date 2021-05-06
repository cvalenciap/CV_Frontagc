import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { Solicitud } from 'src/app/models/interface/solicitud';

@Component({
    selector: 'app-detalle-solicitud-movimiento-personal',
    templateUrl: './detalle-solicitud-movimiento-personal.component.html',
    styleUrls: ['./detalle-solicitud-movimiento-personal.component.scss']
})
export class DetalleSolicitudMovimientoPersonalComponent implements OnInit, OnDestroy {

    solicitud: Solicitud;
    @Output() cerrarModal = new EventEmitter();

    cerrar() {
        this.cerrarModal.emit();
    }

    constructor(private mantenimientoPersonalService: MantenimientoPersonalService) { }

    ngOnDestroy(): void {
        this.mantenimientoPersonalService.solicitud = null;
    }

    ngOnInit(): void {
        this.solicitud = this.mantenimientoPersonalService.solicitud;
    }
}
