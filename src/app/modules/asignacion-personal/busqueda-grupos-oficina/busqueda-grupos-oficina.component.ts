import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignarPersonalService } from '../../../services/impl/asignar-personal.service';
import { Empresa, Oficina, Paginacion } from '../../../models';
import { FormBuilder } from '@angular/forms';
import { Parametro } from '../../../models/enums/parametro';
import { RequestBusquedaPersonal } from '../../../models/request/request-busqueda-personal';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GrupoOficina } from '../../../models/grupo-oficina';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import StorageUtil from '../../shared/util/storage-util';
import { NavegacionService } from 'src/app/services/impl/navegacion.service';

@Component({
  selector: 'app-busqueda-grupos-oficina',
  templateUrl: './busqueda-grupos-oficina.component.html',
  styles: []
})
export class BusquedaGruposOficinaComponent implements OnInit {

  constructor(private asignarPersonalService: AsignarPersonalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private perfilService: PerfilService,
    private navegacionService: NavegacionService) {
  }


  datosConsulta: RequestBusquedaPersonal = new RequestBusquedaPersonal();

  public comboEmpresa: Array<Empresa> = new Array<Empresa>();
  public comboOficina: Array<Oficina> = new Array<Oficina>();
  public comboGrupo: Array<GrupoOficina> = new Array<GrupoOficina>();

  @ViewChild('selectEmpresa') selectEmpresa: NgSelectComponent;
  @ViewChild('selectOficina') selectOficina: NgSelectComponent;
  @ViewChild('selectGrupo') selectGrupo: NgSelectComponent;

  listaGruposEncontrados: Array<GrupoOficina>;
  $mostrarTabla: boolean = false;

  paginacionConfig: any;
  paginacion: Paginacion;

  public static esAdministradorOficina(): boolean {
    const idPerfil: string = sessionStorage.getItem('perfilAsignado');
    return idPerfil === Parametro.PERFIL_ADMINISTRADOR_OFICINA;
  }

  public static datosConsultaRetorno(): boolean {
    return sessionStorage.getItem('datosBusquedaGrupoOficina') !== null;
  }

  public static validarSelect(value: any): boolean {
    return value > 0 && value !== null && value !== undefined;
  }

  public static obtenerDatosConsultaAdmOficina(): RequestBusquedaPersonal {
    const datosConsultaAdmOficina: RequestBusquedaPersonal = new RequestBusquedaPersonal();
    const codOficina: string = sessionStorage.getItem('codOficina');
    // datosConsultaAdmOficina.idEmpresa = Parametro.CODIGO_SEDAPAL;
    datosConsultaAdmOficina.idOficina = Number.parseInt(codOficina);
    return datosConsultaAdmOficina;
  }

  public static obtenerDatosConsultaRetornoAdmOficina(): RequestBusquedaPersonal {
    return <RequestBusquedaPersonal>JSON.parse(sessionStorage.getItem('datosBusquedaGrupoOficina'));
  }

  ngOnInit() {
    this.cargarDatosComponente();
  }

  public cargarDatosComponente(): void {
    if (this.navegacionService.previousUrl === '/mantenimiento/personal/asignar') {
      this.datosConsulta = JSON.parse(sessionStorage.getItem('datosBusquedaGrupoOficina'));
      this.iniciarVistaRetorno();
    } else {
      this.iniciarVistaNormal();
    }
  }

  public iniciarVistaRetorno(): void {
    if (BusquedaGruposOficinaComponent.esAdministradorOficina()) {
      this.iniciarVistaRetornoAdmOficina();
    } else {
      this.iniciarVistaRetornoAdministrador();
    }
  }

  public iniciarVistaNormal(): void {
    if (BusquedaGruposOficinaComponent.esAdministradorOficina()) {
      this.iniciarVistaAdmOficina();
    } else {
      this.iniciarVistaAdministrador();
    }
  }

  public iniciarVistaAdmOficina(): void {
    this.datosConsulta = BusquedaGruposOficinaComponent.obtenerDatosConsultaAdmOficina();
    this.cargarCombosAdmOficina(true);
    this.buscarGruposOficina();
  }

  public async iniciarVistaRetornoAdmOficina() {
    this.datosConsulta = BusquedaGruposOficinaComponent.obtenerDatosConsultaRetornoAdmOficina();
    this.cargarCombosAdmOficina(true);
    this.buscarGruposOficina();
  }

  public iniciarVistaAdministrador(): void {
    this.obtenerListaEmpresas();
    this.deshabilitarCombosAdministrador();
    this.buscarGruposOficina();
  }

