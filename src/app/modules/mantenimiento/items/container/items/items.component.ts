import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoBusquedaItemComponent } from '../../components/info-busqueda-item/info-busqueda-item.component';
import { Response } from 'src/app/models/response';
import { ItemApiService } from 'src/app/services/impl/item-api.service';
import { BusquedaBasicaItemComponent } from '../../components/busqueda-basica/busqueda-basica-item.component';
import { BusquedaItemSesionService } from '../../services/busqueda-item-sesion.service';
import { Item } from 'src/app/models/item';
import { RequestItem } from 'src/app/models/request/request-item';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { SweetAlertOptions } from 'sweetalert2';
import { BusquedaAvanzadaItemComponent } from '../../components/busqueda-avanzada/busqueda-avanzada-item.component';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  alertOptionBuscarAvanzado: SweetAlertOptions = {};
  listaItems: Item[];
  requestItem: RequestItem;
  requestItemBusquedaAvanzada: RequestItem;
  @ViewChild(BusquedaBasicaItemComponent) busquedaBasicaItem: BusquedaBasicaItemComponent;
  @ViewChild(InfoBusquedaItemComponent) InfoBusquedaItem: InfoBusquedaItemComponent;
  @ViewChild(BusquedaAvanzadaItemComponent) busquedaAvanzadaItem: BusquedaAvanzadaItemComponent;
  mensajeValidaBusquedaAvanzada: string = null;

  buscar(requestItem: RequestItem, tipoBusqueda: string): void {
    if (tipoBusqueda === 'BASICA') {
      this.requestItem = ({ descripcion: requestItem.descripcion, estado: '' });
      if (this.requestItem.descripcion) {
        this.InfoBusquedaItem.mostrarFiltroAplicado = true;
        this.busquedaItemSesionService.requestItem = this.requestItem;
      } else {
        this.InfoBusquedaItem.mostrarFiltroAplicado = false;
        this.resetRequestItem();
        this.busquedaItemSesionService.requestItem = null;
      }
    } else if (tipoBusqueda === 'AVANZADA') {
      this.requestItem = requestItem;
      this.busquedaBasicaItem.borrarFiltro();
      if (this.requestItem.descripcion || this.requestItem.estado) {
        this.InfoBusquedaItem.mostrarFiltroAplicado = true;
        this.busquedaItemSesionService.requestItem = this.requestItem;
      } else {
        this.InfoBusquedaItem.mostrarFiltroAplicado = false;
      }
    }
    this.itemApiService.listarItems(requestItem).subscribe((response: Response) => {
      this.listaItems = response.resultado;
      if (tipoBusqueda === 'BUSQUEDA-SESION') {
        this.InfoBusquedaItem.mostrarFiltroAplicado = true;
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  cancelar() {
    this.requestItemBusquedaAvanzada = {};
  }

  constructor(private itemApiService: ItemApiService,
    public router: Router,
    private busquedaItemSesionService: BusquedaItemSesionService,
    private toastrUtilService: ToastrUtilService) { }


  eliminar(item: Item): void {
    const credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    const request: RequestItem = {};
    request.idItem = item.id;
    request.descripcion = item.descripcion;
    request.estado = item.estado;
    request.usuarioModificacion = credenciales.usuario;
    this.itemApiService.eliminarItem(request).subscribe((response: Response) => {
      if (response.estado === 'ERROR') {
        this.toastrUtilService.showError(response.error.mensaje);
      } else {
        this.toastrUtilService.showSuccess(Mensajes.MENSAJE_OK_ELIMINAR_ITEM);
        this.resetRequestItem();
        this.buscar(this.requestItem, 'DEFAULT');
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  limpiarFiltro(item: any): void {
    this.busquedaBasicaItem.borrarFiltro();
    this.resetRequestItem();
    this.buscar(this.requestItem, 'DEFAULT');
    this.busquedaItemSesionService.requestItem = null;
  }

  ngOnInit(): void {
    this.resetRequestItem();
    if (this.busquedaItemSesionService.requestItem) {
      this.requestItem = this.busquedaItemSesionService.requestItem;
      this.buscar(this.requestItem, 'BUSQUEDA-SESION');
    } else {
      this.buscar(this.requestItem, 'DEFAULT');
    }

    this.alertOptionBuscarAvanzado = {
      title: 'Búsqueda Avanzada',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Buscar',
      focusCancel: false,
      focusConfirm: true,
      preConfirm: (e) => {
        if (Object.keys(this.busquedaAvanzadaItem.requestItem).length > 0) {
          return true;
        } else {
          this.toastrUtilService.showWarning('Debe seleccionar por lo menos un filtro.');
          return false;
        }
      }
    };
  }

  resetRequestItem(): void {
    this.requestItem = ({ descripcion: '', estado: 'A' });
  }
}
