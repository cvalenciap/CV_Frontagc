import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { Cargo } from 'src/app/models/interface/cargo';
import { Actividad } from 'src/app/models';
import { CargoApiService } from 'src/app/services/impl/cargo-api.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseObject } from 'src/app/models/response/response-object';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { ResultadoCarga } from 'src/app/models/enums/resultado-carga.enum';

@Component({
  selector: 'app-asignar-cargos',
  templateUrl: './asignar-cargos.component.html',
  styleUrls: ['./asignar-cargos.component.scss']
})
export class AsignarCargosComponent implements OnInit {

  actividadesAgregar: Actividad[] = [];
  actividadesAsignadas: Actividad[] = [];
  actividadesDisponibles: Actividad[] = [];
  actividadesQuitar: Actividad[] = [];
  cargoSeleccionado: Cargo = {};

  loading: boolean = false;

  constructor(private router: Router,
    private cargoApi: CargoApiService,
    private toastrUtil: ToastrUtilService) {
  }

  ngOnInit() {
    this.obtenerActividades();
  }

  private agregarToListaDestino(listaDestino: Actividad[], listaSeleccionados: Actividad[]): void {
    for (let i = 0; i < listaSeleccionados.length; i++) {
      const element = listaSeleccionados[i];
      listaDestino.push(element);
    }
  }

  private buscarIndice(listaActividad: Actividad[], actividad: Actividad): number {
    let indice: number = -1;
    for (let index = 0; index < listaActividad.length; index++) {
      const element = listaActividad[index];
      if (element.codigo === actividad.codigo) {
        indice = index;
        break;
      }
    }
    return indice;
  }

  private agregarActividad(lista: Actividad[], actividad: Actividad): void {
    lista.push(actividad);
  }

  private deseleccionarTodo(lista: Actividad[]): void {
    for (let idx = 0; idx < lista.length; idx++) {
      const actividad = lista[idx];
      actividad.seleccionado = false;
    }
  }

  private eliminarActividad(lista: Actividad[], indice: number): void {
    lista.splice(indice, 1);
  }

  private limpiarLista(lista: Actividad[]): void {
    lista.length = 0;
  }

  private async obtenerActividades() {
    this.cargoSeleccionado = StorageUtil.recuperarObjetoSession('cargoBandejaSeleccionado');
    this.actividadesAsignadas = this.cargoSeleccionado.actividades;
    this.loading = true;
    await this.cargoApi.obtenerActividadesDisponibles(this.cargoSeleccionado.codigo).toPromise()
      .then((response: ResponseObject) => {
        if (response.estado === ResponseStatus.OK) {
          this.actividadesDisponibles = response.resultado;
        } else {
          this.toastrUtil.showError(response.mensaje);
        }
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.loading = false;
      });
  }

  public onAgregarItems(): void {
    if (this.actividadesAgregar.length > 0) {
      this.quitarDeListaOrigen(this.actividadesDisponibles, this.actividadesAgregar);
      this.setAgregado(this.actividadesAgregar);
      this.agregarToListaDestino(this.actividadesAsignadas, this.actividadesAgregar);
      this.limpiarLista(this.actividadesAgregar);
    } else {
      this.toastrUtil.showWarning(Mensajes.MSG_LISTA_AGREGAR_VACIA);
    }
  }

  public async OnGuardarCambios() {
    this.cargoSeleccionado.actividades = this.actividadesAsignadas;
    this.loading = true;
    await this.cargoApi.actualizarActividadesCargo(this.cargoSeleccionado)
      .toPromise()
      .then((response: ResponseObject) => {
        if (response.estado === ResponseStatus.OK) {
          if (response.resultado === ResultadoCarga.CORRECTO) {
            this.setEstadoVacio(this.actividadesAsignadas);
            this.setEstadoVacio(this.actividadesDisponibles);
            this.limpiarLista(this.actividadesQuitar);
            this.limpiarLista(this.actividadesAgregar);
            this.toastrUtil.showSuccess(response.mensaje);
          } else {
            this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
          }
        } else {
          this.toastrUtil.showError(response.error.mensaje);
        }
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.loading = false;
      });
  }

  public onRegresarListado(): void {
    this.router.navigate(['/mantenimiento/cargos-open']);
  }

  public onQuitarItems(): void {
    if (this.actividadesQuitar.length > 0) {
      this.quitarDeListaOrigen(this.actividadesAsignadas, this.actividadesQuitar);
      this.setRetirado(this.actividadesQuitar);
      this.agregarToListaDestino(this.actividadesDisponibles, this.actividadesQuitar);
      this.limpiarLista(this.actividadesQuitar);
    } else {
      this.toastrUtil.showWarning(Mensajes.MSG_LISTA_QUITAR_VACIA);
    }
  }

  private quitarDeListaOrigen(listaorigen: Actividad[], listaSeleccionados: Actividad[]): void {
    for (let i = 0; i < listaSeleccionados.length; i++) {
      const seleccionado = listaSeleccionados[i];
      const indice = this.buscarIndice(listaorigen, seleccionado);
      this.eliminarActividad(listaorigen, indice);
    }
  }

  public seleccionarAsignado(item: Actividad): void {
    this.deseleccionarTodo(this.actividadesDisponibles);
    this.limpiarLista(this.actividadesAgregar);
    if (item.seleccionado) {
      // item.seleccionado = !item.seleccionado;
      this.setSeleccionado(item);
    } else {
      item.seleccionado = true;
    }
    const indice: number = this.buscarIndice(this.actividadesQuitar, item);
    if (indice >= 0) {
      this.eliminarActividad(this.actividadesQuitar, indice);
    } else {
      this.agregarActividad(this.actividadesQuitar, item);
    }
  }

  public seleccionarDisponible(item: Actividad): void {
    this.deseleccionarTodo(this.actividadesAsignadas);
    this.limpiarLista(this.actividadesQuitar);
    if (item.seleccionado) {
      // item.seleccionado = !item.seleccionado;
      this.setSeleccionado(item);
    } else {
      item.seleccionado = true;
    }
    const indice: number = this.buscarIndice(this.actividadesAgregar, item);
    if (indice >= 0) {
      this.eliminarActividad(this.actividadesAgregar, indice);
    } else {
      this.agregarActividad(this.actividadesAgregar, item);
    }
  }

  private setEstadoVacio(lista: Actividad[]): void {
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      element.seleccionado = false;
      element.agregado = false;
      element.retirado = false;
    }
  }

  private setAgregado(lista: Actividad[]): void {
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      element.seleccionado = false;
      element.agregado = true;
    }
  }

  private setRetirado(lista: Actividad[]): void {
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      element.seleccionado = false;
      element.retirado = true;
    }
  }

  private setSeleccionado(item: Actividad): void {
    item.seleccionado = !item.seleccionado;
    item.retirado = false;
    item.agregado = false;
  }

}
