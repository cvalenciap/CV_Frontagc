import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { Response } from 'src/app/models/response';
import { RequestItem } from 'src/app/models/request/request-item';
import { Parametro } from 'src/app/models/enums/parametro';
import { ItemApiService } from 'src/app/services/impl/item-api.service';
import { BusquedaItemSesionService } from '../../services/busqueda-item-sesion.service';
import { Item } from 'src/app/models/item';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';

@Component({
  selector: 'app-agregar-editar-item',
  templateUrl: './agregar-editar-item.component.html',
  styleUrls: ['./agregar-editar-item.component.scss']
})
export class AgregarEditarItemComponent implements OnInit, OnDestroy {

  estado: boolean;
  item: Item;
  salirOpcionItem: boolean;
  public loading = false;

  cambiaEstado(): void {
    this.estado = !this.estado;
  }

  constructor(private itemApiService: ItemApiService,
    private router: Router,
    private toastrService: ToastrService,
    private toastrUtilService: ToastrUtilService,
    private busquedaItemSesionService: BusquedaItemSesionService) { }


  formularioValido(): boolean {
    let retorno: boolean = true;
    if (!this.item.descripcion) {
      this.toastrUtilService.showWarning(Mensajes.MENSAJE_VALIDACION_ITEM);
      retorno = false;
    }
    return retorno;
  }

  guardar(): void {
    this.loading = true;
    const credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    const requestItem: RequestItem = {};
    if (this.formularioValido()) {
      if (this.item.id) {
        requestItem.idItem = this.item.id;
        requestItem.descripcion = this.item.descripcion.trim();
        requestItem.estado = this.estado ? Parametro.ACTIVO : Parametro.INACTIVO;
        requestItem.usuarioModificacion = credenciales.usuario;
        this.loading = false;
        this.modificarItem(requestItem);
      } else {
        requestItem.descripcion = this.item.descripcion.trim();
        requestItem.usuarioCreacion = credenciales.usuario;
        this.loading = false;
        this.registrarItem(requestItem);
      }
    }
  }

  modificarItem(requestItem: RequestItem) {
    this.loading = true;
    this.itemApiService.modificarItem(requestItem).subscribe((response: Response) => {
      if (response.estado === 'ERROR') {
        this.toastrUtilService.showError(response.error.mensaje);
      } else {
        this.toastrUtilService.showSuccess(Mensajes.MENSAJE_OK_MODIFICAR_ITEM);
        this.salirOpcionItem = false;
        this.loading = false;
        this.router.navigate(['/mantenimiento/item']);
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  registrarItem(requestItem: RequestItem) {
    this.loading = true;
    this.itemApiService.registrarItem(requestItem).subscribe((response: Response) => {
      if (response.estado === 'ERROR') {
        this.toastrService.error(response.error.mensaje, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        this.loading = false;
      } else {
        this.toastrUtilService.showSuccess(Mensajes.MENSAJE_OK_CREAR_ITEM);
        this.salirOpcionItem = true;
        this.router.navigate(['/mantenimiento/item']);
        this.loading = false;
      }
    },
      (error: any) => {
        this.loading = false;
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('objetoItem');
    if (this.salirOpcionItem) {
      this.busquedaItemSesionService.accionBusqueda = false;
      this.busquedaItemSesionService.accionVerDetalle = false;
      this.busquedaItemSesionService.requestItem = null;
      this.busquedaItemSesionService.paginacion = null;
    }
  }

  ngOnInit(): void {
    this.salirOpcionItem = true;
    this.item = JSON.parse(sessionStorage.getItem('objetoItem'));
    if (this.item) {
      this.busquedaItemSesionService.accionVerDetalle = true;
      if (this.item.estado === Parametro.ACTIVO) {
        this.estado = true;
      } else {
        this.estado = false;
      }
    } else {
      this.busquedaItemSesionService.accionVerDetalle = false;
      this.item = {};
    }
  }

  regresar(): void {
    this.salirOpcionItem = false;
    this.router.navigate(['/mantenimiento/item']);
  }

}
