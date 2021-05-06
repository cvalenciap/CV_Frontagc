import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';

@Component({
  selector: 'app-custom-filtros-busqueda',
  templateUrl: './custom-filtros-busqueda.component.html',
  styleUrls: ['./custom-filtros-busqueda.component.scss']
})
export class CustomFiltrosBusquedaComponent implements OnInit {

  @Input() dataFiltros: FiltroSalida[];

  @Output() limpiarFiltrosEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onLimpiarFiltros(): void {
    this.limpiarFiltrosEvent.emit();
  }

}
