import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filtro-basico-cargos',
  templateUrl: './filtro-basico-cargos.component.html',
  styleUrls: ['./filtro-basico-cargos.component.scss']
})
export class FiltroBasicoCargosComponent implements OnInit {

  @Output() mostrarBusquedaAvanzadaEvent = new EventEmitter();
  @Output() busquedaSimpleEvent = new EventEmitter();

  inputPlaceholder: string = 'Ingrese Descripción';
  textoBusqueda: string = null;

  constructor() { }

  ngOnInit() {
  }
  onClickBuscar() {
    // TODO: Realizar busqueda simple
  }

  mostrarBusquedaAvanzada() {
    this.mostrarBusquedaAvanzadaEvent.emit();
  }

}
