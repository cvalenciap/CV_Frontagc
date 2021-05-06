import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Estado } from 'src/app/models/interface/estado';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { CargoOpenRequest } from 'src/app/models/request/cargo-open-request';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';

@Component({
  selector: 'app-busqueda-avanzada-cargos',
  templateUrl: './busqueda-avanzada-cargos.component.html',
  styleUrls: ['./busqueda-avanzada-cargos.component.scss']
})
export class BusquedaAvanzadaCargosComponent implements OnInit {

  @Output() busquedaAvanzadaEvent = new EventEmitter();
  @Output() cerrarModalEvent = new EventEmitter();

  comboEstados: Estado[] = [];
  cargoRequest: CargoOpenRequest = {};
  dataFiltrosSeleccionados: FiltroSalida[] = [];
  flagFiltroSeleccionado: boolean = false;

  constructor(private toastrUtil: ToastrUtilService) { }

  ngOnInit() {
    this.cargarCombos();
  }

  private agregarDataFiltro(campo: string, value: any): void {
    this.eliminarFiltroRepetido(campo);
    const filtro: FiltroSalida = { tipoFiltro: campo, codigoTipoFiltro: 0, value };
    this.dataFiltrosSeleccionados.push(filtro);
    this.dataFiltrosSeleccionados.sort((a, b) => {
      if (a.tipoFiltro > b.tipoFiltro) { return 1; }
      if (a.tipoFiltro < b.tipoFiltro) { return -1; }
      return 0;
    });
  }

  private buscarIndiceFiltroRepetido(campo: string) {
    for (let i = 0; i < this.dataFiltrosSeleccionados.length; i++) {
      const item = this.dataFiltrosSeleccionados[i];
      if (item.tipoFiltro === campo) {
        return i;
      }
    }
  }

  public busquedaAvanzada() {
    if (this.habilitarBusqueda()) {
      this.busquedaAvanzadaEvent.emit({
        request: this.cargoRequest,
        filtros: this.dataFiltrosSeleccionados
      });
    } else {
      this.toastrUtil.showWarning(Mensajes.MSG_FILTROS_NO_SELECCIONADOS);
    }
  }

  private cargarCombos(): void {
    this.comboEstados = [{ id: 'A', descripcion: 'ACTIVO' }, { id: 'I', descripcion: 'INACTIVO' }];
  }

  public cerrarModal() {
    this.cerrarModalEvent.emit();
  }

  private eliminarDataFiltro(filtro: string): void {
    let indiceEncontrado = -1;
    for (let index = 0; index < this.dataFiltrosSeleccionados.length; index++) {
      const element = this.dataFiltrosSeleccionados[index];
      if (element.tipoFiltro === filtro) {
        indiceEncontrado = index;
        break;
      }
    }
    if (indiceEncontrado >= 0) {
      this.dataFiltrosSeleccionados.splice(indiceEncontrado, 1);
    }
  }

  private eliminarFiltroRepetido(campo: string): void {
    const indice: number = this.buscarIndiceFiltroRepetido(campo);
    if (indice > -1) {
      this.dataFiltrosSeleccionados.splice(indice, 1);
    }
  }

  private habilitarBusqueda(): boolean {
    return (this.cargoRequest.estado !== null && this.cargoRequest.estado !== undefined)
    || (this.cargoRequest.descripcion !== '' && this.cargoRequest.descripcion !== null && this.cargoRequest.descripcion !== undefined);
  }

  public onChangeFiltro(filtro: string, event: any) {
    switch (filtro) {
      case 'Estado':
        if (event !== null && event !== undefined) {
          this.agregarDataFiltro(filtro, event.descripcion);
        } else {
          this.eliminarDataFiltro(filtro);
          this.cargoRequest.estado = null;
        }
        break;
      case 'Descripción':
        this.cargoRequest.descripcion = event.target.value.trim();
        this.agregarDataFiltro(filtro, event.target.value.trim());
        break;
    }
  }

  public onLimpiarFiltros(): void {
    this.dataFiltrosSeleccionados.length = 0;
    this.cargoRequest = {};
  }

}