  public async iniciarVistaRetornoAdministrador() {
    if (!BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idEmpresa)) {
      this.obtenerListaEmpresas();
      this.deshabilitarCombosAdministrador();
    }
    if (BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idEmpresa)) {
      this.comboEmpresa = await this.obtenerListaEmpresasRetorno();
      this.obtenerOficinas();
      this.selectGrupo.disabled = true;
    }
    if (BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idOficina)) {
      this.obtenerOficinas();
      this.obtenerGrupos();
    }
    this.buscarGruposOficina();
  }

  public cargarCombosAdmOficina(validarNavegacion: boolean): void {
    this.asignarPersonalService.obtenerEmpresas().subscribe(dataEmpresas => {
      this.comboEmpresa = dataEmpresas;
      if (validarNavegacion) {
        if (this.navegacionService.previousUrl === '/mantenimiento/personal/asignar') {
          this.datosConsulta.idEmpresa = StorageUtil.recuperarObjetoSession('datosBusquedaGrupoOficina').idEmpresa;
        } else {
          this.datosConsulta.idEmpresa = Parametro.CODIGO_SEDAPAL;
        }
      } else {
        this.datosConsulta.idEmpresa = Parametro.CODIGO_SEDAPAL;
      }
      /* this.datosConsulta.idEmpresa = StorageUtil.recuperarSession('datosBusquedaGrupoOficina') === null
        ? Parametro.CODIGO_SEDAPAL
        : StorageUtil.recuperarSession('datosBusquedaGrupoOficina').idEmpresa; */
      this.asignarPersonalService.obtenerOficinas(this.datosConsulta.idEmpresa)
        .subscribe(dataOficinas => {
          this.comboOficina = dataOficinas;
          this.asignarPersonalService.obtenerGruposFuncionales(this.datosConsulta.idEmpresa, this.datosConsulta.idOficina, 0)
            .subscribe(dataGrupos => {
              this.comboGrupo = dataGrupos;
              this.deshabilitarCombosAdmOficina();
            });
        });
    });
  }

  public deshabilitarCombosAdministrador(): void {
    this.selectOficina.disabled = true;
    this.selectGrupo.disabled = true;
  }

  public deshabilitarCombosAdmOficina(): void {
    this.selectEmpresa.disabled = false;
    this.selectEmpresa.clearable = true;
    this.selectOficina.disabled = true;
    this.selectOficina.clearable = false;
    this.selectGrupo.disabled = false;
  }

  public onCambioEmpresa(): void {
    if (this.perfilService.esAdministrador()) {
      this.selectOficina.clearModel();
      this.selectGrupo.clearModel();
      this.obtenerOficinas();
    }
  }

  public obtenerOficinas(): void {
    this.asignarPersonalService.obtenerOficinas(this.datosConsulta.idEmpresa)
      .subscribe(data => {
        this.comboOficina = data;
        this.selectOficina.disabled = !(data.length > 0);
      });
  }

  public onCambioOficina(): void {
    this.obtenerGrupos();
  }

  public obtenerGrupos(): void {
    this.asignarPersonalService.obtenerGruposFuncionales(this.datosConsulta.idEmpresa,
      this.datosConsulta.idOficina, 0)
      .subscribe(data => {
        this.comboGrupo = data;
        this.selectGrupo.disabled = !(this.comboGrupo.length > 0);
      });
  }

  public navegarToAsignarPersonal(datosConsulta: GrupoOficina): void {
    sessionStorage.setItem('datosGrupoOficina', JSON.stringify(datosConsulta));
    sessionStorage.setItem('datosBusquedaGrupoOficina', JSON.stringify(this.datosConsulta));
    this.router.navigate(['mantenimiento', 'personal', 'asignar']);
  }

  public cargarDatosPaginacion(data: Array<GrupoOficina>, registros: number = 10): void {
    this.paginacion = new Paginacion({ registros: registros, totalRegistros: data.length });
    this.paginacionConfig = {
      itemsPerPage: this.paginacion.registros,
      currentPage: this.paginacion.pagina,
      totalItems: this.paginacion.totalRegistros
    };
  }

  public obtenerListaEmpresas() {
    this.asignarPersonalService.obtenerEmpresas()
      .subscribe(data => {
        this.comboEmpresa = data;
      });
  }

  public async obtenerListaEmpresasRetorno() {
    return this.asignarPersonalService.obtenerEmpresas().toPromise();
  }

  public buscarGruposOficina(): void {
    const consulta: RequestBusquedaPersonal = new RequestBusquedaPersonal();
    consulta.idEmpresa = BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idEmpresa) ? this.datosConsulta.idEmpresa : 0;
    consulta.idOficina = BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idOficina) ? this.datosConsulta.idOficina : 0;
    consulta.idGrupo = BusquedaGruposOficinaComponent.validarSelect(this.datosConsulta.idGrupo) ? this.datosConsulta.idGrupo : 0;
    this.asignarPersonalService.buscarGruposDeOficina(consulta.idEmpresa, consulta.idOficina, consulta.idGrupo)
      .subscribe(data => {
        this.listaGruposEncontrados = data;
        this.cargarDatosPaginacion(data);
        this.$mostrarTabla = true;
      });
  }

  public onCambiarPagina(event): void {
    this.paginacion.pagina = event.page;
    this.paginacionConfig.currentPage = this.paginacion.pagina;
  }

  public OnCambioRegistros(event): void {
    this.cargarDatosPaginacion(this.listaGruposEncontrados, event.rows);
  }

  public onLimpiarFiltros(): void {
    if (this.perfilService.esAdministradorOficina()) {
      this.datosConsulta = BusquedaGruposOficinaComponent.obtenerDatosConsultaAdmOficina();
      // this.datosConsulta.idEmpresa = Parametro.CODIGO_SEDAPAL;
      this.cargarCombosAdmOficina(false);
      this.buscarGruposOficina();
    } else {
      this.datosConsulta = new RequestBusquedaPersonal();
      this.deshabilitarCombosAdministrador();
      this.buscarGruposOficina();
    }
  }

}
