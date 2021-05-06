import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Oficina, Empresa, Actividad, ProgramaValores, Response } from 'src/app/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from 'src/app/services/impl/reportes-monitoreo.service';
import { PerfilService } from 'src/app/services/impl/perfil.service';


@Component({
    selector: 'app-insertar-programa-valores',
    templateUrl: './insertar-programa-valores.component.html',
    styleUrls: ['./insertar-programa-valores.component.scss']
  })

  export class InsertarProgramaValoresComponent implements OnInit {
  [x: string]: any;
    @Input()
    parametros: any;
    @Output()
    oficina: Oficina;
    empresa: Empresa;
    actividad: Actividad;
    progTotal: number = 0;
    cantPeriodos: number = 0;
    myForm: FormGroup;
    mesValor: number;
    valorPeriodo: number;
    maxPeriodos: number = 0;
    mes: number;
    anio: number;

    @Output()
    emisor: EventEmitter<any> = new EventEmitter();

    @Output()
    emisorItems: EventEmitter<Array<ProgramaValores>> = new EventEmitter();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private perfil: PerfilService,
                private reportesService: ReportesMonitoreoService) { }

    ngOnInit() {
      this.parametros = JSON.parse(this.parametros);
      this.oficina = this.parametros.itemOficina as Oficina;
      this.empresa = this.parametros.itemEmpresa as Empresa;
      this.actividad = this.parametros.itemActividad as Actividad;
      this.subaticList = this.parametros.itemSubactividad;
      this.mes = (new Date()).getMonth() + 1;
      this.anio = (new Date()).getFullYear();
      this.mesValor = this.mes;
      this.myForm = this.fb.group({
        fecha: {year: this.anio, month: this.mes }
      })

      this.cantPeriodos = 13 - this.mes;
      this.progTotal = this.cantPeriodos;
      this.valorPeriodo = 13 - this.mes;
      this.maxPeriodos = 13 - this.mes;
    }
    
    onCalcular($event){
       this.mesValor = $event;
       this.cantPeriodos = 13 - $event;
       this.progTotal = this.cantPeriodos;
       this.valorPeriodo = 13 - this.mesValor;
       this.maxPeriodos = 13 - this.mesValor;
    }

    numberOnly(event) {
       let target = event.target as HTMLInputElement;
       console.log(target.value);
  }

  onChangePeriodos() {
    if (this.cantPeriodos > this.maxPeriodos) {
      this.toastr.warning('El valor ingresado excede el límite permitido (' + this.maxPeriodos.toString() + ')', 'Advertencia', { closeButton: true });
      this.cantPeriodos = this.maxPeriodos;
    }
  }

  onCrear() {
    const request = new ProgramaValores();
    request.v_idacti = this.actividad.codigo;
    request.v_idsubacti_1 =this.subactividad!=null?this.subactividad.substring(0, 2):' ';
    request.v_idsubacti_2 =this.subactividad!=null?this.subactividad.substring(0, 4):' ';
    request.n_id_ofic = this.oficina.codigo;
    request.v_n_id_contrati = this.empresa.codigo;
    request.n_val_prog_total = this.progTotal;
    request.n_cant_periodos = this.cantPeriodos;
    request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
    request.v_v_mes_inicio = this.mesValor;
    request.v_v_anio_inicio = this.anio;
    this.reportesService.crearProgramaValores(request).subscribe(
      (response: Response) => {
        this.items = (response.resultado) as Array<ProgramaValores>;
        this.emisorItems.emit(this.items);
        this.toastr.success('Confirmación', 'Registros agregados correctamente', {closeButton: true});        
      },
      (error) => this.controlarError(error)
    );
    this.emisor.emit();
  }

  onCancel() {
    this.emisor.emit();
  }

  controlarError(err) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    if (this.loading) { this.loading = false; }
  }
}