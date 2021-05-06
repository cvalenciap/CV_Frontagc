import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrosCargaBandeja, RepoCumpActiCierre, Paginacion, Response, Periodo, Ciclo, ItemCumplimiento, ActividadCumplimiento, SubactividadCumplimiento, Empresa, Oficina } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from '../../../services/impl/reportes-monitoreo.service';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { TipoArchivo } from 'src/app/models/enums/tipo-archivo';
import { ExcelService } from '../../../services/impl/excel.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MonitoreoService } from 'src/app/services/impl/monitoreo.service';

@Component({
  selector: 'app-cumplimiento-actividad-reapertura',
  templateUrl: './cumplimiento-actividad-reapertura.component.html',
  styleUrls: ['./cumplimiento-actividad-reapertura.component.scss']
})
export class CumplimientoActividadReaperturaComponent implements OnInit {

  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  listActi: ParametrosCargaBandeja;
  periodosList: Periodo[];
  cicloList: Ciclo[];
  paginacion: Paginacion;
  empresa: number;
  oficina: number;
  periodo: string;
  ciclo: string;
  loading: boolean;
  isLoading: boolean = false;
  items: RepoCumpActiCierre[];
  itemsPagination: RepoCumpActiCierre[];
  urlReportePdf: string;
  codigoPerfil: number;
  myForm: FormGroup;
  mes: number;
  anio: number;
  periodoI: string;
  periodoF: string;
  valorItmes: ItemCumplimiento[];
  valorActividades: ActividadCumplimiento[];
  valorSubactividades: String[];
  itemcp: number;
  actividad: string;
  subactividad: string;
  eitems: boolean = true;
  eactividad: boolean = true;
  esubactividad: boolean = true;
  eciclo: boolean = true;
  listSubacti: String[] = new Array<String>();
  datoUsuarioContratista: Empresa;
  datoOficina: Array<Oficina> = new Array<Oficina>();
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private reportesMonitoreoService: ReportesMonitoreoService,
              private fileService: ExcelService,
              private monitoreoService: MonitoreoService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.itemsPagination = [];
    this.consultarParametros();
    this.consultarActividad();
    this.oficina = this.lista.oficinas[0].codigo;
    this.cargarDato(this.lista.oficinas[0].codigo);
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.periodo = this.periodosList[0].PERIODO;

    this.codigoPerfil = JSON.parse(sessionStorage.getItem('perfilAsignado'));
    this.ciclo = '';
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm = this.fb.group({
      fechaI: { year: this.anio, month: this.mes },
      fechaF: { year: this.anio, month: this.mes }
    });
    let mesTxt = this.mes<10?'0'+this.mes +'':this.mes;
    this.periodo = this.anio +''+ mesTxt;
    this.obtenerItems();
    this.subactividad = '';
    this.eactividad = true;

  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));

    this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    this.periodosList = JSON.parse(sessionStorage.getItem('periodosMonitoreo'));
    this.datoUsuarioContratista = JSON.parse(sessionStorage.getItem('EmpresaUsuarioSesion'));
  }

  private consultarActividad() {
    const this_ = this;
    /*

    this.listaParametros = this.detalleBandejaService.obtenerParametrosBandeja(); */
    //this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    //this.periodosList = JSON.parse(sessionStorage.getItem('periodosMonitoreo'));
    this.monitoreoService.consultarParametrosBusquedaAsignaciones().subscribe(
      (response: Response) => {
        this_.listActi = JSON.parse(JSON.stringify(response.resultado)).listaActividad;
        this_.actividad = this_.listActi[0].codigo;
        this.obtenerSubactividad();
        //this_.actividad = this_.listActi.listaActividad[0].codigo;
        // this.empresa = this.listaParametros.listaEmpresa[0].codigo;
      }
    );

  }

  OnFiltrar() {
    this.isLoading = true;
    const this_ = this;
    const request: ReportesRequest = new ReportesRequest();
    request.v_n_idempr = this.empresa;
    request.v_n_item = this.itemcp;
    request.n_idofic = this.oficina == 0 ? null : this.oficina;
    request.v_idacti = this.actividad;
    request.v_subacti = this.subactividad;
    request.v_periodo = this.periodo;
    this.reportesMonitoreoService.obtenerRepoCumpActiCierre(request).subscribe(
      (response: Response) => {
        this.items = response.resultado;

        if (response.paginacion != undefined) {
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
    this.consultarActividad();
    this.oficina = this.lista.oficinas[0].codigo;
    this.cargarDato(this.lista.oficinas[0].codigo);
    this.empresa = this.listaParametros.listaEmpresa[0].codigo;
    this.itemsPagination = [];
    this.mes = (new Date()).getMonth() + 1;
    this.anio = (new Date()).getFullYear();
    this.myForm.controls['fechaI'].setValue({ year: this.anio, month: this.mes });
    this.myForm.controls['fechaF'].setValue({ year: this.anio, month: this.mes });
    let mesTxt = this.mes<10?'0'+this.mes +'':this.mes;
    this.periodo = this.anio +''+ mesTxt;
    this.obtenerItems();
    this.eactividad = true;
    this.subactividad = '';
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
    for(let i=0;i<this.items.length;i++){
      this.items[i].v_descofic = this.datoOficina[0].descripcion;
      this.items[i].v_nombreempr = this.datoUsuarioContratista.descripcion;
    }
    this.reportesMonitoreoService.generarRepoCumpActiCierrePDF(this.items).subscribe(
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
    this.reportesMonitoreoService.generarRepoCumpActiCierreExcel(this.items).subscribe(
      (data) => {
        const file = new Blob([data], { type: TipoArchivo.xlsx });
        this_.fileService.downloadFile(file, 'informe-cumplimiento-cierre.xlsx');
        this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }


  onPeriodo($event) {
    this.periodo = $event.substring(3, 7) + $event.substring(0, 2);
  }


  cargarDato($event) {
    this.datoOficina =  this.lista.oficinas.filter(item => item.codigo === $event);
  }


  obtenerItems(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerItems(this.oficina.toString()).subscribe(
      (response: Response) => {
        this.valorItmes = JSON.parse(JSON.stringify(response.resultado));
        if(this.valorItmes.length>0){
          this.eitems = false;
          this.itemcp = this.valorItmes[0].ITEM;
          this.obtenerSubactividad();
        }else{
          this.itemcp = 0;
          this.eitems = true;
        }
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerActividades(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerActividades(this.itemcp).subscribe(
      (response: Response) => {
        this.valorActividades = JSON.parse(JSON.stringify(response.resultado));
        this.eactividad = false;
      },
      (error) => this.controlarError(error)
    );
  }


  obtenerSubactividad(){
    const this_ = this;
    this.reportesMonitoreoService.obtenerSubactividadesRend(this.itemcp,this.actividad).subscribe(
      (response: Response) => {
        this_.listSubacti = [];
        if(response.resultado.length>0){
          for(let i=0; i<response.resultado.length;i++){
            //console.log(response.resultado[i].DATA);
            this_.listSubacti.push(JSON.parse(JSON.parse(JSON.stringify(response.resultado[i].DATA))));
          }
          this_.listSubacti.push(JSON.parse(JSON.parse(JSON.stringify('{"id": "", "description": "TODOS"}'))));
          this.valorSubactividades = this_.listSubacti;
          this.esubactividad = false;
        }else{
          this.valorSubactividades = this_.listSubacti;
          this.esubactividad = true;
        }

      },
      (error) => this.controlarError(error)
    );
  }
}
