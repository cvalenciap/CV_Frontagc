import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Paginacion, ParametrosCargaBandeja, Actividad, Response, Zona, Empresa, Trabajador, Reasignacion } from '../../../models';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltrosBandejaDigitalizados } from 'src/app/models/filtro-bandeja.digitalizado';
import { DigitalizadoService } from 'src/app/services/impl/digitalizado.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseObject } from 'src/app/models/response/response-object';
import { Oficina } from 'src/app/models/oficina';
import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from 'src/app/models/numberOnly';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { reject } from 'q';
import { Parametro } from 'src/app/models/enums/parametro';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Digitalizado } from 'src/app/models/digitalizado';
import { Credenciales } from 'src/app/models/credenciales';
import { RequestVisorDigitalizado } from 'src/app/models/request/request-visor-digitalizado';
import { DocumentosService } from 'src/app/services/impl/documentos.service';
import { ValidacionService } from 'src/app/services/impl/validacion';
import * as moment from 'moment';
import { FiltrosBandejaAsignacion } from 'src/app/models/filtro-bandeja.asignacion';
/* import { FiltrosBandejaDetalle } from 'src/app/models/filtro-bandeja.detalle'; */
import { FiltrosBandejaCargaProgramacion } from 'src/app/models/filtro-bandeja.cargaProgramacion';
import { Asignacion } from 'src/app/models/asignacion';
import { Contratista } from 'src/app/models/contratista';
import { EstadoAsignacion } from 'src/app/models/estadoAsignacion';
import { MonitoreoService } from 'src/app/services/impl/monitoreo.service';
import { Estado } from 'src/app/models/enums';
import { Detalle } from 'src/app/models/detalle';
import { Router } from '@angular/router';
import { RequestReasignacion } from 'src/app/models/request/request-visor-monitoreo copy';



@Component({
  selector: 'app-bandeja-asignacion-trabajo',
  templateUrl: './bandeja-asignacion-trabajo.component.html',
  styleUrls: ['./bandeja-asignacion-trabajo.component.scss']
})

export class BandejaAsignacionTrabajoComponent implements OnInit {
  name = 'Angular';
  localIp = sessionStorage.getItem('LOCAL_IP');

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  /* gif onloading */
  private loading: boolean;
  /*Filtros de búsqueda*/
  private filtrosBusqueda: FiltrosBandejaAsignacion;
  private filtrosBusquedaDetalle: FiltrosBandejaAsignacion;
  private filtrosBusquedaManual: FiltrosBandejaAsignacion;
  private filtrosBusquedaCarga: FiltrosBandejaCargaProgramacion;
  private filtrosBusquedaCargaMasiva: FiltrosBandejaCargaProgramacion;
  /* Variable para la paginación */
  private paginacion: Paginacion;
  private paginacionDetalle: Paginacion;
  private paginacionManual: Paginacion;
  /*Filtros de tomados de la vista*/
  public filtros: FiltrosBandejaAsignacion;
  public filtrosCarga: FiltrosBandejaCargaProgramacion;
  public filtrosCargaMasiva: FiltrosBandejaCargaProgramacion;
  public filtrosCargaManual: FiltrosBandejaAsignacion;
  public filtrosDetalle: FiltrosBandejaAsignacion;
  /*Arreglo dw objeto de devolución para tabla principal*/
  public asignaciones: Asignacion[];
  public detalles: Detalle[];
  public reasignacion: Reasignacion[];
  public objReasignacion: Reasignacion;
  public detallesCopy: Detalle[];
  public reasignacionCopy: Reasignacion[];
  /**Listas de carga de combobox iniciales */
  private listaParametros: ParametrosCargaBandeja;
  private listaParametrosMonitoreo: ParametrosCargaBandeja;
  /**valores boolean de vistas */
  mostrarPrincipal: boolean;
  mostrarAgregar: boolean;
  mostrarDetalle: boolean;
  mostrarAddBtn: boolean;
  mostrarMasiva: boolean;
  mostrarManual: boolean;
  /* Variable para mostrar el filtro de busqueda */
  public filtrosTexto: string;
  public filtrosTextoDetalle: string;
  public filtrosTextoManual: string;
  /* Variable para visualizar mensaje de filtro de busqueda */
  public mostrarFiltros: boolean;
  public mostrarFiltrosDetalle: boolean;
  public mostrarFiltrosManual: boolean;

  /* para validación de fechas */
  public today = new Date();
  /* Número de meses de consulta */
  private mesesConsulta: number;
  /* Número Rango de días */
  private rangoDias: number;
  private ultimosMeses: boolean = false;

  public archivo: File;
  private inputFile: string;
  private inputFileMasiva: string;

  public oficina: Oficina;
  public codigoOficina: number;
  public clrOficina: boolean;

  public empresa: Empresa;
  public codigoEmpresa: number;
  public clrEmpresa: boolean;
  public idDetalle: number;
  private formData: FormData;
  private formDataMasiva: FormData;
  private idEliminar: number;


  @ViewChild('FileInput') FileInput;

