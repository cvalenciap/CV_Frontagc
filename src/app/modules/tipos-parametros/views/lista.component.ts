import { Component, OnInit, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Parametro, Paginacion, Response } from 'src/app/models';
import { ResponseParametro } from 'src/app/models/response/response-parametro';
import { RequestParametro } from 'src/app/models/request/request-parametro';
import { ParametrosService } from '../../../services/impl/parametros.service';
import { Estado } from 'src/app/models/enums';
import { BuscarParametroComponent } from '../../dialogs/buscar-parametro/buscar-parametro.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Credenciales } from 'src/app/models/credenciales';
@Component({
  selector: 'tipos-parametros-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss']
})
export class TiposParametrosListaComponent implements OnInit {
  public showMessage: boolean;
  public message: string;

  //items: TipoParametro[];
  @ViewChild('buscar') buscar: ElementRef;
  selectedRow: number;
  loading: boolean;
  requestParam: RequestParametro = new RequestParametro;
  paginacion: Paginacion;
  items: Parametro[] = new Array<Parametro>();
  //Busqueda
  parametroBusqueda: string;
  textoBusqueda: string;
  @ViewChild(BuscarParametroComponent) busquedaAvanzada;
  constructor(private parametrosService: ParametrosService, private localeService: BsLocaleService, private router: Router, private toastr: ToastrService,
    private sanitizer: DomSanitizer) {
    this.loading = false;
    this.selectedRow = -1;
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
    this.parametroBusqueda = 'detalle';
  }

  initValues() {
    this.requestParam.codigo = 0;
    this.requestParam.detalle = 'G';
    this.requestParam.estado = 'G';
    this.showMessage = false;
    this.textoBusqueda = '';
  }
  ngOnInit() {
    this.initValues();
    this.getTipos();
  }

  public permisos(permiso: string) {
    if ((sessionStorage.permisos).includes(this.router.url + permiso)) {
      return false;
    } else {
      return true;
    }
  }

  getTipos() {
    //inicio
    let busqueda = localStorage.getItem("texfinal");
    let parametrosbusque = localStorage.getItem("paraFinal");
    if (busqueda != null) {
      this.textoBusqueda = busqueda;
      this.parametroBusqueda = parametrosbusque;
      localStorage.removeItem("texfinal");
      localStorage.removeItem("paraFinal");
    }
    //primero
    if (this.textoBusqueda != null) {
      localStorage.setItem("textoBusqueda", this.textoBusqueda);
      localStorage.setItem("parametroBusqueda", this.parametroBusqueda);
    }
    //Fin

    switch (this.parametroBusqueda) {
      case 'detalle':
        if (this.textoBusqueda && this.textoBusqueda.trim() != "")
          this.requestParam.detalle = this.textoBusqueda;
        else
          this.initValues();
        break;
    }
    this.loading = true;
    this.obtenerParametros();
  }
  obtenerParametros() {
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestParam));
    this.parametrosService.consultarTipoParametros(this.requestParam
      , this.paginacion.pagina
      , this.paginacion.registros)
      .subscribe((data: ResponseParametro) => {
        this.loading = false;
        this.items = data.resultado;
        this.paginacion = data.paginacion;
      },
      (error) => this.controlarError(error)
      );
  }
  OnConfigurarBusqueda() {
    switch (this.parametroBusqueda) {
      case "detalle": {
        this.buscar.nativeElement.maxLength = 20;
        this.buscar.nativeElement.placeholder = "Nombre";
        //this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 ;
        break;
      }
      case "descripcion": {
        this.buscar.nativeElement.maxLength = 1000;
        this.buscar.nativeElement.placeholder = "Descripción";
        this.buscar.nativeElement.onkeypress = (e) => (e.charCode == 32) || (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122);
        break;
      }
    }
    this.textoBusqueda = null
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getTipos();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getTipos();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getTipos();
  }
  selectRow(index): void {
    this.selectedRow = index;
  }

  search(): void {
    this.loading = true;
  }
  showError() {
    this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
  }
  OnEditar(i: number) {
    this.router.navigate([`mantenimiento/tipos-parametros/${this.items[i].codigo}`]);
  }
  OnVerDetalle(i: number) {
    this.router.navigate([`mantenimiento/tipos-parametros/editar/${this.items[i].codigo}`]);
  }
  OnEliminar(i: number) {
    this.requestParam.codigo = this.items[i].codigo;

    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem("credenciales");
    item = JSON.parse(credenciales);
    this.requestParam.usuario = item.usuario;

    this.parametrosService.eliminarTipoParametro(this.requestParam).subscribe(
      (response: Response) => {
        if (response.estado == "OK") {
          this.toastr.success('Registro eliminado', 'Acción completada', { closeButton: true });
          this.initValues();
          this.getTipos();
        } else {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
        }
      },
      (error) => this.controlarError(error)
    );
  }

  OnBusquedaAvanzada() {
    this.initValues();
    this.parametroBusqueda = 'detalle';
    this.requestParam.detalle = this.busquedaAvanzada.nombre;
    this.requestParam.estado = this.busquedaAvanzada.estado ? this.busquedaAvanzada.estado : 'G';
    this.obtenerParametros();
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  public leaveFilters(): void {
    this.initValues();
    this.parametroBusqueda = 'detalle';
    this.paginacion.pagina = 1;
    this.getTipos();
  }

  public generateInfoMessage(requestParam: RequestParametro): string {
    let message = '<strong>Búsqueda Por: </strong>';
    /*if (this.textoBusqueda !== '') {
      message = message + '<br/><strong>Nombre parámetro: </strong> <parrafo>' + this.textoBusqueda + '</parrafo>' + ' ';
      this.showMessage = true;
    } else {
    }*/
    if (requestParam.detalle !== undefined && requestParam.detalle !== 'G') {
      message = message + '<br/><strong>Nombre parámetro: </strong> <parrafo>' + requestParam.detalle + '</parrafo>' + ' ';
      this.showMessage = true;
    }
    if (requestParam.estado !== undefined && requestParam.estado !== 'G') {
      message = message + '<br/><strong>Estado parámetro: </strong> <parrafo>' + requestParam.estado + '</parrafo>' + ' ';
      this.showMessage = true;
    }
    return message;
  }

}
