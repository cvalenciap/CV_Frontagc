import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, SecurityContext} from '@angular/core';
import {
  Paginacion,
  ParametrosCargaBandeja,
  Parametro,
  Oficina,
  Empresa,
  Actividad,
  TipoParametro,
  Response,
  Responsable,
  ResponseAdjuntos,
  Adjunto
} from '../../../../models';
import {CargaTrabajo} from '../../../../models/CargaTrabajo';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {DatosConsulta} from '../../../../models/datosConsulta';
import {CargasTrabajoService} from '../../../../services/impl/cargas-trabajo.service';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap';
import {RequestCarga} from 'src/app/models/request/request-carga';
import {ResponseCarga} from '../../../../models/response/response-carga';
import {BuscarCargaTrabajoComponent} from '../../../dialogs/carga-trabajo/carga-trabajo.component';
import {Credenciales} from 'src/app/models/credenciales';
import {DomSanitizer} from '@angular/platform-browser';
import {Estado} from '../../../../models/enums';
import {Parametro as EnumParametro} from '../../../../models/enums/parametro';
import {AnularCargaComponent} from './carga-anular.component';
import {ValidacionService} from 'src/app/services/impl/validacion';
import {PaginacionSetComponent} from 'src/app/components/common/paginacion/paginacion-set.component';
import {EmpresasService} from '../../../../services/impl/empresas.service';

@Component({
  selector: 'app-detalle-bandeja',
  templateUrl: './detalle-bandeja.component.html',
  styleUrls: ['./detalle-bandeja.component.scss']
})
export class DetalleBandejaComponent implements OnInit {
  @ViewChild('buscar') buscar: ElementRef;
  @ViewChildren('buscar') buscar_aux: ElementRef;
  @ViewChild(BuscarCargaTrabajoComponent) busquedaAvanzada;
  @ViewChild(AnularCargaComponent) anularCarga;
  @ViewChild('general') general1: PaginacionSetComponent;

  public cargasTrabajo: Array<CargaTrabajo>;
  public paginacion: Paginacion;
  datos: DatosConsulta;
  filaSeleccionada: number;
  public nombreGrupoSeleccionado: string;
  public parametroBusqueda: string;
  public indicador: string;
  textoBusqueda: string;
  public requestCarga: RequestCarga;
  public uidCarga: string;


  public pagRetorno: number;
  public dataofici: string;
  public empresas: Empresa[] = new Array<Empresa>();
  public oficinas: Oficina[] = new Array<Oficina>();
  public actividades: Actividad[] = new Array<Actividad>();
  public estados: TipoParametro = new TipoParametro();
  public fechaInicial: Date = new Date();
  public fechaFinal: Date = new Date();
  public vdescripcion: String = 'G';
  public uidUsuarioC: string;

  estadoParametro: Parametro;
  oficina: Oficina;
  empresa: Empresa;
  actividad: Actividad;
  listaParametros: ParametrosCargaBandeja = new ParametrosCargaBandeja();
  loading: boolean;
  flag_busqueda: boolean = false;
  esContratista: boolean = false;
  esSedapal: boolean = false;
  public showMessage: boolean;
  public message: string;
  public booleanModal: boolean;
  public boolCaja: boolean = false;
  public motivo: string = '0';
  public txtMotivo: string = '';

  constructor(private cargasService: CargasTrabajoService, private localeService: BsLocaleService,
              private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer,
              private ValidacionSoloLetras: ValidacionService, private empresaService: EmpresasService) {
    this.requestCarga = new RequestCarga();
    this.paginacion = new Paginacion({registros: 10});
    defineLocale('es', esLocale);
    this.localeService.use('es');
    // this.ConsultarParametros();
  }

  ngOnInit(): void {
    localStorage.removeItem('ValorFInal');
    this.esSedapal = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_INTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_RESPONSABLE;
    this.esContratista = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_EXTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_SUPERVISOR_EXTERNO;
    this.nombreGrupoSeleccionado = 'Grupo genérico';
    this.requestCarga.uidGrupo = '0';
    this.fechaFinal = null;
    this.fechaInicial = null;
    this.parametroBusqueda = 'nrocarga';
    this.initValues();
    this.ConsultarParametros();
    //Inicio
    //this.realizarBusqueda();

    let valor = sessionStorage.getItem('tex');
    if (valor != null) {
      this.OnBuscarRetorno();
    } else {
      this.OnBuscar();
    }
    //Fin
    //PAGINA


    let CantRow = parseInt(localStorage.getItem('combocantidadRow'));
    if (String(CantRow) == 'NaN') {
      CantRow = 0;
    }

    if (CantRow > 0) {
      this.general1.change(CantRow);
      let pagRetorno = parseInt(localStorage.getItem('pagRetorno'));
      this.OnPageOptionChangedReturn(pagRetorno, CantRow);
    } else {
      //paginacion
      let cantiPgFinal = localStorage.getItem('pagRetorno');
      if (cantiPgFinal != null) {
        //combo
        this.OnPageChangedRetorno(cantiPgFinal);
      }
    }
    sessionStorage.removeItem('busquedaAvanzadaPaginaFinal');
    localStorage.removeItem('busquePagin');
  }

