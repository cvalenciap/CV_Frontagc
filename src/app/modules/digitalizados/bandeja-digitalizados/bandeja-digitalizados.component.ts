import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Paginacion, ParametrosCargaBandeja, Actividad, Response } from '../../../models';
import { FiltrosBandejaDigitalizadosComponent } from '../modales/filtros-bandeja-digitalizados/filtros-bandeja-digitalizados.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltrosBandejaDigitalizados } from 'src/app/models/filtro-bandeja.digitalizado';
import { DigitalizadoService } from 'src/app/services/impl/digitalizado.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseObject } from 'src/app/models/response/response-object';
import { Oficina } from 'src/app/models/oficina';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Parametro } from 'src/app/models/enums/parametro';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Digitalizado } from 'src/app/models/digitalizado';
import { Credenciales } from 'src/app/models/credenciales';
import { RequestVisorDigitalizado } from 'src/app/models/request/request-visor-digitalizado';
import { DocumentosService } from 'src/app/services/impl/documentos.service';
import { ValidacionService } from 'src/app/services/impl/validacion';
import * as moment from 'moment';



@Component({
  selector: 'app-bandeja-digitalizados',
  templateUrl: './bandeja-digitalizados.component.html',
  styleUrls: ['./bandeja-digitalizados.component.scss']
})

export class BandejaDigitalizadosComponent implements OnInit {


  /* Variables para manejo de filtros */
  // private filtros: FiltrosBandejaDigitalizados;
  /* Variable para mostrar el filtro de busqueda */
  public filtrosTexto: string;
  /* Variable para visualizar mensaje de filtro de busqueda */
  public mostrarFiltros: boolean;
  /* Variable para control del modal */
  @ViewChild(FiltrosBandejaDigitalizadosComponent) filtrosBandejaDigitalizados;
  /* Lista de digitalizados */
  public digitalizados: Digitalizado[];
  public distavisos: Digitalizado[];
  public inspcomercial: Digitalizado[];
  public medidores: Digitalizado[];
  public sgio: Digitalizado[];
  public tomaestado: Digitalizado[];


  public arrayAdjuntos: Array<{ id: number, text: string }>;
  /* Variable para la url del documento */
  public urlPDF: string;
  /* Objeto para filtros */
  private filtrosBusqueda: FiltrosBandejaDigitalizados;
  /* Variable para la paginación */
  public paginacion: Paginacion;
  public paginacion2: Paginacion;
  public paginacion3: Paginacion;
  public paginacion4: Paginacion;
  public paginacion5: Paginacion;
  public paginacion6: Paginacion;
  /* Numero de suministro */
  public numeroSuministro: number;
  /* Código de oficina */
  public codigoOficina: number;
  /* variable para load */
  public loading: boolean;
  /* Variable para validacion del botón Exportar */
  public verExportarExcel: boolean;
  /* Número de meses de consulta */
  private mesesConsulta: number;
  /* Número Rango de días */
  private rangoDias: number;
  private ultimosMeses: boolean = false;

  public today = new Date();
  /*   public inputReadonly = true; */
  private filtroFechas: boolean;

  public estadoComponentes: EstadoComponentes;
  public filtros: FiltrosBandejaDigitalizados;
  public listaParametros: ParametrosCargaBandeja;
  public oficina: Oficina;

  public clrOficina: boolean;
  public selectedIndex;/*
  public arrayImagenes:any = 'http://10.240.147.142:8080/fileserver/agc/b24cbc04-9c0e-407b-a046-e7895909453b.JPG'; */
  public arrayImagenes: any = null;
  public sumVisor: number = 0;

  /* Variable para controlar componente modal */
  public alertOption: SweetAlertOptions = {};
  @ViewChild('modalFiltrosBandejaDigitalizados') private modalFiltrosBandejaDigitalizados: SwalComponent;
  /* Variable para control del visor */
  @ViewChild('visorPdfSwal') private visorPdfSwal: SwalComponent;
  @ViewChild('visorImgSwal') private visorImgSwal: SwalComponent;