  constructor(private sanitizer: DomSanitizer,
    private monitoreoService: MonitoreoService,
    private router: Router,
    private datePipe: DatePipe,
    private zone: NgZone,
    private toastr: ToastrService,
    private validacionNumero: ValidacionService) {
    this.filtrosBusqueda = null;
    this.filtrosBusquedaDetalle = null;
    this.filtrosBusquedaCarga = null;
    this.filtrosBusquedaCargaMasiva = null;
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacionDetalle = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacionManual = new Paginacion({ registros: 10, pagina: 1 });
    this.asignaciones = new Array<Asignacion>();
    this.reasignacion = new Array<Reasignacion>();
    this.objReasignacion = new Reasignacion();
    this.detalles = new Array<Detalle>();
    this.detallesCopy = new Array<Detalle>();
    this.listaParametros = new ParametrosCargaBandeja();
    this.listaParametrosMonitoreo = new ParametrosCargaBandeja();
    this.filtros = new FiltrosBandejaAsignacion();
    this.filtrosCarga = new FiltrosBandejaCargaProgramacion();
    this.filtrosCargaMasiva = new FiltrosBandejaCargaProgramacion();
    this.filtrosCargaManual = new FiltrosBandejaAsignacion();
    this.filtrosDetalle = new FiltrosBandejaAsignacion();
    /* inicializa objetos de los combos pantalla principal */
    this.filtros.actividad = new Actividad();
    this.filtros.contratista = new Contratista();
    this.filtros.estado = new EstadoAsignacion();
    this.filtros.zona = new Zona();
    this.filtros.oficina = new Oficina();
    /* inicializa objetos de los combos pantalla carga */
    this.filtrosCarga.actividad = new Actividad();
    this.filtrosCarga.contratista = new Contratista();
    this.filtrosCarga.oficina = new Oficina();
    /* inicializa objetos de los combos pantalla carga masiva*/
    this.filtrosCargaMasiva.actividad = new Actividad();
    this.filtrosCargaMasiva.contratista = new Contratista();
    this.filtrosCargaMasiva.oficina = new Oficina();
    /* inicializa objetos de los combos pantalla carga masiva*/
    this.filtrosCargaManual.actividad = new Actividad();
    this.filtrosCargaManual.contratista = new Contratista();
    this.filtrosCargaManual.trabajador = new Trabajador();
    this.filtrosCargaManual.trabajadorAnt = new Trabajador();
    /* inicializa objetos de los combos pantalla detalle */
    this.filtrosDetalle.actividad = new Actividad();
    this.filtrosDetalle.contratista = new Contratista();
    this.filtrosDetalle.trabajador = new Trabajador();
    this.filtrosDetalle.zona = new Zona();
    this.filtrosDetalle.estado = new EstadoAsignacion();
    this.archivo = null;

  }