  ConsultarParametros() {
    this.cargasService.consultarParametros().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
      },
      (error) => this.controlarError(error)
    );
  }

  validacionNroCarga(item: any) {
    let validador
    validador = item.keycode || item.which;
    let tecla = String.fromCharCode(validador).toString();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890-";
    let especiales = [8, 6];
    let tecla_especial = false
    for (var i in especiales) {
      if (validador == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      return false;
    }

  }

  mostrarDetalleRegistro(cargaTrabajo: CargaTrabajo) {
    localStorage.setItem('beanCargaTrabajo', JSON.stringify(cargaTrabajo));
    this.router.navigate(['carga-trabajo/detalle']);
  }

  initValues() {
    this.requestCarga = {
      uidCargaTrabajo: 'G',
      motivoAnula: 'G',
      uidUsuarioE: 'G',
      uidUsuarioC: 'G',
      uidOficina: '0',
      uidGrupo: '0',
      uidEstado: 'G',
      uidContratista: '0',
      uidActividad: 'G',
      cantidadEjecutada: '0',
      cantidadCarga: '0',
      fechaSedapal: '31/12/2999',
      fechaContratista: '31/12/2999',
      fechaCarga: '31/12/2999',
      fechaInicio: '31/12/2999',
      fechaFin: '31/12/2999',
      idPers: '0',
      idPerfil: '0',
      comentario: 'G',
      usuario: 'G',
      vnTipoEstado: 0,
      vdescripcion: 'G',
      descContratista: ''
    };
    this.showMessage = false;
    this.textoBusqueda = '';
    this.booleanModal = false;
  }

  OnBuscarRetorno() {
    this.indicador = '';
    //eliminamos pagina por que no viene si buscas

    localStorage.removeItem('CantPagina');

    this.actividad = null;
    this.vdescripcion = null;
    this.fechaInicial = null;
    this.fechaFinal = null;
    this.uidCarga = 'G';
    this.requestCarga.uidEstado = 'G';
    let textoMemoria = sessionStorage.getItem('tex');
    let parametro = sessionStorage.getItem('parametroBusqueda');
    let valorEstado = sessionStorage.getItem('valorEstado');

    this.textoBusqueda = textoMemoria;
    this.parametroBusqueda = parametro;

    if (valorEstado != null) {
      this.textoBusqueda = '';
    }

    if (this.textoBusqueda == undefined || this.textoBusqueda == null || this.textoBusqueda.length == 0) {
      this.showMessage = false;
    }

    this.fechaInicial = null;
    this.fechaFinal = null;
    switch (this.parametroBusqueda) {
      case 'nrocarga':
        this.uidCarga = this.textoBusqueda;
        this.vdescripcion = 'G';
        this.requestCarga.uidEstado = 'G';
        break;
      case 'descripcion':
        this.uidCarga = 'G';
        this.vdescripcion = this.textoBusqueda;
        this.requestCarga.uidEstado = 'G';
        break;
      case 'estado':
        this.uidCarga = 'G';
        this.vdescripcion = 'G';
        //this.requestCarga.uidEstado = this.estadoParametro == undefined || this.estadoParametro == null ? 'G' : this.estadoParametro.valor;
        this.requestCarga.uidEstado = valorEstado;
        this.showMessage = this.estadoParametro == undefined || this.estadoParametro == null ? false : true;
        break;
    }

    this.realizarBusquedaRetorno();
  }

  realizarBusquedaRetorno() {
    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem('credenciales');
    item = JSON.parse(credenciales);
    this.seleccionarNroCargaFechas();
    this.requestCarga.uidContratista = this.empresa != null ? this.empresa.codigo.toString() : '0';
    this.requestCarga.uidOficina = this.oficina != null ? this.oficina.codigo.toString() : '0';
    this.requestCarga.uidEstado = this.estadoParametro != null ? this.estadoParametro.valor : 'G';
    this.requestCarga.uidActividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    this.requestCarga.uidCargaTrabajo = this.uidCarga != null && this.uidCarga != '' ? this.uidCarga.toString() : 'G';
    this.requestCarga.vdescripcion = this.vdescripcion != null && this.vdescripcion != '' ? this.vdescripcion.toString() : 'G';
    //this.requestCarga.uidUsuarioC = item.usuario;
    this.requestCarga.uidUsuarioC = this.uidUsuarioC != null && this.uidUsuarioC != "" ? this.uidUsuarioC.toString() : 'G';
    this.requestCarga.uidUsuarioE = item.usuario;
    this.requestCarga.idPerfil = sessionStorage.getItem('perfilAsignado');
    this.requestCarga.idPers = sessionStorage.getItem('codigoTrabajador');
    this.requestCarga.comentario = 'G';
    this.requestCarga.usuario = 'G';
    const actividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    ////////////////////////////

    //final
    let prueba = sessionStorage.getItem('valorEstado');
    if (prueba != null) {
      this.requestCarga.uidEstado = prueba;
    }


    let busqueFinal: RequestCarga;
    busqueFinal = JSON.parse(sessionStorage.getItem('busquedaAvanzadaprimero'));


    //busqueda y paginacion si es verdad

    let BusquedPagina = localStorage.getItem('busquePagin');
    if (BusquedPagina != null) {
      let busquePaginaFinal: RequestCarga;
      busquePaginaFinal = JSON.parse(sessionStorage.getItem('busquedaAvanzadaPaginaFinal'));
      this.requestCarga = busquePaginaFinal;
      this.booleanModal = true;
    }


    //busqueda y paginacion si es verdad
    if (busqueFinal != null) {
      this.requestCarga = busqueFinal;
      this.booleanModal = true;

    }

    ///////////////
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestCarga));
    this.booleanModal = false;
    this.loading = true;

    this.cargasService.consultarCargasTrabajo(this.requestCarga, this.paginacion.pagina, this.paginacion.registros)
      .subscribe((data: ResponseCarga) => {
          this.loading = false;
          this.cargasTrabajo = data.resultado;
          this.paginacion = data.paginacion;
        },
        (error) => this.controlarError(error)
      );

  }

  OnBuscar() {
    this.indicador = 'avanzado';
    sessionStorage.removeItem('tex');
    sessionStorage.removeItem('parametroBusqueda');
    sessionStorage.removeItem('valorEstado');
    localStorage.removeItem('EstadoMensaje');
    sessionStorage.removeItem('busquedaAvanzadaFinal');
    //sessionStorage.removeItem("busquedaAvanzadaprimero")
    localStorage.removeItem('contratista');
    localStorage.removeItem('actividadmensaje');

    //eliminamos pagina por que no viene si buscas

    localStorage.removeItem('CantPagina');

    this.actividad = null;
    this.vdescripcion = null;
    this.fechaInicial = null;
    this.fechaFinal = null;
    this.uidCarga = 'G';
    this.requestCarga.uidEstado = 'G';
    sessionStorage.setItem('tex', this.textoBusqueda);
    sessionStorage.setItem('parametroBusqueda', this.parametroBusqueda);

    if (this.textoBusqueda == undefined || this.textoBusqueda == null || this.textoBusqueda.length == 0) {
      this.showMessage = false;
    }

    this.fechaInicial = null;
    this.fechaFinal = null;
    switch (this.parametroBusqueda) {
      case 'nrocarga':
        this.uidCarga = this.textoBusqueda;
        this.vdescripcion = 'G';
        this.requestCarga.uidEstado = 'G';
        break;
      case 'descripcion':
        this.uidCarga = 'G';
        this.vdescripcion = this.textoBusqueda;
        this.requestCarga.uidEstado = 'G';
        break;
      case 'estado':
        this.uidCarga = 'G';
        this.vdescripcion = 'G';
        this.requestCarga.uidEstado = this.estadoParametro == undefined || this.estadoParametro == null ? 'G' : this.estadoParametro.valor;
        sessionStorage.setItem('valorEstado', this.requestCarga.uidEstado);
        this.showMessage = this.estadoParametro == undefined || this.estadoParametro == null ? false : true;
        break;
    }

    this.realizarBusqueda();
  }

  realizarBusqueda() {
    //Busqueda Avanzanda
    //final
    localStorage.removeItem('oficinaFinalC');
    sessionStorage.removeItem('busquedaAvanzadaFinal');
    localStorage.removeItem('estadoAvanza');
    localStorage.removeItem('EstadoMensaje');
    localStorage.removeItem('contratista');
    localStorage.removeItem('actividadmensaje');
    //sessionStorage.removeItem("busquedaAvanzadaprimero")
    //final


    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem('credenciales');
    item = JSON.parse(credenciales);
    this.seleccionarNroCargaFechas();
    this.requestCarga.uidContratista = this.empresa != null ? this.empresa.codigo.toString() : '0';
    this.requestCarga.uidOficina = this.oficina != null ? this.oficina.codigo.toString() : '0';
    this.requestCarga.uidEstado = this.estadoParametro != null ? this.estadoParametro.valor : 'G';
    this.requestCarga.uidActividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    this.requestCarga.uidCargaTrabajo = this.uidCarga != null && this.uidCarga != '' ? this.uidCarga.toString() : 'G';
    this.requestCarga.vdescripcion = this.vdescripcion != null && this.vdescripcion != '' ? this.vdescripcion.toString() : 'G';
    //this.requestCarga.uidUsuarioC = item.usuario;
    this.requestCarga.uidUsuarioC = this.uidUsuarioC != null && this.uidUsuarioC != "" ? this.uidUsuarioC.toString() : 'G';
    this.requestCarga.uidUsuarioE = item.usuario;
    this.requestCarga.idPerfil = sessionStorage.getItem('perfilAsignado');
    this.requestCarga.idPers = sessionStorage.getItem('codigoTrabajador');
    this.requestCarga.comentario = 'G';
    this.requestCarga.usuario = 'G';
    const actividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    ////////////////////////////

    sessionStorage.setItem('busquedaAvanzadaprimero', JSON.stringify(this.requestCarga));
    //busqueda y paginacion si es verdad
    ///////////////
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestCarga));
    this.booleanModal = false;
    this.loading = true;
    this.cargasService.consultarCargasTrabajo(this.requestCarga, this.paginacion.pagina, this.paginacion.registros)
      .subscribe((data: ResponseCarga) => {
          this.loading = false;
          this.cargasTrabajo = data.resultado;
          this.paginacion = data.paginacion;
        },
        (error) => this.controlarError(error)
      );
  }


  OnPageChanged(event): void {
    localStorage.removeItem('pagRetorno');
    this.paginacion.pagina = event.page;
    //Variable Local de Retorno
    localStorage.setItem('pagRetorno', event.page);
    this.realizarBusquedaReturnPaginacion();
  }


  OnPageChangedRetorno(event): void {
    this.paginacion.pagina = event.page;
    this.realizarBusquedaReturnPaginacion();
  }


  realizarBusquedaReturnPaginacion() {
    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem('credenciales');
    item = JSON.parse(credenciales);
    this.seleccionarNroCargaFechas();
    this.requestCarga.uidContratista = this.empresa != null ? this.empresa.codigo.toString() : '0';
    this.requestCarga.uidOficina = this.oficina != null ? this.oficina.codigo.toString() : '0';
    this.requestCarga.uidEstado = this.estadoParametro != null ? this.estadoParametro.valor : 'G';
    this.requestCarga.uidActividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    this.requestCarga.uidCargaTrabajo = this.uidCarga != null && this.uidCarga != '' ? this.uidCarga.toString() : 'G';
    this.requestCarga.vdescripcion = this.vdescripcion != null && this.vdescripcion != '' ? this.vdescripcion.toString() : 'G';
    //this.requestCarga.uidUsuarioC = item.usuario;
    this.requestCarga.uidUsuarioC = this.uidUsuarioC != null && this.uidUsuarioC != "" ? this.uidUsuarioC.toString() : 'G';
    this.requestCarga.uidUsuarioE = item.usuario;
    this.requestCarga.idPerfil = sessionStorage.getItem('perfilAsignado');
    this.requestCarga.idPers = sessionStorage.getItem('codigoTrabajador');
    this.requestCarga.comentario = 'G';
    this.requestCarga.usuario = 'G';
    const actividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    //Busqueda Avanzada
    let busqueFinal: RequestCarga;
    busqueFinal = JSON.parse(sessionStorage.getItem('busquedaAvanzadaprimero'));

    if (busqueFinal != null) {
      this.requestCarga = busqueFinal;
      this.booleanModal = true;
    }
    let PaginacionRetorno = parseInt(localStorage.getItem('pagRetorno'));


    ///////////////
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestCarga));
    this.booleanModal = false;
    this.loading = true;
    this.cargasService.consultarCargasTrabajo(this.requestCarga, PaginacionRetorno, this.paginacion.registros)
      .subscribe((data: ResponseCarga) => {
          this.loading = false;
          this.cargasTrabajo = data.resultado;
          this.paginacion = data.paginacion;
        },
        (error) => this.controlarError(error)
      );

  }


  //Cantidad de Reg.
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    localStorage.removeItem('combocantidadRow');
    localStorage.setItem('combocantidadRow', JSON.stringify(this.paginacion.registros));
    this.paginacion.pagina = 1;


    this.realizarBusquedaReturnPaginacionRow();
    /*
      if(this.indicador=="avanzado"){
        this.realizarBusquedaReturnPaginacionRow();
      }else{
        this.realizarBusqueda();
      }*/
  }


  OnPageOptionChangedReturn(pagina: number, registros: number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    this.realizarBusquedaReturnPaginacionRow();
  }

  realizarBusquedaReturnPaginacionRow() {
    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem('credenciales');
    item = JSON.parse(credenciales);
    this.seleccionarNroCargaFechas();
    this.requestCarga.uidContratista = this.empresa != null ? this.empresa.codigo.toString() : '0';
    this.requestCarga.uidOficina = this.oficina != null ? this.oficina.codigo.toString() : '0';
    this.requestCarga.uidEstado = this.estadoParametro != null ? this.estadoParametro.valor : 'G';
    this.requestCarga.uidActividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    this.requestCarga.uidCargaTrabajo = this.uidCarga != null && this.uidCarga != '' ? this.uidCarga.toString() : 'G';
    this.requestCarga.vdescripcion = this.vdescripcion != null && this.vdescripcion != '' ? this.vdescripcion.toString() : 'G';
    //this.requestCarga.uidUsuarioC = item.usuario;
    this.requestCarga.uidUsuarioC = this.uidUsuarioC != null && this.uidUsuarioC != "" ? this.uidUsuarioC.toString() : 'G';
    this.requestCarga.uidUsuarioE = item.usuario;
    this.requestCarga.idPerfil = sessionStorage.getItem('perfilAsignado');
    this.requestCarga.idPers = sessionStorage.getItem('codigoTrabajador');
    this.requestCarga.comentario = 'G';
    this.requestCarga.usuario = 'G';
    const actividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    //Busqueda Avanzada
    let busqueFinal: RequestCarga;
    busqueFinal = JSON.parse(sessionStorage.getItem('busquedaAvanzadaprimero'));

    if (busqueFinal != null) {
      this.requestCarga = busqueFinal;
      this.booleanModal = true;
    }
    let PaginacionRetorno = parseInt(localStorage.getItem('pagRetorno'));
    if (String(PaginacionRetorno) != 'NaN') {
      this.paginacion.pagina = PaginacionRetorno;
    } else {
      this.paginacion.pagina = 1;
    }
    let rowcantidad = parseInt(localStorage.getItem('combocantidadRow'));
    ///////////////
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestCarga));
    this.booleanModal = false;
    this.loading = true;

    this.cargasService.consultarCargasTrabajo(this.requestCarga, this.paginacion.pagina, rowcantidad)
      .subscribe((data: ResponseCarga) => {
          this.loading = false;
          this.cargasTrabajo = data.resultado;
          this.paginacion = data.paginacion;
        },
        (error) => this.controlarError(error)
      );

  }

  realizarBusquedaSGIO() {
    const pag = {pagina: 1, registros: 10, totalPaginas: 1, totalRegistros: 1};
    const paginacion = new Paginacion(pag);
    const lstCarga = new Array<CargaTrabajo>();
    const carga = new CargaTrabajo();
    carga.descActividad = 'SGIO';
    lstCarga.push(carga);
  }


  seleccionarNroCargaFechas() {
    if (this.fechaInicial || this.fechaFinal) {
      if (this.fechaInicial) {
        let dayI = this.fechaInicial.getDate().toString();
        if (dayI.toString().length == 1) {
          dayI = '0' + dayI;
        }
        let monthI = (this.fechaInicial.getMonth() + 1).toString();
        if (monthI.toString().length == 1) {
          monthI = '0' + monthI;
        }
        let yearI = this.fechaInicial.getFullYear().toString();
        this.requestCarga.fechaInicio = dayI + '/' + monthI + '/' + yearI;
        if (!this.fechaFinal) {
          this.requestCarga.fechaFin = '31/12/2999';
        }
      }

      if (this.fechaFinal) {
        let dayF = this.fechaFinal.getDate().toString();
        if (dayF.toString().length == 1) {
          dayF = '0' + dayF;
        }
        let monthF = (this.fechaFinal.getMonth() + 1).toString();
        if (monthF.toString().length == 1) {
          monthF = '0' + monthF;
        }
        let yearF = this.fechaFinal.getFullYear().toString();
        this.requestCarga.fechaFin = dayF + '/' + monthF + '/' + yearF;
        if (!this.fechaInicial) {
          this.requestCarga.fechaInicio = '31/12/2999';
        }
      }
    } else {
      this.requestCarga.fechaInicio = '31/12/2999';
      this.requestCarga.fechaFin = '31/12/2999';
    }

    this.requestCarga.fechaSedapal = '31/12/2999';
    this.requestCarga.fechaContratista = '31/12/2999';
    this.requestCarga.fechaCarga = '31/12/2999';
  }

  asignarDatosConsultados(cargaTrabajo: CargaTrabajo) {
    if (cargaTrabajo.descActividad !== 'SGIO') {
      this.datos = new DatosConsulta();
      this.datos.numeroCarga = cargaTrabajo.uidCargaTrabajo;
      this.datos.contratista = cargaTrabajo.descContratista;
      this.datos.oficina = cargaTrabajo.descOficina;
      this.datos.grupo = 'Grupo genérico';
      this.datos.actividad = cargaTrabajo.descActividad;
      this.datos.uidEstado = cargaTrabajo.uidEstado;
      this.datos.estado = cargaTrabajo.estado;
      this.datos.fecha = cargaTrabajo.fechaCarga;
      this.datos.uidContratista = cargaTrabajo.uidContratista.toString();
    } else {
      this.datos = new DatosConsulta();
      this.datos.actividad = cargaTrabajo.descActividad;
      this.datos.uidEstado = 'SGIO';
    }
  }

  visualizar(id: string) {
    this.router.navigate(['carga-trabajo/detalle/', id]);
  }

  OnConfigurarBusqueda() {
    switch (this.parametroBusqueda) {
      case 'nrocarga': {
        this.flag_busqueda = false;
        this.estadoParametro = null;
        this.buscar.nativeElement.maxLength = 20;
        this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 || (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122);
        this.buscar.nativeElement.placeholder = 'Nro Carga';
        break;
      }
      case 'descripcion': {
        this.flag_busqueda = false;
        this.estadoParametro = null;
        this.buscar.nativeElement.maxLength = 60;
        this.buscar.nativeElement.placeholder = 'Descripción';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'estado': {
        this.flag_busqueda = true;
        this.buscar.nativeElement.maxLength = 40;
        this.buscar.nativeElement.placeholder = 'Seleccione estado';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
    }
  }

  OnBusquedaAvanzada() {
    this.loading = true;
    this.requestCarga = this.busquedaAvanzada.requestCarga;
    this.fechaInicial = this.busquedaAvanzada.fechaInicial;
    this.fechaFinal = this.busquedaAvanzada.fechaFinal;
    this.uidCarga = this.busquedaAvanzada.uidCarga;
    this.estadoParametro = this.busquedaAvanzada.estadoParametro;
    this.oficina = this.busquedaAvanzada.oficina;
    this.empresa = this.busquedaAvanzada.empresa;
    this.actividad = this.busquedaAvanzada.actividad;
    this.vdescripcion = this.busquedaAvanzada.vdescripcion;
    this.booleanModal = true;

    if(!this.esContratista){
      this.uidUsuarioC = this.busquedaAvanzada.uidUsuarioC;
    }

    //cguerra capturamos la lisparametros para que pinte
    sessionStorage.setItem('listaParametros', JSON.stringify(this.busquedaAvanzada.listaParametros));
    //cguerra
    this.realizarBusqueda();
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    if (this.loading) {
      this.loading = false;
    }
  }

  DetectChange() {
    if (!this.fechaFinal || !this.fechaInicial) {
      return;
    }
    if (this.fechaFinal && this.fechaFinal.toString() == 'Invalid Date') {
      this.fechaFinal = null;
      this.toastr.warning('Fecha Final ingresada no valida', 'Advertencia', {closeButton: true});
      return;
    }
    if (this.fechaInicial && this.fechaInicial.toString() == 'Invalid Date') {
      this.fechaInicial = null;
      this.toastr.warning('Fecha Inicial ingresada no valida', 'Advertencia', {closeButton: true});
      return;
    }

  }


  OnRefrescar() {
    this.loading = true;
    this.paginacion.pagina = 1;
    this.loading = false;
  }


  OnAnular(indice: number): void {
    let item = new Credenciales();
    let credenciales: string;
    let mensaje: string;
    if (this.anularCarga.motivo == '2') {
      mensaje = 'Otros Motivos : ' + this.anularCarga.txtMotivo;
    } else if (this.anularCarga.motivo == '0') {
      mensaje = 'Error de Envio';
    } else {
      mensaje = 'Carga Duplicada';
    }
    credenciales = sessionStorage.getItem('credenciales');
    item = JSON.parse(credenciales);
    this.loading = true;
    this.cargasService.anularCargaTrabajo(this.cargasTrabajo[indice].uidCargaTrabajo, item.usuario, mensaje.toUpperCase().trim()).subscribe((data: ResponseCarga) => {
        let responsable = new Responsable();
        responsable.uidPersona = +(sessionStorage.getItem('codigoTrabajador'));
        responsable.uidOficina = this.cargasTrabajo[indice].uidOficina;
        responsable.uidActividad = this.cargasTrabajo[indice].uidActividad;
        // Inicio - Se navega hacia la bandeja, el resultado del envío de correo se manejara internamente
        this.realizarBusqueda();
        this.loading = false;
        this.toastr.success('Se ha eliminado la Carga de Trabajo', 'Confirmación', {closeButton: true});
        // Fin
        this.cargasService.obtenerListaAdjuntosDetalle(this.cargasTrabajo[indice].uidCargaTrabajo).subscribe(
          (response: ResponseAdjuntos) => {
            let listaFiles = new Array<Adjunto>();
            listaFiles = response.resultado;
            this.cargasService.obtenerResponsablesEnvio(responsable, this.cargasTrabajo[indice].uidCargaTrabajo, 'AN', listaFiles, this.cargasTrabajo[indice].descContratista).subscribe(
              (data: any) => {
                null;
              },
              (error) => {
                null;
              }
            );
          },
          (error) => {
            null;
          }
        );
      },
      (error) => {
        this.controlarError(error);
        this.loading = false;
      }
    );
  }

  private leaveFilters(): void {
    this.uidCarga = 'G';
    this.vdescripcion = null;
    this.estadoParametro = null;
    this.oficina = null;
    this.empresa = null;
    this.actividad = null;
    this.fechaFinal = null;
    this.fechaInicial = null;
    this.uidUsuarioC = null;
    this.initValues();
    this.realizarBusqueda();
  }

  private generateInfoMessage(requestCarga: RequestCarga): string {

    let message = '<strong>Búsqueda Por: </strong>';
    if (this.booleanModal) {
      if (requestCarga.uidOficina !== '0') {
        let descOfi = localStorage.getItem('oficinaFinalC');


        if (descOfi != null) {
          let descOfi = localStorage.getItem('oficinaFinalC');
          message = message + '<br/><strong>Oficina: </strong> <parrafo>' + descOfi + '</parrafo>' + ' ';
          this.showMessage = true;
          //Eliminamos Variable
          //localStorage.removeItem("oficinaFinalC");

        } else {
          const oficina: Oficina = this.busquedaAvanzada.listaParametros.listaOficina.find((ofi) => {
            return ofi.codigo === Number(requestCarga.uidOficina);
          });
          message = message + '<br/><strong>Oficina: </strong> <parrafo>' + oficina.descripcion + '</parrafo>' + ' ';

          localStorage.setItem('oficinaFinalC', oficina.descripcion);

          this.showMessage = true;
        }
      }
      if (requestCarga.uidActividad !== 'G') {
        let activi = localStorage.getItem('actividadmensaje');

        if (activi != null) {
          message = message + '<br/><strong>Actividad: </strong> <parrafo>' + activi + '</parrafo>' + ' ';
          this.showMessage = true;

        } else {
          const actividad: Actividad = this.busquedaAvanzada.listaParametros.listaActividad.find((activity) => {
            return activity.codigo === requestCarga.uidActividad;
          });
          message = message + '<br/><strong>Actividad: </strong> <parrafo>' + actividad.descripcion + '</parrafo>' + ' ';
          localStorage.setItem('actividadmensaje', actividad.descripcion);
          this.showMessage = true;
        }

      }

      if (requestCarga.uidEstado !== 'G') {
        let datosestados = localStorage.getItem('EstadoMensaje');
        if (datosestados != null) {

          message = message + '<br/><strong>Estado: </strong> <parrafo>' + datosestados + '</parrafo>' + ' ';
          this.showMessage = true;
          //
        } else {
          const estado: Parametro = this.busquedaAvanzada.listaParametros.listaEstado.find((parameter) => {
            return parameter.valor === requestCarga.uidEstado;
          });
          message = message + '<br/><strong>Estado: </strong> <parrafo>' + estado.detalle + '</parrafo>' + ' ';
          this.showMessage = true;

          localStorage.setItem('EstadoMensaje', estado.detalle);

          this.estadoParametro.valor = 'G';

        }

      }


      if (requestCarga.uidContratista !== '0') {
        let datoContrati = localStorage.getItem('contratista');
        if (datoContrati != null) {
          message = message + '<br/><strong>Contratista: </strong> <parrafo>' + datoContrati + '</parrafo>' + ' ';
          this.showMessage = true;
          //localStorage.removeItem('contratista');
        } else {
          const empresa: Empresa = this.busquedaAvanzada.listaParametros.listaEmpresa.find((company) => {
            return company.codigo == requestCarga.uidContratista;
          });
          message = message + '<br/><strong>Contratista: </strong> <parrafo>' + empresa.descripcion + '</parrafo>' + ' ';
          localStorage.setItem('contratista', empresa.descripcion);
          this.showMessage = true;
        }
      }
      /////////////////////

      //Nro Carga
      if (requestCarga.uidCargaTrabajo !== 'G') {
        let NroCargaFinal = localStorage.getItem('NroCargaFinal');
        if (NroCargaFinal != null) {
          message = message + '<br/><strong>Número de carga: </strong> <parrafo>' + NroCargaFinal + '</parrafo>' + ' ';
          this.showMessage = true;
          //Eliminamos Variable
          localStorage.removeItem('NroCargaFinal');
        } else {
          message = message + '<br/><strong>Número de carga: </strong> <parrafo>' + requestCarga.uidCargaTrabajo + '</parrafo>' + ' ';
          this.showMessage = true;
        }

      }
      if (requestCarga.vdescripcion !== 'G') {
        let DescripcionFinal = localStorage.getItem('DescripcionFInal');
        if (DescripcionFinal != null) {
          message = message + '<br/><strong>Descripción: </strong> <parrafo>' + DescripcionFinal + '</parrafo>' + ' ';
          this.showMessage = true;
          //Eliminamos Variable
          localStorage.removeItem('DescripcionFInal');
        } else {
          message = message + '<br/><strong>Descripción: </strong> <parrafo>' + requestCarga.vdescripcion + '</parrafo>' + ' ';
          this.showMessage = true;
        }
      }

      //Fecha Inicial
      if (requestCarga.fechaInicio !== '31/12/2999') {
        message = message + '<br/><strong>Fecha de inicio: </strong> <parrafo>' + requestCarga.fechaInicio + '</parrafo>' + ' ';
        this.showMessage = true;
      }
      //Fecha Fin
      if (requestCarga.fechaFin !== '31/12/2999') {
        message = message + '<br/><strong>Fecha de fin: </strong> <parrafo>' + requestCarga.fechaFin + '</parrafo>' + ' ';
        this.showMessage = true;
      }

        //Usuario de Carga
        if (requestCarga.uidUsuarioC !== 'G' &&  !this.esContratista) {
          let UsuarioCargaFinal = localStorage.getItem("UsuarioCargaFinal");
          if (UsuarioCargaFinal != null) {
            message = message + '<br/><strong>Usuario AGC: </strong> <parrafo>' + UsuarioCargaFinal + '</parrafo>' + ' ';
            this.showMessage = true;
            //Eliminamos Variable
            localStorage.removeItem("UsuarioCargaFinal");
          } else {
            message = message + '<br/><strong>Usuario AGC: </strong> <parrafo>' + requestCarga.uidUsuarioC + '</parrafo>' + ' ';
            this.showMessage = true;
          }
        }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else {
      //Busqueda Simple
      this.requestCarga.uidOficina = '0';
      sessionStorage.setItem('busquedaAvanzada', JSON.stringify(this.requestCarga));

      if (requestCarga.uidCargaTrabajo !== 'G') {
        message = message + '<br/><strong>Número de carga: </strong> <parrafo>' + requestCarga.uidCargaTrabajo + '</parrafo>' + ' ';
        this.showMessage = true;

      }
      if (requestCarga.vdescripcion !== 'G') {
        message = message + '<br/><strong>Descripción: </strong> <parrafo>' + requestCarga.vdescripcion + '</parrafo>' + ' ';
        this.showMessage = true;
      }
      if (requestCarga.fechaInicio !== '31/12/2999') {
        message = message + '<br/><strong>Fecha de inicio: </strong> <parrafo>' + requestCarga.fechaInicio + '</parrafo>' + ' ';
        this.showMessage = true;
      }
      if (requestCarga.fechaFin !== '31/12/2999') {
        message = message + '<br/><strong>Fecha de fin: </strong> <parrafo>' + requestCarga.fechaFin + '</parrafo>' + ' ';
        this.showMessage = true;
      }


      //Mensaje del Estado//
      if (requestCarga.uidEstado !== 'G') {

        let valorfinal1 = localStorage.getItem('EstadoMensaje');


        if (valorfinal1 != null) {
          message = message + '<br/><strong>Estado: </strong> <parrafo>' + valorfinal1 + '</parrafo>' + ' ';
          this.showMessage = true;
          //localStorage.removeItem("EstadoMensaje");
        } else {

          const estado: Parametro = this.listaParametros.listaEstado.find((parameter) => {
            return parameter.valor === requestCarga.uidEstado;
          });
          message = message + '<br/><strong>Estado: </strong> <parrafo>' + estado.detalle + '</parrafo>' + ' ';
          localStorage.setItem('EstadoMensaje', estado.detalle);
          this.showMessage = true;

        }
      }

      if (requestCarga.uidUsuarioC !== 'G' &&  !this.esContratista) {
        message = message + '<br/><strong>Usuario AGC: </strong> <parrafo>' + requestCarga.uidUsuarioC + '</parrafo>' + ' ';
        this.showMessage = true;
      }

    }
    //Eliminamos Variable de sessión
    localStorage.removeItem('Desestado');
    sessionStorage.removeItem('estadoParametroF');
    sessionStorage.removeItem('tipoEstadoF');
    //slocalStorage.removeItem("finalahorasi");
    sessionStorage.removeItem("aaaa");


    return message;

  }

}

