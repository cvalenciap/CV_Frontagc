import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Oficina, Empresa, Actividad, Rendimiento, Response, Parametro, Paginacion, ParametrosCargaBandeja } from 'src/app/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from 'src/app/services/impl/reportes-monitoreo.service';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { ReportesRequest } from 'src/app/models/request/reporte-request';
import { ValidacionService } from 'src/app/services/impl/validacion';
import { MonitoreoService } from 'src/app/services/impl/monitoreo.service';

@Component({
    selector: 'app-insertar-rendimiento',
    templateUrl: './insertar-rendimiento.component.html',
    styleUrls: ['./insertar-rendimiento.component.scss']
  })

  export class InsertarRendimientoComponent implements OnInit {
  [x: string]: any;
    @Input()
    listaParametros: any;
    @Output()
    listaOficinas: Oficina[];
    empresa: Empresa[];
    listaActividad: Actividad[];
    oficina: Oficina = new Oficina();
    actividad: Actividad = new Actividad();
    subaticList: String[] = new Array<String>();
    progTotal: number = 0;
    cantPeriodos: number = 0;
    myForm: FormGroup;
    mesValor: number;
    valorPeriodo: number;
    maxPeriodos: number = 0;
    mes: number;
    anio: number;
    ncuadrilla: number = 0;
    vtrabajador: number = 0;
    vsuministro: number = 0;
    uniMedida: string ;
    opcional1: string;
    opcional2: string;
    subactividad: string;
    arrayItems: Array<{codigo: number, detalle: string}>;
    item: Parametro= new Parametro();
    suministroBlock:number = 0;
    cuadrillaBlock:number = 0;
    trabajadorBlock:number = 0;

    @Output()
    emisor: EventEmitter<any> = new EventEmitter();

    @Output()
    emisorItems: EventEmitter<Array<Rendimiento>> = new EventEmitter();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private perfil: PerfilService,
                private reportesService: ReportesMonitoreoService,
                private validacionNumero: ValidacionService,
                private monitoreoService: MonitoreoService) {


    this.listaParametros = new ParametrosCargaBandeja();

    this.suministroBlock = 0;
    this.cuadrillaBlock = 0;
    this.trabajadorBlock = 0;
    }

    ngOnInit() {
      this.consultarParametros();
/*       this.listaActividad = new Array<Actividad>();
      this.listaOficinas = new Array<Oficina>();
      this.listaOficinas = this.listaParametros.listaOficina;
      this.listaActividad = this.listaParametros.listaActividad; */
      /* this.listaParametros.listaOficina = this.lista.oficinas; */
      this.mes = (new Date()).getMonth() + 1;
      this.anio = (new Date()).getFullYear();
      this.mesValor = this.mes;
      this.myForm = this.fb.group({
        fecha: {year: this.anio, month: this.mes }
      });

      this.cantPeriodos = 13 - this.mes;
      this.progTotal = this.cantPeriodos;
      this.valorPeriodo = 13 - this.mes;
      this.maxPeriodos = 13 - this.mes;

      this.arrayItems = [
        {codigo: 1, detalle: 'Ítem 1'},
        {codigo: 2, detalle: 'Ítem 2'},
        {codigo: 3, detalle: 'Ítem 3'},
        {codigo: 4, detalle: 'Ítem 4'},
    ];
    }
    onCalcular($event) {
       this.mesValor = $event;
       this.cantPeriodos = 13 - $event;
       this.progTotal = this.cantPeriodos;
       this.valorPeriodo = 13 - this.mesValor;
       this.maxPeriodos = 13 - this.mesValor;
    }

  onChangePeriodos() {
    if (this.cantPeriodos > this.maxPeriodos) {
      this.toastr.warning('El valor ingresado excede el límite permitido (' + this.maxPeriodos.toString() + ')', 'Advertencia', { closeButton: true });
      this.cantPeriodos = this.maxPeriodos;
    }
  }

  onCrear() {
    if (!this.validaFormuario()) {
      return false;
    }
    const request = new Rendimiento();
    request.v_idacti_seda = '1';
    request.v_idacti = this.actividad.codigo;
    request.v_ind_clte_espe = '1';
    request.v_idsubacti_1 =this.subactividad;
    /* request.v_idsubacti_2 =this.subactividad!=null?this.subactividad.substring(0, 4):' '; */
    request.n_numitem = this.item.codigo;
    request.n_numcuad = this.ncuadrilla;
    request.n_valor_trabajador = this.vtrabajador;
    request.n_valor_suministro = this.vsuministro;
    request.v_codigo_val1 = this.opcional1;
    request.v_codigo_val2 = this.opcional2;
    request.v_uni_medida = this.uniMedida;
    request.n_idofic = this.oficina.codigo;
    request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
    request.v_v_mes_inicio = this.mesValor;
    request.v_v_anio_inicio = this.anio;

    this.reportesService.crearRendimiento(request).subscribe(
      (response: Response) => {
        if (response.resultado == "ERROR. El Registro ya existe") {
          this.toastr.warning('El Registro ya existe', 'Error', {closeButton: true});
        } else if (response.resultado == "") {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
        } else {
          this.items = (response.resultado);
          this.emisorItems.emit(this.items);
          this.toastr.success(  'Confirmación', 'Registros agregados correctamente', {closeButton: true});
        }
      },
      (error) => this.controlarError(error)
    );
    this.emisor.emit();
  }

  onCancel() {
    this.emisor.emit();
  }
  onBlurSuministro(event){
    if (event != null && event != 0 ) {
      this.trabajadorBlock = 1;
      this.cuadrillaBlock = 1;
    }else{
      this.trabajadorBlock = 0;
      this.cuadrillaBlock = 0;
    }
  }
  onBlurCuadrilla(event){
    if (event != null && event != 0 ) {
      this.trabajadorBlock = 1;
      this.suministroBlock = 1;
    }else{
      this.trabajadorBlock = 0;
      this.suministroBlock = 0;
    }
  }
  onBlurTrabajador(event){
    if (event != null && event != 0 ) {
      this.suministroBlock = 1;
      this.cuadrillaBlock = 1;
    }else{
      this.suministroBlock = 0;
      this.cuadrillaBlock = 0
    }
  }

  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }

  private consultarParametros() {
    /* this.listaParametros = this.detalleBandejaService.obtenerParametrosBandeja(); */
    this.monitoreoService.consultarParametrosBusquedaAsignaciones().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
      }
    );
    this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
  }

  OnChange(i, event) {
    switch (i) {
      case 1 :
        this.oficina.descripcion = event.descripcion;
        this.subactividad = null;
        if (this.actividad.descripcion) {
          this.obtenerSubactividad();
        }
        break;
      case 2 :
        this.actividad.descripcion = event.descripcion;
        this.subactividad = null;
        if (this.oficina.descripcion) {
          this.obtenerSubactividad();
        }
        break;
      case 3 :
        this.actividad.descripcion = event.descripcion;
        break;
      case 4 :
        this.item.detalle = event.detalle;
        break;
      default:
        break;
    }
  }
  validaFormuario(){
    let valida:boolean = false
    if (this.oficina && this.actividad && this.item && this.subactividad) {

      if (this.ncuadrilla && this.vtrabajador && this.vsuministro) {
        this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
        return valida = false;
      }
      if (!this.ncuadrilla && !this.vtrabajador && !this.vsuministro) {
        this.toastr.warning('Debe llenar al menos uno de los valores (+)', 'Aviso', {closeButton: true});
        return valida = false;
      }

      if (this.ncuadrilla && this.vsuministro) {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
      }else if (this.ncuadrilla && this.vtrabajador ) {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
      }else if (this.vsuministro && this.vtrabajador ) {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
      }

      if (this.ncuadrilla) {
        if (!this.vsuministro && !this.vtrabajador) {
          valida=true;
        } else {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
        }
      }
      if (this.vtrabajador) {
        if (!this.vsuministro && !this.ncuadrilla) {
          valida=true;
        } else {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
        }
      }
      if (this.vsuministro) {
        if (!this.ncuadrilla && !this.vtrabajador) {
          valida=true;
        } else {
          this.toastr.warning('Debe llenar solo uno de los valores (+)', 'Aviso', {closeButton: true});
          return valida = false;
        }
      }
    }else{
      this.toastr.warning('Debe llenar todos los filtros obligatorios', 'Aviso', {closeButton: true});
      return valida = false;
    }
    return valida;
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
        } else {
          this_.subaticList = [];
        }
      },
      (error) => this.controlarError(error)
    );
  }
}
