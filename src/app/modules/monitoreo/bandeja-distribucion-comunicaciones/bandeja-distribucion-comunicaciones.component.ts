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
import { Router } from '@angular/router';
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
import { TomaEstado } from 'src/app/models/tomaEstado';
import { DistribucionComunicacionDet } from 'src/app/models/distribucionComunicacionDet';
import { RequestVisorMonitoreo } from 'src/app/models/request/request-visor-monitoreo';



@Component({
  selector: 'app-bandeja-distribucion-comunicaciones',
  templateUrl: './bandeja-distribucion-comunicaciones.component.html',
  styleUrls: ['./bandeja-distribucion-comunicaciones.component.scss']
})

export class BandejaDistComunicacionesComponent implements OnInit {
  name = 'Angular';
  localIp = sessionStorage.getItem('LOCAL_IP');

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  /* gif onloading */
  public loading: boolean;

  public monitoreos: Monitoreo[];
  public cabecera: Monitoreo;
  public distComunicacion: DistribucionComunicacionDet[];
  public distComunicacionCopy: DistribucionComunicacionDet[];
  /* Variable para la paginación */
  public paginacion: Paginacion;
  public paginacion2: Paginacion;

  public filtros: FiltrosBandejaMonitoreo;
  public filtrosBusqueda: FiltrosBandejaMonitoreo;
  public filtrosDetalle: FiltrosBandejaMonitoreoDetalle;
  public filtrosBusquedaDetalle: FiltrosBandejaMonitoreoDetalle;

  public mostrarPrincipal: boolean;
  public mostrarDetalle: boolean;
  public mostrarAddBtn: boolean;
  public verExportarExcel: boolean;
/*   public mostrarNmed: boolean; */
  /* public mostrarCiclo: boolean; */
  public listaParametros: ParametrosCargaBandeja;
  public listaParametrosMonitoreo: ParametrosCargaBandeja;

  public oficina: Oficina;
  public codigoOficina: number;
  public clrOficina: boolean;
  public empresa: Empresa;
  public codigoEmpresa: number;
  public clrEmpresa: boolean;
  /* Variable para mostrar el filtro de busqueda */
  public filtrosTexto: string;
  public filtrosTextoDetalle: string;
  /* Variable para visualizar mensaje de filtro de busqueda */
  public mostrarFiltros: boolean;
  public mostrarFiltrosDetalle: boolean;

  /* para validación de fechas */
  public today = new Date();
  /* Número de meses de consulta */
  private mesesConsulta: number;
  /* Número Rango de días */
  private rangoDias: number;
  public sumVisor: number;
  public arrayImagenes:any = null;

  @ViewChild('visorImgSwal') private visorImgSwal: SwalComponent;
  @ViewChild('FileInput') FileInput;

  constructor(private sanitizer: DomSanitizer,
    private monitoreoService: MonitoreoService,
    private documentosService: DocumentosService,
    private datePipe: DatePipe,
    private router: Router,
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
    this.filtros.ciclo = new Parametro();
    this.filtros.periodo = new Parametro();
    this.filtros.imposibilidad = new Parametro();
    this.filtros.tipoActividad = new Parametro();
    this.filtros.foto = new Parametro();
    this.filtros.semaforo = new Parametro();
    this.filtros.tipoNotificacion = new Parametro();
    this.filtros.operario = new Trabajador();
    this.listaParametros = new ParametrosCargaBandeja();
    this.listaParametrosMonitoreo = new ParametrosCargaBandeja();

    this.filtrosDetalle = new FiltrosBandejaMonitoreoDetalle();
    this.filtrosDetalle.foto = new Parametro();
    this.filtrosDetalle.periodo = new Parametro();
    this.filtrosDetalle.ciclo = new Parametro();
    this.filtrosDetalle.incidencia = new Parametro();
    this.filtrosDetalle.subIncidencia = new Parametro();
    this.filtrosDetalle.estado = new Parametro();
    this.filtrosDetalle.cumplimiento = new Parametro();
    this.filtrosDetalle.tipoEntrega = new Parametro();
    this.filtrosDetalle.contratista = new Contratista();
    this.filtrosDetalle.trabajador = new Trabajador();

  }

