import { Component, OnInit, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { ParametrosCargaBandeja, ProgramaValores, Response, Paginacion, RequestReportes, Empresa, Oficina, Actividad} from 'src/app/models';
import { PerfilService } from '../../../services/impl/perfil.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProgramaMensualRequest } from 'src/app/models/request/programa-mensual-request';
import { ProgramaMensualService } from '../../../services/impl/programa-mensual.service';
import { ToastrService } from 'ngx-toastr';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { ReportesMonitoreoService } from 'src/app/services/impl/reportes-monitoreo.service';
import { InsertarProgramaValoresComponent } from './registro-programa-valores/insertar-programa-valores.component';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-registro-programa-valores',
  templateUrl: './programa-valores.component.html',
  styleUrls: ['./programa-valores.component.scss']
})
export class ProgramaValoresComponent implements OnInit {
  listaParametros: ParametrosCargaBandeja;
  lista: ParametrosCargaBandeja;
  @Output()
  parametros: any;
  @Output()
  oficina: Oficina = new Oficina();
  @Output()
  empresa: Empresa = new Empresa();
  @Output()
  actividad: Actividad = new Actividad();

  @ViewChild('registrar') registrarvalores: SwalComponent;
  myForm: FormGroup;
  cantidadMes: number;
  cantidad_periodo: number;
  valorTotal: number;
  isLoading: boolean = false;
  @Input()
  items: Array<ProgramaValores> = new Array<ProgramaValores>();
  itemsPagination: ProgramaValores[];
  paginacion: Paginacion;
  loading: boolean = false;
  editando: boolean = false;
  valoranterior: number = 0;
  itemEmpresa: Empresa = new Empresa();
  itemOficina: Oficina = new Oficina();
  itemActividad: Actividad = new Actividad();

  subaticList: String[] = new Array<String>();
  listSubacti: String[] = new Array<String>();
  subactividad: string;
  @ViewChild(InsertarProgramaValoresComponent) registrar;
  @ViewChild('registrar') registrarModal: SwalComponent;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private perfilService: PerfilService,
              private programaMensualService: ProgramaMensualService,
              private reportesService: ReportesMonitoreoService) { }

  ngOnInit() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.consultarParametros();
    this.myForm = this.fb.group({
      fecha: { year: 2020, month: 1 }
    });
    this.empresa = this.listaParametros.listaEmpresa[0];
    this.actividad = this.listaParametros.listaActividad[0];
    this.oficina = this.lista.oficinas[0];

    this.parametros = {itemActividad: this.listaParametros.listaActividad[0], itemOficina: this.lista.oficinas[0],
      itemEmpresa: this.listaParametros.listaEmpresa[0], itemSubactividad: ''
    };
    this.parametros = JSON.stringify(this.parametros);
    this.obtenerSubactividad();
  }

  private consultarParametros() {
    this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
    this.lista =  JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
  }

  private ObtenerProgramaMensual(): ProgramaMensualRequest {
    const request: ProgramaMensualRequest = new ProgramaMensualRequest();
    request.v_idacti = this.actividad.codigo;
    request.n_id_ofic = this.oficina.codigo;
    request.v_n_id_contrati = this.empresa.codigo;
    request.n_val_prog_total = this.valorTotal;
    request.n_cant_periodos = this.cantidad_periodo;
    request.a_v_usucre = this.perfilService.obtenerUsuarioLogin();
    request.v_v_mes_inicio = this.myForm.value.fecha.month;
    request.v_v_anio_inicio = this.myForm.value.fecha.year;
    return request;
  }

  OnEnviar(): void {
    this.isLoading = true;
    const this_ = this;
    this.programaMensualService.registrarPrograma(this.ObtenerProgramaMensual()).subscribe(
      (response: Response) => {
        this_.items = response.resultado;
        this_.isLoading = false;
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
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

  private suscribirLoading(): void {
    this.programaMensualService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
  }

  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  obtenerSubactividad() {
    const this_ = this;
    const request: ReportesRequest = new ReportesRequest();
    request.v_idacti = this.actividad.codigo;
    request.n_idofic = this.oficina.codigo;
    this.reportesService.obtenerSubactividades(request).subscribe(
      (response: Response) => {
        if (response.resultado.length !== '') {
          this_.subaticList = [];
          this_.listSubacti = [];
          for (let i = 0; i < response.resultado.length; i++) {
            this_.listSubacti.push(JSON.parse(JSON.parse(JSON.stringify(response.resultado[i]))));
          }
           this_.subaticList = this_.listSubacti;
           this_.parametros = JSON.parse(this.parametros);
           this_.parametros.itemSubactividad = this_.subaticList;
           this_.parametros = JSON.stringify(this_.parametros);
        } else {
          this_.subaticList = [];
        }
      },
      (error) => this.controlarError(error)
    );
  }

  OnListarProgramaMensual(): void {
    this.isLoading = true;
    const this_ = this;
    const request: ProgramaValores = new ProgramaValores();
    request.v_n_id_contrati = this.empresa.codigo;
    request.v_idacti = this.actividad.codigo;
    request.n_id_ofic = this.oficina.codigo;
    this.reportesService.listarProgramaValores(request).subscribe(
      (response: Response) => {
        this.items = (response.resultado) as Array<ProgramaValores>;
        this_.isLoading = false;
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnEditar(index: number) {
    this.items[index].v_editable = 1;
    this.editando = true;
    this.valoranterior = this.items[index].n_val_prog_mensual;
  }

  OnCancel(index: number) {
    this.items[index].v_editable = 0;
    this.editando = false;
    this.items[index].n_val_prog_mensual = this.valoranterior;
  }

  OnUpdate(index: number) {
    this.isLoading = true;
    this.items[index].v_idsubacti_1=this.subactividad!=null?this.subactividad.substring(0, 2):' ';
    this.items[index].v_idsubacti_2=this.subactividad!=null?this.subactividad.substring(0, 4):' ';
    this.reportesService.updateProgramaValores(this.items[index]).subscribe(
      (response: Response) => {
        this.items[index].v_editable = 0;
        this.editando = false;
        this.toastr.success('Confirmación', 'Se actualizó el registro satisfactoriamente');
        this.OnListarProgramaMensual();
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnEliminar() {
    this.isLoading = true;
    const this_ = this;
    const request: ProgramaValores = new ProgramaValores();
    request.v_n_id_contrati = this.empresa.codigo;
    request.v_idacti = this.actividad.codigo;
    request.n_id_ofic = this.oficina.codigo;
    this.reportesService.eliminarProgramaValores(request).subscribe(
      (response: Response) => {
        this.editando = false;
        this.toastr.success('Se eliminaron los registros satisfactoriamente');
        this.items = new Array<ProgramaValores>();
        this.OnListarProgramaMensual();
      },
      (error) => this.controlarError(error)
    );
    this.suscribirLoading();
  }

  OnChange(i, event) {
    this.parametros = JSON.parse(this.parametros);
    switch (i) {
      case 1 :
        this.parametros.itemEmpresa = event as Empresa;
        break;
      case 2 :
        this.parametros.itemOficina = event as Oficina;
        break;
      case 3 :
        this.parametros.itemActividad = event as Actividad;
        break;
      default:
        break;
    }
    this.parametros = JSON.stringify(this.parametros);
  }

  onCancelRegistrar() {
    this.registrarModal.nativeSwal.close();
  }

  listarItems(event) {
    this.items = event;
  }
}
