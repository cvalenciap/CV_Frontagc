import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Oficina } from 'src/app/models';
import { Item } from 'src/app/models/item';
import { ItemApiService } from 'src/app/services/impl/item-api.service';
import { Response } from 'src/app/models/response';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ItemOficina } from 'src/app/models/item-oficina';
import { Parametro } from 'src/app/models/enums/parametro';
import { Constantes } from 'src/app/models/enums/constantes';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Component({
  selector: 'app-asignar-cargos',
  templateUrl: './asignar-oficinas-item.component.html',
  styleUrls: ['./asignar-oficinas-item.component.scss']
})
export class AsignarOficinasItemComponent implements OnInit {
  item: Item;
  listaFinal: ItemOficina[] = new Array<ItemOficina>();
  listaItemOficinas: any[] = new Array<ItemOficina>();
  listaOficinasDisponibles: Oficina[] = new Array<Oficina>();
  listaSeleccionTempLeft: any[] = new Array<Oficina>();
  listaSeleccionTempRigth: any[] = new Array<Oficina>();
  loading: boolean = false;

  agregarOficinas() {
    this.listaSeleccionTempLeft.forEach(element => {
      const objItemOficina = this.listaFinal.find(e => e.oficina.codigo === element.codigo);
      const itemOficina: ItemOficina = { item: this.item, oficina: element };

      itemOficina.estadoSeleccion = element.perteneceListaRigth ? Constantes.REGISTRO_NO_SELECCIONADO : Constantes.REGISTRO_ADICIONADO;
      this.listaItemOficinas.push(itemOficina);
      if (objItemOficina) {
        const index = this.listaFinal.indexOf(objItemOficina, 0);
        this.listaFinal.splice(index, 1);
      } else {
        itemOficina.estado = { id: Parametro.ACTIVO.toString() };
        itemOficina.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
        this.listaFinal.push(itemOficina);
      }
      const indexOfic = this.listaOficinasDisponibles.indexOf(element, 0);
      this.listaOficinasDisponibles.splice(indexOfic, 1);
    });
    this.listaSeleccionTempLeft = [];
  }

  constructor(private router: Router, private itemApiService: ItemApiService, private toastrUtilService: ToastrUtilService) { }

  guardar() {
    if (this.listaFinal.length > 0) {
      this.loading = true;
      this.itemApiService.registrarItemOficina(this.listaFinal).subscribe(
        (response: Response) => {
          this.loading = false;
          this.toastrUtilService.showSuccess(response.resultado);
          this.reset();
          this.listarItemOficinaMantenimiento();
        }, (error: any) => {
          this.loading = false;
          this.toastrUtilService.showError(error.error.error.mensaje);
        }
      );
    } else {
      this.toastrUtilService.showSuccess('Se ha guardado los cambios correctamente.');
    }
  }

  listarItemOficinaMantenimiento() {
    this.item = JSON.parse(sessionStorage.getItem('itemMantenimiento'));
    this.itemApiService.listarItemOficinas(this.item.id).subscribe((response: Response) => {
      this.listaOficinasDisponibles = response.resultado.listaOficinasDisponibles;
      this.listaItemOficinas = response.resultado.listaItemOficinas;
      if (this.listaOficinasDisponibles) {
        this.listaOficinasDisponibles.forEach(element => {
          element.estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
          Object.defineProperty(element, 'perteneceListaLeft', { value: true });
        });
      }
      if (this.listaItemOficinas) {
        this.listaItemOficinas.forEach(element => {
          element.estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
          Object.defineProperty(element.oficina, 'perteneceListaRigth', { value: true });
        });
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  ngOnInit() {
    this.listarItemOficinaMantenimiento();
  }

  permisos(permiso: string) {
    if ((sessionStorage.permisos).includes(this.router.url + permiso)) {
      return false;
    } else {
      return true;
    }
  }

  quitarOficinaItem() {
    let descOficinaValida: string;
    let errorValidacion: boolean = false;
    for (const element of this.listaSeleccionTempRigth) {
      const itemOficina: ItemOficina = this.listaItemOficinas.find(e => e.oficina.codigo === element.codigo);
      if (itemOficina.cantPersExtOfic > 0) {
        errorValidacion = true;
        descOficinaValida = itemOficina.oficina.descripcion;
        break;
      }
    }
    if (!errorValidacion) {
      this.listaSeleccionTempRigth.forEach(element => {
        const itemOficina: ItemOficina = this.listaItemOficinas.find(e => e.oficina.codigo === element.codigo);
        const indexIO = this.listaItemOficinas.indexOf(itemOficina, 0);
        this.listaItemOficinas.splice(indexIO, 1);
  
        element.estadoSeleccion = element.perteneceListaLeft ? Constantes.REGISTRO_NO_SELECCIONADO : Constantes.REGISTRO_ADICIONADO;
        this.listaOficinasDisponibles.push(element);
  
        const objItemOficina = this.listaFinal.find(e => e.oficina.codigo === element.codigo);
        if (objItemOficina) {
          const index = this.listaFinal.indexOf(objItemOficina, 0);
          this.listaFinal.splice(index, 1);
        } else {
          itemOficina.estado = { id: Parametro.INACTIVO.toString() };
          itemOficina.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
          this.listaFinal.push(itemOficina);
        }
      });
      this.listaSeleccionTempRigth = [];
    } else {
      this.toastrUtilService.showWarning('Ya existe personal activo en la oficina ' + descOficinaValida + ' del ítem a desasignar.');
    }

  }

  regresar(): void {
    sessionStorage.removeItem('itemMantenimiento');
    this.router.navigate(['/mantenimiento/item']);
  }

  reset() {
    this.listaOficinasDisponibles = [];
    this.listaItemOficinas = [];
    this.listaSeleccionTempLeft = [];
    this.listaSeleccionTempRigth = [];
    this.listaFinal = [];
  }

  seleccionarOficinaLeft(oficina: Oficina, indice: number) {
    const objOficina = this.listaSeleccionTempLeft.find(e => e.codigo === oficina.codigo);
    if (objOficina) {
      const index = this.listaSeleccionTempLeft.indexOf(oficina, 0);
      this.listaSeleccionTempLeft.splice(index, 1);
      this.listaOficinasDisponibles[indice].estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
    } else {
      this.listaSeleccionTempLeft.push(oficina);
      this.listaOficinasDisponibles[indice].estadoSeleccion = Constantes.REGISTRO_SELECCIONADO;
    }
  }

  seleccionarOficinaRigth(oficina: Oficina, indice: number) {
    const objOficina = this.listaSeleccionTempRigth.find(e => e.codigo === oficina.codigo);
    if (objOficina) {
      const index = this.listaSeleccionTempRigth.indexOf(oficina, 0);
      this.listaSeleccionTempRigth.splice(index, 1);
      this.listaItemOficinas[indice].estadoSeleccion = Constantes.REGISTRO_NO_SELECCIONADO;
    } else {
      this.listaSeleccionTempRigth.push(oficina);
      this.listaItemOficinas[indice].estadoSeleccion = Constantes.REGISTRO_SELECCIONADO;
    }
  }

}
