import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Paginacion, ParametrosCargaBandeja, Actividad, Response, Zona, Empresa, Trabajador } from '../../../models';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ResponseObject } from 'src/app/models/response/response-object';
import { Oficina } from 'src/app/models/oficina';
import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from 'src/app/models/numberOnly';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { reject } from 'q';
import { Parametro } from 'src/app/models/parametro';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Credenciales } from 'src/app/models/credenciales';
import { DocumentosService } from 'src/app/services/impl/documentos.service';
import { ValidacionService } from 'src/app/services/impl/validacion';
import * as moment from 'moment';
import { FiltrosBandejaMonitoreo } from 'src/app/models/filtro-bandeja.monitoreo';
import { FiltrosBandejaCargaProgramacion } from 'src/app/models/filtro-bandeja.cargaProgramacion';
import { Asignacion } from 'src/app/models/asignacion';
import { Contratista } from 'src/app/models/contratista';
import { EstadoAsignacion } from 'src/app/models/estadoAsignacion';
import { MonitoreoService } from 'src/app/services/impl/monitoreo.service';
import { Estado } from 'src/app/models/enums';
import { Detalle } from 'src/app/models/detalle';
import { Monitoreo } from 'src/app/models/monitoreo';
import { FiltrosBandejaMonitoreoDetalle } from 'src/app/models/filtro-bandeja.monitoreo-detalle';
import { Sostenibilidad } from 'src/app/models/sostenibilidad';
import { RequestVisorMonitoreo } from 'src/app/models/request/request-visor-monitoreo';
import { Router } from '@angular/router';



@Component({
  selector: 'app-bandeja-sostenibilidad',
  templateUrl: './bandeja-sostenibilidad.component.html',
  styleUrls: ['./bandeja-sostenibilidad.component.scss']
})

export class BandejaSostenibilidadComponent implements OnInit {
  name = 'Angular';
  localIp = sessionStorage.getItem('LOCAL_IP');

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  /* gif onloading */
  public loading: boolean;

  public monitoreos: Monitoreo[];
  public cabecera: Monitoreo;
  public sostenibilidad: Sostenibilidad[];
  public sostenibilidadCopy: Sostenibilidad[];
  /* Variable para la paginaci??n */
  public paginacion: Paginacion;
  public paginacion2: Paginacion;

  public filtros: FiltrosBandejaMonitoreo;
  public filtrosBusqueda: FiltrosBandejaMonitoreo;
  public filtrosDetalle: FiltrosBandejaMonitoreoDetalle;
  public filtrosBusquedaDetalle: FiltrosBandejaMonitoreoDetalle;

  public mostrarPrincipal: boolean;
  public mostrarDetalle: boolean;
  public mostrarAddBtn: boolean;
  public mostrarNmed: boolean;
  /* Variable para mostrar el filtro de busqueda */
  public filtrosTexto: string;
  public filtrosTextoDetalle: string;
  /* Variable para visualizar mensaje de filtro de busqueda */
  public mostrarFiltros: boolean;
  public mostrarFiltrosDetalle: boolean;
  public verExportarExcel: boolean;

  public listaParametros: ParametrosCargaBandeja;
  public listaParametrosMonitoreo: ParametrosCargaBandeja;

  public oficina: Oficina;
  public codigoOficina: number;
  public clrOficina: boolean;
  public empresa: Empresa;
  public codigoEmpresa: number;
  public clrEmpresa: boolean;

  /* para validaci??n de fechas */
  public today = new Date();
  /* N??mero de meses de consulta */
  private mesesConsulta: number;
  /* N??mero Rango de d??as */
  private rangoDias: number;
  public sumVisor: number;
  public arrayImagenes:any = null;

  @ViewChild('visorImgSwal') private visorImgSwal: SwalComponent;
  @ViewChild('FileInput') FileInput;

