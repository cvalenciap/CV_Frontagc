import { Component, OnInit, Output, ViewChild} from '@angular/core';
import { ParametrosCargaBandeja, Response, Paginacion, RequestReportes, Empresa, Oficina, Actividad, Rendimiento, Parametro } from 'src/app/models';
import { ReportesMonitoreoService } from '../../../services/impl/reportes-monitoreo.service';
import { ToastrService } from 'ngx-toastr';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { ReportesModule } from '../reportes.module';
import { InsertarRendimientoComponent } from './registro-rendimientos/insertar-rendimiento.component';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ValidacionService } from 'src/app/services/impl/validacion';
import { MonitoreoService } from 'src/app/services/impl/monitoreo.service';
import { ResponseObject } from 'src/app/models/response/response-object';
@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.component.html',
  styleUrls: ['./rendimiento.component.scss']
})
export class RendimientoComponent implements OnInit {

  private paginacion: Paginacion;
  private itemDelete: number;
  arrayItems: Array<{codigo: number, detalle: string}>;
  item: Parametro = new Parametro();
  editando: Boolean = false;

  @Output()
  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  itemEmpresa: Empresa = new Empresa();
  itemOficina: Oficina = new Oficina();
  itemActividad: Actividad = new Actividad();
  listaOficina: Oficina[] = new Array<Oficina>();
  listaActividad: Actividad[] = new Array<Actividad>();
  isLoading: boolean = false;
  loading: boolean = false;
  items: Array<Rendimiento> = new Array<Rendimiento>();
  mensaje:string;
  itemsCopy: Array<Rendimiento> = new Array<Rendimiento>();
  subaticList: String[] = new Array<String>();
  listSubacti: String[] = new Array<String>();
  rendimientoAnterior: Rendimiento = new Rendimiento();
  subactividad: string;
  requestBusqueda: Rendimiento = new Rendimiento();

  suministroBlock:number = 0;
  cuadrillaBlock:number = 0;
  trabajadorBlock:number = 0;
 /*  @Output()
  parametros: any; */
 /*  @Output()
  parametrosSwal: any; */
  @Output()
  oficina: Oficina = new Oficina();
  @Output()
  empresa: Empresa = new Empresa();
  @Output()
  actividad: Actividad = new Actividad();
  @ViewChild(InsertarRendimientoComponent) registrar;
  @ViewChild('registrar') registrarModal: SwalComponent;
  constructor(private toastr: ToastrService,
    private reporteMonitoreo: ReportesMonitoreoService,
    private perfil: PerfilService,
    private validacionNumero: ValidacionService,
    private monitoreoService: MonitoreoService) {

    this.listaParametros = new ParametrosCargaBandeja();
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });

    this.suministroBlock = 0;
    this.cuadrillaBlock = 0;
    this.trabajadorBlock = 0;
    }

  ngOnInit() {
    this.consultarParametros();
    /* this.empresa = this.listaParametros.listaEmpresa[0];
    this.oficina =  this.lista.oficinas[0]; */
   /*  this.parametros = {itemActividad: this.listaParametros.listaActividad[0], itemOficina: this.lista.oficinas[0],
      itemEmpresa: this.listaParametros.listaEmpresa[0], itemSubactividad: ''
    }; */
 /*    this.parametrosSwal = {listaActividad: this.listaParametros.listaActividad, listaOficina: this.lista.oficinas};
    this.parametrosSwal = JSON.stringify(this.parametrosSwal); */
  /*   this.parametros = JSON.stringify(this.parametros); */

    this.arrayItems = [
      {codigo: 0, detalle: 'Todos'},
      {codigo: 1, detalle: 'Ítem 1'},
      {codigo: 2, detalle: 'Ítem 2'},
      {codigo: 3, detalle: 'Ítem 3'},
      {codigo: 4, detalle: 'Ítem 4'},
  ];

  }

  private consultarParametros() {/*
    this.listaParametros = this.detalleBandejaService.obtenerParametrosBandeja(); */
    this.monitoreoService.consultarParametrosBusquedaAsignaciones().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
      }
    );

    this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
  }
  OnListarRendimiento()/* : void */ {
    this.isLoading = true;
    const this_ = this;
    const request: Rendimiento = new Rendimiento();
    if (this.actividad && this.item.codigo>=0) {

    request.v_idacti = this.actividad.codigo;
    request.item = this.item;
    this.requestBusqueda = request;
    /* request.n_idofic = this.oficina.codigo;
    request.n_idcontrati = this.empresa.codigo; */

    this.reporteMonitoreo.listarRendimiento(this.requestBusqueda).subscribe(
      (response: Response) => {
        if (response.resultado) {
        this.items = (response.resultado) as Array<Rendimiento>;
        this.itemDelete = this.item.codigo;
        this_.isLoading = false;
        this.paginacion = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: this.items.length,
          totalPaginas: this.items.length
        })
      }else{
        this.isLoading = false;
        this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        this.paginacion = new Paginacion({pagina: 1, registros: 10})
        this.items = new Array<Rendimiento>();
      }
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
    } else {
      this.isLoading = false;
      this.toastr.error("Debe llenar todos los filtros obligatorios", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      return false;
    }
  }

  private suscribirLoading(): void {
    this.reporteMonitoreo.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
  }

  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    this.isLoading = false;
  }
  OnChange(i, event) {
    /* this.parametros = JSON.parse(this.parametros); */
    switch (i) {
      case 1 :/*
        this.parametros.itemEmpresa = event as Empresa; */
        break;
      case 2 :/*
        this.parametros.itemOficina = event as Oficina; */
        break;
      case 3 :
        /* this.parametros.itemActividad = event as Actividad; */
        this.actividad.descripcion = event.descripcion;
        break;
      case 4 :
        this.item.detalle = event.detalle;
        console.log(this.item.detalle);
        break;
      default:
        break;
    }

    /* this.parametros = JSON.stringify(this.parametros); */
    /* console.log(this.parametros); */
  }

  onCancelRegistrar() {
    this.registrarModal.nativeSwal.close();
  }

  obtenerSubactividad() {
    const this_ = this;
    const request: ReportesRequest = new ReportesRequest();
    request.v_idacti = this.actividad.codigo;
    request.n_idofic = this.oficina.codigo;
    this.reporteMonitoreo.obtenerSubactividades(request).subscribe(
      (response: Response) => {
        if (response.resultado.length !== '') {
          this_.subaticList = [];
          this_.listSubacti = [];
          for (let i = 0; i < response.resultado.length; i++) {
            this_.listSubacti.push(JSON.parse(JSON.parse(JSON.stringify(response.resultado[i]))));
          }
           this_.subaticList = this_.listSubacti;
/*            this_.parametros = JSON.parse(this.parametros);
           this_.parametros.itemSubactividad = this_.subaticList;
           this_.parametros = JSON.stringify(this_.parametros); */
        } else {
          this_.subaticList = [];
        }
      },
      (error) => this.controlarError(error)
    );
  }

  listarItems(event) {
    this.mensaje = event;
    if (this.requestBusqueda.v_idacti) {
    this.isLoading = true;
    const this_ = this;
      this.reporteMonitoreo.listarRendimiento(this.requestBusqueda).subscribe(
        (response: Response) => {
          if (response.resultado) {
          this.items = (response.resultado) as Array<Rendimiento>;
          this.itemDelete = this.item.codigo;
          this_.isLoading = false;
          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.items.length,
            totalPaginas: this.items.length
          })
        }else{
          this.isLoading = false;
          this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }
        },
        (error) => this.controlarError(error)
      );
      this.suscribirLoading();
    }
