import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ParametrosCargaBandeja, Oficina, Empresa, Actividad, ProgramaValores, Response, Ciclos } from '../../../../../app/models';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportesMonitoreoService } from '../../../../../app/services/impl/reportes-monitoreo.service';
import { PerfilService } from '../../../../../app/services/impl/perfil.service';
import { CicloRequest } from 'src/app/models/request/ciclo-request';
import { CicloService } from '../../../../services/impl/ciclo.service';

@Component({
    selector: 'app-insertar-ciclos',
    templateUrl: './insertar-ciclos.component.html',
    styleUrls: ['./insertar-ciclos.component.scss']
  })

  export class InsertarCiclosComponent implements OnInit {
    [x: string]: any;
    @Input()
    parametros: any;
    @Output()
    oficina: number;
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
    emisorItems: EventEmitter<Array<Ciclos>> = new EventEmitter();
    listaParametros: ParametrosCargaBandeja;
    lista: ParametrosCargaBandeja;

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private perfil: PerfilService,
                private reportesService: ReportesMonitoreoService,
                private cicloService: CicloService) { }

    ngOnInit() {
      this.parametros = JSON.parse(this.parametros);
      this.consultarParametros();
      this.oficina = this.parametros.idOficina;
      this.mes = this.parametros.month;
      this.anio = this.parametros.year
      this.mesValor = this.mes;
      this.myForm = this.fb.group({
        fecha: {year: this.parametros.year, month: this.parametros.month}
      })
      this.cantPeriodos = 13 - this.parametros.month;
      this.valorPeriodo = 13 - this.parametros.month;
      this.maxPeriodos = 13 - this.parametros.month;

    }

    private consultarParametros() {
      this.listaParametros = JSON.parse(sessionStorage.getItem('parametrosUsuario'));
      this.lista = JSON.parse(sessionStorage.getItem('parametrosBandejaPersonal'));
    }

    onCalcular($event){
       this.mesValor = $event;
       this.cantPeriodos = 13 - $event;
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
    const request = new CicloRequest();
    request.n_idofic = this.oficina;
    request.d_periodo = this.anio +''+ this.mes;
    request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
    request.n_cant_periodos = this.cantPeriodos;
    this.cicloService.registrarCiclo(request).subscribe(
      (response: Response) => {
        this.items = (response.resultado) as Array<Ciclos>;
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