  ngOnInit() {
    this.listaParametrosMonitoreo = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.monitoreoService.consultarParametrosBusquedaMonitoreo('DC').subscribe(
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

      this.verExportarExcel = false;
      this.mostrarPrincipal = true;
      this.mostrarDetalle = false;
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
  onListarDetalles(): DistribucionComunicacionDet[] {
    const inicio: number = (this.paginacion2.pagina - 1) * this.paginacion2.registros;
    const fin: number = (this.paginacion2.registros * this.paginacion2.pagina);
    return this.distComunicacion.slice(inicio, fin);
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
  seleccionarViewSemaforo(event) {
    if (event) {
    this.filtros.semaforo.detalle = event.detalle;
    } else {
      this.filtros.semaforo = new Parametro();
    }
  }
  onSeleccionarTipoTipoNotificacion(event) {
    if (event) {
    this.filtros.tipoNotificacion.detalle = event.detalle;
    } else {
      this.filtros.tipoNotificacion = new Parametro();
    }
  }

  onSeleccionarOficina(event) {
    if (event) {
      this.filtros.oficina.descripcion = event.descripcion;
    } else {
      this.filtros.oficina = new Oficina();
    }
  }

  onSeleccionarTipoActividad(event) {
    if (event) {
      this.filtros.tipoActividad.detalle = event.detalle;
    } else {
      this.filtros.tipoActividad = new Parametro();
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
  seleccionarviewTipoEntrega(event) {
    if (event) {
      this.filtrosDetalle.tipoEntrega.detalle = event.detalle;
    } else {
      this.filtrosDetalle.tipoEntrega = new Parametro();
    }
  }
  seleccionarviewIncidencia(event) {
    if (event) {
      this.filtrosDetalle.incidencia.detalle = event.detalle;
    } else {
      this.filtrosDetalle.incidencia = new Parametro();
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
  detectarCambioFechas() {
    if (!(this.filtros. fechaProgramacionInicio instanceof Date) || isNaN(this.filtros. fechaProgramacionInicio.getTime())) {
      this.filtros. fechaProgramacionInicio = null;
    }
    if (!(this.filtros.fechaProgramacionFin instanceof Date) || isNaN(this.filtros.fechaProgramacionFin.getTime())) {
      this.filtros.fechaProgramacionFin = null;
    }
  }    onSeleccionarSemaforo(event) {
    if (event) {
      this.filtros.semaforo.detalle = event.detalle;
    } else {
      this.filtros.semaforo = new Parametro();
    }
  }

  validarFormulario(filtros: FiltrosBandejaMonitoreo) {
    let valida: boolean;
    if ( filtros.contratista.codigo && filtros.oficina.codigo ) {
      if(filtros.suministro && !Number(filtros.suministro)){
        valida = false;
        this.toastr.warning("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
      else if(filtros.numMedidor && !Number(filtros.numMedidor)){
        valida = false;
        this.toastr.warning("El Número de Medidor debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
      else if(filtros.operario.codigo && !Number(filtros.operario.codigo)){
        valida = false;
        this.toastr.warning("El código de operario debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }else if (filtros. fechaProgramacionInicio && filtros.fechaProgramacionFin) {
        if (filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > filtros.fechaProgramacionFin.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.warning("La Fecha Inicio debe ser menor o igual a la Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        } /* else if (filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0) ||
          filtros. fechaProgramacionInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.warning("Las fechas no deben ser mayores a la fecha actual", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        }  */else {
          let diasFecha = 0;
          diasFecha = moment(filtros.fechaProgramacionFin).diff(moment(filtros. fechaProgramacionInicio), 'days') + 1;
          if (diasFecha > this.rangoDias) {
            valida = false;
            this.toastr.warning("Los dias del rango de fechas no debe superar los " + this.rangoDias + " días", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          } else {
            valida = true;
          }
        }
      } else if (!(filtros. fechaProgramacionInicio || filtros.fechaProgramacionFin)) {
        if (filtros.periodo.codigo) {
          if (filtros.ciclo.codigo) {
            valida = true;
          } else {
            valida = false;
            this.toastr.warning("El ciclo es obligatorio si selecciona un periodo", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          }
        } else {
          filtros.fechaProgramacionFin = moment(new Date).toDate();
          filtros. fechaProgramacionInicio = moment(new Date).toDate();
          valida = true;
        }

      }else if ((!filtros. fechaProgramacionInicio && filtros.fechaProgramacionFin) ||
      (filtros. fechaProgramacionInicio && !filtros.fechaProgramacionFin)){
        valida = false;
        this.toastr.warning("Debe elegir ambas fechas", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    } else {
      valida = false;
      this.toastr.warning("Debe seleccionar todos los filtros obligatorios", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    return valida;
  }

  validarFormularioDetalle(filtros: FiltrosBandejaMonitoreoDetalle) {
    let valida: boolean;
    if ( filtros.contratista.codigo ) {
      if(filtros.suministro && !Number(filtros.suministro)){
        valida = false;
        this.toastr.error("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }else{
        valida = true;
      }
    } else {
      valida = false;
      this.toastr.error("Debe seleccionar todos los filtros obligatorios", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    return valida;
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
    eliminarFiltros(){
      this.verExportarExcel = false;
      this.mostrarFiltros = false;
      /* this.onLimpiarFiltros(); */
      this.monitoreos = new Array<Monitoreo>();
      this.paginacion = new Paginacion({
        pagina: 1,
        registros: 10
      })
    }

    eliminarFiltrosDetalle(){
      this.mostrarFiltrosDetalle = false;
      /* this.onLimpiarFiltros(); */
      this.distComunicacion = this.distComunicacionCopy;
      this.paginacion2 = new Paginacion({
        pagina: 1,
        registros: 10,
        totalRegistros: this.distComunicacion.length,
        totalPaginas: this.distComunicacion.length
      })
    }
    private mostrarInformacionFiltros() {
      let mensaje = '<strong>Búsqueda Por: </strong>';
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
/*       if (this.filtrosBusqueda.periodo) {
        mensaje = mensaje + '<br/><strong>Periodo: </strong> <parrafo>' + this.filtrosBusqueda.periodo.detalle + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      }
      if (this.filtrosBusqueda.ciclo) {
        mensaje = mensaje + '<br/><strong>Ciclo: </strong> <parrafo>' + this.filtrosBusqueda.ciclo.detalle + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      } */
      if (this.filtrosBusqueda.tipoActividad) {
        mensaje = mensaje + '<br/><strong>Sub Actividad: </strong> <parrafo>' + this.filtrosBusqueda.tipoActividad.detalle + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      }
      if (this.filtrosBusqueda.cedulaNotificacion) {
        mensaje = mensaje + '<br/><strong>Cédula Notificación: </strong> <parrafo>' + this.filtrosBusqueda.cedulaNotificacion + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      }
      if (this.filtrosBusqueda.tipoNotificacion) {
        mensaje = mensaje + '<br/><strong>Tipo Notificación: </strong> <parrafo>' + this.filtrosBusqueda.tipoNotificacion.codigo + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      }
      if (this.filtrosBusqueda.operario.codigo) {
        mensaje = mensaje + '<br/><strong>Código Operario: </strong> <parrafo>' + this.filtrosBusqueda.operario.codigo + '</parrafo>' + ' ';
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
      let mensaje = '<strong>Búsqueda Por: </strong>';
      if (this.filtrosBusquedaDetalle.contratista.codigo) {
        mensaje = mensaje + '<br/><strong>Contratista: </strong> <parrafo>' + this.filtrosBusquedaDetalle.contratista.descripcion + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.fechaProgramacion) {
        mensaje = mensaje + '<br/><strong>Fecha Programación: </strong> <parrafo>' + this.filtrosBusquedaDetalle.fechaProgramacion + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.trabajador) {
        mensaje = mensaje + '<br/><strong>Código Operario: </strong> <parrafo>' + this.filtrosBusquedaDetalle.trabajador.codigo + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.incidencia) {
        mensaje = mensaje + '<br/><strong>Incidencia: </strong> <parrafo>' + this.filtrosBusquedaDetalle.incidencia.detalle + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.foto) {
        mensaje = mensaje + '<br/><strong>Foto: </strong> <parrafo>' + this.filtrosBusquedaDetalle.foto.detalle + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.estado) {
        mensaje = mensaje + '<br/><strong>Estado: </strong> <parrafo>' + this.filtrosBusquedaDetalle.estado.detalle + '</parrafo>' + ' ';
        this.mostrarFiltrosDetalle = true;
      }
      if (this.filtrosBusquedaDetalle.tipoEntrega) {
        mensaje = mensaje + '<br/><strong>Tipo Entrega: </strong> <parrafo>' + this.filtrosBusquedaDetalle.tipoEntrega.detalle + '</parrafo>' + ' ';
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
  buscarDetalle(monitoreo) {
    this.loading = true;
    this.monitoreoService.obtenerDetallesMonitoreo(monitoreo).subscribe(
      (response: ResponseObject) => {
        if (!(response.resultado.listarMonitoreoDetalle.length > 0)) {
          this.loading = false;
          this.distComunicacion = new Array<DistribucionComunicacionDet>();
          this.paginacion2 = new Paginacion({pagina: 1, registros: 10})
          this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          return false;
        }
        this.cabecera = monitoreo;
        this.distComunicacion = response.resultado.listarMonitoreoDetalle;
        this.distComunicacionCopy = response.resultado.listarMonitoreoDetalle;
        this.mostrarPrincipal = false;
        this.mostrarDetalle = true;
        this.loading = false;

        this.paginacion2 = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: this.distComunicacion.length,
          totalPaginas: this.distComunicacion.length
        })

        this.filtrosDetalle.contratista = this.filtrosBusqueda.contratista;
        this.filtrosDetalle.trabajador = monitoreo.trabajador;
        this.filtrosDetalle.fechaProgramacion = monitoreo.fechaProgramacion;
        if (monitoreo.trabajador.nombre) {
          this.filtrosDetalle.operarioCodNombre = monitoreo.trabajador.codigo + " - " + monitoreo.trabajador.nombre;
        } else {
          this.filtrosDetalle.operarioCodNombre = monitoreo.trabajador.codigo
        }

      },
      (error) => {
        this.loading = false;
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }


  onObtenerDetalles() {
    this.loading = true;
    this.filtrosBusquedaDetalle = new FiltrosBandejaMonitoreoDetalle();
    this.filtrosBusquedaDetalle.foto = new Parametro();
    this.filtrosBusquedaDetalle.periodo = new Parametro();
    this.filtrosBusquedaDetalle.ciclo = new Parametro();
    this.filtrosBusquedaDetalle.incidencia = new Parametro();
    this.filtrosBusquedaDetalle.subIncidencia = new Parametro();
    this.filtrosBusquedaDetalle.estado = new Parametro();
    this.filtrosBusquedaDetalle.cumplimiento = new Parametro();
    this.filtrosBusquedaDetalle.contratista = new Contratista();
    this.filtrosBusquedaDetalle.trabajador = new Trabajador();

    if (!this.validarFormularioDetalle(this.filtrosDetalle)) {
      this.loading = false;
      return false;
    }

    if (this.filtrosDetalle.foto.codigo) {
      this.filtrosBusquedaDetalle.foto = this.filtrosDetalle.foto;
    } else {
      this.filtrosBusquedaDetalle.foto = null;
    }
    if (this.filtrosDetalle.ciclo.codigo) {
      this.filtrosBusquedaDetalle.ciclo = this.filtrosDetalle.ciclo;
    } else {
      this.filtrosBusquedaDetalle.ciclo = null;
    }
    if ( this.filtrosDetalle.incidencia.codigo) {
      this.filtrosBusquedaDetalle.incidencia = this.filtrosDetalle.incidencia;
    } else {
      this.filtrosBusquedaDetalle.incidencia = null;
    }
    if (this.filtrosDetalle.subIncidencia.codigo) {
      this.filtrosBusquedaDetalle.subIncidencia = this.filtrosDetalle.subIncidencia;
    } else {
      this.filtrosBusquedaDetalle.subIncidencia = null;
    }
    if (this.filtrosDetalle.estado.id) {
      this.filtrosBusquedaDetalle.estado = this.filtrosDetalle.estado;
    } else {
      this.filtrosBusquedaDetalle.estado = null;
    }
    if (this.filtrosDetalle.cumplimiento.codigo) {
      this.filtrosBusquedaDetalle.cumplimiento = this.filtrosDetalle.cumplimiento;
    } else {
      this.filtrosBusquedaDetalle.cumplimiento = null;
    }
    if (this.filtrosDetalle.tipoEntrega.codigo) {
      this.filtrosBusquedaDetalle.tipoEntrega = this.filtrosDetalle.tipoEntrega;
    } else {
      this.filtrosBusquedaDetalle.tipoEntrega = null;
    }
    this.filtrosBusquedaDetalle.contratista = this.filtrosDetalle.contratista;
    this.filtrosBusquedaDetalle.trabajador = this.filtrosDetalle.trabajador;
    this.filtrosBusquedaDetalle.suministro = this.filtrosDetalle.suministro;
    this.filtrosBusquedaDetalle.fechaProgramacion = this.filtrosDetalle.fechaProgramacion;


    this.monitoreoService.obtenerDetallesBusquedaDC(this.filtrosBusquedaDetalle).subscribe(
      (response: ResponseObject) => {
        if (!(response.resultado.listarMonitoreoDetalle.length > 0)) {
          this.loading = false;
          this.distComunicacion = new Array<DistribucionComunicacionDet>();
          this.paginacion2 = new Paginacion({pagina: 1, registros: 10})
          this.mostrarInformacionFiltrosDetalle();
          this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          return false;
        }
        this.distComunicacion = response.resultado.listarMonitoreoDetalle;
        this.mostrarPrincipal = false;
        this.mostrarDetalle = true;
        this.mostrarInformacionFiltrosDetalle();
        this.loading = false;

        this.paginacion2 = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: this.distComunicacion.length,
          totalPaginas: this.distComunicacion.length
        })
      },
      (error) => {
        this.loading = false;
        this.mostrarInformacionFiltrosDetalle();
        this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
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
    /* this.filtrosBusqueda.periodo = new Parametro(); */
    this.filtrosBusqueda.tipoActividad = new Parametro();
   /*  this.filtrosBusqueda.ciclo = new Parametro(); */

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
    this.filtrosBusqueda.cedulaNotificacion = this.filtros.cedulaNotificacion;
    this.filtrosBusqueda.ordenServicio = this.filtros.ordenServicio;

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
    if (this.filtros.tipoNotificacion.codigo) {
      this.filtrosBusqueda.tipoNotificacion = this.filtros.tipoNotificacion;
    } else {
      this.filtrosBusqueda.tipoNotificacion = null;
    }



    if (sessionStorage.getItem('codOficina') != null) {
      this.codigoOficina = Number(sessionStorage.getItem('codOficina'));
      this.filtrosBusqueda.oficina.codigo = this.codigoOficina;
      this.filtrosBusqueda.oficina.descripcion = sessionStorage.getItem('desOficina');
    } else {
      this.filtrosBusqueda.oficina = this.filtros.oficina;
    }


    if (this.filtrosBusqueda) {
      this.monitoreoService.obtenerMonitoreos(this.filtrosBusqueda, 'DC').subscribe(
        (response: ResponseObject) => {
          if (!(response.resultado.listarMonitoreoCabecera.length > 0)) {
            this.loading = false;
            this.monitoreos = new Array<Monitoreo>();
            this.paginacion = new Paginacion({pagina: 1, registros: 10})
            this.toastr.warning("La búsqueda no obtuvo resultados.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
            return false;
          }
          this.verExportarExcel = true;
          this.monitoreos = response.resultado.listarMonitoreoCabecera;
          /* seteo de la paginación manual */
          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.monitoreos.length,
            totalPaginas: this.monitoreos.length
          })
          /*  */
          this.loading = false;
          this.mostrarInformacionFiltros();
        },
        (error) => {
          this.loading = false;
          this.mostrarInformacionFiltros();
          this.monitoreos = new Array<Monitoreo>();
          this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    } else {
      this.loading = false;
    }
  }
  onLimpiarFiltros() {
    this.verExportarExcel = false;
    this.filtros = new FiltrosBandejaMonitoreo();
    this.filtros.contratista = new Contratista();
    /* this.filtros.oficina = new Oficina(); */
    this.filtros.ciclo = new Parametro();
    this.filtros.periodo = new Parametro();
    this.filtros.imposibilidad = new Parametro();
    this.filtros.tipoActividad = new Parametro();
    this.filtros.foto = new Parametro();
    this.filtros.semaforo = new Parametro();
    this.filtros.tipoNotificacion = new Parametro();
    this.filtros.operario = new Trabajador();
    this.mostrarFiltros = false;

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
    this.filtrosDetalle.foto = new Parametro();
    this.filtrosDetalle.suministro = null;
    this.filtrosDetalle.cumplimiento = new Parametro();
    this.filtrosDetalle.tipoEntrega = new Parametro();
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
    this.filtrosDetalle.tipoEntrega = new Parametro();
    this.filtrosDetalle.contratista = new Contratista();
    this.filtrosDetalle.trabajador = new Trabajador();

    this.distComunicacion = null;
/*
    if (!this.filtrosBusqueda.periodo.codigo) {
      this.filtros.periodo = new Parametro();
      this.filtros.ciclo = new Parametro();
    }
 */
    this.mostrarDetalle = false;
    this.mostrarPrincipal = true;
  }

  visualizarImagen(item: DistribucionComunicacionDet, accion: string): void{
      this.loading = true;
      this.sumVisor = item.suministro;
      console.log(this.sumVisor);
      let obj: RequestVisorMonitoreo = new RequestVisorMonitoreo();
      obj.suministro = item.suministro;
      obj.actividad = "DC";
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
    this.monitoreoService.generaExcelDetalle(this.cabecera, this.distComunicacion, "DC").subscribe(
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
    this.monitoreoService.generaExcel(this.filtrosBusqueda, "DC").subscribe(
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
