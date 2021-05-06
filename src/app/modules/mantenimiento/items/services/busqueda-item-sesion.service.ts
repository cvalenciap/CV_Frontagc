import { Injectable } from '@angular/core';
import { RequestItem } from 'src/app/models/request/request-item';
import { Paginacion } from 'src/app/models';

@Injectable()
export class BusquedaItemSesionService {

    paginacion: Paginacion;
    requestItem: RequestItem;
    accionBusqueda: boolean;
    accionVerDetalle: boolean;

    constructor() {
        this.accionBusqueda = false;
        this.accionVerDetalle = false;
    }

}