  ngOnInit() {
    this.listaParametrosMonitoreo = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.monitoreoService.consultarParametrosBusquedaAsignaciones().subscribe(
      (response: ResponseObject) => {
        this.listaParametros = response.resultado;
        this.listaParametros.listaOficina.length === 1 ? this.oficina = this.listaParametros.listaOficina[0] : this.oficina = null;
        this.listaParametros.listaOficina.length === 1 ? this.clrOficina = false : this.clrOficina = true;

        //Segun Perfil
        if (sessionStorage.getItem('codOficina') != null) {
          this.filtros.oficina.codigo = this.oficina.codigo;
          this.filtros.oficina.descripcion = this.oficina.descripcion;
        }
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

    /* inicializando lista  */
    this.asignaciones = [];
    this.reasignacion = [];
    this.detalles = [];
    this.detallesCopy = [];
    this.mostrarPrincipal = true;
    this.mostrarAgregar = false;
    this.mostrarDetalle = false;
    this.mostrarMasiva = false;
    this.mostrarManual = false;

    //validacion de botón anular por perfil
        console.log(sessionStorage.getItem('perfilAsignado'));
      if (sessionStorage.getItem('perfilAsignado') == '1' || sessionStorage.getItem('perfilAsignado') == '4'
      || sessionStorage.getItem('perfilAsignado') == '2') {
        this.mostrarAddBtn = true;
      } else {
        this.mostrarAddBtn = false;
      }


  }

  onObtenerAsignaciones() {

    this.loading = true;

    this.filtrosBusqueda = new FiltrosBandejaDigitalizados();
    this.filtrosBusqueda.actividad = new Actividad();
    this.filtrosBusqueda.estado = new EstadoAsignacion();
    this.filtrosBusqueda.contratista = new Contratista();
    /* this.filtrosBusqueda.zona = new Zona(); */
    this.filtrosBusqueda.oficina = new Oficina();

    this.filtrosBusqueda.actividad.codigo = this.filtros.actividad.codigo;
    this.filtrosBusqueda.actividad.descripcion = this.filtros.actividad.descripcion;
    this.filtrosBusqueda.estado.codigo = this.filtros.estado.codigo;
    this.filtrosBusqueda.estado.descripcion = this.filtros.estado.descripcion;
    this.filtrosBusqueda.contratista.codigo = this.filtros.contratista.codigo;
    this.filtrosBusqueda.contratista.descripcion = this.filtros.contratista.descripcion;
    /* this.filtrosBusqueda.zona.codigo = this.filtros.zona.codigo;
    this.filtrosBusqueda.zona.detalle = this.filtros.zona.detalle; */

    this.filtrosBusqueda.fechaAsignacionInicio = this.filtros.fechaAsignacionInicio;
    this.filtrosBusqueda.fechaAsignacionFin = this.filtros.fechaAsignacionFin;

    if(sessionStorage.getItem('codOficina')!=null){
      this.codigoOficina = Number(sessionStorage.getItem('codOficina'));
      this.filtrosBusqueda.oficina.codigo = this.codigoOficina;
      this.filtrosBusqueda.oficina.descripcion = sessionStorage.getItem('desOficina');
    }else{
      this.filtrosBusqueda.oficina.codigo = this.filtros.oficina.codigo;
      this.filtrosBusqueda.oficina.descripcion = this.filtros.oficina.descripcion;
    }
    /* if(sessionStorage.getItem('codEmpresa')!=null){
      this.codigoEmpresa = Number(sessionStorage.getItem('codEmpresa'));
      this.filtrosBusqueda.contratista.codigo = this.codigoEmpresa;
    }else{
      this.filtrosBusqueda.contratista.codigo = this.filtros.contratista.codigo;
    } */

    if (!this.validarFormulario(this.filtros)) {
      this.loading = false;
      this.mostrarFiltros = false;
      return false;
    }

    if (this.filtrosBusqueda) {

      this.monitoreoService.obtenerAsignaciones(this.filtrosBusqueda).subscribe(
        (response: ResponseObject) => {
          this.asignaciones = response.resultado.listaMonitoreoCab;
          if (!(response.resultado.listaMonitoreoCab.length > 0)) {
            this.loading = false;
            this.asignaciones = new Array<Asignacion>();
            this.paginacion = new Paginacion({pagina: 1, registros: 10})
            this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
            this.mostrarInformacionFiltros();
            return false;
          }
          /* seteo de la paginación manual */
          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.asignaciones.length,
            totalPaginas: this.asignaciones.length
          })
          /*  */
          this.loading = false;
          this.mostrarInformacionFiltros();
        },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    } else {
      this.loading = false;
    }



  }

  onLimpiarFiltros() {
    this.filtros.actividad = new Actividad();
    this.filtros.estado = new EstadoAsignacion();
    this.filtros.zona = new Zona();

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
    this.filtros.fechaAsignacionInicio = null;
    this.filtros.fechaAsignacionFin = null;
    this.mostrarFiltros = false;
    this.asignaciones = [];
    this.filtrosBusqueda = null;
  }
  onListarAsignaciones(): Asignacion[] {
    const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
    const fin: number = (this.paginacion.registros * this.paginacion.pagina);
    return this.asignaciones.slice(inicio, fin);
  }
  onListarReasignaciones(): Reasignacion[] {
    const inicio: number = (this.paginacionManual.pagina - 1) * this.paginacionManual.registros;
    const fin: number = (this.paginacionManual.registros * this.paginacionManual.pagina);
    return this.reasignacion.slice(inicio, fin);
  }

  regresarPrincipal(){
    this.router.navigate(['inicio']);
  }
  getAvance(avance: Asignacion){
    let number = (avance.cantProgramada/avance.cantAsignada)*100;
    return number.toFixed(2);
  }
  seleccionarViewContratistas(event) {
    if (event) {
      this.filtros.contratista.descripcion = event.descripcion;
    } else {
      this.filtros.contratista.descripcion = null;
    }
  }
  onSeleccionarOficina(event){
    if (event) {
      this.filtros.oficina.descripcion = event.descripcion;
    } else {
      this.filtros.oficina.descripcion = null;
    }
  }
  onSeleccionarOficinaCarga(event){
    if (event) {
      this.filtrosCarga.oficina.descripcion = event.descripcion;
    } else {
      this.filtrosCarga.oficina.descripcion = null;
    }
  }
  seleccionarViewContratistasCarga(event) {
    if (event) {
      this.filtrosCarga.contratista.descripcion = event.descripcion;
    } else {
      this.filtrosCarga.contratista.descripcion = null;
    }
  }
  onSeleccionarActividad(event) {
    if (event) {
      this.filtros.actividad.descripcion = event.descripcion;
    } else {
      this.filtros.actividad.descripcion = null;
    }
  }
  onSeleccionarActividadCarga(event) {
    if (event) {
      this.filtrosCarga.actividad.descripcion = event.descripcion;
    } else {
      this.filtrosCarga.actividad.descripcion = null;
    }
  }
  seleccionarviewEstado(event) {
    if (event) {
      this.filtros.estado.descripcion = event.detalle;
    } else {
      this.filtros.estado.descripcion = null;
    }
  }
  seleccionarviewEstadoDetalle(event) {
    if (event) {
      this.filtrosDetalle.estado.descripcion = event.detalle;
    } else {
      this.filtrosDetalle.estado.descripcion = null;
    }
  }
  seleccionarviewZona(event) {
    if (event) {
      this.filtros.zona.detalle = event.detalle;
    } else {
      this.filtros.zona.detalle = null;
    }
  }
  seleccionarviewZonaDetalle(event) {
    if (event) {
      this.filtrosDetalle.zona.detalle = event.detalle;
    } else {
      this.filtrosDetalle.zona.detalle = null;
    }
  }
  detectarCambioFechas() {
    if (!(this.filtros.fechaAsignacionInicio instanceof Date) || isNaN(this.filtros.fechaAsignacionInicio.getTime())) {
      this.filtros.fechaAsignacionInicio = null;
    }
    if (!(this.filtros.fechaAsignacionFin instanceof Date) || isNaN(this.filtros.fechaAsignacionFin.getTime())) {
      this.filtros.fechaAsignacionFin = null;
    }
    if (!(this.filtrosCargaMasiva.fecReasignacion instanceof Date) || isNaN(this.filtrosCargaMasiva.fecReasignacion.getTime())) {
      this.filtrosCargaMasiva.fecReasignacion = null;
    }
  }
  agregarTrabajo() {
    this.mostrarPrincipal = false;
    this.mostrarAgregar = true;
  }
  regresarCarga() {
    this.filtrosBusquedaCarga = new FiltrosBandejaCargaProgramacion;
    this.filtrosBusquedaCarga.actividad = new Actividad();
    this.filtrosBusquedaCarga.contratista = new Contratista();
    this.filtrosBusquedaCarga.oficina = new Oficina();
    this.filtrosBusquedaCarga.archivo = null;

    this.filtrosCarga = new FiltrosBandejaCargaProgramacion;
    this.filtrosCarga.actividad = new Actividad();
    this.filtrosCarga.contratista = new Contratista();
    this.filtrosCarga.oficina = new Oficina();
    this.filtrosCarga.archivo = null;
    this.inputFile = null;

    if (this.filtrosBusqueda) {

      this.monitoreoService.obtenerAsignaciones(this.filtrosBusqueda).subscribe(
        (response: ResponseObject) => {
          this.asignaciones = response.resultado.listaMonitoreoCab;
          /* seteo de la paginación manual */
          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.asignaciones.length,
            totalPaginas: this.asignaciones.length
          })
          /*  */
          this.loading = false;
          this.mostrarInformacionFiltros();
        },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }
    this.mostrarPrincipal = true;
    this.mostrarAgregar = false;
  }
  regresarCargaMasiva() {

    this.filtrosCargaMasiva.fecReasignacion = null;
    this.filtrosCargaMasiva.archivo = null;
    this.inputFileMasiva = null;
    this.mostrarDetalle = true;
    this.mostrarMasiva = false;
  }

