import { Component, Input, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CargasTrabajoService } from '../../../services/impl/cargas-trabajo.service';
import { CargaTrabajo } from '../../../models/CargaTrabajo';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ViewChild } from '@angular/core';
import { DetalleCargaMedidoresComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-medidores.component';
import { DetalleCargaDistribucionComunicacionesComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-distribucion-comunicaciones.component';
import { DetalleCargaInspeccionesComercialesComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-inspecciones-comerciales.component';
import { DetalleCargaTomaEstadosComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-toma-estados.component';
import { DetalleCargaAvisoCobranzaComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-aviso-cobranza.component';
import { validate } from 'class-validator';
import { DatosConsultaComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/datos-consulta/datos-consulta.component';
import { Parametro } from 'src/app/models/enums/parametro';
import { Credenciales } from 'src/app/models/credenciales';
import { RequestCarga } from 'src/app/models/request/request-carga';
import { ResponseObject } from 'src/app/models/response/response-object';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseCarga } from 'src/app/models/response/response-carga';
import { Router } from '@angular/router';
import { BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Responsable, Adjunto, ResponseAdjuntos, Empresa, ParametrosCargaBandeja } from 'src/app/models';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { Parametro as EnumParametro } from '../../../models/enums/parametro';
import { AnularCargaComponent } from '../bandeja/detalle-bandeja/carga-anular.component';
import { CargaMasivaTramaComponent } from 'src/app/modules/carga-trabajo/detalle-carga-trabajo/carga-masiva-trama/carga-masiva-trama.component';

@Component({
  selector: 'app-detalle-carga-trabajo',
  templateUrl: './detalle-carga-trabajo.component.html',
  styleUrls: ['./detalle-carga-trabajo.component.scss']
})
export class DetalleCargaTrabajoComponent implements OnInit, OnDestroy {
  @Input() fechaInicioVigencia: Date = null;
  @Input() fechaFinVigencia: Date = null;
  @Input() contratista: Empresa = new Empresa();

  // Invocación a componentes
  @ViewChild('datosConsulta') datosConsulta: DatosConsultaComponent;
  @ViewChild('cargaTramaEjec') cargaTramaEjec: CargaMasivaTramaComponent;
  @ViewChild('cargaMedidores') cargaMedidores: DetalleCargaMedidoresComponent;
  @ViewChild('distribucionComunicaciones') distribucionComunicaciones: DetalleCargaDistribucionComunicacionesComponent;
  @ViewChild('inspeccionesComerciales') inspeccionesComerciales: DetalleCargaInspeccionesComercialesComponent;
  @ViewChild('tomaEstados') tomaEstados: DetalleCargaTomaEstadosComponent;
  @ViewChild('avisoCobranza') avisoCobranza: DetalleCargaAvisoCobranzaComponent;
  @ViewChild(AnularCargaComponent) anularCarga;

  /* Objeto seleccionado */
  datos: CargaTrabajo;
  /* Manejo de errores */
  errors: any;
  /* Credenciales de Usuario */
  credenciales: Credenciales;
  esContratista: boolean = false;
  esSedapal: boolean = false;
  public boolCaja: boolean = false;
  public motivo: string = '0';
  public txtMotivo: string = '';
  public acciones: String = '';
  /* Variables para radio button */
  tipoDescagaTrama: number;
  /* Modales */
  public alertOption: SweetAlertOptions = {};
  public alertOptionObservar: SweetAlertOptions = {};
  /* Variable carga */
  loading: boolean;
  listaMensajesValidacion: Array<string> = new Array<string>();

  constructor(private localeService: BsLocaleService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cargaTrabajoService: CargasTrabajoService,
    private router: Router) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.datos = new CargaTrabajo();
    this.errors = {};
    this.credenciales = new Credenciales();
    this.acciones = sessionStorage.getItem("acciones");
    this.loading = false;
  }

  enviaFechas(fechas: [Date, Date]) {
    this.fechaInicioVigencia = fechas[0];
    this.fechaFinVigencia = fechas[1];
  }

  enviaContratista(contratista: Empresa) {
    this.contratista = contratista;
  }

  onActivarLoanding(valor: boolean): void {
    this.loading = valor;
  }

  ngOnInit() {
    //pagina
    let paginaTotal = localStorage.getItem("CantPagina");

    if (paginaTotal == "1") {
      paginaTotal = null;
    }

    //bean de busqueda avanzada
    let listaBusquedaAvanzada: RequestCarga;
    listaBusquedaAvanzada = JSON.parse(sessionStorage.getItem("busquedaAvanzada"));

    if (paginaTotal == undefined || paginaTotal == null) {
      //Oficina
      let Oficina = listaBusquedaAvanzada.uidOficina;
      if (Oficina !== '0') {
        let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
        localStorage.setItem("OficinaFinal", objSesion.descOficina);
      }
      //Actividad
      let Actividad = listaBusquedaAvanzada.uidActividad;
      if (Actividad !== 'G') {
        let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
        localStorage.setItem("ActividadFinal", objSesion.descActividad);
      }
      //Estado
      let Estado = listaBusquedaAvanzada.uidEstado;
      if (Estado !== 'G') {
        let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
        localStorage.setItem("EstadoFinal", objSesion.estado);
      }
      //Contratista
      let Contratista = listaBusquedaAvanzada.uidContratista;
      if (Contratista !== '0') {
        let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
        localStorage.setItem("ContratistaFinal", objSesion.descContratista);
      }
      //Descripcion     verificar
      let Descripcion = listaBusquedaAvanzada.vdescripcion;
      if (Descripcion !== 'G') {
        localStorage.setItem("DescripcionFInal", Descripcion);
      }

      //Lista de Parametros para que pinte el buscar
      let listaParametros: ParametrosCargaBandeja[] = [];
      // listaParametros =JSON.parse(sessionStorage.getItem("listaParametros"));

      if (listaBusquedaAvanzada != null) {
        sessionStorage.setItem("busquedaAvanzadaFinal", JSON.stringify(listaBusquedaAvanzada));
        //sessionStorage.setItem("listaParametrosFinal",JSON.stringify(listaParametros));
        //Eliminamos Variables de session
        sessionStorage.removeItem("listaParametros");
        localStorage.removeItem("CantPagina");
        localStorage.removeItem("busquePagin");
      }

    } else {
      // PaginaCion con Busqueda
      let Estado = listaBusquedaAvanzada.uidEstado;
      let NpaginaTotal = Number(paginaTotal);
      if (NpaginaTotal > 1 && Estado != 'G') {
        //indicador ojo eliminar
        let busqPagin= "true";
        localStorage.setItem("busquePagin",busqPagin);

         //enviamos el estado
        let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
        localStorage.setItem("EstadoFinal", objSesion.estado);
        //eviamos pag
        localStorage.setItem("PaginaFinal", paginaTotal);


         //Lista de Parametros para que pinte el buscar
      let listaParametros: ParametrosCargaBandeja[] = [];
      // listaParametros =JSON.parse(sessionStorage.getItem("listaParametros"));

      if (listaBusquedaAvanzada != null) {
        sessionStorage.setItem("busquedaAvanzadaPaginaFinal", JSON.stringify(listaBusquedaAvanzada));
        //sessionStorage.setItem("listaParametrosFinal",JSON.stringify(listaParametros));
        //Eliminamos Variables de session
        //sessionStorage.removeItem("busquedaAvanzada");
        sessionStorage.removeItem("listaParametros");
      }
      } else {
        //Solo Paginacion
        if (paginaTotal != null) {
          //creamos otra varible que contiene la pg
          localStorage.setItem("PaginaFinal", paginaTotal);
          localStorage.removeItem("busquePagin");
          localStorage.removeItem("CantPagina");
         // sessionStorage.removeItem("busquedaAvanzada");
          //sessionStorage.removeItem("busquedaAvanzadaFinal");
        }

      }


    }


    //Fin
    this.esSedapal = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_INTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_RESPONSABLE;
    this.esContratista = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_EXTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_SUPERVISOR_EXTERNO;

    if (this.esSedapal) {
      this.tipoDescagaTrama = 1;
    } else {
      this.tipoDescagaTrama = 0;
    }

    localStorage.setItem("viewAdjuntos", "0");
    let objSesion = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
    this.datos.uidCargaTrabajo = objSesion.uidCargaTrabajo;
    this.datos.uidContratista = objSesion.uidContratista;
    this.datos.descContratista = objSesion.descContratista;
    this.datos.uidOficina = objSesion.uidOficina;
    this.datos.descOficina = objSesion.descOficina;
    this.datos.uidGrupo = objSesion.uidGrupo;
    this.datos.uidActividad = objSesion.uidActividad;
    this.datos.descActividad = objSesion.descActividad;
    this.datos.uidEstado = objSesion.uidEstado;
    this.datos.estado = objSesion.estado;
    this.datos.fechaCarga = objSesion.fechaCarga;
    this.datos.fechaSedapal = objSesion.fechaSedapal;
    this.datos.fechaContratista = objSesion.fechaContratista;
    this.datos.cantidadCarga = objSesion.cantidadCarga;
    this.datos.cantidadEjecutada = objSesion.cantidadEjecutada;
    this.datos.uidUsuarioC = objSesion.uidUsuarioC;
    this.datos.comentario = objSesion.comentario;
    this.datos.motivoAnula = objSesion.motivoAnula;
    this.credenciales = JSON.parse(sessionStorage.getItem("credenciales"));

    this.alertOption = {
      input: 'textarea',
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50,
      html: '<h4>¿Está seguro que desea anular la Carga de Trabajo ' + this.datos.uidCargaTrabajo + "?</h4>",
      showCancelButton: true,
      cancelButtonText: "No ",
      confirmButtonText: 'Sí, anular ',
      focusCancel: true,
      focusConfirm: false,
      inputValidator: (value) => {
        return !value && '<strong>Por favor ingrese motivo de anulación!</strong>'
      }
    }

    this.alertOptionObservar = {
      input: 'textarea',
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50,
      html: '<h4>Detalle de la Observación:</h4>',
      showCancelButton: true,
      cancelButtonText: "No ",
      confirmButtonText: 'Aceptar ',
      focusCancel: true,
      focusConfirm: false,
      inputValidator: (value) => {
        return !value && '<strong>Por favor ingrese comentario de la observación!</strong>'
      }
    }

  }

  onEjecutarFiltro(filtro: number) {
    switch (this.datos.uidActividad) {
      case Parametro.ACT_INSPECCIONES_COMERCIALES: {
        this.inspeccionesComerciales.obtenerDetalleTrabajo();
        break;
      }
      case Parametro.ACT_DISTRBUCION_COMUNICACIONES: {
        this.distribucionComunicaciones.obtenerDetalleTrabajo();
        break;
      }
      case Parametro.ACT_DISTRIB_AVISO_COBRANZA: {
        this.avisoCobranza.obtenerDetalleTrabajo();
        break;
      }
      case Parametro.ACT_TOMA_ESTADO: {
        this.tomaEstados.obtenerDetalleTrabajo();
        break;
      }
      case Parametro.ACT_MEDIDORES: {
        this.cargaMedidores.obtenerDetalleTrabajo();
        break;
      } default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('beanCargaTrabajo');
  }

  onDescargarTrama(): void {
    let countListaDetalle: number;
    switch (this.datos.uidActividad) {
      case Parametro.ACT_INSPECCIONES_COMERCIALES: {
        countListaDetalle = this.inspeccionesComerciales.listaItems.length;
        break;
      }
      case Parametro.ACT_DISTRBUCION_COMUNICACIONES: {
        countListaDetalle = this.distribucionComunicaciones.listaItems.length;
        break;
      }
      case Parametro.ACT_DISTRIB_AVISO_COBRANZA: {
        countListaDetalle = this.avisoCobranza.listaItems.length;
        break;
      }
      case Parametro.ACT_TOMA_ESTADO: {
        countListaDetalle = this.tomaEstados.listaItems.length;
        break;
      }
      case Parametro.ACT_MEDIDORES: {
        countListaDetalle = this.cargaMedidores.listaItems.length;
        break;
      } default: {
        countListaDetalle = 0;
        break;
      }
    }
    if (countListaDetalle > 0) {
      this.loading = true;

      let perfilAsignado = JSON.parse(sessionStorage.getItem("perfilAsignado"));

      let item = new Credenciales();
      let credenciales: string;
      credenciales = sessionStorage.getItem("credenciales");
      item = JSON.parse(credenciales);

      this.cargaTrabajoService.obtenerTrama(this.datos.uidCargaTrabajo, this.datos.uidActividad, perfilAsignado, this.tipoDescagaTrama, item.usuario).subscribe((response) => {
        let nombreArchivo = this.datos.uidCargaTrabajo + ".txt";
        let nombreArchivoComprimido = this.datos.uidCargaTrabajo + ".zip";
        var zip = new JSZip();
        zip.file(nombreArchivo, response);
        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, nombreArchivoComprimido);
        });

        // let blob = new Blob([response],{type:'octet-stream'});
        // saveAs(blob, "Carga_"+this.datos.uidCargaTrabajo+".zip");

        if (this.esSedapal) {
          this.tipoDescagaTrama = 1;
        } else {
          this.tipoDescagaTrama = 0;
        }

        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      });
    } else {
      this.toastr.warning(Mensajes.MESSAGE_NO_EXISTE_DETALLE_CARGA, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
  }

  onCancelarDescargaTrama(): void {
    this.tipoDescagaTrama = 1;
  }

  OnAnular(event: string): void {
    let item = new Credenciales();
    let credenciales: string;
    let mensaje: string;
    if (this.anularCarga.motivo == "2") {
      mensaje = "Otros Motivos : " + this.anularCarga.txtMotivo;
    } else if (this.anularCarga.motivo == "0") {
      mensaje = "Error de Envio";
    } else {
      mensaje = "Carga Duplicada";
    }

    credenciales = sessionStorage.getItem("credenciales");
    item = JSON.parse(credenciales);
    this.loading = true;
    this.cargaTrabajoService.anularCargaTrabajo(this.datos.uidCargaTrabajo, item.usuario, mensaje.toUpperCase().trim()).subscribe((data: ResponseCarga) => {
      let responsable = new Responsable();
      responsable.uidPersona = +(sessionStorage.getItem("codigoTrabajador"));
      responsable.uidOficina = this.datos.uidOficina;
      responsable.uidActividad = this.datos.uidActividad;
      // Inicio - Se navega hacia la bandeja, el resultado del envío de correo se manejara internamente
      this.loading = false;
      this.router.navigate(['/carga-trabajo']);
      this.toastr.success(Mensajes.MESSAGE_ANULA_CARGA_TRABAJO, Mensajes.CAB_MESSAGE_OK, { closeButton: true });
      // Fin
      this.cargaTrabajoService.obtenerListaAdjuntosDetalle(this.datos.uidCargaTrabajo).subscribe(
        (response: ResponseAdjuntos) => {
          let listaFiles = new Array<Adjunto>();
          listaFiles = response.resultado;
          this.cargaTrabajoService.obtenerResponsablesEnvio(responsable, this.datos.uidCargaTrabajo, 'AN', listaFiles, this.datos.descContratista).subscribe(
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

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  onConfirmarEnvio() {
    this.onModificarCargaTrabajo(this.obtenerRequestCarga(), 'ENVIAR');
  }

  onEnviar(): void {
    // TODO: Cambiar mensaje de validacion
    if (this.validarEnvio()) {
      if (new Date() <= new Date(this.fechaFinVigencia) && new Date() >= new Date(this.fechaInicioVigencia)) {
        this.onConfirmarEnvio();
      } else {
        this.enviarContratistaNoVigente();
      }
    } else {
      this.mostrarMensajesToastr(this.listaMensajesValidacion);
    }

  }

  private mostrarMensajesToastr(listaMensajes: Array<string>): void {
    listaMensajes.forEach((value) => {
      this.toastr.warning(value, '');
    });
    listaMensajes.length = 0;
  }

  private validarEnvio(): boolean {
    let valido: boolean = true;
    if (this.contratista === null || this.contratista.codigo === 0) {
      this.listaMensajesValidacion.push('Debe seleccionar un contratista');
      valido = false;
    }
    return valido;
  }

  private enviarContratistaNoVigente(): void {
    swal({
      title: '¿El contratista NO está vigente. Desea continuar?',
      showCancelButton: true,
      confirmButtonText: 'Si, enviar',
      cancelButtonText: 'No gracias',
      focusConfirm: false,
      focusCancel: true,
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50
    }).then((result) => {
      if (result.value) {
        this.onModificarCargaTrabajo(this.obtenerRequestCarga(), 'ENVIAR');
      }
    });
  }

  private obtenerRequestCarga(): RequestCarga {
    const request: RequestCarga = new RequestCarga();
    request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
    request.motivoAnula = '';
    request.uidEstado = 'ES';
    request.comentario = this.datos.comentario;
    request.usuario = this.credenciales.usuario;
    request.uidContratista = this.datos.uidContratista.toString();
    request.accion = 'ENVIAR';
    request.uidOficina = this.datos.uidOficina.toString();
    request.uidActividad = this.datos.uidActividad;
    request.descContratista = this.datos.descContratista;
    return request;
  }

  onEnviarEjecutado(): void {
    let requestBusqueda: RequestCarga = new RequestCarga();
    requestBusqueda.uidCargaTrabajo = this.datos.uidCargaTrabajo;
    requestBusqueda.idPerfil = sessionStorage.getItem('perfilAsignado');
    requestBusqueda.idPers = '0';
    requestBusqueda.uidOficina = '0';
    requestBusqueda.uidEstado = 'G';
    requestBusqueda.uidContratista = '0';
    requestBusqueda.uidActividad = 'G';
    requestBusqueda.fechaSedapal = '31/12/2999';
    requestBusqueda.fechaInicio = '31/12/2999';
    requestBusqueda.fechaFin = '31/12/2999';
    requestBusqueda.vdescripcion = 'G';
    this.cargaTrabajoService.consultarCargasTrabajo(requestBusqueda, 1, 1).subscribe((data: ResponseCarga) => {

      let request: RequestCarga = new RequestCarga();
      request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
      request.motivoAnula = "";
      request.comentario = this.datos.comentario;
      request.usuario = this.credenciales.usuario;
      request.uidContratista = this.datos.uidContratista.toString();
      request.accion = 'ENVIAR-EJECUTADO';
      request.uidOficina = this.datos.uidOficina.toString();
      request.uidActividad = this.datos.uidActividad;
      request.descContratista = this.datos.descContratista;

      if (data.resultado[0].cantidadCarga == data.resultado[0].cantidadEjecutada) {
        request.uidEstado = 'EC';
      } else {
        request.uidEstado = 'EPC'
      }
      this.onModificarCargaTrabajo(request, 'ENVIAR-EJECUTADO');
    },
      (error) => this.controlarError(error)
    );
  }

  onObservar(comentarioObservacion): void {
    let request: RequestCarga = new RequestCarga();
    request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
    request.motivoAnula = comentarioObservacion.trim();

    if (this.datos.uidEstado == 'ES') {
      request.uidEstado = 'OC';
    } else if (this.datos.uidEstado == 'EC' || this.datos.uidEstado == 'EPC') {
      request.uidEstado = 'OS';
    }
    request.comentario = this.datos.comentario;
    request.usuario = this.credenciales.usuario;
    request.uidContratista = this.datos.uidContratista.toString();
    request.accion = 'OBSERVADO';
    request.uidOficina = this.datos.uidOficina.toString();
    request.uidActividad = this.datos.uidActividad;
    request.descContratista = this.datos.descContratista;
    this.onModificarCargaTrabajo(request, 'OBSERVADO');
  }

  onAceptar(): void {
    let request: RequestCarga = new RequestCarga();
    request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
    request.motivoAnula = "";
    request.uidEstado = 'AC';
    request.comentario = this.datos.comentario;
    request.usuario = this.credenciales.usuario;
    request.uidContratista = this.datos.uidContratista.toString();
    request.accion = 'ACEPTADO';
    request.uidOficina = this.datos.uidOficina.toString();
    request.uidActividad = this.datos.uidActividad;
    request.descContratista = this.datos.descContratista;
    this.onModificarCargaTrabajo(request, 'ACEPTADO');
  }

  onCerrar(): void {
    let request: RequestCarga = new RequestCarga();
    request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
    request.motivoAnula = "";
    request.uidOficina = this.datos.uidOficina.toString();
    request.uidActividad = this.datos.uidActividad;
    request.uidEstado = 'CE';
    request.comentario = this.datos.comentario;
    request.usuario = this.credenciales.usuario;
    request.uidContratista = this.datos.uidContratista.toString();
    request.accion = 'CERRAR';
    request.descContratista = this.datos.descContratista;
    this.onModificarCargaTrabajo(request, 'CERRAR');
  }

  onGuardar(): void {
    this.errors = {};
    validate(this.datos).then(errors => {
      if (errors.length > 0) {
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });
        this.datosConsulta.onSetearError(this.errors);
        this.toastr.error(Mensajes.MESSAGE_VALIDACION_CAMPOS, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      } else {
        let request: RequestCarga = new RequestCarga();
        request.uidCargaTrabajo = this.datos.uidCargaTrabajo;
        request.uidEstado = this.datos.uidEstado;
        request.comentario = this.datos.comentario;
        request.usuario = this.credenciales.usuario;
        request.uidContratista = this.datos.uidContratista.toString();
        request.accion = 'GUARDAR';
        request.uidOficina = this.datos.uidOficina.toString();
        request.uidActividad = this.datos.uidActividad;
        request.descContratista = this.datos.descContratista;
        this.onModificarCargaTrabajo(request, 'GUARDAR');
      }
    });
  }

  onModificarCargaTrabajo(request: RequestCarga, accion: string): void {
    if (request.descContratista == null || request.descContratista == undefined) {
      request.descContratista = this.contratista.descripcion;
    }
    this.loading = true;
    this.cargaTrabajoService.modificarEstadoCarga(request).subscribe((response: ResponseObject) => {
      if (accion != 'GUARDAR') {
        // Inicio - Se navega hacia la bandeja, el resultado del envío de correo se manejara internamente
        this.loading = false;
        this.router.navigate(['/carga-trabajo']);
        this.toastr.success(Mensajes.MESSAGE_OK_TRANSACCION, Mensajes.CAB_MESSAGE_OK, { closeButton: true });
        // Fin
        this.cargaTrabajoService.obtenerListaAdjuntosDetalle(request.uidCargaTrabajo).subscribe(
          (response: ResponseAdjuntos) => {
            let responsable = new Responsable();
            responsable.uidPersona = +(sessionStorage.getItem("codigoTrabajador"));
            responsable.uidOficina = +request.uidOficina;
            responsable.uidActividad = request.uidActividad
            let listaFiles = new Array<Adjunto>();
            listaFiles = response.resultado;
            this.cargaTrabajoService.obtenerResponsablesEnvio(responsable, request.uidCargaTrabajo, request.uidEstado, listaFiles, request.descContratista).subscribe(
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
      } else {
        this.loading = false;
        this.toastr.success(Mensajes.MESSAGE_OK_TRANSACCION, Mensajes.CAB_MESSAGE_OK, { closeButton: true });
      }
    }, (error) => {
      this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      this.loading = false;
    });
  }

  onBuscarItemDetalleTrabajo(codigoRegistro): void {
    switch (this.datos.uidActividad) {
      case Parametro.ACT_INSPECCIONES_COMERCIALES: {
        this.inspeccionesComerciales.obtenerItemDetalleTrabajo(codigoRegistro);
        break;
      }
      case Parametro.ACT_DISTRBUCION_COMUNICACIONES: {
        this.distribucionComunicaciones.obtenerItemDetalleTrabajo(codigoRegistro);
        break;
      }
      case Parametro.ACT_DISTRIB_AVISO_COBRANZA: {
        this.avisoCobranza.obtenerItemDetalleTrabajo(codigoRegistro);
        break;
      }
      case Parametro.ACT_TOMA_ESTADO: {
        this.tomaEstados.obtenerItemDetalleTrabajo(codigoRegistro);
        break;
      }
      case Parametro.ACT_MEDIDORES: {
        this.cargaMedidores.obtenerItemDetalleTrabajo(codigoRegistro);
        break;
      } default: {
        this.toastr.error(Mensajes.MESSAGE_ACTIVIDAD_NO_DEFINIDA, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
        break;
      }
    }
  }
}