/*     this.paginacion = new Paginacion({
      pagina: 1,
      registros: 10,
      totalRegistros: this.items.length,
      totalPaginas: this.items.length
    })  */
  }

  OnEditar(index) {
    this.items[index].v_editable = 1;
    this.editando = true;
    this.rendimientoAnterior = Object.assign({}, this.items[index]);

    this.suministroBlock = 0;
    this.cuadrillaBlock = 0;
    this.trabajadorBlock = 0;
  }

  OnCancel(index: number) {
    this.editando = false;
    this.items[index] = this.rendimientoAnterior;
    this.items[index].v_editable = 0;
  }

  OnUpdate(index: number) {
    this.isLoading = true;
    /* this.items[index].v_idsubacti_1=this.subactividad!=null?this.subactividad.substring(0, 2):' ';
    this.items[index].v_idsubacti_2=this.subactividad!=null?this.subactividad.substring(0, 4):' '; */
    this.reporteMonitoreo.updateRendimiento(this.items[index]).subscribe(
      (response: Response) => {
        this.items[index].v_editable = 0;
        this.editando = false;
        this.toastr.success('Confirmación', 'Se actualizó el registro satisfactoriamente');
        this.OnListarRendimiento();
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnEliminar(rendimiento) {
    this.isLoading = true;
    const this_ = this;
    const request: Rendimiento = new Rendimiento();
    request.v_idacti = this.actividad.codigo;
    request.n_idofic = this.oficina.codigo;
    request.n_idcontrati = this.empresa.codigo;
    request.n_numitem = rendimiento.n_numitem;
    request.n_idrendimiento = rendimiento.n_idrendimiento;
    request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
    this.reporteMonitoreo.eliminarRendimientos(request).subscribe(
      (response: Response) => {
        this.editando = false;
        this.toastr.success('Se eliminaron los registros satisfactoriamente');
        this.items = new Array<Rendimiento>();
        this.OnListarRendimiento();
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }


  onListarRendimientos(): Rendimiento[] {
    const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
    const fin: number = (this.paginacion.registros * this.paginacion.pagina);
    return this.items.slice(inicio, fin);
  }

  onPageChanged(event): void {
    this.paginacion.pagina = event.page;
  }

  onPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
  }

  onBlurSuministro(event){
    if (event != null && event != 0 ) {
      this.trabajadorBlock = 1;
      this.cuadrillaBlock = 1;
    }else{
      this.trabajadorBlock = 0;
      this.cuadrillaBlock = 0;
    }
  }
  onBlurCuadrilla(event){
    if (event != null && event != 0 ) {
      this.trabajadorBlock = 1;
      this.suministroBlock = 1;
    }else{
      this.trabajadorBlock = 0;
      this.suministroBlock = 0;
    }
  }
  onBlurTrabajador(event){
    if (event != null && event != 0 ) {
      this.suministroBlock = 1;
      this.cuadrillaBlock = 1;
    }else{
      this.suministroBlock = 0;
      this.cuadrillaBlock = 0
    }
  }

}
