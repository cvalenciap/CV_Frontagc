import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';

@Component({
  selector: 'app-resultado-alta',
  templateUrl: './resultado-alta.component.html',
  styles: []
})
export class ResultadoAltaComponent implements OnInit {

  @Input() resultados: string[] = [];
  @Output() regresarEvent = new EventEmitter();
  paginacion: Paginacion;
  listaPaginada: string[] = [];

  constructor() {
    this.paginacion = PaginacionUtil.paginacionVacia(5);
  }

  ngOnInit() {
    this.paginarLista();
  }

  public onCambioPagina(event): void {
    this.paginarLista(event.page);
  }

  public onRegresar(): void {
    this.regresarEvent.emit();
  }

  private paginarLista(pagina: number = 1): void {
    this.paginacion = new Paginacion({ pagina: pagina, registros: 5, totalRegistros: this.resultados.length });
    this.listaPaginada = PaginacionUtil.paginarData(this.resultados, this.paginacion);
  }

}
