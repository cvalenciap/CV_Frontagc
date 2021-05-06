import {Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {Empresa, Paginacion} from '../../../models';
import {Router} from '@angular/router';
import {EmpresasService} from '../../../services/impl/empresas.service';
import {RequestEmpresa} from '../../../models/request/request-empresa';
import {Response} from '../../../models';
import {BuscarEmpresaComponent} from '../../dialogs/buscar-empresa/buscar-empresa.component';
import {DomSanitizer} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ValidacionService } from 'src/app/services/impl/validacion';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseObject } from 'src/app/models/response/response-object';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { CeseMasivoResponse } from 'src/app/models/response/cese-masivo-response';
import { ResultadoCarga } from 'src/app/models/enums/resultado-carga.enum';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-empresa-consultar',
  templateUrl: './empresa-consultar.component.html',
  styleUrls: ['./empresa-consultar.component.scss']
})
export class EmpresaConsultarComponent implements OnInit {
  public textoBusqueda: string;
  public flagBusqueda: string;
  public paginacion: Paginacion;
  public filaSeleccionada: number;
  public requestCompany: RequestEmpresa;
  public empresas: Empresa [];
  public tipos: any[] = [{codigo: 'S', descripcion: 'Sedapal'}, {codigo: 'C', descripcion: 'Contratista'}];
  public estados: any[] = [{codigo: 'ACTIVO', descripcion: 'Activo'}, {codigo: 'INACTIVO', descripcion: 'Inactivo'}];
  public showMessage: boolean;  public message: string;

  loading: boolean = false;
  mostrarDetalleCese: boolean = false;
  detalleCese: string[] = [];

  @ViewChild(BuscarEmpresaComponent) buscarEmpresaComponent;
  @ViewChild('detalleCeseMasivo') detalleCeseMasivo: SwalComponent;

  constructor(private ValidacionSoloLetras: ValidacionService,
    private router: Router,
    private companyService: EmpresasService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private personalApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.inizializarVariables();
    this.getListOfCompanies();


  }

  public permisos(permiso: string) {
    if((sessionStorage.permisos).includes(this.router.url + permiso)) {
      return false;
    } else {
      return true;
    }
  }