  constructor(private sanitizer: DomSanitizer,
    private monitoreoService: MonitoreoService,
    private router: Router,
    private datePipe: DatePipe,
    private zone: NgZone,
    private toastr: ToastrService,
    private _validacionNumero: ValidacionService) {

    this.filtrosBusqueda = null;
    this.filtrosBusquedaDetalle = null;
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion2 = new Paginacion({ registros: 10, pagina: 1 });
    this.monitoreos = new Array<Monitoreo>();
    this.filtros = new FiltrosBandejaMonitoreo();
    this.filtros.contratista = new Contratista();
    this.filtros.oficina = new Oficina();
    this.filtros.imposibilidad = new Parametro();
    this.filtros.tipoActividad = new Parametro();
    this.filtros.foto = new Parametro();
    this.filtros.semaforo = new Parametro();
    this.filtros.operario = new Trabajador();
    this.listaParametros = new ParametrosCargaBandeja();
    this.listaParametrosMonitoreo = new ParametrosCargaBandeja();

    this.filtrosDetalle = new FiltrosBandejaMonitoreoDetalle();
    this.filtrosDetalle.foto = new Parametro();
    this.filtrosDetalle.zona = new Zona();
    this.filtrosDetalle.estado = new Parametro();
    this.filtrosDetalle.cumplimiento = new Parametro();
    this.filtrosDetalle.contratista = new Contratista();
    this.filtrosDetalle.trabajador = new Trabajador();
    this.filtrosDetalle.tipoActividad = new Parametro();
    this.filtrosDetalle.tipoOrdenServicio = new Parametro();
    this.filtrosDetalle.codObservacion = new Parametro();

  }

  ngOnInit() {
    this.listaParametrosMonitoreo = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.monitoreoService.consultarParametrosBusquedaMonitoreo('SO').subscribe(
      (response: ResponseObject) => {
        this.listaParametros = response.resultado;
        //Segun Perfil
        this.listaParametros.listaEmpresa.length === 1 ? this.empresa = this.listaParametros.listaEmpresa[0] : this.oficina = null;
        this.listaParametros.listaEmpresa.length === 1 ? this.clrEmpresa = false : this.clrEmpresa = true;
        //Segun Perfil
        if (sessionStorage.getItem('codEmpresa') != null) {
          this.filtros.contratista.codigo = this.empresa.codigo;
          this.filtros.contratista.descripcion = this.empresa.descripcion;
        }
      }
    );

    this.monitoreoService.obtenerParametrosPeriodo().subscribe(
      (response: Response) => {
        this.mesesConsulta = response.resultado.mesesConsulta;
        this.rangoDias = response.resultado.diasRango;

          (error) => {
            this.loading = false;
            this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          }
        }
      );

      this.mostrarPrincipal = true;
      this.mostrarDetalle = false;
      this.mostrarNmed = false
      this.verExportarExcel = false;
  }

  get validacionNumero() {
    return this._validacionNumero;
  }

  regresarPrincipal(){
    this.router.navigate(['inicio']);
  }

  onListarMonitoreos(): Monitoreo[] {
    const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
    const fin: number = (this.paginacion.registros * this.paginacion.pagina);
    return this.monitoreos.slice(inicio, fin);
  }
  onListarDetalles(): Sostenibilidad[] {
    const inicio: number = (this.paginacion2.pagina - 1) * this.paginacion2.registros;
    const fin: number = (this.paginacion2.registros * this.paginacion2.pagina);
    return this.sostenibilidad.slice(inicio, fin);
  }
  getAvance(monitoreo: Monitoreo) {
    let number = (monitoreo.cargaEjecutada / monitoreo.cargaProgramada) * 100;
    return number.toFixed(2);
  }
  seleccionarViewContratistas(event) {
    if (event) {
      this.filtros.contratista.descripcion = event.descripcion;
    } else {
      this.filtros.contratista = new Contratista();
    }
  }

  onSeleccionarSemaforo(event) {
    if (event) {
      this.filtros.semaforo.detalle = event.detalle;
    } else {
      this.filtros.semaforo = new Parametro();
    }
  }

