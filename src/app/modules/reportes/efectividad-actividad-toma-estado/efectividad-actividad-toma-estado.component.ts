import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrosCargaBandeja,RepoEfecActiTomaEst, Paginacion, Response, Periodo, Ciclo } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from '../../../services/impl/reportes-monitoreo.service';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { TipoArchivo } from 'src/app/models/enums/tipo-archivo';
import { ExcelService } from '../../../services/impl/excel.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-efectividad-actividad-toma-estado',
  templateUrl: './efectividad-actividad-toma-estado.component.html',
  styleUrls: ['./efectividad-actividad-toma-estado.component.scss']
})
export class EfectividadActividadTomaEstadoComponent implements OnInit {

  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  periodosList: Periodo[];
  cicloList: Ciclo[];
  paginacion: Paginacion;
  empresa: number;
  oficina: number;
  myForm: FormGroup;
  mes: number;
  anio: number;
  periodo: string;
  ciclo: string;
  loading: boolean;
  isLoading: boolean = false;
  items: RepoEfecActiTomaEst[];
  itemsPagination: RepoEfecActiTomaEst[];
  urlReportePdf: string;
  codigoPerfil: number;
  cicloButton: boolean = true;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  constructor( private fb: FormBuilder,
               private toastr: ToastrService,
               private reportesMonitoreoService: ReportesMonitoreoService,
               private fileService: ExcelService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.itemsPagination = [];
    this.consultarParametros();
    this.oficina = 0;
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.codigoPerfil = JSON.parse(sessionStorage.getItem('perfilAsignado'));
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm = this.fb.group({
      fechaI: { year: this.anio, month: this.mes }
    });
    let mesTxt = this.mes<10?'0'+this.mes +'':this.mes;
    this.periodo = this.anio +''+ mesTxt;
    this.obtenerCiclo();
    this.ciclo= 'TODOS';

  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.lista =  JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    this.lista.oficinas.push({codigo:0, descripcion: "TODOS"});
    this.periodosList = JSON.parse(sessionStorage.getItem('periodosMonitoreo'));
  }

  OnFiltrar(){
    this.isLoading = true;
    const this_ = this;
    const request: ReportesRequest = new ReportesRequest();
    request.n_idofic = this.oficina==0?null:this.oficina;
    request.n_idcontrati =this.empresa==0?null:this.empresa;
    request.v_periodo = this.periodo==''?null:this.periodo;
    request.v_ciclo = this.ciclo=='TODOS'?null:this.ciclo;
    this.reportesMonitoreoService.obtenerRepoEfecActiTomaEst(request).subscribe(
      (response: Response) => {
        this.items = response.resultado;

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

  OnLimpiar(){
    this.paginacion = new Paginacion({ registros: 10 });
    this.consultarParametros();
    this.oficina = 0;
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.itemsPagination = [];
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm.controls['fechaI'].setValue({ year: this.anio, month: this.mes });
    let mesTxt = this.mes<10?'0'+this.mes +'':this.mes;
    this.periodo = this.anio +''+ mesTxt;
    this.obtenerCiclo();
    this.ciclo= 'TODOS';
  }

  private suscribirLoading(): void {
    this.reportesMonitoreoService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
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
    this.reportesMonitoreoService.generarEfectividadTomaEstadoPDF(this.items).subscribe(
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
    this.reportesMonitoreoService.generarEfectividadTomaEstadoExcel(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.xlsx });
        this_.fileService.downloadFile(file, 'informe-actividad-toma-estado.xlsx');
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }

  obtenerCiclo(){
    const this_ = this;
    this.ciclo='';
    this.reportesMonitoreoService.obtenerCiclos(this.periodo).subscribe(
      (response: Response) => {
        this.cicloList = response.resultado;
        if(this.cicloList.length>0){
          this.cicloButton=false;
          this.cicloList.push(JSON.parse(JSON.parse(JSON.stringify('{"CICLO": "TODOS"}'))));
          this.ciclo = 'TODOS';
        }else{
          this.cicloList.push(JSON.parse(JSON.parse(JSON.stringify('{"CICLO": "TODOS"}'))));
          this.ciclo = 'TODOS';
          this.cicloButton=true;
        }
      },
      (error) => this.controlarError(error)
    );
  }
  onPeriodo($event) {
    this.periodo = $event.substring(3, 7) + $event.substring(0, 2);
    this.obtenerCiclo();
  }

}
