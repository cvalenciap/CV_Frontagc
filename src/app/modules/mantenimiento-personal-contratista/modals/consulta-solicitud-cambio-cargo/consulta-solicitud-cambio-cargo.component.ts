import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { Solicitud } from 'src/app/models/interface/solicitud';

@Component({
  selector: 'app-consulta-solicitud-cambio-cargo',
  templateUrl: './consulta-solicitud-cambio-cargo.component.html',
  styleUrls: ['./consulta-solicitud-cambio-cargo.component.scss']
})
export class ConsultaSolicitudCambioCargoComponent implements OnInit, OnDestroy {

  solicitud: Solicitud;
  @Output() cerrarModal = new EventEmitter();

  cerrar() {
    this.cerrarModal.emit();
  }

  constructor(private mantenimientoPersonalService: MantenimientoPersonalService) { }

  ngOnDestroy() {
    this.mantenimientoPersonalService.solicitud = null;
  }

  ngOnInit() {
    this.solicitud = this.mantenimientoPersonalService.solicitud;
  }

}