  name = 'Angular';
  localIp = sessionStorage.getItem('LOCAL_IP');
  viewAdjuntos: number;

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  constructor(private sanitizer: DomSanitizer,
    private digitalizadoService: DigitalizadoService,
    private documentosService: DocumentosService,
    private datePipe: DatePipe,
    private zone: NgZone,
    private toastr: ToastrService,
    public validacionNumero: ValidacionService) {
    this.filtrosBusqueda = null;
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion2 = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion3 = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion4 = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion5 = new Paginacion({ registros: 10, pagina: 1 });
    this.paginacion6 = new Paginacion({ registros: 10, pagina: 1 });
    this.verExportarExcel = false;
    this.digitalizados = new Array<Digitalizado>();
    this.filtroFechas = false; this.listaParametros = new ParametrosCargaBandeja();
    this.filtros = new FiltrosBandejaDigitalizados();
    this.filtros.actividad = new Actividad();
    this.filtros.oficina = new Oficina();
    this.estadoComponentes = new EstadoComponentes();

  }

  ngOnInit() {
    this.viewAdjuntos = 1;
    localStorage.setItem('viewAdjuntos', this.viewAdjuntos.toString());

    this.digitalizados = [];
    this.distavisos = [];
    this.inspcomercial = [];
    this.medidores = [];
    this.sgio = [];
    this.tomaestado = [];


    this.arrayAdjuntos = [
      { id: 0, text: 'TODOS' },
      { id: 1, text: 'CON DIGITALIZADOS' },
      { id: 2, text: 'SIN DIGITALIZADOS' },
    ];




    //Perfil
    this.digitalizadoService.consultarParametrosBusquedaDigitalizados().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
        this.listaParametros.listaOficina.length === 1 ? this.oficina = this.listaParametros.listaOficina[0] : this.oficina = null;
        this.listaParametros.listaOficina.length === 1 ? this.clrOficina = false : this.clrOficina = true;

        if (this.listaParametros.listaActividad.length === 1) {
          this.filtros.actividad = this.listaParametros.listaActividad[0];
          this.iniciarCamposFiltro(this.filtros.actividad.codigo);
        }
        //Segun Perfil
        if (sessionStorage.getItem('codOficina') != null) {
          this.filtros.oficina.codigo = this.oficina.codigo;
          this.filtros.oficina.descripcion = this.oficina.descripcion;
        }
      }
    );

    this.digitalizadoService.obtenerParametrosPeriodo().subscribe(
      (response: Response) => {
        this.mesesConsulta = response.resultado.mesesConsulta;
        this.rangoDias = response.resultado.diasRango;

        (error) => {
          this.loading = false;
          this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      }
    );
    /*
        this.alertOption = {
          title:"Búsqueda Avanzada - Bandeja de Digitalizados",
          showCancelButton:true,
          focusCancel:false,
          allowOutsideClick:true,
          confirmButtonText:"Buscar",
          cancelButtonText:"Cancelar",
          customClass:"filtros-digitalizados-swal",
          preConfirm: () => {
            let valida: boolean;
            var prodmise = new Promise(() => {
              let filtros: FiltrosBandejaDigitalizados = this.filtrosBandejaDigitalizados.filtros;
              if(filtros.suministro       ||
                 filtros.numeroCarga      ||
                 filtros.actividad.codigo ||
                 filtros.ordenServicio    ||
                 filtros.ordenTrabajo     ||
                 filtros.numeroCedula     ||
                 filtros.numeroReclamo    ||
                 filtros.oficina.codigo   ||
                 filtros.fechaInicio      ||
                 filtros.fechaFin){
                  if( !(filtros.suministro ||
                    filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo || filtros.numeroCedula || filtros.numeroReclamo) && filtros.oficina.codigo && !filtros.actividad.codigo){
                    valida = false;
                     this.toastr.error("Debe seleccionar la actividad", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if( !(filtros.suministro ||
                    filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo || filtros.numeroCedula || filtros.numeroReclamo) && filtros.actividad.codigo && !filtros.oficina.codigo){
                    valida = false;
                     this.toastr.error("Debe seleccionar la oficina", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if (filtros.actividad.codigo == Parametro.ACT_SGIO && !filtros.oficina.codigo){
                    valida = false;
                    this.toastr.error("Debe seleccionar la oficina para la actividad SGIO", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if((filtros.actividad.codigo == Parametro.ACT_TOMA_ESTADO) && !(filtros.fechaInicio || filtros.fechaFin) && !(filtros.suministro ||  filtros.numeroCarga)){
                    valida = false;
                    this.toastr.error("Debe seleccionar la Fecha Inicio y Fecha Fin para la actividad Toma de Estado", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if((filtros.actividad.codigo == Parametro.ACT_SGIO) && !(filtros.fechaInicio || filtros.fechaFin) && !(filtros.suministro || filtros.ordenServicio || filtros.ordenTrabajo)){
                    valida = false;
                    this.toastr.error("Debe seleccionar la Fecha Inicio y Fecha Fin para la actividad SGIO", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if(filtros.fechaInicio && !filtros.fechaFin || !filtros.fechaInicio && filtros.fechaFin){
                    valida = false;
                    this.toastr.error("Debe ingresar Fecha Inicio y Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }else if(filtros.fechaInicio && filtros.fechaFin){
                    if(filtros.fechaInicio.setHours(0, 0, 0, 0) > filtros.fechaFin.setHours(0, 0, 0, 0)){
                      valida = false;
                      this.toastr.error("La Fecha Inicio debe ser menor o igual a la Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                    }else{
                      let diasFecha=0;
                      diasFecha = moment(filtros.fechaFin).diff(moment(filtros.fechaInicio), 'days') + 1;
                       if(diasFecha > this.rangoDias){
                        valida = false;
                        this.toastr.error("Los dias del rango de fechas no debe superar los " + this.rangoDias + " días", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                       }else{
                        valida = true;
                        this.filtroFechas = true;
                       }
                   }
                  }else if(!(filtros.fechaInicio || filtros.fechaFin)){
                   if(!(filtros.suministro ||
                      filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo ||
                      filtros.numeroCedula || filtros.numeroReclamo) && filtros.actividad.codigo && filtros.oficina.codigo){
                        filtros.fechaFin    = moment(new Date).toDate();
                        filtros.fechaInicio = moment(new Date).add(-this.mesesConsulta, 'months').toDate();
                        valida = true;
                        this.filtroFechas = false;
                      }
                  }else if(filtros.suministro && !Number(filtros.suministro)){
                    valida = false;
                    this.toastr.error("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
                  }
              }else{
                valida = false;
                this.toastr.error("Debe seleccionar por lo menos un filtro", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
              }
            })
            return valida;
          }
        } */
  }

  seleccionarViewAdjuntos() {
    localStorage.setItem('viewAdjuntos', this.viewAdjuntos.toString());
  }

  onObtenerDigitalizados(invocacion: string) {
    this.loading = true;

    /* if(this.numeroSuministro){ */
    /* if(Number(this.numeroSuministro)){ */
    this.filtrosBusqueda = new FiltrosBandejaDigitalizados();
    this.filtrosBusqueda.actividad = new Actividad();
    this.filtrosBusqueda.oficina = new Oficina();
    this.filtrosBusqueda.suministro = this.numeroSuministro;
    if (sessionStorage.getItem('codOficina') != null) {
      this.codigoOficina = Number(sessionStorage.getItem('codOficina'));
      this.filtrosBusqueda.oficina.codigo = this.codigoOficina;
    } else {
      this.filtrosBusqueda.oficina.codigo = this.filtros.oficina.codigo;
    }
    this.filtrosBusqueda.oficina.descripcion = this.filtros.oficina.descripcion;
    this.filtrosBusqueda.digitalizado = this.viewAdjuntos;

    /* if (this.filtros.actividad.codigo==null) {
      this.filtrosBusqueda.actividad.codigo = 'DC';
      this.filtrosBusqueda.actividad.descripcion = "DISTRIBUCION Y COMUNICACIONES"
    }else{ */
    this.filtrosBusqueda.actividad.codigo = this.filtros.actividad.codigo;
    this.filtrosBusqueda.actividad.descripcion = this.filtros.actividad.descripcion;
    /* } */
    this.filtrosBusqueda.numeroCarga = this.filtros.numeroCarga;
    this.filtrosBusqueda.ordenServicio = this.filtros.ordenServicio;
    this.filtrosBusqueda.ordenTrabajo = this.filtros.ordenTrabajo;
    this.filtrosBusqueda.numeroCedula = this.filtros.numeroCedula;
    this.filtrosBusqueda.numeroReclamo = this.filtros.numeroReclamo;
    this.filtrosBusqueda.fechaInicio = this.filtros.fechaInicio;
    this.filtrosBusqueda.fechaFin = this.filtros.fechaFin;

    /*  if (this.filtros.fechaInicio==null) {
     this.filtrosBusqueda.fechaInicio = this.filtros.fechaInicio;
     } else {
       this.filtrosBusqueda.fechaInicio = this.filtros.fechaInicio;
     }
     if (this.filtros.fechaFin==null) {
       this.filtrosBusqueda.fechaFin = new Date();
     } else {
       this.filtrosBusqueda.fechaFin = this.filtros.fechaFin;

     } */

    this.ultimosMeses = false;
    if (!this.validarFormulario(this.filtrosBusqueda)) {
      this.loading = false;
      this.mostrarFiltros = false;
      return false;
    }

    /* if (this.filtros.actividad.codigo == 'TE') {
      if (this.filtros.fechaInicio == null || this.filtros.fechaFin == null) {
        this.toastr.error("Debe seleccionar fechas obligatoriamente para esta actividad: Toma estado.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });

        this.paginacion = new Paginacion({
          pagina: 1,
          registros: 10,
          totalRegistros: 0,
          totalPaginas: 0
        });
        this.loading = false;
        return false;
      }
    } */


    /* }else{
      this.loading = false;
      // this.numeroSuministro = null;
      // this.digitalizados = new Array<Digitalizado>();
      // this.filtrosBusqueda = null;
      this.paginacion = new Paginacion({registros: 10, pagina: 1});
      // this.filtrosTexto = "";
      this.toastr.error("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    } */
    /* } */
    console.log(this.filtrosBusqueda);
    if (this.filtrosBusqueda) {
      this.digitalizadoService.obtenerDigitalizados(this.filtrosBusqueda, this.paginacion.pagina, 1000000).subscribe(
        /* this.digitalizadoService.obtenerDigitalizados(this.filtrosBusqueda, 0, 0).subscribe( */
        (response: ResponseObject) => {
          this.verExportarExcel = true;

          this.digitalizados = response.resultado.listaDyC;
          this.distavisos = response.resultado.listaDAC;
          this.inspcomercial = response.resultado.listaIC;
          this.medidores = response.resultado.listaMed;
          this.sgio = response.resultado.listaSGIO;
          this.tomaestado = response.resultado.listaTdE;

          this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.digitalizados.length,
            totalPaginas: this.digitalizados.length
          })

          this.paginacion2 = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.distavisos.length,
            totalPaginas: this.distavisos.length
          })


          this.paginacion3 = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.inspcomercial.length,
            totalPaginas: this.inspcomercial.length
          })

          this.paginacion4 = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.medidores.length,
            totalPaginas: this.medidores.length
          })

          this.paginacion5 = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.sgio.length,
            totalPaginas: this.sgio.length
          })

          this.paginacion6 = new Paginacion({
            pagina: 1,
            registros: 10,
            totalRegistros: this.tomaestado.length,
            totalPaginas: this.tomaestado.length
          })
          switch (this.filtrosBusqueda.actividad.codigo) {
            case 'DC':
              this.selectedIndex = 0;
              break;

            case 'DA':
              this.selectedIndex = 1;
              break;

            case 'IC':
              this.selectedIndex = 2;
              break;

            case 'ME':
              this.selectedIndex = 3;
              break;

            case 'SG':
              this.selectedIndex = 4;
              break;

            case 'TE':
              this.selectedIndex = 5;
              break;

            default:
              this.selectedIndex = 0;
              break;
          }

          this.mostrarInformacionFiltros();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Ocurrió un error al realizar la búsqueda.', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    } else {
      this.loading = false;
    }
  }



  /*método para paginación*/

  onListarDigitalizados(): Digitalizado[] {
    const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
    const fin: number = (this.paginacion.registros * this.paginacion.pagina);
    return this.digitalizados.slice(inicio, fin);
  }
  onListarDistavisos(): Digitalizado[] {
    const inicio: number = (this.paginacion2.pagina - 1) * this.paginacion2.registros;
    const fin: number = (this.paginacion2.registros * this.paginacion2.pagina);
    return this.distavisos.slice(inicio, fin);
  }
  onListarInspcomercial(): Digitalizado[] {
    const inicio: number = (this.paginacion3.pagina - 1) * this.paginacion3.registros;
    const fin: number = (this.paginacion3.registros * this.paginacion3.pagina);
    return this.inspcomercial.slice(inicio, fin);
  }
  onListarMedidores(): Digitalizado[] {
    const inicio: number = (this.paginacion4.pagina - 1) * this.paginacion4.registros;
    const fin: number = (this.paginacion4.registros * this.paginacion4.pagina);
    return this.medidores.slice(inicio, fin);
  }
  onListarSGIO(): Digitalizado[] {
    const inicio: number = (this.paginacion5.pagina - 1) * this.paginacion5.registros;
    const fin: number = (this.paginacion5.registros * this.paginacion5.pagina);
    return this.sgio.slice(inicio, fin);
  }
  onListarTomaEstado(): Digitalizado[] {
    const inicio: number = (this.paginacion6.pagina - 1) * this.paginacion6.registros;
    const fin: number = (this.paginacion6.registros * this.paginacion6.pagina);
    return this.tomaestado.slice(inicio, fin);
  }

  onPageChanged(event): void {
    this.paginacion.pagina = event.page;
    /* this.onObtenerDigitalizadosTab('PAGINACION', event); */
  }
  onPageChanged2(event): void {
    this.paginacion2.pagina = event.page;
  }
  onPageChanged3(event): void {
    this.paginacion3.pagina = event.page;
  }
  onPageChanged4(event): void {
    this.paginacion4.pagina = event.page;
  }
  onPageChanged5(event): void {
    this.paginacion5.pagina = event.page;
  }
  onPageChanged6(event): void {
    this.paginacion6.pagina = event.page;
  }

  onPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    /*  if(this.digitalizados.length > 0 && this.filtrosBusqueda){
       this.onObtenerDigitalizadosTab('PAGINACION', event);
     } */
  }
  onPageOptionChanged2(event): void {
    this.paginacion2.registros = event.rows;
    this.paginacion2.pagina = 1;
  }
  onPageOptionChanged3(event): void {
    this.paginacion3.registros = event.rows;
    this.paginacion3.pagina = 1;
  }
  onPageOptionChanged4(event): void {
    this.paginacion4.registros = event.rows;
    this.paginacion4.pagina = 1;
  }
  onPageOptionChanged5(event): void {
    this.paginacion5.registros = event.rows;
    this.paginacion5.pagina = 1;
  }
  onPageOptionChanged6(event): void {
    this.paginacion6.registros = event.rows;
    this.paginacion6.pagina = 1;
  }

  /** */
  /* Método para obtener filtros del modal */
  public obtenerFiltrosModal(): void {
    this.numeroSuministro = null;
    this.filtrosBusqueda = this.filtrosBandejaDigitalizados.filtros;
    this.filtrosBusqueda.digitalizado = Number(localStorage.getItem('viewAdjuntos').toString());
    this.onObtenerDigitalizados('MODAL');
  }

  private mostrarInformacionFiltros() {
    let mensaje = '<strong>Búsqueda Por: </strong>';
    if (this.filtrosBusqueda.suministro) {
      mensaje = mensaje + '<br/><strong>Número Suministro: </strong> <parrafo>' + this.filtrosBusqueda.suministro + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.numeroCarga) {
      mensaje = mensaje + '<br/><strong>Número Carga: </strong> <parrafo>' + this.filtrosBusqueda.numeroCarga + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.actividad.codigo) {
      mensaje = mensaje + '<br/><strong>Actividad: </strong> <parrafo>' + this.filtrosBusqueda.actividad.descripcion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.ordenServicio) {
      mensaje = mensaje + '<br/><strong>Orden Servicio: </strong> <parrafo>' + this.filtrosBusqueda.ordenServicio + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.ordenTrabajo) {
      mensaje = mensaje + '<br/><strong>Orden Trabajo: </strong> <parrafo>' + this.filtrosBusqueda.ordenTrabajo + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.numeroCedula) {
      mensaje = mensaje + '<br/><strong>Número Cédula: </strong> <parrafo>' + this.filtrosBusqueda.numeroCedula + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.numeroReclamo) {
      mensaje = mensaje + '<br/><strong>Número Reclamo: </strong> <parrafo>' + this.filtrosBusqueda.numeroReclamo + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.oficina.codigo) {
      if (this.numeroSuministro) {
        mensaje = mensaje;
        this.mostrarFiltros = true;
      } else {
        mensaje = mensaje + '<br/><strong>Oficina: </strong> <parrafo>' + this.filtrosBusqueda.oficina.descripcion + '</parrafo>' + ' ';
        this.mostrarFiltros = true;
      }
    }

    if (this.filtrosBusqueda.fechaInicio && this.filtroFechas) {
      mensaje = mensaje + '<br/><strong>Fecha Inicio: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaInicio, 'dd/MM/yyyy') + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    } else if (this.ultimosMeses) {
      mensaje = mensaje + '<br/><strong>Fecha: </strong> <parrafo>Resultado de los últimos ' + this.mesesConsulta + ' meses</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.fechaFin && this.filtroFechas) {
      mensaje = mensaje + '<br/><strong>Fecha Fin: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaFin, 'dd/MM/yyyy') + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.mostrarFiltros) {
      this.filtrosTexto = mensaje;
    }
  }

  private eliminarFiltros(): void {
    /* this.filtrosBusqueda = null; */
    this.mostrarFiltros = false;
    this.filtrosTexto = '';
    /*  this.numeroSuministro = null; */
    this.verExportarExcel = false;

    this.digitalizados = [];
    this.distavisos = [];
    this.inspcomercial = [];
    this.medidores = [];
    this.sgio = [];
    this.tomaestado = [];

    this.paginacion = new Paginacion({ registros: this.paginacion.registros, pagina: 1 });
    this.paginacion2 = new Paginacion({ registros: this.paginacion2.registros, pagina: 1 });
    this.paginacion3 = new Paginacion({ registros: this.paginacion3.registros, pagina: 1 });
    this.paginacion4 = new Paginacion({ registros: this.paginacion4.registros, pagina: 1 });
    this.paginacion5 = new Paginacion({ registros: this.paginacion5.registros, pagina: 1 });
    this.paginacion6 = new Paginacion({ registros: this.paginacion6.registros, pagina: 1 });
    /* this.toastr.warning("Ha eliminado los filtros de búsqueda", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true }); */
  }

  generarArchivoExcel(): void {
    this.loading = true;
    console.log(this.filtrosBusqueda);
    this.digitalizadoService.generarArchivoExcelDigitalizados(this.filtrosBusqueda, 1, 1000000).subscribe(
      (data) => {
        this.loading = false;
        var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, 'Resultado');
      },
      (error) => {
        this.loading = false;
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }

  visualizarDigitalizados(item: Digitalizado, accion: string, tipo: string): void {
    this.loading = true;
    this.sumVisor = item.suministro;
    console.log(this.sumVisor);
    let obj: RequestVisorDigitalizado = new RequestVisorDigitalizado();
    obj.suministro = item.suministro;
    obj.numeroCarga = item.numeroCarga;
    obj.idCargaDetalle = item.idCargaDetalle;
    obj.ordTrabOrdServCedu = item.ordTrabOrdServCedu;
    obj.tipologia = item.tipologia;
    obj.numeroOT = item.numeroOT;
    obj.actividad = item.actividad.codigo;
    obj.accion = accion;

    let credenciales = new Credenciales();
    let credencialesString: string;
    credencialesString = sessionStorage.getItem('credenciales');
    credenciales = JSON.parse(credencialesString);
    obj.usuario = credenciales.usuario;

    obj.ip = sessionStorage.getItem('IP');

    localStorage.setItem('SUMINISTRO', item.suministro.toString());
    localStorage.setItem('NUMEROCARGA', item.numeroCarga);
    localStorage.setItem('IDCARGADETALLE', item.idCargaDetalle != null ? item.idCargaDetalle.toString() : '');
    localStorage.setItem('ORDTRABORDSERVCEDU', item.ordTrabOrdServCedu != null ? item.ordTrabOrdServCedu.toString() : '');
    localStorage.setItem('TIPOORDTRABORDSERV', item.tipologia != null ? item.tipologia.toString() : '');
    localStorage.setItem('ACTIVIDAD', item.actividad.codigo.toString());
    localStorage.setItem('USUARIO', credenciales.usuario.toString());
    localStorage.setItem('IP', obj.ip);

    if (tipo == 'pdf') {
      this.digitalizadoService.visualizarAdjuntosDigitalizados(obj).subscribe(
        (data: ResponseObject) => {
          this.loading = false;
          if (data.estado == 'OK') {
            this.urlPDF = data.resultado;
            if (this.urlPDF !== null) {
              if (this.urlPDF.length > 0) {
                this.visorPdfSwal.show();
              } else {
                this.toastr.error('Error recuperando archivos digitalizados del fileserver', 'Error', {closeButton: true});
              }
            } else {
              this.toastr.error('Error recuperando archivos digitalizados del fileserver', 'Error', {closeButton: true});
            }
          } else {
            this.toastr.error(data.resultado.mensajeInterno, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    } else {
      this.digitalizadoService.visualizarAdjuntosDigitalizadosJpg(obj).subscribe(
        (data: ResponseObject) => {
          this.loading = false;
          if (data.estado == 'OK') {
            this.arrayImagenes = data.resultado;
            if (this.arrayImagenes.length > 0) {
              this.visorImgSwal.show();
            } else {
              this.toastr.error('Error recuperando archivos digitalizados del fileserver', 'Error', {closeButton: true});
            }
          } else {
            this.toastr.error(data.resultado.mensajeInterno, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    }
  }

  eliminarArchivoFileServer(): void {
    this.documentosService.deleteAttachFileServer(this.urlPDF).subscribe((responseFile) => {
      null;
    }, (errorFileServer) => {
      null;
    });
  }

  validarFormulario(filtros: FiltrosBandejaDigitalizados) {
    let valida: boolean;
    /* var prodmise = new Promise(() => { */
    if (filtros.suministro ||
      filtros.numeroCarga ||
      filtros.actividad.codigo ||
      filtros.ordenServicio ||
      filtros.ordenTrabajo ||
      filtros.numeroCedula ||
      filtros.numeroReclamo ||
      filtros.oficina.codigo ||
      filtros.fechaInicio ||
      filtros.fechaFin) {
      if (!(filtros.suministro ||
        filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo || filtros.numeroCedula || filtros.numeroReclamo) && filtros.oficina.codigo && !filtros.actividad.codigo) {
        valida = false;
        this.toastr.error('Debe seleccionar la actividad', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if (!(filtros.suministro ||
        filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo || filtros.numeroCedula || filtros.numeroReclamo) && filtros.actividad.codigo && !filtros.oficina.codigo) {
        valida = false;
        this.toastr.error('Debe seleccionar la oficina', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if ((filtros.suministro ||
        filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo || filtros.numeroCedula || filtros.numeroReclamo) && !filtros.oficina.codigo) {
        valida = false;
        this.toastr.error('Debe seleccionar la oficina', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if (filtros.actividad.codigo == Parametro.ACT_SGIO && !filtros.oficina.codigo) {
        valida = false;
        this.toastr.error('Debe seleccionar la oficina para la actividad SGIO', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if ((filtros.actividad.codigo == Parametro.ACT_TOMA_ESTADO) && !(filtros.fechaInicio || filtros.fechaFin) && !(filtros.suministro || filtros.numeroCarga)) {
        valida = false;
        this.toastr.error('Debe seleccionar la Fecha Inicio y Fecha Fin para la actividad Toma de Estado', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if ((filtros.actividad.codigo == Parametro.ACT_SGIO) && !(filtros.fechaInicio || filtros.fechaFin) && !(filtros.suministro || filtros.ordenServicio || filtros.ordenTrabajo)) {
        valida = false;
        this.toastr.error('Debe seleccionar la Fecha Inicio y Fecha Fin para la actividad SGIO', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if (filtros.fechaInicio && !filtros.fechaFin || !filtros.fechaInicio && filtros.fechaFin) {
        valida = false;
        this.toastr.error('Debe ingresar Fecha Inicio y Fecha Fin', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if (filtros.fechaInicio && filtros.fechaFin) {
        if (filtros.fechaInicio.setHours(0, 0, 0, 0) > filtros.fechaFin.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.error('La Fecha Inicio debe ser menor o igual a la Fecha Fin', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        } else if (filtros.fechaInicio.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0) ||
          filtros.fechaFin.setHours(0, 0, 0, 0) > this.today.setHours(0, 0, 0, 0)) {
          valida = false;
          this.toastr.error('Las fechas no deben ser mayores a la fecha actual', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        } else {
          let diasFecha = 0;
          diasFecha = moment(filtros.fechaFin).diff(moment(filtros.fechaInicio), 'days') + 1;
          if (diasFecha > this.rangoDias) {
            valida = false;
            this.toastr.error('Los dias del rango de fechas no debe superar los ' + this.rangoDias + ' días', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          } else {
            valida = true;
            this.filtroFechas = true;
          }
        }
      } else if (filtros.suministro && !Number(filtros.suministro)) {
        valida = false;
        this.toastr.error('El Número Suministro debe estar compuesto solo de números.', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      } else if (!(filtros.fechaInicio || filtros.fechaFin)) {
        if (!(filtros.suministro ||
          filtros.numeroCarga || filtros.ordenServicio || filtros.ordenTrabajo ||
          filtros.numeroCedula || filtros.numeroReclamo) && filtros.actividad.codigo && filtros.oficina.codigo) {
          filtros.fechaFin = moment(new Date).toDate();
          filtros.fechaInicio = moment(new Date).add(-this.mesesConsulta, 'months').toDate();
          valida = true;
          this.filtroFechas = false;
          this.ultimosMeses = true;
        } else {
          valida = true;
          this.filtroFechas = true;
        }
      }
    } else {
      valida = false;
      this.toastr.error('Debe seleccionar por lo menos un filtro', Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
    /* }) */
    return valida;


  }


  onSeleccionarActividad(evento: any): void {
    this.estadoComponentes = new EstadoComponentes();
    this.filtros.actividad.descripcion = evento.descripcion;
    this.iniciarCamposFiltro(evento.codigo);
  }
  onSeleccionarOficina(evento: any): void {
    this.estadoComponentes = new EstadoComponentes();
    this.filtros.oficina.descripcion = evento.descripcion;
    this.iniciarCamposFiltro(evento.codigo);
  }

  iniciarCamposFiltro(codigoActividad: string): void {
    switch (codigoActividad) {
      case Parametro.ACT_DISTRIB_AVISO_COBRANZA: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_DISTRBUCION_COMUNICACIONES: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        break;
      }
      case Parametro.ACT_INSPECCIONES_COMERCIALES: {
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        break;
      }
      case Parametro.ACT_MEDIDORES: {
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_TOMA_ESTADO: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_SGIO: {
        this.estadoComponentes.inputNumeroCarga = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.numeroCarga = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      default: {
        null;
        break;
      }
    }
  }
  detectarCambioFechas() {
    if (!(this.filtros.fechaInicio instanceof Date) || isNaN(this.filtros.fechaInicio.getTime())) {
      this.filtros.fechaInicio = null;
    }
    if (!(this.filtros.fechaFin instanceof Date) || isNaN(this.filtros.fechaFin.getTime())) {
      this.filtros.fechaFin = null;
    }
  }

  onLimpiarFiltros(): void {
    this.filtros.actividad = new Actividad();
    if (sessionStorage.getItem('codOficina') === null) {
      this.filtros.oficina = new Oficina();
    }
    this.filtros.fechaInicio = null;
    this.filtros.fechaFin = null;
    this.verExportarExcel = false;

    this.numeroSuministro = null;
    this.filtros.numeroCarga = null;
    this.filtros.ordenServicio = null;
    this.filtros.ordenTrabajo = null;
    this.filtros.numeroCedula = null;
    this.filtros.actividad.codigo = null;
    this.filtros.numeroReclamo = null;

    this.digitalizados = [];
    this.distavisos = [];
    this.inspcomercial = [];
    this.medidores = [];
    this.sgio = [];
    this.tomaestado = [];

    this.estadoComponentes.inputNumeroCarga = true;
    this.estadoComponentes.inputOrdenServicio = true;
    this.estadoComponentes.inputOrdenTrabajo = true;
    this.estadoComponentes.inputNumeroCedula = true;
    this.estadoComponentes.inputNumeroReclamo = true;
    this.eliminarFiltros();
  }
}
class EstadoComponentes {
  inputNumeroCarga: boolean = true;
  inputOrdenServicio: boolean = true;
  inputOrdenTrabajo: boolean = true;
  inputNumeroCedula: boolean = true;
  inputNumeroReclamo: boolean = true;
}

