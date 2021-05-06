
import {Component, OnInit} from '@angular/core';
import {Empresa, Response} from '../../../models';
import {ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import {RequestEmpresa} from '../../../models/request/request-empresa';
import {EmpresasService} from '../../../services/impl/empresas.service';
import { filter, pairwise } from 'rxjs/operators';
import { validate } from 'class-validator';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Estado } from 'src/app/models/enums';
import { EstadoEmpresa } from '../../../models/enums/estado-empresa';
import { Mensajes } from 'src/app/models/enums/mensajes';

@Component({
  selector: 'app-empresa-agregar-editar',
  templateUrl: './empresa-agregar-editar.component.html',
  styleUrls: ['./empresa-agregar-editar.component.scss']
})
export class EmpresaAgregarEditarComponent implements OnInit {
  public accion: string;
  public codigoOpen: string;
  public razonSocial: string;
  public direccion: string;
  public estado: boolean;
  public empresa: Empresa;
  public tipoEmpresa: string;
  protected datePipe: DatePipe = new DatePipe('es-PE');
  public tipos: any[] = [{codigo: 'S', descripcion: 'Sedapal'}, {codigo: 'C', descripcion: 'Contratista'}];
  private urlAnterior: string ='';
  errors: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private empresaService: EmpresasService) {}

  ngOnInit() {
    this.inicializarVariable();
    // Inicio
    const busquedatexto = localStorage.getItem('textoBusqueda');
    const flagBusqueda = localStorage.getItem('flagBusqueda') ;
    if (busquedatexto != null && flagBusqueda != null) {
      localStorage.setItem('busquedatextofina', busquedatexto);
      localStorage.setItem('flagfinal', flagBusqueda);
      // eliminamos las vairables  de session
      localStorage.removeItem('textoBusqueda');
      localStorage.removeItem(flagBusqueda);
    }
    //fin
  }

  private onCambiaEstado() {
    this.estado = !this.estado;
  }

  public permisos(permiso: string) {
    let url ='';

    this.router.events
    .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
    ).subscribe((e: any) => {
        url = e[0].urlAfterRedirects;
    });

    if((sessionStorage.permisos).includes(url + permiso)) {
      return false;
    } else {
      return true;
    }
  }

  validaFechaDesde(evento): void {
    if (!Date.parse(this.empresa.fechaInicioVigencia.toString())) {
      this.toastr.error('La fecha de Vigencia Desde inválido', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true});
      this.empresa.fechaInicioVigencia = null;
    }
  }

  validaFechaHasta(evento): void {
    if (!Date.parse(this.empresa.fechaFinVigencia.toString())) {
      this.toastr.error('La fecha de Vigencia Hasta inválido', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true});
      this.empresa.fechaFinVigencia = null;
    }
  }

  private inicializarVariable(): void {
    this.tipoEmpresa = 'S';
    this.empresa = new Empresa();
    this.empresa.fechaInicioVigencia= new Date();
    this.empresa.fechaFinVigencia = new Date();
    this.accion = 'Registro';
    this.codigoOpen = '';
    this.razonSocial = '';
    this.direccion = '';
    this.estado = true;
    this.obtenerEmpresaPorCodigo(this.obtenerCodigoEmpresa());
  }

  public obtenerCodigoEmpresa(): number {
    const codigo = this.activatedRoute.snapshot.paramMap.get('codigo');
    if (codigo !== undefined) {
      return Number(codigo);
    } else {
      return 0;
    }
  }

  private obtenerEmpresaPorCodigo(companyCode: number) {
    if (companyCode > 0) {
      this.empresaService.findCompanyByCode(companyCode).subscribe((responseFindCompany: Response) => {
        this.empresa = new Empresa();

        const fechaInicio: Date = new Date(responseFindCompany.resultado.fechaInicioVigencia);
        const fechaFin: Date = new Date(responseFindCompany.resultado.fechaFinVigencia);
        fechaInicio.setMinutes(fechaInicio.getMinutes() + fechaInicio.getTimezoneOffset());
        fechaFin.setMinutes(fechaFin.getMinutes() + fechaFin.getTimezoneOffset());
        Object.assign(this.empresa, responseFindCompany.resultado);
        this.empresa.fechaInicioVigencia = new Date(fechaInicio);
        this.empresa.fechaFinVigencia = new Date(fechaFin);

        if(this.empresa.estado.toString()=='A') {
          this.estado=true;
        } else {
          this.estado=false;
        }
      }, (errorFind) => {
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true});
      });
    } else {
      this.empresa = new Empresa();
    }
  }

  public regresar() {
    this.router.navigate(['/mantenimiento/empresas']);
  }

  public save() {
    this.errors = {};

    if (this.empresa.fechaInicioVigencia != null || this.empresa.fechaInicioVigencia != undefined) {
      const latest_date = this.datePipe.transform(this.empresa.fechaInicioVigencia, 'yyyy-MM-dd');
      Object.assign(this.empresa.fechaInicioVigencia, Date.parse(latest_date));
      this.empresa.fechaInicioVigencia = new Date(this.empresa.fechaInicioVigencia.toString());
    }

    if (this.empresa.fechaFinVigencia != null || this.empresa.fechaFinVigencia != undefined) {
      const latest_date = this.datePipe.transform(this.empresa.fechaFinVigencia, 'yyyy-MM-dd');
      Object.assign(this.empresa.fechaFinVigencia, Date.parse(latest_date));
      this.empresa.fechaFinVigencia = new Date(this.empresa.fechaFinVigencia.toString());
    }

    if(this.estado==true) {
      this.empresa.estado = EstadoEmpresa.ACTIVO;
    } else {
      this.empresa.estado = EstadoEmpresa.INACTIVO;
    }

    validate(this.empresa).then(errors => {
      if (errors.length > 0) {
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });
        const mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.error(`Los siguientes campos no son válidos: ${mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
      } else {
        if ((new Date(this.empresa.fechaFinVigencia)).getTime() < (new Date(this.empresa.fechaInicioVigencia)).getTime()) {
          this.toastr.error('La fecha de Inicio de Vigencia debe ser mayor a la fecha de Fin de Vigencia', 'Acción inválida', {closeButton: true});
        } else {
          const requestCompany = this.getRequestCompany(this.empresa);
          requestCompany.estadoEmpresa = this.empresa.estado;
          this.empresaService.saveCompany(requestCompany).subscribe((responseSaveCompany: Response) => {
            this.toastr.success('Se registraron correctamente los datos', 'Confirmación', {closeButton: true});
            this.regresar();
          }, (error) => {
            this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true});
          });
        }
      }
    });
  }

  private getRequestCompany(company: Empresa): RequestEmpresa {
    const requestCompany: RequestEmpresa = {
      codigo: company.codigo,
      razonSocial: company.descripcion,
      telefono: company.telefono,
      ruc: company.nroRUC,
      numeroContrato: company.numeroContrato,
      direccion: company.direccion,
      tipoEmpresa: company.tipoEmpresa,
      comentario: company.comentario,
      fechaInicio: company.fechaInicioVigencia,
      fechaFin: company.fechaFinVigencia,
      usuario: 'USER-TEST'
    };
      requestCompany.estadoEmpresa = company.estado.toString();
    return requestCompany;
  }

  private getParameters(): Map<string, any> {
    const parameters: Map<string, any> =  new Map();
    parameters.set('usuario', 'USER-TEST');
    return parameters;
  }

}
