import { Component, OnInit } from '@angular/core';
import { FiltrosBandejaLog } from 'src/app/models/filtro-bandeja.log';
import { Parametro } from 'src/app/models';
import { ValidacionService } from 'src/app/services/impl/validacion';

@Component({
  selector: 'app-filtros-bandeja-log',
  templateUrl: './filtros-bandeja-log.component.html',
  styleUrls: ['./filtros-bandeja-log.component.scss']
})
export class FiltrosBandejaLogComponent implements OnInit {

  public filtros: FiltrosBandejaLog;
  acciones = [{valor: 'V', descripcion: 'VISUALIZAR'},{valor: 'D', descripcion: 'DESCARGAR'},{valor:'I', descripcion: 'IMPRIMIR'}];
  tipo = [{valor: 'PDF', descripcion: 'PDF'},{valor: 'JPG', descripcion: 'JPG'}];

  constructor(public validacionNumero: ValidacionService) {
    this.filtros = new FiltrosBandejaLog();
  }

  ngOnInit() {
  }

  detectarCambioFechas() {
    if (!(this.filtros.fechaInicio instanceof Date) || isNaN(this.filtros.fechaInicio.getTime()) ) {
      this.filtros.fechaInicio = null;
    }
    if (!(this.filtros.fechaFin instanceof Date) || isNaN(this.filtros.fechaFin.getTime()) ) {
      this.filtros.fechaFin = null;
    }
  }

  onLimpiarFiltros(): void{
    this.filtros = new FiltrosBandejaLog();
    this.filtros.fechaInicio = null;
    this.filtros.fechaFin = null;
  }

}


