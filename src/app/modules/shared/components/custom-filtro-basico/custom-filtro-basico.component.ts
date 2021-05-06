import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TipoOpcion } from 'src/app/models/enums/tipo-opcion.enum';
import { CustomFiltroBasicoData } from 'src/app/models/interface/custom-filtro-basico-data';
import { CustomFiltroBasicoConfig } from 'src/app/models/interface/custom-filtro-basico-config';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';

@Component({
  selector: 'app-custom-filtro-basico',
  templateUrl: './custom-filtro-basico.component.html',
  styles: [`
    .menu-item:hover {
      cursor: pointer !important;
    }
  `]
})
export class CustomFiltroBasicoComponent implements OnInit {

  constructor() {
    this.iniciarConfiguracion();
  }

  @Output() busquedaSimpleEvent = new EventEmitter();
  @Output() mostrarBusquedaAvanzadaEvent = new EventEmitter();

  @Input() customDataList: Array<CustomFiltroBasicoData>;
  @Input() busquedaAvanzada: boolean = true;
  @Input() customConfig: CustomFiltroBasicoConfig;

  // opcionSeleccionada: CustomFiltroBasicoData = { descripcion: 'Filtro 1', placeholder: 'Seleccione Filtro 1', tipoOpcion: TipoOpcion.TEXTO };
  opcionSeleccionada: CustomFiltroBasicoData;
  enabledButton: boolean = true;
  valorCombo: any = null;
  textoIngresado: string;
  filtroSalida: FiltroSalida;

  listClicked: number = -1;

  private static validaParametro(parametro: any): boolean {
    return (parametro !== null && parametro !== undefined);
  }

  ngOnInit() {
    this.opcionSeleccionada = this.customDataList[0];
  }

  public getTipoOpcion() {
    return TipoOpcion;
  }

  private iniciarConfiguracion(): void {
    if (this.customConfig !== null && this.customConfig !== undefined) {
      this.customDataList = CustomFiltroBasicoComponent.validaParametro(this.customConfig.customDataList)
        ? this.customConfig.customDataList : [];
      this.busquedaAvanzada = CustomFiltroBasicoComponent.validaParametro(this.customConfig.busquedaAvanzada)
        ? this.customConfig.busquedaAvanzada : false;
    }
  }

  public onBuscar(): void {
    if (this.opcionSeleccionada.tipoOpcion === TipoOpcion.TEXTO || this.opcionSeleccionada.tipoOpcion === TipoOpcion.NUMERICO) {
      this.filtroSalida = {
        value: this.textoIngresado.trim(),
        codigoTipoFiltro: this.opcionSeleccionada.codigo,
        tipoFiltro: this.opcionSeleccionada.descripcion
      };
    } else if (this.opcionSeleccionada.tipoOpcion === TipoOpcion.COMBO) {
      this.filtroSalida = {
        value: this.valorCombo,
        codigoTipoFiltro: this.opcionSeleccionada.codigo,
        tipoFiltro: this.opcionSeleccionada.descripcion
      };
    }
    this.textoIngresado = null;
    this.valorCombo = null;
    this.enabledButton = true;
    this.busquedaSimpleEvent.emit(this.filtroSalida);
  }

  public onChangeCombo(): void {
    this.validarBotonBuscar();
  }

  public onChangeTextoIngresado(): void {
    this.validarBotonBuscar();
  }

  public onMostrarBusquedaAvanzada(): void {
    this.mostrarBusquedaAvanzadaEvent.emit();
  }

  public onSeleccionarOpcion(opcion: CustomFiltroBasicoData, nroOpcion: number): void {
    this.listClicked = nroOpcion;
    this.enabledButton = true;
    this.textoIngresado = null;
    this.valorCombo = null;
    this.filtroSalida = null;
    this.opcionSeleccionada = opcion;
  }

  private validarBotonBuscar(): void {
    if (this.opcionSeleccionada.tipoOpcion === TipoOpcion.TEXTO) {
      this.enabledButton = !(this.textoIngresado !== null && this.textoIngresado !== undefined && this.textoIngresado !== '');
    } else if (this.opcionSeleccionada.tipoOpcion === TipoOpcion.NUMERICO) {
      const regNumeros = new RegExp('^[0-9]+$');
      this.enabledButton = !regNumeros.test(this.textoIngresado.trim());
    } else if (this.opcionSeleccionada.tipoOpcion === TipoOpcion.COMBO) {
      this.enabledButton = !(this.valorCombo !== null && this.valorCombo !== undefined);
    }
  }

}
