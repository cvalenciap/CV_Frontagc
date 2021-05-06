import {Component, EventEmitter, OnInit, Output,ViewChild,ElementRef} from '@angular/core';
import {Empresa, Paginacion} from '../../../../models';
import {Oficina} from '../../../../models/oficina';
import {Actividad} from '../../../../models/actividad';
import {TipoParametro} from '../../../../models/tipo-parametro';
import {ToastrService} from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import {Parametro} from '../../../../models/parametro';
import {ParametrosCargaBandeja, Response} from '../../../../models/';
import {RequestCarga} from '../../../../models/request/request-carga';
import {EmpresasService} from '../../../../services/impl/empresas.service';
import {OficinasService} from '../../../../services/impl/oficinas.service';
import {ActividadesService} from '../../../../services/impl/actividades.service';
import {ParametrosService} from '../../../../services/impl/parametros.service';
import {ResponseObject} from '../../../../models/response/response-object';
import { CargasTrabajoService } from 'src/app/services/impl/cargas-trabajo.service';
import { CargaTrabajo } from 'src/app/models/CargaTrabajo';
import { ResponseCarga } from '../../../../models/response/response-carga';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-busqueda-bandeja',
  templateUrl: './busqueda-bandeja.component.html',
  styleUrls: ['./busqueda-bandeja.component.scss']
})
export class BusquedaBandejaComponent implements OnInit {
  public requestCarga: RequestCarga;
  public uidCarga: string;
  public empresas: Empresa[] = new Array<Empresa>();
  public oficinas: Oficina[] = new Array<Oficina>();
  public actividades: Actividad[] = new Array<Actividad>();
  public estados: TipoParametro = new TipoParametro();
  public fechaInicial: Date = new Date();
  public fechaFinal: Date = new Date();
  public nombreEmpresaSeleccionada: string;
  public nombreOficinaSeleccionada: string;
  public nombreGrupoSeleccionado: string;
  public nombreActividadSeleccionada: string;
  public nombreEstadoSeleccionado: string;

  estadoParametro: Parametro; // = new TipoParametro();
  oficina: Oficina;
  empresa: Empresa;
  actividad: Actividad;
  listaParametros: ParametrosCargaBandeja = new ParametrosCargaBandeja();
  @ViewChild('buscar') buscar: ElementRef;
  @Output() recibirData = new EventEmitter<CargaTrabajo[]>();
  @Output() enviarPaginacion = new EventEmitter<Paginacion>();

  @Output() manejoFiltros = new EventEmitter<RequestCarga>();
  paginacion: Paginacion;

  constructor(private cargasService: CargasTrabajoService, private localeService: BsLocaleService, private toastr: ToastrService) {
    this.requestCarga = new RequestCarga();
    this.paginacion = new Paginacion({registros: 10});
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.nombreGrupoSeleccionado = 'Grupo genérico';
    this.requestCarga.uidGrupo = '0';
    this.fechaFinal = null;
    this.fechaInicial = null;
    this.initValues();
    this.ConsultarParametros();
    this.realizarBusqueda();
  }