  onSeleccionarOficina(event) {
    if (event) {
      this.filtros.oficina.descripcion = event.descripcion;
    } else {
      this.filtros.oficina = new Oficina();
    }
  }
  seleccionarviewEstadoDetalle(event) {
    if (event) {
      this.filtrosDetalle.estado.detalle = event.detalle;
    } else {
      this.filtrosDetalle.estado = new Parametro();
    }
  }
  seleccionarviewZonaDetalle(event) {
    if (event) {
      this.filtrosDetalle.zona.detalle = event.detalle;
    } else {
      this.filtrosDetalle.zona = new Zona();
    }
  }
  onSeleccionarTipoActividad(event) {
    if (event) {
      this.filtros.tipoActividad.detalle = event.detalle;
    } else {
      this.filtros.tipoActividad = new Parametro();
    }
  }
  onSeleccionarTipoActividadDetalle(event) {
    if (event) {
      this.filtrosDetalle.tipoActividad.detalle = event.detalle;
    } else {
      this.filtrosDetalle.tipoActividad = new Parametro();
    }
  }
  onSeleccionarCodObservacion(event) {
    if (event) {
      this.filtrosDetalle.codObservacion.detalle = event.detalle;
    } else {
      this.filtrosDetalle.codObservacion = new Parametro();
    }
  }
  onSeleccionarTipoOrdServicio(event) {
    if (event) {
      this.filtrosDetalle.tipoOrdenServicio.detalle = event.detalle;
    } else {
      this.filtrosDetalle.tipoOrdenServicio = new Parametro();
    }
  }
  seleccionarViewImposibilidad(event) {
    if (event) {
      this.filtros.imposibilidad.detalle = event.detalle;
    } else {
      this.filtros.imposibilidad = new Parametro();
    }
  }
  onSeleccionarFoto(event) {
    if (event) {
      this.filtros.foto.detalle = event.detalle;
    } else {
      this.filtros.foto = new Parametro();
    }
  }
  seleccionarViewExisteFoto(event) {
    if (event) {
      this.filtrosDetalle.foto.detalle = event.detalle;
    } else {
      this.filtrosDetalle.foto = new Parametro();
    }
  }
  seleccionarviewEstado(event) {
    if (event) {
      this.filtrosDetalle.estado.detalle = event.detalle;
    } else {
      this.filtrosDetalle.estado = new Parametro();
    }
  }
  onSeleccionarCumplimiento(event) {
    if (event) {
      this.filtrosDetalle.cumplimiento.detalle = event.detalle;
    } else {
      this.filtrosDetalle.cumplimiento = new Parametro();
    }
  }
  onSeleccionarZona(event) {
    if (event) {
      this.filtrosDetalle.zona.detalle = event.detalle;
    } else {
      this.filtrosDetalle.zona = new Zona();
    }
  }
  detectarCambioFechas() {
    if (!(this.filtros. fechaProgramacionInicio instanceof Date) || isNaN(this.filtros. fechaProgramacionInicio.getTime())) {
      this.filtros. fechaProgramacionInicio = null;
    }
    if (!(this.filtros.fechaProgramacionFin instanceof Date) || isNaN(this.filtros.fechaProgramacionFin.getTime())) {
      this.filtros.fechaProgramacionFin = null;
    }
  }

