import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrosCargaBandeja,RepoInfActiEjec, Paginacion, Response, Periodo } from 'src/app/models';
import { TipoArchivo } from 'src/app/models/enums/tipo-archivo';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from '../../../services/impl/reportes-monitoreo.service';
import { ExcelService } from '../../../services/impl/excel.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PerfilReporte } from 'src/app/models/enums/perfil-reporte';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-informe-actividad-ejecutada-consolidado',
  templateUrl: './informe-actividad-ejecutada-consolidado.component.html',
  styleUrls: ['./informe-actividad-ejecutada-consolidado.component.scss']
})
export class InformeActividadEjecutadaConsolidadoComponent implements OnInit {

  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  esContratista: boolean = false;
  empresa: number;
  oficina: number;
  usuario: string;
  actividad: string;
  items: RepoInfActiEjec[];
  itemsPagination: RepoInfActiEjec[];
  paginacion: Paginacion;
  loading: boolean;
  urlReportePdf: string;
  codigoPerfil: number;
  isLoading: boolean = false;
  usuarioList: String[] = new Array<String>();
  listUsers: String[] = new Array<String>();
  perfilReporte: PerfilReporte;
  perfilReporteType = PerfilReporte;
  perfilReporteKeys = [];
  myForm: FormGroup;
  mes: number;
  anio: number;
  periodo: string;

  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private reportesMonitoreoService: ReportesMonitoreoService,
              private fileService: ExcelService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.codigoPerfil = JSON.parse(sessionStorage.getItem('perfilAsignado'));
    this.consultarParametros();
    this.actividad = this.listaParametros.listaActividad[0].codigo;
    this.oficina = 0;
    this.empresa = this.listaParametros.listaEmpresa[0].codigo
    this.itemsPagination = [];
    this.perfilReporteKeys = Object.keys(this.perfilReporteType);
    this.perfilReporte = PerfilReporte.TODOS;
    this.obtenerUsuario();
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm = this.fb.group({
      fechaI: { year: this.anio, month: this.mes },
      fechaF: { year: this.anio, month: this.mes }
    });
    let mesTxt = this.mes<10?'0'+this.mes +'':this.mes;
    this.periodo = this.anio +''+ mesTxt;
  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.lista =  JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    this.lista.oficinas.push({codigo:0, descripcion: "TODOS"});
  }
  getDocumentos(): void {
    this.loading = true;
    this.reportesMonitoreoService.obtenerRepoInfActiEjec(this.ObtenerReportesRequestInicial()).subscribe(
      (response: Response) => {
        this.items = response.resultado;

        if(response.paginacion!=undefined){
          this.paginacion = new Paginacion(response.paginacion);
          response.paginacion.pagina = this.paginacion.pagina;
          response.paginacion.registros = this.paginacion.registros;
          this.getDocumentPage();
        }

        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }
  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  getDocumentPage(): void {
    this.itemsPagination = [];
    let j = 0;
    if (this.items.length > 0) {
      if (this.items.length < this.paginacion.pagina * this.paginacion.registros) {
        for (let i = (this.paginacion.pagina - 1) * (this.paginacion.registros); i < this.items.length; i++) {
          this.itemsPagination[j] = this.items[i];
          j++;
        }
      } else {
        for (let i = (this.paginacion.pagina - 1) * (this.paginacion.registros); i < (this.paginacion.pagina) * this.paginacion.registros; i++) {
          this.itemsPagination[j] = this.items[i];
          j++;
        }
      }
    } else {
      this.itemsPagination = this.items;
    }
  }
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getDocumentPage();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getDocumentPage();
  }

  OnPDF() {
    const toastr = this.toastr;
    const this_ = this;
    this.loading = true;
    this.reportesMonitoreoService.generarPDFcons(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.pdf });
        const fileURL = URL.createObjectURL(file);
        this_.urlReportePdf = fileURL;
        this_.reportePdfSwal.show();
        toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnExcel() {
    const this_ = this;
    this.loading = true;
    this.reportesMonitoreoService.generarExcel(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.xlsx });
        this_.fileService.downloadFile(file, 'informe-de-actividades-ejecutadas.xlsx');
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }


  private ObtenerReportesRequestInicial(): ReportesRequest {
    const request: ReportesRequest = new ReportesRequest();
    request.n_idofic = null;
    request.n_idcontrati = null;
    request.v_idacti = null;
    request.v_subacti = null;
    request.v_perfil = null;
    request.v_periodo = null;
    request.v_usuario = null;
    return request;
  }
  private ObtenerReportesRequest(): ReportesRequest {
    const request: ReportesRequest = new ReportesRequest();
    request.n_idofic = this.oficina==0?null:this.oficina;
    request.n_idcontrati =this.empresa==0?null:this.empresa;
    request.v_idacti = this.actividad==""?null:this.actividad;
    request.v_subacti = null;
    request.v_perfil = null;
    request.v_periodo = this.periodo==""?null:this.periodo;
    request.v_usuario = this.usuario=="0"?null:this.usuario;
    return request;
  }

  OnFiltrar(){
    this.isLoading = true;
    const this_ = this;
    this.reportesMonitoreoService.obtenerRepoInfActiEjec(this.ObtenerReportesRequest()).subscribe(
      (response: Response) => {
        if(response.resultado.length > 0) {
          if(response.resultado[0].um !== null) {
            this.items = response.resultado;
          } else {
            this.items = [];
          }

        } else {
          this.items = response.resultado;
        }


        if(response.paginacion!=undefined){
          this.paginacion = new Paginacion(response.paginacion);
          response.paginacion.pagina = this.paginacion.pagina;
          response.paginacion.registros = this.paginacion.registros;
          this.getDocumentPage();
        }else{
          this.paginacion = new Paginacion({ registros: 10 });
          this.getDocumentPage();
        }
        this_.isLoading = false;
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }
  private suscribirLoading(): void {
    this.reportesMonitoreoService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
  }
  OnLimpiar(){
    this.paginacion = new Paginacion({ registros: 10 });
    this.codigoPerfil = JSON.parse(sessionStorage.getItem('perfilAsignado'));
    this.consultarParametros();
    this.obtenerUsuario();
    this.actividad = this.listaParametros.listaActividad[0].codigo;
    this.oficina = 0;
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.itemsPagination = [];
    this.periodo = '';
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm.controls['fechaF'].setValue({ year: this.anio, month: this.mes });

    this.itemsPagination = [];
    this.usuarioList = [];
    this.listUsers = [];
    this.usuario="0";

  }

  obtenerUsuario(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerUsuariosContratista(this.ObtenerReportesRequest()).subscribe(
      (response: Response) => {
        if(response.resultado.length!=""){
          this_.usuarioList = [];
          this_.listUsers = [];
          for(let i=0; i<response.resultado.length;i++){
            this_.listUsers.push(JSON.parse(JSON.parse(JSON.stringify(response.resultado[i]))));
          }
          this_.listUsers.push(JSON.parse(JSON.parse(JSON.stringify('{"vcodusuario": "0", "vnombres": "TODOS"}'))));
          this_.usuarioList = this_.listUsers;
          this.usuario="0";
        }else{
          this_.listUsers.push(JSON.parse(JSON.parse(JSON.stringify('{"vcodusuario": "0", "vnombres": "TODOS"}'))));
          this_.usuarioList = this_.listUsers;
          this.usuario="0";
        }

      },
      (error) => this.controlarError(error)
    );
  }

  onPeriodo($event) {
    this.periodo = $event.substring(3, 7) + $event.substring(0, 2);
  }

}