  ConsultarParametros() {
    this.cargasService.consultarParametros().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
      },
      (error) => this.controlarError(error)
    );
  }

  realizarBusqueda() {
    this.seleccionarNroCargaFechas();
    this.requestCarga.uidContratista = this.empresa !== null ? this.empresa.codigo.toString() : '0';
    this.requestCarga.uidOficina = this.oficina !== null ? this.oficina.codigo.toString() : '0';
    this.requestCarga.uidEstado = this.estadoParametro !== null ? this.estadoParametro.valor : 'G';
    this.requestCarga.uidActividad = this.actividad !== null ? this.actividad.codigo.toString() : 'G';
    this.requestCarga.uidCargaTrabajo = this.uidCarga !== null &&   this.uidCarga !== '' ? this.uidCarga.toString() : 'G';
    const actividad = this.actividad != null ? this.actividad.codigo.toString() : 'G';
    if (actividad === 'SG') {
     this.realizarBusquedaSGIO();
    } else {
     if (this.validarFiltros()) {
       this.cargasService.consultarCargasTrabajo(this.requestCarga, this.paginacion.pagina, this.paginacion.registros)
       .subscribe((data: ResponseCarga) => {
         this.recibirData.emit(data.resultado);
         this.paginacion = data.paginacion;
         this.enviarPaginacion.emit(this.paginacion);
       },
         (error) => this.controlarError(error)
       );
     } else {
       this.toastr.warning('La fecha inicial no puede ser futura a la fecha final.', 'Advertencia', {closeButton: true});
     }
    }
  }
  OnConfigurarBusqueda() {
    this.buscar.nativeElement.maxLength = 13;
    this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 ||  ( e.charCode >= 65 && e.charCode <= 90 ) ||
                                                                                           ( e.charCode >= 97 && e.charCode <= 122 );

  }
  seleccionarNroCargaFechas() {
    if (this.fechaInicial && this.fechaFinal) {
      let dayI = this.fechaInicial.getDate().toString();
      if (dayI.toString().length === 1)
        dayI = '0' + dayI;
      let monthI = (this.fechaInicial.getMonth() + 1).toString();
      if (monthI.toString().length === 1)
        monthI = '0' + monthI;
      let yearI = this.fechaInicial.getFullYear().toString();
      this.requestCarga.fechaInicio = dayI + '/' + monthI + '/' + yearI;

      let dayF = this.fechaFinal.getDate().toString();
      if (dayF.toString().length === 1)
        dayF = '0' + dayF;
      let monthF = (this.fechaFinal.getMonth() + 1).toString();
      if (monthF.toString().length === 1)
        monthF = '0' + monthF;
      let yearF = this.fechaFinal.getFullYear().toString();
      this.requestCarga.fechaFin = dayF + '/' + monthF + '/' + yearF;
    } else {
      this.requestCarga.fechaInicio = '31/12/2999';
      this.requestCarga.fechaFin =  '31/12/2999';
    }
    this.requestCarga.fechaSedapal = '31/12/2999';
    this.requestCarga.fechaContratista = '31/12/2999';
    this.requestCarga.fechaCarga = '31/12/2999';
  }

  validarFiltros() {
    if (this.fechaInicial > this.fechaFinal) {
      return false;
    } else {
      return true;
    }
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  onChange() {
    if (this.actividad.codigo === 'SG') {
      this.realizarBusquedaSGIO();
    }
  }

  initValues() {
    this.requestCarga = {
      uidCargaTrabajo:  'G',
      motivoAnula:  'G',
      uidUsuarioE:  'G',
      uidUsuarioC:  'G',
      uidOficina:  '0',
      uidGrupo:  '0',
      uidEstado:  'G',
      uidContratista:  '0',
      uidActividad:  'G',
      cantidadEjecutada:  '0',
      cantidadCarga:  '0',
      fechaSedapal:  '31/12/2999',
      fechaContratista:  '31/12/2999',
      fechaCarga:  '31/12/2999',
      fechaInicio: '31/12/2999',
      fechaFin: '31/12/2999',
      idPers: '0',
      idPerfil: '0',
      comentario: 'G',
      usuario: 'G',
      vnTipoEstado: 0,
      vdescripcion: 'G',
      descContratista:''
    };
  }

  realizarBusquedaSGIO() {
    const pag = {pagina: 1, registros: 10, totalPaginas: 1, totalRegistros: 1 };
    const paginacion = new Paginacion(pag);
    const lstCarga = new Array<CargaTrabajo>();
      const carga = new CargaTrabajo();
      carga.descActividad = 'SGIO';
      lstCarga.push(carga);
      this.recibirData.emit(lstCarga);
      this.enviarPaginacion.emit(paginacion);
  }

  DetectChange() {
    if (!this.fechaFinal || !this.fechaInicial) {
      return;
    }
    if (this.fechaFinal && this.fechaFinal.toString() === 'Invalid Date') {
      this.fechaFinal = null;
      this.toastr.warning('Fecha Final ingresada no valida', 'Advertencia', {closeButton: true});
      return;
    }
    if (this.fechaInicial && this.fechaInicial.toString() === 'Invalid Date') {
      this.fechaInicial = null;
      this.toastr.warning('Fecha Inicial ingresada no valida', 'Advertencia', {closeButton: true});
      return;
    }
  }

}
