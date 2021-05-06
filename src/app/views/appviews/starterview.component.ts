import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Trabajador } from 'src/app/models/trabajador';
import { Parametro } from '../../models/enums/parametro';
import { CargasTrabajoService } from 'src/app/services/impl/cargas-trabajo.service';
import { ParametrosCargaBandeja } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { ReportesMonitoreoService } from '../../services/impl/reportes-monitoreo.service';

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html',
  styleUrls: ['starterview.component.scss']
})
export class StarterViewComponent implements OnDestroy, OnInit {
  public nav: any;
  modulos: any[];
  item: Trabajador = new Trabajador();
  parametrosUsuario: ParametrosCargaBandeja = new ParametrosCargaBandeja();
  periodos: string[];
  tiposInspe: string[];
  frecAlerta: string[];
  isLoading: boolean = false;

  public constructor(private cargasTrabajoService: CargasTrabajoService,
    private perfilService: PerfilService,
    private personalContratistaApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService,
    private toastrService: ToastrService,
    private reportesMonitoreoService:ReportesMonitoreoService) {
    this.perfilService.obtenerPerfil();
    this.obtenerParametrosUsuario();
    this.obtenerParametrosBandejaPersonal();
    this.obtenerPeriodosMonitoreo();
    this.obtenerTipoInspe();
    this.obtenerFrecAlerta();
  }

  public ngOnInit() {
    this.nav = document.querySelector('nav.navbar');
    this.item.nombre = sessionStorage.getItem('nombreTrabajador');
    this.item.estado = sessionStorage.getItem('estadoTrabajador');
    this.modulos = JSON.parse(sessionStorage.getItem('modulos'));
    this.nav.className += 'white-bg';

    this.session();
  }

  public ngOnDestroy(): any {
    this.nav.classList.remove('white-bg');
  }

  private consultarParametrosUsuario() {
    return this.cargasTrabajoService.consultarParametros().toPromise();
  }

  private consultarParametrosBandejaPersonal() {
    return this.personalContratistaApi.obtenerParametrosBandeja().toPromise();
  }

  private consultarPeriodoMonitoreo(){
    return  this.reportesMonitoreoService.obtenerPeriodo().toPromise();
  }
  private consultarListaTipoInspe(){
    return  this.reportesMonitoreoService.obtenerTipoInspe().toPromise();
  }
  private consultarListaFrecAlerta(){
    return this.reportesMonitoreoService.obtenerFrecAlerta().toPromise();
  }

  proper(cadena: string) {
    cadena = cadena.toLowerCase();
    const arreglo = cadena.split(' ');
    let nuevaCad = '';
    for (let i = 0; i <= arreglo.length - 1; i++) {
      if (arreglo[i].length > 2) {
        nuevaCad = nuevaCad + ' ' + arreglo[i].substr(0, 1).toUpperCase() + arreglo[i].substr(1, arreglo[i].length - 1);
      } else {
        nuevaCad = nuevaCad + ' ' + arreglo[i];
      }
    }
    return (nuevaCad).trim();
  }

  private async obtenerParametrosBandejaPersonal() {
    this.isLoading = true;
    await this.consultarParametrosBandejaPersonal()
    .then((response) => {
      if (response.estado === ResponseStatus.OK) {
        sessionStorage.setItem('parametrosBandejaPersonal', JSON.stringify(response.resultado));
      } else {
        console.error(response);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_PARAMS_BANDEJA_PERSONAL);
      }
      this.isLoading = false;
    })
    .catch((err) => {
      console.error(err);
      this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_PARAMS_BANDEJA_PERSONAL);
      this.isLoading = false;
    });
  }

  private async obtenerParametrosUsuario() {
    this.isLoading = true;
    await this.consultarParametrosUsuario()
      .then((response) => {
        this.parametrosUsuario = response.resultado;
        sessionStorage.setItem('parametrosUsuario', JSON.stringify(this.parametrosUsuario));
        sessionStorage.setItem('idEmpresa', this.parametrosUsuario.codEmpresa.toString());
        sessionStorage.setItem('EmpresaUsuarioSesion', JSON.stringify(this.parametrosUsuario.listaEmpresa[0]));
        sessionStorage.setItem('idGrupo', this.parametrosUsuario.codGrupo.toString());
        this.isLoading = false;
      })
      .catch((error) => {
        this.toastrService.error(Mensajes.MENSAJE_ERROR_OBTENER_PARAMETROS, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        this.isLoading = false;
      });
  }

  private async obtenerPeriodosMonitoreo(){
    await this.consultarPeriodoMonitoreo()
    .then((response) => {
      this.periodos = response.resultado;
      sessionStorage.setItem('periodosMonitoreo', JSON.stringify(this.periodos));
    })
    .catch((error) => {
      this.toastrService.error(Mensajes.MENSAJE_ERROR_OBTENER_PARAMETROS, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      this.isLoading = false;
    });
  }

  private async obtenerTipoInspe(){
    await this.consultarListaTipoInspe()
    .then((response) => {
      this.tiposInspe = response.resultado;
      sessionStorage.setItem('listaTipoInspe', JSON.stringify(this.tiposInspe));
    })
    .catch((error) => {
      this.toastrService.error(Mensajes.MENSAJE_ERROR_OBTENER_PARAMETROS, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      this.isLoading = false;
    });
  }

  private async  obtenerFrecAlerta() {
    await this.consultarListaFrecAlerta()
      .then((response) => {
        this.frecAlerta = response.resultado;
        sessionStorage.setItem('listaAlertaFrecuencia', JSON.stringify(this.frecAlerta));
      })
      .catch((error) => {
        this.toastrService.error(Mensajes.MENSAJE_ERROR_OBTENER_PARAMETROS, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        this.isLoading = false;
      });
  }

  session() {
    localStorage.removeItem('ContratistaFinal');
    localStorage.removeItem('EstadoFinal');
    localStorage.removeItem('ActividadFinal');
    localStorage.removeItem('OficinaFinal');
    // busqueda avanzada
    localStorage.removeItem('FinalBusqueda');
    localStorage.removeItem('ParametroBusquedad');
    localStorage.removeItem('Variable');
    localStorage.removeItem('parametroBusqueda');
    //////////
    localStorage.removeItem('busquedatextofina');
    localStorage.removeItem('flagBusqueda');
    localStorage.removeItem('textoBusqueda');
    localStorage.removeItem('flagBusqueda');
    //////
    localStorage.removeItem('texfinal');
    localStorage.removeItem('paraFinal');
    // pagina
    localStorage.removeItem('CantPagina');
    localStorage.removeItem('PaginaFinal');
    // estado
    localStorage.removeItem('Desestado');
    sessionStorage.removeItem('valorFin');
    sessionStorage.removeItem('estadoParametroF');
    sessionStorage.removeItem('tipoEstadoF');
    sessionStorage.removeItem('ValorFInal');
    sessionStorage.removeItem('busquedaAvanzadaFinal');
    // Busqueda y paginacion
    localStorage.removeItem('busquePagin');

    sessionStorage.removeItem('tex');
    sessionStorage.removeItem('parametroBusqueda');
    sessionStorage.removeItem('valorEstado');
    localStorage.removeItem('pagRetorno');
    localStorage.removeItem('contratista');
    sessionStorage.removeItem('busquedaAvanzadaprimero');
    localStorage.removeItem('actividadmensaje');
    localStorage.removeItem('oficinaFinalC');
    sessionStorage.removeItem('busquedaAvanzadaFinal');
    localStorage.removeItem('estadoAvanza');
    localStorage.removeItem('EstadoMensaje');

    localStorage.removeItem('combocantidadRow');


  }
}
