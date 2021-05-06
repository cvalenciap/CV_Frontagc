import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa, Oficina } from 'src/app/models';
import { EmpresasService } from 'src/app/services/impl/empresas.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Response } from 'src/app/models/response';
import { Constantes } from 'src/app/models/enums/constantes';
import { Item } from 'src/app/models/item';
import { Parametro } from 'src/app/models/enums/parametro';
import StorageUtil from '../../shared/util/storage-util';

@Component({
  selector: 'app-empresa-asignar-items',
  templateUrl: './empresa-asignar-items.component.html',
  styleUrls: ['./empresa-asignar-items.component.scss']
})
export class EmpresaAsignarItemsComponent implements OnInit {
  empresa: Empresa;
  listaFinal: Item[] = new Array<Item>();
  listaItemDisponibles: Item[] = new Array<Item>();
  listaEmpresaItem: any[] = new Array<Item>();
  listaSeleccionTempLeft: any[] = new Array<Item>();
  listaSeleccionTempRigth: any[] = new Array<Item>();
  loading: boolean = false;

  agregarItems() {
    this.listaSeleccionTempLeft.forEach(element => {
      const indexOfic = this.listaItemDisponibles.indexOf(element, 0);
      element.estadoSeleccion = element.perteneceListaRigth ? Constantes.REGISTRO_NO_SELECCIONADO : Constantes.REGISTRO_ADICIONADO;
      this.listaEmpresaItem.push(element);
      const objItem = this.listaFinal.find(e => e.id === element.id);
      if (objItem) {
        const index = this.listaFinal.indexOf(objItem, 0);
        this.listaFinal.splice(index, 1);
      } else {
        element.estado = Parametro.ACTIVO;
        element.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
        this.listaFinal.push(element);
      }
      this.listaItemDisponibles.splice(indexOfic, 1);
    });
    this.listaSeleccionTempLeft = [];
  }

  constructor(private router: Router,
    private empresasService: EmpresasService,
    private toastrUtilService: ToastrUtilService) { }

  guardar() {
    if (this.listaFinal.length > 0) {
      this.loading = true;
      this.empresasService.registrarEmpresaItem(this.listaFinal, this.empresa.codigo).subscribe(
        (response: Response) => {
          this.loading = false;
          this.toastrUtilService.showSuccess(response.resultado);
          this.reset();
          this.listarEmpresaItem();
        }, (error: any) => {
          this.loading = false;
          this.toastrUtilService.showError(error.error.error.mensaje);
        }
      );
    } else {
      this.toastrUtilService.showSuccess('Se ha guardado los cambios correctamente.');
    }
  }

  listarEmpresaItem() {
    this.empresasService.obtenerListaEmpresaItem(this.empresa.codigo).subscribe((response: Response) => {
      this.listaItemDisponibles = response.resultado.listaItemDisponibles;
      this.listaEmpresaItem = response.resultado.listaEmpresaItem;
      if (this.listaItemDisponibles) {
        this.listaItemDisponibles.forEach(element => {
          element.estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
          Object.defineProperty(element, 'perteneceListaLeft', { value: true });
        });
      }
      if (this.listaEmpresaItem) {
        this.listaEmpresaItem.forEach(element => {
          element.estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
          Object.defineProperty(element, 'perteneceListaRigth', { value: true });
        });
      }
    }, (error: any) => {
      this.toastrUtilService.showError(error.error.error.mensaje);
    });
  }

  ngOnInit() {
    this.empresa = JSON.parse(sessionStorage.getItem('empresaMantenimiento'));
    this.listarEmpresaItem();
  }

  quitarEmpresaItem() {
    this.listaSeleccionTempRigth.forEach(element => {
      const item: Item = this.listaEmpresaItem.find(e => e.id === element.id);
      const indexI = this.listaEmpresaItem.indexOf(item, 0);
      this.listaEmpresaItem.splice(indexI, 1);

      element.estadoSeleccion = element.perteneceListaLeft ? Constantes.REGISTRO_NO_SELECCIONADO : Constantes.REGISTRO_ADICIONADO;
      this.listaItemDisponibles.push(element);

      const objItem = this.listaFinal.find(e => e.id === element.id);
      if (objItem) {
        const index = this.listaFinal.indexOf(objItem, 0);
        this.listaFinal.splice(index, 1);
      } else {
        element.estado = Parametro.INACTIVO;
        element.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
        this.listaFinal.push(element);
      }
    });
    this.listaSeleccionTempRigth = [];
  }

  regresar() {
    sessionStorage.removeItem('empresaMantenimiento');
    this.router.navigate(['/mantenimiento/empresas']);
  }

  reset() {
    this.listaItemDisponibles = [];
    this.listaEmpresaItem = [];
    this.listaSeleccionTempLeft = [];
    this.listaSeleccionTempRigth = [];
    this.listaFinal = [];
  }

  seleccionarItemLeft(item: Item, indice: number) {
    const objItem = this.listaSeleccionTempLeft.find(e => e.id === item.id);
    if (objItem) {
      const index = this.listaSeleccionTempLeft.indexOf(objItem, 0);
      this.listaSeleccionTempLeft.splice(index, 1);
      this.listaItemDisponibles[indice].estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
    } else {
      this.listaSeleccionTempLeft.push(item);
      this.listaItemDisponibles[indice].estadoSeleccion = Constantes.REGISTRO_SELECCIONADO;
    }
  }

  seleccionarItemRigth(item: Item, indice: number) {
    const objItem = this.listaSeleccionTempRigth.find(e => e.id === item.id);
    if (objItem) {
      const index = this.listaSeleccionTempRigth.indexOf(objItem, 0);
      this.listaSeleccionTempRigth.splice(index, 1);
      this.listaEmpresaItem[indice].estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
    } else {
      this.listaSeleccionTempRigth.push(item);
      this.listaEmpresaItem[indice].estadoSeleccion = Constantes.REGISTRO_SELECCIONADO;
    }
  }

}
