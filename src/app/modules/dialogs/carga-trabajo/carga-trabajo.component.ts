import {Component, OnInit,Input, ViewChild, ElementRef} from '@angular/core';
import {DatePipe} from '@angular/common';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import {CargasTrabajoService} from '../../../services/impl/cargas-trabajo.service';
import { ParametrosCargaBandeja, Parametro, Oficina, Empresa, Actividad,Response} from 'src/app/models';
import { RequestCarga } from 'src/app/models/request/request-carga';
import {Parametro as EnumParametro} from '../../../models/enums/parametro';
@Component({
  selector: 'carga-trabajo',
  templateUrl: 'carga-trabajo.template.html',
  styleUrls: ['carga-trabajo.component.scss']
})
export class BuscarCargaTrabajoComponent implements OnInit {

  @ViewChild('buscar') buscar: ElementRef;
  public requestCarga: RequestCarga;
  public nombreGrupoSeleccionado: string;
  public listaParametros: ParametrosCargaBandeja;
  public estadoParametro: Parametro;
  public oficina: Oficina;
  public empresa: Empresa;
  public actividad: Actividad;
  public uidCarga: string;
  public descripcion: string;
  public fechaInicial: Date = new Date();
  public fechaFinal: Date = new Date();
  public clrEmpresa: boolean = true;
  public clrOficina: boolean = false;
  public clrActividad: boolean = false;
  public clrEstado: boolean = false;
  public esContratista : boolean = false;
  vdescripcion: string;
  constructor(private cargasService : CargasTrabajoService,private localeService: BsLocaleService,
              private toastr: ToastrService) {
    this.requestCarga = new RequestCarga();
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.listaParametros = new ParametrosCargaBandeja();
    this.nombreGrupoSeleccionado = 'Grupo genérico';
    this.requestCarga.uidGrupo = '0';
    this.fechaFinal = null;
    this.fechaInicial= null;

    this.esContratista = sessionStorage.getItem('perfilAsignado')==EnumParametro.PERFIL_ANALISTA_EXTERNO || sessionStorage.getItem('perfilAsignado')==EnumParametro.PERFIL_SUPERVISOR_EXTERNO;

    this.initValues();
    this.ConsultarParametros();
  }

  ConsultarParametros() {
    this.cargasService.consultarParametros().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
        this.listaParametros.listaOficina.length==1?this.oficina = this.listaParametros.listaOficina[0]:this.oficina = null;
        this.listaParametros.listaActividad.length==1?this.actividad = this.listaParametros.listaActividad[0]:this.actividad = null;
        if(this.esContratista){
          this.listaParametros.listaEmpresa.length==1?this.empresa = this.listaParametros.listaEmpresa[0]:this.empresa = null;
        }
        this.listaParametros.listaEstado.length==1?this.estadoParametro = this.listaParametros.listaEstado[0]:this.estadoParametro = null;
        this.listaParametros.listaOficina.length==1?this.clrOficina = false:this.clrOficina = true;
        this.listaParametros.listaActividad.length==1?this.clrActividad = false:this.clrActividad = true;
        this.listaParametros.listaEstado.length==1?this.clrEstado = false:this.clrEstado = true;

      },
      (error) => this.controlarError(error)
    );
  }
  seleccionarNroCargaFechas() {
    if(this.fechaInicial && this.fechaFinal){
      let dayI = this.fechaInicial.getDate().toString();
      if(dayI.toString().length==1)
        dayI = '0' + dayI;
      let monthI = (this.fechaInicial.getMonth()+1).toString();
      if(monthI.toString().length==1)
        monthI = '0' + monthI;
      let yearI = this.fechaInicial.getFullYear().toString();
      this.requestCarga.fechaInicio = dayI+'/'+monthI+'/'+yearI;

      let dayF = this.fechaFinal.getDate().toString();
      if(dayF.toString().length==1)
        dayF = '0' + dayF;
      let monthF = (this.fechaFinal.getMonth()+1).toString();
      if(monthF.toString().length==1)
        monthF = '0' + monthF;
      let yearF = this.fechaFinal.getFullYear().toString();
      this.requestCarga.fechaFin = dayF+'/'+monthF+'/'+yearF;
    }else{
      this.requestCarga.fechaInicio = '31/12/2999';
      this.requestCarga.fechaFin =  '31/12/2999';
    }


    this.requestCarga.fechaSedapal = '31/12/2999';
    this.requestCarga.fechaContratista = '31/12/2999';
    this.requestCarga.fechaCarga = '31/12/2999';
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  DetectChange(){
    if(!this.fechaFinal || !this.fechaInicial){
      return;
    }
    if(this.fechaFinal && this.fechaFinal.toString()=='Invalid Date'){
      this.fechaFinal = null;
      this.toastr.warning('Fecha Final ingresada no valida','Advertencia',{closeButton:true});
      return;
    }
    if(this.fechaInicial && this.fechaInicial.toString()=='Invalid Date'){
      this.fechaInicial = null;
      this.toastr.warning('Fecha Inicial ingresada no valida','Advertencia',{closeButton:true});
      return;
    }

  }
  OnConfigurarBusqueda() {
    // this.buscar.nativeElement.maxLength = 13;
    this.buscar.nativeElement.maxLength = 20;
    this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 ||  ( e.charCode >= 65 && e.charCode <= 90 ) || ( e.charCode >= 97 && e.charCode <= 122 );

  }
  initValues(){
    this.requestCarga = {
      uidCargaTrabajo:  'G',
      motivoAnula:  'G',
      uidUsuarioE:  'G',
      uidUsuarioC:  'G',
      uidOficina:  '0',
      uidGrupo:  '0',
      uidEstado:  'G',
      uidContratista:  '0',
      uidActividad:  'G',
      cantidadEjecutada:  '0',
      cantidadCarga:  '0',
      fechaSedapal:  '31/12/2999',
      fechaContratista:  '31/12/2999',
      fechaCarga:  '31/12/2999',
      fechaInicio: '31/12/2999',
      fechaFin: '31/12/2999',
      idPers: '0',
      idPerfil: '0',
      comentario: 'G',
      usuario: 'G',
      vnTipoEstado: 0,
      vdescripcion: 'G',
      descContratista: ''
    };
  }

  onLimpiarFiltros():void{
    this.uidCarga = "";
    if(this.esContratista==true) {
      this.listaParametros.listaEmpresa.length==1?this.empresa = this.listaParametros.listaEmpresa[0]:this.empresa = null;
    } else {
      this.empresa=null;
    }
    this.listaParametros.listaOficina.length==1?this.oficina = this.listaParametros.listaOficina[0]:this.oficina = null;
    this.actividad = null;
    this.fechaInicial = null;
    this.fechaFinal = null;
    this.estadoParametro = null;
    this.vdescripcion = "";
  }
}