  cargarDetalles(){

    if (this.filtrosBusqueda) {

            this.monitoreoService.obtenerAsignaciones(this.filtrosBusqueda).subscribe(
              (response: ResponseObject) => {
                this.asignaciones = response.resultado.listaMonitoreoCab;
                /* seteo de la paginación manual */
                this.paginacion = new Paginacion({
                  pagina: 1,
                  registros: 10,
                  totalRegistros: this.asignaciones.length,
                  totalPaginas: this.asignaciones.length
                })
                /*  */
                this.loading = false;
                this.mostrarInformacionFiltros();
                this.toastr.success("Reprogramación realizada con éxito.", Mensajes.CAB_MESSAGE_OK, { closeButton: true });
              },
              (error) => {
                this.loading = false;
                this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
              }
            );
          }
          this.mostrarPrincipal = true;
          this.mostrarMasiva = false;
  }

  regresarTrabajadores() {
        if (this.filtrosBusquedaDetalle) { //analizar

          this.monitoreoService.obtenerDetallesXFiltro(this.filtrosBusquedaDetalle).subscribe(
            (response: ResponseObject) => {
              this.detalles = response.resultado.listaMonitoreoCab;
              this.paginacion = new Paginacion({
                pagina: 1,
                registros: 10,
                totalRegistros: this.detalles.length,
                totalPaginas: this.detalles.length
              })
              this.loading = false;
              this.mostrarInformacionFiltrosDetalle();
            },
            (error) => {
              this.loading = false;
              this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            }
          );
        }
        this.mostrarDetalle = true;
        this.mostrarManual = false;
      }
  onCargarArchivos() {
    this.filtrosBusquedaCarga = new FiltrosBandejaCargaProgramacion;
    this.filtrosBusquedaCarga.actividad = this.filtrosCarga.actividad;
    this.filtrosBusquedaCarga.contratista = this.filtrosCarga.contratista;
    this.filtrosBusquedaCarga.oficina = this.filtrosCarga.oficina;
    this.formData = new FormData();

    if (this.filtrosBusquedaCarga.actividad && this.filtrosBusquedaCarga.contratista
        && this.filtrosBusquedaCarga.oficina && this.filtrosCarga.archivo) {

      this.formData.append('files', this.filtrosCarga.archivo, this.filtrosCarga.archivo.name);
      this.loading = true;

      this.monitoreoService.cargarArchivoProgramacion(this.filtrosBusquedaCarga, this.formData).subscribe(
        (response: ResponseObject) => {
          if (response.mensaje) {
            this.toastr.error(response.mensaje, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            this.loading = false;
            return false;
          }

          this.filtrosCarga = new FiltrosBandejaCargaProgramacion;
          this.filtrosCarga.actividad = new Actividad();
          this.filtrosCarga.contratista = new Contratista();
          this.filtrosCarga.oficina = new Oficina();
          this.filtrosCarga.archivo = null;
          this.inputFile = null;


          this.mostrarPrincipal = true;
          this.mostrarAgregar = false;
          this.loading = false;
        },
        (error: ResponseObject) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }else{
      this.toastr.error("Debe llenar todos los filtros y cargar un archivo", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
    }

  }
  onCargarArchivosMasiva() {
    this.loading = true;
    this.filtrosBusquedaCargaMasiva = new FiltrosBandejaCargaProgramacion;
    this.filtrosBusquedaCargaMasiva.actividad = this.filtrosCargaMasiva.actividad;
    this.filtrosBusquedaCargaMasiva.contratista = this.filtrosCargaMasiva.contratista;
    this.filtrosBusquedaCargaMasiva.fecReasignacion = this.filtrosCargaMasiva.fecReasignacion;
    this.filtrosBusquedaCargaMasiva.nroCarga = this.filtrosCargaMasiva.nroCarga;
    this.filtrosBusquedaCargaMasiva.idDetalle = this.filtrosCargaMasiva.idDetalle;

    this.formDataMasiva = new FormData();

    if (this.filtrosBusquedaCargaMasiva.actividad && this.filtrosBusquedaCargaMasiva.contratista && this.filtrosCargaMasiva.archivo) {
      this.formDataMasiva.append('files', this.filtrosCargaMasiva.archivo, this.filtrosCargaMasiva.archivo.name);

      this.monitoreoService.cargarArchivoProgramacionMasiva(this.filtrosBusquedaCargaMasiva, this.formDataMasiva).subscribe(
        (response: ResponseObject) => {
          if (response.mensaje) {
            this.toastr.error(response.mensaje, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            this.loading = false;
            return false;
          }

          this.filtrosCargaMasiva = new FiltrosBandejaCargaProgramacion();
          this.filtrosCargaMasiva.contratista = new Contratista();
          this.filtrosCargaMasiva.actividad = new Actividad();
          this.filtrosBusquedaCargaMasiva = null;
          this.mostrarPrincipal = true;
          this.mostrarMasiva = false;
          this.loading = false;

          this.cargarDetalles();
        },
        (error: ResponseObject) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }else{
      this.toastr.error("Debe llenar todos los filtros y cargar un archivo", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      this.loading = false;
    }

  }
  handleFileInput(evento) {
    this.filtrosCarga.archivo = evento.target.files[0];
    this.inputFile = this.filtrosCarga.archivo.name;
  }
  handleFileInputMasiva(evento) {
    this.filtrosCargaMasiva.archivo = evento.target.files[0];
    this.inputFileMasiva = this.filtrosCargaMasiva.archivo.name;
  }

  resetFile(): void {
    this.FileInput.nativeElement.value = '';
    /* this.existeArchivoMismoNombre = false; */
  }
  anularDetalle() {
    this.monitoreoService.anularCabecera(this.filtrosDetalle.idCabecera).subscribe(
      (response: ResponseObject) => {

        //regresa a la pantalla principal recarando la información
        this.loading = true;
          this.monitoreoService.obtenerAsignaciones(this.filtrosBusqueda).subscribe(
            (response: ResponseObject) => {
              this.asignaciones = response.resultado.listaMonitoreoCab;
              /* seteo de la paginación manual */
              this.paginacion = new Paginacion({
                pagina: 1,
                registros: 10,
                totalRegistros: this.asignaciones.length,
                totalPaginas: this.asignaciones.length
              })
              /*  */
              this.loading = false;
              this.mostrarInformacionFiltros();
            },
            (error) => {
              this.loading = false;
              this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            }
          );
          this.toastr.success("Anulación realizada con éxito.", Mensajes.CAB_MESSAGE_OK, { closeButton: true });
          this.mostrarDetalle = false;
          this.mostrarPrincipal = true;
      },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la anulación.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
    );

  }
  anularDetallePrincipal() {
    console.log(this.idEliminar);
    this.monitoreoService.anularCabecera(this.idEliminar).subscribe(
      (response: ResponseObject) => {

        //regresa a la pantalla principal recarando la información
        this.loading = true;
          this.monitoreoService.obtenerAsignaciones(this.filtrosBusqueda).subscribe(
            (response: ResponseObject) => {
              this.asignaciones = response.resultado.listaMonitoreoCab;
              /* seteo de la paginación manual */
              this.paginacion = new Paginacion({
                pagina: 1,
                registros: 10,
                totalRegistros: this.asignaciones.length,
                totalPaginas: this.asignaciones.length
              })
              /*  */
              this.loading = false;
              this.mostrarInformacionFiltros();
            },
            (error) => {
              this.loading = false;
              this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
            }
          );
          this.toastr.success("Anulación realizada con éxito.", Mensajes.CAB_MESSAGE_OK, { closeButton: true });
          this.mostrarDetalle = false;
          this.mostrarPrincipal = true;
      },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la anulación.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
    );

  }
  onObtenerDetalles() {
    this.loading = true;
    this.filtrosBusquedaDetalle = new FiltrosBandejaAsignacion;
    this.filtrosBusquedaDetalle.actividad = this.filtrosDetalle.actividad;
    this.filtrosBusquedaDetalle.contratista = this.filtrosDetalle.contratista;
    this.filtrosBusquedaDetalle.fechaAsignacionDetalle = this.filtrosDetalle.fechaAsignacionDetalle;
    this.filtrosBusquedaDetalle.idCabecera = this.filtrosDetalle.idCabecera;
    this.filtrosBusquedaDetalle.suministro = this.filtrosDetalle.suministro;
    this.filtrosBusquedaDetalle.trabajador = this.filtrosDetalle.trabajador;
    if (this.filtrosDetalle.estado.codigo) {
      this.filtrosBusquedaDetalle.estado = this.filtrosDetalle.estado;
    }else{
      this.filtrosBusquedaDetalle.estado = null;
    }

    if (this.filtrosDetalle.zona.codigo) {
      this.filtrosBusquedaDetalle.zona = this.filtrosDetalle.zona;
    }else{
      this.filtrosBusquedaDetalle.zona = null;
    }


    if (!this.validarFormularioDetalle(this.filtrosBusquedaDetalle)) {
      this.loading = false;
      this.mostrarFiltrosDetalle = false;
      return false;
    }

    if (this.filtrosBusquedaDetalle) {
      this.monitoreoService.obtenerDetallesXFiltro(this.filtrosBusquedaDetalle).subscribe(
        (response: ResponseObject) => {


          if (!(response.resultado.listaMonitoreoDet.length > 0)) {
            this.loading = false;
            this.detalles = new Array<Detalle>();
            this.paginacionDetalle = new Paginacion({pagina: 1, registros: 10})
            this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
            this.mostrarInformacionFiltrosDetalle();
            return false;
          }
          this.detalles = response.resultado.listaMonitoreoDet;
            /* seteo de la paginación manual */
            this.paginacionDetalle = new Paginacion({
              pagina: 1,
              registros: 10,
              totalRegistros: this.detalles.length,
              totalPaginas: this.detalles.length
            })
            /*  */
            this.loading = false;
            this.mostrarDetalle = true;
            this.mostrarPrincipal = false;
            this.mostrarInformacionFiltrosDetalle();
        },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda del detalle.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }


  }
  onObtenerTrabajadorManual() {
    this.loading = true;
    this.filtrosBusquedaManual = new FiltrosBandejaAsignacion;
    this.filtrosBusquedaManual.actividad = this.filtrosCargaManual.actividad;
    this.filtrosBusquedaManual.contratista = this.filtrosCargaManual.contratista;
    this.filtrosBusquedaManual.fechaAsignacionManual = this.filtrosCargaManual.fechaAsignacionManual;
    this.filtrosBusquedaManual.nroCarga = this.filtrosCargaManual.nroCarga;
    this.filtrosBusquedaManual.suministro = this.filtrosCargaManual.suministro;
    this.filtrosBusquedaManual.trabajador = this.filtrosCargaManual.trabajador;
    this.filtrosBusquedaManual.trabajadorAnt = this.filtrosCargaManual.trabajadorAnt;

/*
    if (!this.validarFormularioDetalle(this.filtrosBusquedaManual)) {
      this.loading = false;
      this.mostrarFiltrosDetalle = false;
      return false;
    } */
    if (this.filtrosBusquedaManual) {
      this.monitoreoService.obtenerTrabajadoresManual(this.filtrosBusquedaManual).subscribe(
        (response: ResponseObject) => {
          this.reasignacion = response.resultado.listarReprogramacionDetalle;
            /* seteo de la paginación manual */
            this.paginacionManual = new Paginacion({
              pagina: 1,
              registros: 10,
              totalRegistros: this.reasignacion.length,
              totalPaginas: this.reasignacion.length
            })
            /*  */
            this.loading = false;
/*             this.mostrarDetalle = true;
            this.mostrarPrincipal = false; */
            this.mostrarInformacionFiltrosManual();
        },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda del detalle.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }


  }
  regresarDetalle() {
    this.filtrosDetalle.suministro = null;
    this.filtrosDetalle.trabajador = new Trabajador();
    this.filtrosDetalle.zona = new Zona();
    this.filtrosDetalle.estado = new EstadoAsignacion();

      this.mostrarPrincipal = true;
      this.mostrarDetalle = false;
  }
  onReasignacionMasiva() {
    this.filtrosCargaMasiva = new FiltrosBandejaCargaProgramacion;
    this.filtrosCargaMasiva.actividad = this.filtrosDetalle.actividad;
    this.filtrosCargaMasiva.contratista = this.filtrosDetalle.contratista;
    this.filtrosCargaMasiva.idDetalle = this.filtrosDetalle.idCabecera;
    this.filtrosCargaMasiva.nroCarga = this.filtrosDetalle.nroCarga;

    this.mostrarDetalle = false;
    this.mostrarMasiva = true;
  }

  validarFormulario(filtros: FiltrosBandejaAsignacion) {
    let valida: boolean;
    if (filtros.actividad.codigo && filtros.contratista.codigo && filtros.estado.codigo
       /* && filtros.fechaAsignacionInicio && filtros.fechaAsignacionFin */ && filtros.oficina.codigo) {

      if (filtros.fechaAsignacionInicio && filtros.fechaAsignacionFin) {
        if (filtros.fechaAsignacionInicio.setHours(0, 0, 0, 0) > filtros.fechaAsignacionFin.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.error("La Fecha Inicio debe ser menor o igual a la Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }
       /*  else if (filtros.fechaAsignacionInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0) ||
          filtros.fechaAsignacionFin.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.error("Las fechas no deben ser mayores a la fecha actual", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }  */
        else {
          let diasFecha=0;
                diasFecha = moment(filtros.fechaAsignacionFin).diff(moment(filtros.fechaAsignacionInicio), 'days') + 1;
                 if(diasFecha > this.rangoDias){
                  valida = false;
                  this.toastr.error("Los dias del rango de fechas no debe superar los " + this.rangoDias + " días", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                 }else{
                  valida = true;
                 }
        }
      }else if(!(filtros.fechaAsignacionInicio || filtros.fechaAsignacionFin)){
             filtros.fechaAsignacionFin    = moment(new Date).toDate();
             filtros.fechaAsignacionInicio = moment(new Date).add(-this.mesesConsulta, 'months').toDate();
             valida = true;

       }
    } else {
      valida = false;
      this.toastr.error("Debe seleccionar todos los filtros", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }


    return valida;
  }
  validarFormularioDetalle(filtros: FiltrosBandejaAsignacion) {
    let valida: boolean;
    if (filtros.actividad.codigo && filtros.contratista.codigo && filtros.fechaAsignacionDetalle && filtros.idCabecera) {
          valida = true;
    } else {
      valida = false;
      this.toastr.error("Debe seleccionar todos los filtros", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }

    return valida;
  }

  private mostrarInformacionFiltros() {
    let mensaje = '<strong>Búsqueda Por: </strong>';
    if (this.filtrosBusqueda.contratista.codigo) {
      mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusqueda.contratista.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.actividad.codigo) {
      mensaje = mensaje + '<br/><strong>Actividad: </strong> <parrafo>' + this.filtrosBusqueda.actividad.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.estado.codigo) {
      mensaje = mensaje + '<br/><strong>Estado: </strong> <parrafo>' + this.filtrosBusqueda.estado.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.oficina.codigo) {
      mensaje = mensaje + '<br/><strong>Oficina: </strong> <parrafo>' + this.filtrosBusqueda.oficina.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.fechaAsignacionInicio && this.filtrosBusqueda.fechaAsignacionFin) {
     mensaje = mensaje + '<br/><strong>Rango de fechas: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaAsignacionInicio, 'dd/MM/yyyy') + ' hasta ' + this.datePipe.transform(this.filtrosBusqueda.fechaAsignacionFin, 'dd/MM/yyyy') + '</parrafo>' + ' ';
    /*
      mensaje = mensaje + '<br/><strong>Rango de fechas: </strong> Últimos <parrafo>' + this.mesesConsulta + ' meses</parrafo>' + ' '; */
      this.mostrarFiltros = true;
    }

    if (this.mostrarFiltros) {
      this.filtrosTexto = mensaje;
    }
  }

  private mostrarInformacionFiltrosDetalle() {
    let mensaje = '<strong>Búsqueda Por: </strong>';
    if (this.filtrosBusquedaDetalle.idCabecera) {
      mensaje = mensaje + '<br/><strong>Id. Detalle: </strong> <parrafo>' + this.filtrosBusquedaDetalle.idCabecera + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.fechaAsignacionDetalle) {
      mensaje = mensaje + '<br/><strong>Fecha Asignación: </strong> <parrafo>' + this.filtrosBusquedaDetalle.fechaAsignacionDetalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.contratista.codigo) {
      mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusquedaDetalle.contratista.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.actividad.codigo) {
      mensaje = mensaje + '<br/><strong>Actividad: </strong> <parrafo>' + this.filtrosBusquedaDetalle.actividad.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.trabajador.codigo) {
      mensaje = mensaje + '<br/><strong>Cod. Trabajador: </strong> <parrafo>' + this.filtrosBusquedaDetalle.trabajador.codigo + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.suministro) {
      mensaje = mensaje + '<br/><strong>Suministro: </strong> <parrafo>' + this.filtrosBusquedaDetalle.suministro + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.zona) {
      mensaje = mensaje + '<br/><strong>Zona: </strong> <parrafo>' + this.filtrosBusquedaDetalle.zona.detalle + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }
    if (this.filtrosBusquedaDetalle.estado) {
      mensaje = mensaje + '<br/><strong>Estado: </strong> <parrafo>' + this.filtrosBusquedaDetalle.estado.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosDetalle = true;
    }

    if (this.mostrarFiltrosDetalle) {
      this.filtrosTextoDetalle = mensaje;
    }
  }

  private mostrarInformacionFiltrosManual() {
    let mensaje = '<strong>Búsqueda Por: </strong>';
    if (this.filtrosBusquedaManual.suministro) {
      mensaje = mensaje + '<br/><strong>Id. Detalle: </strong> <parrafo>' + this.filtrosBusquedaManual.suministro + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.nroCarga) {
      mensaje = mensaje + '<br/><strong>Nro. Carga: </strong> <parrafo>' + this.filtrosBusquedaManual.nroCarga + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.fechaAsignacionManual) {
      mensaje = mensaje + '<br/><strong>Fecha Asignación: </strong> <parrafo>' + this.filtrosBusquedaManual.fechaAsignacionManual + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.contratista.codigo) {
      mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusquedaManual.contratista.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.actividad.codigo) {
      mensaje = mensaje + '<br/><strong>Actividad: </strong> <parrafo>' + this.filtrosBusquedaManual.actividad.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.trabajador.codigo) {
      mensaje = mensaje + '<br/><strong>Cod. Trabajador Reemplazante: </strong> <parrafo>' + this.filtrosBusquedaManual.trabajador.codigo + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }
    if (this.filtrosBusquedaManual.trabajador.nombre) {
      mensaje = mensaje + '<br/><strong>Nombre Trabajador Reemplazante: </strong> <parrafo>' + this.filtrosBusquedaManual.trabajador.nombre + '</parrafo>' + ' ';
      this.mostrarFiltrosManual = true;
    }

    if (this.mostrarFiltrosManual) {
      this.filtrosTextoManual = mensaje;
    }
  }

  onPageChanged(event): void {
    this.paginacion.pagina = event.page;
  }

  onPageChangedDetalle(event): void {
    this.paginacionDetalle.pagina = event.page;
  }

  onPageChangedManual(event): void {
    this.paginacionManual.pagina = event.page;
  }
  onPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
  }
  onPageOptionChangedDetalle(event): void {
    this.paginacionDetalle.registros = event.rows;
    this.paginacionDetalle.pagina = 1;
  }
  onPageOptionChangedManual(event): void {
    this.paginacionManual.registros = event.rows;
    this.paginacionManual.pagina = 1;
  }
  eliminarFiltros(){
    this.mostrarFiltros = false;
    this.onLimpiarFiltros();
  }
  eliminarFiltrosDetalle(){
    this.mostrarFiltrosDetalle = false;
    this.detalles = this.detallesCopy;
    this.paginacionDetalle = new Paginacion({
      pagina: 1,
      registros: 10,
      totalRegistros: this.detalles.length,
      totalPaginas: this.detalles.length
    })
    this.onLimpiarFiltrosDetalle();
  }
  onLimpiarFiltrosDetalle() {
    this.filtrosDetalle.estado = new EstadoAsignacion();
    this.filtrosDetalle.zona = new Zona();
    this.filtrosDetalle.suministro = null;
    this.filtrosDetalle.trabajador = new Trabajador();
  }
  eliminarFiltrosManual(){
    this.mostrarFiltrosManual = false;
    this.reasignacion = this.reasignacionCopy;
    this.paginacionManual = new Paginacion({
      pagina: 1,
      registros: 10,
      totalRegistros: this.reasignacion.length,
      totalPaginas: this.reasignacion.length
    })
  }
  buscarAsignacion(asignacion){
    this.loading = true;
    this.monitoreoService.obtenerDetalles(asignacion.idCabecera).subscribe(
      (response: ResponseObject) => {
        this.detalles = response.resultado.listaMonitoreoDet;
        this.detallesCopy = response.resultado.listaMonitoreoDet;
        this.filtrosDetalle.actividad = this.filtrosBusqueda.actividad;
        this.filtrosDetalle.contratista = this.filtrosBusqueda.contratista;
        this.filtrosDetalle.idCabecera = asignacion.idCabecera;
        this.filtrosDetalle.nroCarga = asignacion.numeroCarga;
        this.filtrosDetalle.fechaAsignacionDetalle = asignacion.fechaAsignacion;
          /* seteo de la paginación manual */
          this.paginacionDetalle = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.detalles.length,
            totalPaginas: this.detalles.length
          })
          /*  */
          this.loading = false;
          this.mostrarDetalle = true;
          this.mostrarPrincipal = false;
      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
  visualizarTrabajadores(detalle){
    this.loading = true;
    let requestReasignacion: FiltrosBandejaAsignacion = new FiltrosBandejaAsignacion;
    requestReasignacion.trabajador = new Trabajador;
    requestReasignacion.actividad = new Actividad;
    requestReasignacion.contratista = new Contratista;
    requestReasignacion.idCabecera = this.filtrosDetalle.idCabecera;

    requestReasignacion.trabajadorAnt = detalle.trabajador;
    requestReasignacion.actividad = detalle.actividad;
    requestReasignacion.contratista = this.filtrosDetalle.contratista;


    this.monitoreoService.obtenerReasignaciones(requestReasignacion).subscribe(
      (response: ResponseObject) => {
        this.reasignacion = response.resultado.listarReprogramacionDetalle;
        this.reasignacionCopy = response.resultado.listarReprogramacionDetalle;
        this.filtrosCargaManual.actividad = detalle.actividad;
        this.filtrosCargaManual.contratista = this.filtrosDetalle.contratista;
        this.filtrosCargaManual.nroCarga = this.filtrosDetalle.nroCarga;
        this.filtrosCargaManual.fechaAsignacionManual = this.filtrosDetalle.fechaAsignacionDetalle;
        this.filtrosCargaManual.suministro = detalle.suministro;
        this.filtrosCargaManual.trabReemplazar = detalle.trabajador.codigo + " - " + detalle.trabajador.nombre;
        this.filtrosCargaManual.idCabecera = this.filtrosDetalle.idCabecera;
        this.filtrosCargaManual.trabajadorAnt = detalle.trabajador;
                  /* seteo de la paginación manual */
          this.paginacionManual = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.reasignacion.length,
            totalPaginas: this.reasignacion.length
          })
          /*  */
          this.loading = false;
          this.mostrarManual = true;
          this.mostrarDetalle = false;
      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
  eliminarAsignacion(event){
    this.idEliminar = event.idCabecera;
  }
  onListarDetalle():Detalle[]{
    const inicio: number = (this.paginacionDetalle.pagina - 1) * this.paginacionDetalle.registros;
    const fin: number = (this.paginacionDetalle.registros * this.paginacionDetalle.pagina);
    return this.detalles.slice(inicio, fin);
  }
  asignarObjTrabajador(reasignacion){
    this.objReasignacion = new Reasignacion();
    this.objReasignacion = reasignacion;
  }
  asignarTrabajador(){
    this.loading = true;
    let requestReasignacion: RequestReasignacion = new RequestReasignacion;
    requestReasignacion.trabajadorAntiguo = new Trabajador;
    requestReasignacion.trabajadorNuevo = new Trabajador;

    requestReasignacion.nroCarga = this.filtrosCargaManual.nroCarga;
    requestReasignacion.suministro = this.filtrosCargaManual.suministro;
    requestReasignacion.trabajadorAntiguo = this.filtrosCargaManual.trabajadorAnt
    requestReasignacion.trabajadorNuevo = this.objReasignacion.trabajador;

    this.monitoreoService.reasignarTrabajador(requestReasignacion).subscribe(
      (response: ResponseObject) => {
        if (response.mensaje == "Información incompleta.") {
          this.toastr.warning("El trabajador no puede ser asignado a esta tarea.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          this.loading = false;
          return false;
        } else {
          this.returnDetalle(this.filtrosCargaManual);
        }
      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );



  }

  returnDetalle(filtrosCargaManual){
    this.monitoreoService.obtenerDetalles(filtrosCargaManual.idCabecera).subscribe(
      (response: ResponseObject) => {
        this.detalles = response.resultado.listaMonitoreoDet;
        this.detallesCopy = response.resultado.listaMonitoreoDet;
        this.filtrosDetalle.actividad = filtrosCargaManual.actividad;
        this.filtrosDetalle.contratista = filtrosCargaManual.contratista;
        this.filtrosDetalle.idCabecera = filtrosCargaManual.idCabecera;
        this.filtrosDetalle.nroCarga = filtrosCargaManual.nroCarga;
        this.filtrosDetalle.fechaAsignacionDetalle = filtrosCargaManual.fechaAsignacionManual;
          /* seteo de la paginación manual */
          this.paginacionDetalle = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.detalles.length,
            totalPaginas: this.detalles.length
          })
          /*  */
          /* limpiado de los filtros */
          this.filtrosDetalle.suministro = null;
          this.filtrosDetalle.trabajador = new Trabajador();
          this.filtrosDetalle.zona = new Zona();
          this.filtrosDetalle.estado = new EstadoAsignacion();
          /*  */
          this.loading = false;
          this.toastr.success("Trabajador asignado con éxito.", Mensajes.CAB_MESSAGE_OK, { closeButton: true });
          this.mostrarManual = false;
          this.mostrarDetalle = true;
      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
}