  validarFormulario(filtros: FiltrosBandejaMonitoreo) {
    let valida: boolean;
    if ( filtros.contratista.codigo && filtros.oficina.codigo ) {
      if(filtros.suministro && !Number(filtros.suministro)){
        valida = false;
        this.toastr.warning("El N??mero Suministro debe estar compuesto solo de n??meros.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
      else if(filtros.numMedidor && !Number(filtros.numMedidor)){
        valida = false;
        this.toastr.warning("El N??mero de Medidor debe estar compuesto solo de n??meros.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
      else if(filtros.operario.codigo && !Number(filtros.operario.codigo)){
        valida = false;
        this.toastr.warning("El c??digo de operario debe estar compuesto solo de n??meros.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }else if (filtros. fechaProgramacionInicio && filtros.fechaProgramacionFin) {
        if (filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > filtros.fechaProgramacionFin.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.warning("La Fecha Inicio debe ser menor o igual a la Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }/*  else if (filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0) ||
          filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.warning("Las fechas no deben ser mayores a la fecha actual", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }  */else {
          let diasFecha = 0;
          diasFecha = moment(filtros.fechaProgramacionFin).diff(moment(filtros. fechaProgramacionInicio), 'days') + 1;
          if (diasFecha > this.rangoDias) {
            valida = false;
            this.toastr.warning("Los dias del rango de fechas no debe superar los " + this.rangoDias + " d??as", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          } else {
            valida = true;
          }
        }
      } else if (!(filtros. fechaProgramacionInicio || filtros.fechaProgramacionFin)) {

          filtros.fechaProgramacionFin = moment(new Date).toDate();
          filtros. fechaProgramacionInicio = moment(new Date).toDate();
          valida = true;


      }else if ((!filtros. fechaProgramacionInicio && filtros.fechaProgramacionFin) ||
      (filtros. fechaProgramacionInicio && !filtros.fechaProgramacionFin)){
        valida = false;
        this.toastr.warning("Debe elegir ambas fechas", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    } else if (!(filtros. fechaProgramacionInicio || filtros.fechaProgramacionFin)) {

      filtros.fechaProgramacionFin = moment(new Date).toDate();
      filtros. fechaProgramacionInicio = moment(new Date).toDate();
      valida = true;
    }else if ((!filtros. fechaProgramacionInicio && filtros.fechaProgramacionFin) ||
    (filtros. fechaProgramacionInicio && !filtros.fechaProgramacionFin)){
      valida = false;
      this.toastr.warning("Debe elegir ambas fechas", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
  }
    else {
      valida = false;
      this.toastr.warning("Debe seleccionar todos los filtros obligatorios", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    return valida;
  }
  eliminarFiltros(){
    this.mostrarFiltros = false;
    this.verExportarExcel = false;
    this.monitoreos = new Array<Monitoreo>();
    this.paginacion = new Paginacion({
      pagina: 1,
      registros: 10
    })
  }

  eliminarFiltrosDetalle(){
    this.mostrarFiltrosDetalle = false;
    /* this.onLimpiarFiltros(); */
    this.sostenibilidad = this.sostenibilidadCopy;
    this.paginacion2 = new Paginacion({
      pagina: 1,
      registros: 10,
      totalRegistros: this.sostenibilidad.length,
      totalPaginas: this.sostenibilidad.length
    })
  }
  validarFormularioDetalle(filtros: FiltrosBandejaMonitoreoDetalle) {
    let valida: boolean;
    if ( filtros.contratista.codigo ) {
      if(filtros.suministro && !Number(filtros.suministro)){
        valida = false;
        this.toastr.error("El N??mero Suministro debe estar compuesto solo de n??meros.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }else{
        valida = true;
      }
    } else {
      valida = false;
      this.toastr.error("Debe seleccionar todos los filtros obligatorios", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    return valida;
  }
  private mostrarInformacionFiltros() {
    let mensaje = '<strong>B??squeda Por: </strong>';
    if (this.filtrosBusqueda.contratista.codigo) {
      mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusqueda.contratista.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.imposibilidad) {
      mensaje = mensaje + '<br/><strong>Imposibilidad: </strong> <parrafo>' + this.filtrosBusqueda.imposibilidad.detalle + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.oficina.codigo) {
      mensaje = mensaje + '<br/><strong>Oficina: </strong> <parrafo>' + this.filtrosBusqueda.oficina.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.tipoActividad) {
      mensaje = mensaje + '<br/><strong>Sub Actividad: </strong> <parrafo>' + this.filtrosBusqueda.tipoActividad.detalle + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.numMedidor) {
      mensaje = mensaje + '<br/><strong>N??mero medidor: </strong> <parrafo>' + this.filtrosBusqueda.numMedidor + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.ordenTrabajo) {
      mensaje = mensaje + '<br/><strong>Orden de Trabajo: </strong> <parrafo>' + this.filtrosBusqueda.ordenTrabajo + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.ordenServicio) {
      mensaje = mensaje + '<br/><strong>Orden de Servicio: </strong> <parrafo>' + this.filtrosBusqueda.ordenServicio + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.operario.codigo) {
      mensaje = mensaje + '<br/><strong>C??digo Operario: </strong> <parrafo>' + this.filtrosBusqueda.operario.codigo + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.suministro) {
      mensaje = mensaje + '<br/><strong>Suministro: </strong> <parrafo>' + this.filtrosBusqueda.suministro + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.foto) {
      mensaje = mensaje + '<br/><strong>Foto: </strong> <parrafo>' + this.filtrosBusqueda.foto.detalle + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.semaforo) {
      mensaje = mensaje + '<br/><strong>Semaforo: </strong> <parrafo>' + this.filtrosBusqueda.semaforo.detalle + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.fechaProgramacionInicio && this.filtrosBusqueda.fechaProgramacionFin) {
      mensaje = mensaje + '<br/><strong>Rango de fechas: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaProgramacionInicio, 'dd/MM/yyyy')
      + ' hasta ' + this.datePipe.transform(this.filtrosBusqueda.fechaProgramacionFin, 'dd/MM/yyyy') + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }

    if (this.mostrarFiltros) {
      this.filtrosTexto = mensaje;
    }
  }

  private mostrarInformacionFiltrosDetalle() {
    let mensaje = '<strong>B??squeda Por: </strong>';
    if (this.filtrosBusquedaDetalle.contratista.codigo) {
      mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusquedaDetalle.contratista.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.fechaProgramacion) {
      mensaje = mensaje + '<br/><strong>Fecha Programaci??n: </strong> <parrafo>' + this.filtrosBusquedaDetalle.fechaProgramacion + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
/*     if (this.filtrosBusquedaDetalle.periodo) {
      mensaje = mensaje + '<br/><strong>Periodo: </strong> <parrafo>' + this.filtrosBusquedaDetalle.periodo.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.ciclo) {
      mensaje = mensaje + '<br/><strong>Ciclo: </strong> <parrafo>' + this.filtrosBusquedaDetalle.ciclo.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    } */
    if (this.filtrosBusquedaDetalle.trabajador) {
      mensaje = mensaje + '<br/><strong>C??digo Operario: </strong> <parrafo>' + this.filtrosBusquedaDetalle.trabajador.codigo + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.ordenServicio) {
      mensaje = mensaje + '<br/><strong>Incidencia: </strong> <parrafo>' + this.filtrosBusquedaDetalle.ordenServicio + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.foto) {
      mensaje = mensaje + '<br/><strong>Foto: </strong> <parrafo>' + this.filtrosBusquedaDetalle.foto.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.tipoActividad) {
      mensaje = mensaje + '<br/><strong>Sub Actividad: </strong> <parrafo>' + this.filtrosBusquedaDetalle.tipoActividad.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.zona) {
      mensaje = mensaje + '<br/><strong>Zona: </strong> <parrafo>' + this.filtrosBusquedaDetalle.zona.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.tipoOrdenServicio) {
      mensaje = mensaje + '<br/><strong>Tipo Orden de Servicio: </strong> <parrafo>' + this.filtrosBusquedaDetalle.tipoOrdenServicio.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.codObservacion) {
      mensaje = mensaje + '<br/><strong>C??digo Observaci??n: </strong> <parrafo>' + this.filtrosBusquedaDetalle.codObservacion.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.estado) {
      mensaje = mensaje + '<br/><strong>Estado: </strong> <parrafo>' + this.filtrosBusquedaDetalle.estado.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.suministro) {
      mensaje = mensaje + '<br/><strong>Suministro: </strong> <parrafo>' + this.filtrosBusquedaDetalle.suministro + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.cumplimiento) {
      mensaje = mensaje + '<br/><strong>Cumplimiento: </strong> <parrafo>' + this.filtrosBusquedaDetalle.cumplimiento.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }

    if (this.mostrarFiltrosDetalle) {
      this.filtrosTextoDetalle = mensaje;
    }
  }


    onPageChanged(event): void {
      this.paginacion.pagina = event.page;
    }

    onPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
    }
    onPageChangedDetalle(event): void {
      this.paginacion2.pagina = event.page;
    }

    onPageOptionChangedDetalle(event): void {
      this.paginacion2.registros = event.rows;
      this.paginacion2.pagina = 1;
    }
  /*   eliminarFiltros(){
      this.mostrarFiltros = false;
      this.onLimpiarFiltros();
    } */

  buscarDetalle(monitoreo) {
    this.loading = true;
    this.monitoreoService.obtenerDetallesMonitoreo(monitoreo).subscribe(
      (response: ResponseObject) => {
        if (!(response.resultado.listarMonitoreoDetalle.length > 0)) {
          this.loading = false;
          this.sostenibilidad = new Array<Sostenibilidad>();
          this.paginacion2 = new Paginacion({pagina: 1, registros: 10})
          this.toastr.warning("La b??squeda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          return false;
        }
        this.cabecera = monitoreo;
        this.sostenibilidad = response.resultado.listarMonitoreoDetalle;
        this.sostenibilidadCopy = response.resultado.listarMonitoreoDetalle;
        this.mostrarPrincipal = false;
        this.mostrarDetalle = true;
        this.loading = false;

        this.paginacion2 = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: this.sostenibilidad.length,
          totalPaginas: this.sostenibilidad.length
        })

        this.filtrosDetalle.contratista = this.filtrosBusqueda.contratista;
        this.filtrosDetalle.trabajador = monitoreo.trabajador;
        if (monitoreo.trabajador.nombre) {
          this.filtrosDetalle.operarioCodNombre = monitoreo.trabajador.codigo + " - " + monitoreo.trabajador.nombre;
        } else {
          this.filtrosDetalle.operarioCodNombre = monitoreo.trabajador.codigo
        }
        this.filtrosDetalle.fechaProgramacion = monitoreo.fechaProgramacion;

      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurri?? un error al realizar la b??squeda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }


  onObtenerDetalles() {
    this.loading = true;
    this.filtrosBusquedaDetalle = new FiltrosBandejaMonitoreoDetalle();
    this.filtrosBusquedaDetalle.foto = new Parametro();
    this.filtrosBusquedaDetalle.tipoOrdenServicio = new Parametro();
    this.filtrosBusquedaDetalle.codObservacion = new Parametro();
    this.filtrosBusquedaDetalle.estado = new Parametro();
    this.filtrosBusquedaDetalle.cumplimiento = new Parametro();
    this.filtrosBusquedaDetalle.contratista = new Contratista();
    this.filtrosBusquedaDetalle.trabajador = new Trabajador();
    this.filtrosBusquedaDetalle.tipoActividad = new Parametro();
    this.filtrosBusquedaDetalle.zona = new Zona();
    if (!this.validarFormularioDetalle(this.filtrosDetalle)) {
      this.loading = false;
      return false;
    }

    if (this.filtrosDetalle.foto.codigo) {
      this.filtrosBusquedaDetalle.foto = this.filtrosDetalle.foto;
    } else {
      this.filtrosBusquedaDetalle.foto = null;
    }
    if (this.filtrosDetalle.tipoActividad.id) {
      this.filtrosBusquedaDetalle.tipoActividad = this.filtrosDetalle.tipoActividad;
    } else {
      this.filtrosBusquedaDetalle.tipoActividad = null;
    }
    if (this.filtrosDetalle.codObservacion.codigo) {
      this.filtrosBusquedaDetalle.codObservacion = this.filtrosDetalle.codObservacion;
    } else {
      this.filtrosBusquedaDetalle.codObservacion = null;
    }
    if (this.filtrosDetalle.tipoOrdenServicio.codigo) {
      this.filtrosBusquedaDetalle.tipoOrdenServicio = this.filtrosDetalle.tipoOrdenServicio;
    } else {
      this.filtrosBusquedaDetalle.tipoOrdenServicio = null;
    }
    if (this.filtrosDetalle.estado.id) {
      this.filtrosBusquedaDetalle.estado = this.filtrosDetalle.estado;
    } else {
      this.filtrosBusquedaDetalle.estado = null;
    }
    if (this.filtrosDetalle.zona.codigo) {
      this.filtrosBusquedaDetalle.zona = this.filtrosDetalle.zona;
    } else {
      this.filtrosBusquedaDetalle.zona = null;
    }
    if (this.filtrosDetalle.cumplimiento.codigo) {
      this.filtrosBusquedaDetalle.cumplimiento = this.filtrosDetalle.cumplimiento;
    } else {
      this.filtrosBusquedaDetalle.cumplimiento = null;
    }
    this.filtrosBusquedaDetalle.contratista = this.filtrosDetalle.contratista;
    this.filtrosBusquedaDetalle.trabajador = this.filtrosDetalle.trabajador;
    this.filtrosBusquedaDetalle.suministro = this.filtrosDetalle.suministro;
    this.filtrosBusquedaDetalle.fechaProgramacion = this.filtrosDetalle.fechaProgramacion;
    this.filtrosBusquedaDetalle.ordenServicio = this.filtrosDetalle.ordenServicio;


    this.monitoreoService.obtenerDetallesBusquedaSO(this.filtrosBusquedaDetalle).subscribe(
      (response: ResponseObject) => {
        if (!(response.resultado.listarMonitoreoDetalle.length > 0)) {
          this.loading = false;
          this.sostenibilidad = new Array<Sostenibilidad>();
          this.paginacion2 = new Paginacion({pagina: 1, registros: 10})
          this.mostrarInformacionFiltrosDetalle();
          this.toastr.warning("La b??squeda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          return false;
        }
        this.sostenibilidad = response.resultado.listarMonitoreoDetalle;
        this.mostrarPrincipal = false;
        this.mostrarDetalle = true;
        this.mostrarInformacionFiltrosDetalle();
        this.loading = false;

        this.paginacion2 = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: this.sostenibilidad.length,
          totalPaginas: this.sostenibilidad.length
        })
      },
      (error) => {
        this.loading = false;
        this.mostrarInformacionFiltrosDetalle();
        this.toastr.error("Ocurri?? un error al realizar la b??squeda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }


  onObtenerMonitoreo() {
    this.loading = true;
    this.filtrosBusqueda = new FiltrosBandejaMonitoreo();
    this.filtrosBusqueda.contratista = new Contratista();
    this.filtrosBusqueda.oficina = new Oficina();
    this.filtrosBusqueda.operario = new Trabajador();
    this.filtrosBusqueda.foto = new Parametro();
    this.filtrosBusqueda.semaforo = new Parametro();
    this.filtrosBusqueda.imposibilidad = new Parametro();
    this.filtrosBusqueda.periodo = new Parametro();
    this.filtrosBusqueda.tipoActividad = new Parametro();
    this.filtrosBusqueda.ciclo = new Parametro();

    if (!this.validarFormulario(this.filtros)) {
      this.loading = false;
      return false;
    }
    this.filtrosBusqueda.contratista.codigo = this.filtros.contratista.codigo;
    this.filtrosBusqueda.contratista.descripcion = this.filtros.contratista.descripcion;
    this.filtrosBusqueda.operario.codigo = this.filtros.operario.codigo;

    this.filtrosBusqueda. fechaProgramacionInicio = this.filtros. fechaProgramacionInicio;
    this.filtrosBusqueda.fechaProgramacionFin = this.filtros.fechaProgramacionFin;

    this.filtrosBusqueda.suministro = this.filtros.suministro;
    this.filtrosBusqueda.numMedidor = this.filtros.numMedidor;
    this.filtrosBusqueda.ordenServicio = this.filtros.ordenServicio;
    this.filtrosBusqueda.ordenTrabajo = this.filtros.ordenTrabajo;

    if (this.filtros.tipoActividad.id) {
      this.filtrosBusqueda.tipoActividad = this.filtros.tipoActividad;
    } else {
      this.filtrosBusqueda.tipoActividad = null;
    }
    if (this.filtros.imposibilidad.codigo) {
      this.filtrosBusqueda.imposibilidad = this.filtros.imposibilidad;
    } else {
      this.filtrosBusqueda.imposibilidad = null;
    }
    if (this.filtros.foto.codigo) {
      this.filtrosBusqueda.foto = this.filtros.foto;
    } else {
      this.filtrosBusqueda.foto = null;
    }
    if (this.filtros.semaforo.codigo) {
      this.filtrosBusqueda.semaforo = this.filtros.semaforo;
    } else {
      this.filtrosBusqueda.semaforo = null;
    }
    if (sessionStorage.getItem('codOficina') != null) {
      this.codigoOficina = Number(sessionStorage.getItem('codOficina'));
      this.filtrosBusqueda.oficina.codigo = this.codigoOficina;
      this.filtrosBusqueda.oficina.descripcion = sessionStorage.getItem('desOficina');
    } else {
      this.filtrosBusqueda.oficina = this.filtros.oficina;
    }
    if (this.filtrosBusqueda) {
      this.monitoreoService.obtenerMonitoreos(this.filtrosBusqueda, 'SO').subscribe(
        (response: ResponseObject) => {
          if (!(response.resultado.listarMonitoreoCabecera.length > 0)) {
            this.loading = false;
            this.monitoreos = new Array<Monitoreo>();
            this.paginacion = new Paginacion({pagina: 1, registros: 10})
            this.toastr.warning("La b??squeda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
            return false;
          }
          this.monitoreos = response.resultado.listarMonitoreoCabecera;
          /* seteo de la paginaci??n manual */
          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.monitoreos.length,
            totalPaginas: this.monitoreos.length
          })
          /*  */
          this.loading = false;
          this.verExportarExcel = true;
          this.mostrarInformacionFiltros();
        },
        (error) => {
          this.mostrarInformacionFiltros();
          this.loading = false;
          this.monitoreos = new Array<Monitoreo>();
          this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
          this.toastr.error("Ocurri?? un error al realizar la b??squeda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          }
      );
    } else {
      this.loading = false;
    }
  }
  onLimpiarFiltros() {
    this.filtros = new FiltrosBandejaMonitoreo();
    this.filtros.contratista = new Contratista();
    /* this.filtros.oficina = new Oficina(); */
    this.filtros.ciclo = new Parametro();
    this.filtros.periodo = new Parametro();
    this.filtros.imposibilidad = new Parametro();
    this.filtros.tipoActividad = new Parametro();
    this.filtros.foto = new Parametro();
    this.filtros.semaforo = new Parametro();
    this.filtros.operario = new Trabajador();
    this.mostrarFiltros = false;
    this.verExportarExcel = false;

    this.paginacion = new Paginacion({
      pagina: 1,
      registros: 10
    });
    if (sessionStorage.getItem('codEmpresa') === null) {
      this.filtros.contratista = new Contratista();
    }
    if (sessionStorage.getItem('codOficina') === null) {
      this.filtros.oficina = new Oficina();
    }
    this.monitoreos = new Array<Monitoreo>();
    this.filtrosBusqueda = null;
  }
  onLimpiarFiltrosDetalle() {
    this.filtrosDetalle.estado = new Parametro();
    this.filtrosDetalle.tipoActividad = new Parametro();
    this.filtrosDetalle.incidencia = new Parametro();
    this.filtrosDetalle.subIncidencia = new Parametro();
    this.filtrosDetalle.tipoOrdenServicio = new Parametro();
    this.filtrosDetalle.codObservacion = new Parametro();
    this.filtrosDetalle.zona = new Zona();
    this.filtrosDetalle.foto = new Parametro();
    this.filtrosDetalle.suministro = null;
    this.filtrosDetalle.ordenServicio = null;
    this.filtrosDetalle.cumplimiento = new Parametro();
    this.eliminarFiltrosDetalle();
  }

  regresarDetalle(){
    /* this.filtrosDetalle = new FiltrosBandejaMonitoreoDetalle(); */
    this.filtrosDetalle.foto = new Parametro();
    /* this.filtrosDetalle.ciclo = new Parametro(); */
    this.filtrosDetalle.incidencia = new Parametro();
    this.filtrosDetalle.subIncidencia = new Parametro();
    this.filtrosDetalle.estado = new Parametro();
    this.filtrosDetalle.cumplimiento = new Parametro();
    this.filtrosDetalle.contratista = new Contratista();
    this.filtrosDetalle.trabajador = new Trabajador();

    this.sostenibilidad = null;

    if (!this.filtrosBusqueda.periodo.codigo) {
      this.filtros.periodo = new Parametro();
      this.filtros.ciclo = new Parametro();
    }

    this.mostrarDetalle = false;
    this.mostrarPrincipal = true;
  }

  visualizarImagen(item: Sostenibilidad, accion: string): void{
      this.loading = true;
      this.sumVisor = item.suministro;
      console.log(this.sumVisor);
      let obj: RequestVisorMonitoreo = new RequestVisorMonitoreo();
      obj.suministro = item.suministro;
      obj.actividad = "SO";
      obj.accion = accion;
      obj.imagen1 = item.imagen1;
      obj.imagen2 = item.imagen2;
      obj.imagen3 = item.imagen3;
      /* obj.idCargaDetalle = item. */

      let credenciales = new Credenciales();
      let  credencialesString : string;
      credencialesString = sessionStorage.getItem("credenciales");
      credenciales  = JSON.parse(credencialesString);
      obj.usuario = credenciales.usuario;

      obj.ip = sessionStorage.getItem("IP");

      localStorage.setItem("SUMINISTRO", item.suministro.toString());
      localStorage.setItem("ACTIVIDAD", obj.actividad);
      localStorage.setItem("USUARIO", credenciales.usuario.toString());
      localStorage.setItem("IP", obj.ip);
      localStorage.setItem("FLAG", "M");

        this.monitoreoService.visualizarAdjuntosMonitoreoJpg(obj).subscribe(
          (data: ResponseObject) => {
            this.loading = false;
            if(data.estado == 'OK'){
              this.arrayImagenes = data.resultado;
                this.visorImgSwal.show();
            }else{
              this.toastr.error(data.resultado.mensajeInterno, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            }
          },
          (error) => {
            this.loading = false;
            this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          }
        );
    }
  onExportarDetalle(){
    this.monitoreoService.generaExcelDetalle(this.cabecera, this.sostenibilidad, "SO").subscribe(
      (data) => {
        this.loading = false;
        var file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(file, "Resultado");
      },
      (error) => {
        this.loading = false;
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
  onExportar(){
    this.monitoreoService.generaExcel(this.filtrosBusqueda, "SO").subscribe(
      (data) => {
        this.loading = false;
        var file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(file, "Resultado");
      },
      (error) => {
        this.loading = false;
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
}