  private inizializarVariables() {
    this.textoBusqueda = '';
    this.flagBusqueda = 'RS';
    this.filaSeleccionada = -1;
    this.showMessage = false;
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, '');
    this.empresas = new Array<Empresa>();
    this.paginacion = new Paginacion({registros: 10, pagina: 1});
    this.requestCompany = new RequestEmpresa();
  }

  public getListOfCompanies() {
    this.message = this.sanitizer.sanitize(SecurityContext.HTML, this.generateInfoMessage(this.requestCompany));
    this.companyService.getAllCompanies(this.getParameters(true))
      .subscribe((responseCompanies: Response) => {
        this.empresas = responseCompanies.resultado;
        if (this.empresas.length <= 0 ) {
          this.empresas = new Array();
          this.paginacion = new Paginacion({pagina: 1, totalPaginas: 1, totalRegistros: 0, registros: 0});
        } else {
          this.paginacion = responseCompanies.paginacion;
        }
    }, (errorCompanies) => {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    });
  }

  private eliminarEmpresa(empresa: Empresa, indice: number) {
    if (empresa !== null && indice >= 0) {
      this.empresas.splice(indice, 1);
      this.companyService.deleteCompany(empresa.codigo, this.getParameters(false)).subscribe((responseDeleteCompany: Response) => {
        this.toastr.success('El registro se eliminó correctamente', 'Confirmación', { closeButton: true });
      }, (errorDelete) => {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      });
    }
  }

  public async darBajaContratista(empresa: Empresa) {
    if (empresa.indCesePersonal === 0) {
      this.loading = true;
      await this.personalApi.ceseMasivoPersonal(empresa.codigo).toPromise()
        .then((response: ResponseObject) => {
          if (response.estado === ResponseStatus.OK) {
            const resultadoCese: CeseMasivoResponse = response.resultado;
            if (resultadoCese.resultado === ResultadoCarga.CORRECTO) {
              this.toastrUtil.showSuccess(resultadoCese.mensaje);
              this.getListOfCompanies();
            } else if (resultadoCese.resultado === ResultadoCarga.INCORRECTO) {
              this.toastrUtil.showError(resultadoCese.mensaje);
              if (resultadoCese.detalle.length > 0) {
                this.detalleCese = resultadoCese.detalle;
                this.detalleCeseMasivo.show();
              }
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.toastrUtil.showError(response.mensaje);
            console.error(response.error);
          }
        })
        .catch(err => {
          this.loading = false;
          this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
          console.error(err);
      });
    } else {
      this.toastrUtil.showWarning(Mensajes.MENSAJE_CESE_MASIVO_EJECUTADO);
    }
  }

  public getRequestCompanyOfModal(): void {
    this.textoBusqueda = '';
    this.requestCompany = this.buscarEmpresaComponent.requestEmpresa;
    if (this.requestCompany !== null) {
      this.showMessage = true;
    }
    this.getListOfCompanies();
  }

  private generateInfoMessage(requestCompany: RequestEmpresa): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: '2-digit', year: 'numeric'
     };
    // Inicio
    const finaltex = localStorage.getItem('busquedatextofina');
    const flagFinal = localStorage.getItem('flagfinal');

    if (finaltex != null) {
      this.textoBusqueda = finaltex;
      this.flagBusqueda = flagFinal;
      // eliminamos variable
      localStorage.removeItem('busquedatextofina');
      localStorage.removeItem('flagBusqueda');
      }
    // primero
    if (this.textoBusqueda != null) {
      localStorage.setItem('textoBusqueda', this.textoBusqueda);
      localStorage.setItem('flagBusqueda', this.flagBusqueda);
      }
      //Fin
    let message = '<strong>Búsqueda Por: </strong>';
    if (requestCompany !== null) {
      if (requestCompany.tipoEmpresa !== undefined) {
        let tipoEmpresa: string;
        if (requestCompany.tipoEmpresa === 'C') { tipoEmpresa = 'Contratista'; } else  { tipoEmpresa = 'Sedapal'; }
        message = message + '<br/><strong>Tipo Empresa: </strong> <parrafo>' + tipoEmpresa + '</parrafo>' + ' ';
      }
      if (requestCompany.estadoEmpresa !== undefined) {
        let estadoEmpresa: string;
        if (requestCompany.estadoEmpresa === 'A') { estadoEmpresa = 'Activo'; } else  { estadoEmpresa = 'Inactivo'; }
        message = message + '<br/><strong>Estado Empresa: </strong> <parrafo>' + estadoEmpresa + '</parrafo>' + ' ';
      }
      if (this.textoBusqueda !== '' && this.flagBusqueda === 'RS') {
        message = message + '<br/><strong>Razón Social: </strong> <parrafo>' + this.textoBusqueda + '</parrafo>' + ' ';
        this.showMessage = true;
      } else {
        if (requestCompany.razonSocial !== undefined) {
          message = message + '<br/><strong>Razón Social: </strong> <parrafo>' + requestCompany.razonSocial + '</parrafo>' + ' ';
        }
      }
      if (requestCompany.fechaInicio !== undefined) {
        message = message + '<br/><strong>Fecha Inicio: </strong> <parrafo>' + requestCompany.fechaInicio.toLocaleDateString('es-PE', options) + '</parrafo>' + ' ';
      }
      if (requestCompany.fechaFin !== undefined) {
        message = message + '<br/><strong>Fecha Fin: </strong> <parrafo>' + requestCompany.fechaFin.toLocaleDateString('es-PE', options) + '</parrafo>' + ' ';
      }
      if (this.textoBusqueda !== '' && this.flagBusqueda === 'RU') {
        message = message + '<br/><strong>Número de RUC: </strong> <parrafo>' + this.textoBusqueda + '</parrafo>' + ' ';
        this.showMessage = true;
      }
    }
    if (message == '<strong>Búsqueda Por: </strong>') {
      this.showMessage = false;
    }
    return message;
  }

  private getParameters(flag: boolean): Map<string, any> {
    const parameters: Map<string, any> =  new Map();
    // El parámetro de entrada [flag] es que usara por defecto - true (Buscar empresas) | false(Eliminar empresa)

    if (flag) {
      // inicio
      const finaltex = localStorage.getItem('busquedatextofina');
      const flagFinal = localStorage.getItem('flagfinal');

      if (finaltex !== null) {
        this.textoBusqueda = finaltex;
        this.flagBusqueda = flagFinal;
        // eliminamos variable
        localStorage.removeItem('busquedatextofina');
        localStorage.removeItem('flagBusqueda');
      }
      // primero
      if (this.textoBusqueda !== null) {
        localStorage.setItem('textoBusqueda', this.textoBusqueda);
        localStorage.setItem('flagBusqueda', this.flagBusqueda);
      }
      //fin
      parameters.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);
      parameters.set('estadoEmpresa', 'A');
      if (this.textoBusqueda) {
        if (this.flagBusqueda === 'RS') {
          parameters.set('razonSocial', this.textoBusqueda);
          if(this.textoBusqueda==undefined || this.textoBusqueda==null || this.textoBusqueda.length==0) {
            this.showMessage=false;
          }
        }
        if (this.flagBusqueda === 'RU') {
          parameters.set('ruc', this.textoBusqueda);
          if(this.textoBusqueda==undefined || this.textoBusqueda==null || this.textoBusqueda.length==0) {
            this.showMessage=false;
          }
        }
      } else {
        parameters.set('tipoEmpresa', (this.requestCompany.tipoEmpresa !== undefined) ? this.requestCompany.tipoEmpresa : '');
        parameters.set('estadoEmpresa', (this.requestCompany.estadoEmpresa !== undefined) ? this.requestCompany.estadoEmpresa : 'A');
        if (this.textoBusqueda !== '' && this.flagBusqueda === 'RS') {
          parameters.set('razonSocial', (this.textoBusqueda !== undefined) ? this.textoBusqueda : '');
        } else {
          parameters.set('razonSocial', (this.requestCompany.razonSocial !== undefined) ? this.requestCompany.razonSocial : '');
        }
        parameters.set('fechaInicio', (this.requestCompany.fechaInicio !== undefined) ? this.requestCompany.fechaInicio : '');
        parameters.set('fechaFin', (this.requestCompany.fechaFin !== undefined) ? this.requestCompany.fechaFin : '');
      }
    } else {
      parameters.set('usuario', 'USER-TEST');
    }
    this.requestCompany = new RequestEmpresa();
    return parameters;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getListOfCompanies();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getListOfCompanies();
  }

  public registrarEditarEmpresa(empresa: Empresa) {
    if (empresa == null) {
      this.router.navigate(['/mantenimiento/empresas/registrar']);
    } else {
      this.router.navigate(['/mantenimiento/empresas/editar/' + empresa.codigo]);
    }
    this.getListOfCompanies();
  }

  private asignarItem(empresa: Empresa) {
    sessionStorage.setItem('empresaMantenimiento', JSON.stringify(empresa));
    this.router.navigate(['/mantenimiento/empresas/asignar']);
  }

  public validarBajaPersonal(fechaFin: string) {
    const fechaFinVigencia = Date.parse(fechaFin);
    const hoy = Date.parse(this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
    return (hoy > fechaFinVigencia);
  }

  public leaveFilters(): void {
    this.requestCompany = new RequestEmpresa();
    this.textoBusqueda = '';
    this.showMessage = false;
    this.requestCompany.estadoEmpresa = 'A';
    this.getListOfCompanies();
  }

 }
