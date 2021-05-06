import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FiltrosService} from '../filtros.service';
import {DatosConsulta} from '../../../models/datosConsulta';
import {RequestCarga} from '../../../models/request/request-carga';
import {CargaTrabajo} from '../../../models/CargaTrabajo';
import {CargasTrabajoService} from '../../../services/impl/cargas-trabajo.service';
import {Paginacion} from '../../../models';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {
  public datosActuales: DatosConsulta;
  public requestCarga: RequestCarga;
  public cargasTrabajo: Array<CargaTrabajo>;
  public paginacion: Paginacion;

  constructor(private filtrosService: FiltrosService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({registros: 10});
    this.filtrosService.datosActuales.subscribe(
        datosActuales => this.datosActuales = datosActuales
      );
  }

  nuevosDatosRegistro() {
    this.filtrosService.cambiarDatosRegistro(this.datosActuales);
  }

  recibirDatos($event) {
    this.datosActuales = $event;
    this.nuevosDatosRegistro();
  }

  recibirFiltros($event) {
    this.requestCarga = $event;
    this.buscarCargasTrabajo();
  }

  recibirRequest($event) {
    this.requestCarga = $event;
  }

  enviarPag($event) {
    this.paginacion = $event;
  }

  buscarCargasTrabajo() {
  }

  searchEvent(datos: DatosConsulta) {

  }
}
