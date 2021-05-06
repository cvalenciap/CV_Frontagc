import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrosCargaBandeja, RepoCumpActiInsp, Paginacion, Response, Periodo, Ciclo, ItemCumplimiento, ActividadCumplimiento, SubactividadCumplimiento, Empresa, Oficina } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from '../../../services/impl/reportes-monitoreo.service';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { TipoArchivo } from 'src/app/models/enums/tipo-archivo';
import { ExcelService } from '../../../services/impl/excel.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cumplimiento-actividad-inspeccion',
  templateUrl: './cumplimiento-actividad-inspeccion.component.html',
  styleUrls: ['./cumplimiento-actividad-inspeccion.component.scss']
})
export class CumplimientoActividadInspeccionComponent implements OnInit {

  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  periodosList: Periodo[];
  cicloList: Ciclo[];
  paginacion: Paginacion;
  empresa: number;
  oficina: number;
  periodo: string;
  ciclo: string;
  loading: boolean;
  isLoading: boolean = false;
  items: RepoCumpActiInsp[];
  itemsPagination: RepoCumpActiInsp[];
  urlReportePdf: string;
  codigoPerfil: number;
  myForm: FormGroup;
  mes: number;
  anio: number;
  periodoI: string;
  periodoF: string;

  valorItmes: ItemCumplimiento[];
  valorActividades: ActividadCumplimiento[];
  valorSubactividades: SubactividadCumplimiento[];
  itemcp: number;
  actividadcp: string;
  subactividadcp: string;
  eitems: boolean = true;
  eactividad: boolean = true;
  esubactividad: boolean = true;
  eciclo: boolean = true;
  fechaEmision: Date = new Date();
  datoUsuarioContratista: Empresa;
  datoOficina: Array<Oficina> = new Array<Oficina>();
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private reportesMonitoreoService: ReportesMonitoreoService,
    private fileService: ExcelService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.itemsPagination = [];
    this.consultarParametros();
    this.oficina = this.lista.oficinas[0].codigo;
    this.cargarDato(this.lista.oficinas[0].codigo);
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.actividadcp = this.listaParametros.listaActividad[2].codigo;
    this.periodo = this.periodosList[0].PERIODO;
    this.codigoPerfil = JSON.parse(sessionStorage.getItem('perfilAsignado'));
    this.ciclo = '';
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm = this.fb.group({
      fechaI: { year: this.anio, month: this.mes },
      fechaF: { year: this.anio, month: this.mes }
    });
  //
    this.obtenerItems();
    this.eactividad = true;
    //this.obtenerActividades();
  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    this.periodosList = JSON.parse(sessionStorage.getItem('periodosMonitoreo'));
    this.datoUsuarioContratista = JSON.parse(sessionStorage.getItem('EmpresaUsuarioSesion'));
  }

  OnFiltrar() {
    this.isLoading = true;
    const this_ = this;
    const request: ReportesRequest = new ReportesRequest();
    request.v_n_item = this.itemcp;
    request.n_idofic = this.oficina == 0 ? null : this.oficina;
    request.v_idacti = this.actividadcp;
    request.d_femision = this.fechaEmision;
    this.reportesMonitoreoService.obtenerRepoCumpActiInsp(request).subscribe(
      (response: Response) => {
        if(response){
          if(response.resultado.length > 1){
            if(response.resultado[0].carga_entrega === null){
              this.items = [];
            }else{
              this.items = response.resultado;
            }
          } else {
            this.items = [];
          }

        }

        if (response.paginacion != undefined && this.items.length > 0) {
          this.paginacion = new Paginacion(response.paginacion);
          response.paginacion.pagina = this.paginacion.pagina;
          response.paginacion.registros = this.paginacion.registros;
          this.getDocumentPage();
        } else {
          this.paginacion = new Paginacion({ registros: 10 });
          this.getDocumentPage();
        }
        this_.isLoading = false;
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnLimpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.consultarParametros();
    this.oficina = this.lista.oficinas[0].codigo;
    this.cargarDato(this.lista.oficinas[0].codigo);
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.actividadcp = this.listaParametros.listaActividad[2].codigo;
    this.itemsPagination = [];
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm.controls['fechaI'].setValue({ year: this.anio, month: this.mes });
    this.myForm.controls['fechaF'].setValue({ year: this.anio, month: this.mes });
    this.obtenerItems();
    this.eactividad = true;
    this.fechaEmision = new Date();

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
    for(let i=0;i<this.items.length;i++){
      this.items[i].v_descofic = this.datoOficina[0].descripcion;
      this.items[i].v_nombreempr = this.datoUsuarioContratista.descripcion;
    }
    this.reportesMonitoreoService.generarRepoCumpActiInspPDF(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.pdf });
        const fileURL = URL.createObjectURL(file);
        this_.urlReportePdf = fileURL;
        this_.reportePdfSwal.show();
        toastr.info('Documento generado', 'Confirmación', { closeButton: true });
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnExcel() {
    const this_ = this;
    this.loading = true;
    this.reportesMonitoreoService.generarRepoCumpActiInspExcel(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.xlsx });
        this_.fileService.downloadFile(file, 'informe-cumplimiento-inspecciones.xlsx');
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }

  onPerriodoI($event) {
    this.periodoI = $event.substring(3, 7) + $event.substring(0, 2);
  }

  onPerriodoF($event) {
    this.periodoF = $event.substring(3, 7) + $event.substring(0, 2);
  }

  cargarDato($event) {
    this.datoOficina =  this.lista.oficinas.filter(item => item.codigo === $event);
  }


  obtenerItems(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerItems(this.oficina.toString()).subscribe(
      (response: Response) => {
        this.valorItmes = JSON.parse(JSON.stringify(response.resultado));
        this.eitems = false;
        this.itemcp = this.valorItmes[0].ITEM;
        this.obtenerActividades();
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerActividades(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerActividades(this.itemcp).subscribe(
      (response: Response) => {
        this.valorActividades = JSON.parse(JSON.stringify(response.resultado));
      },
      (error) => this.controlarError(error)
    );
  }
  DetectChange(){
    if(!this.fechaEmision){
      return;
    }
    if(this.fechaEmision && this.fechaEmision.toString()=='Invalid Date'){
      this.fechaEmision = null;
      this.toastr.warning('Fecha Emisión ingresada no valida','Advertencia',{closeButton:true});
      return;
    }

  }
}
