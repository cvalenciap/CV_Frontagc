import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import {Empresa, Trabajador, Response} from '../../../models';
import { ToastrService } from 'ngx-toastr';
import {Oficina} from '../../../models/oficina';
import {Actividad} from '../../../models/actividad';
import {Router} from '@angular/router';
import { ResponsablesService } from 'src/app/services/impl/responsables.service';
import { Credenciales } from 'src/app/models/credenciales';
declare var jQuery: any;

@Component({
  selector: 'app-asignar-responsables',
  templateUrl: './asignar-responsables.component.html',
  styleUrls: ['./asignar-responsables.component.scss']
})
export class AsignarResponsablesComponent implements OnInit {
  public tipoEmpresa: string;
  public empresas: Empresa[] = new Array<Empresa>();
  public oficinas: Oficina[] = new Array<Oficina>();
  public actividades: Actividad[] = new Array<Actividad>();
  public trabajadores: Trabajador[] = new Array<Trabajador>();
  public trabajadoresAgregar: Trabajador[];
  public trabajadoresQuitar: Trabajador[];
  public trabajadoreSeleccionados: Trabajador[] = new Array<Trabajador>();
  public listaIndicesQuitar: number[];
  public listaIndicesAgregar: number[];

  public selectedEmpresa: Empresa;
  public selectedOficina: Oficina;
  public selectedActividad: Actividad;
  public codigoOficina: number;

  public textoSSeleccion: string;
  public textoCSelecccin: string;
  public texto_bool_IZQ:boolean = false;
  public texto_bool_DER:boolean = false;
  public trabajadoresAux_IZQ: Trabajador[] = new Array<Trabajador>();
  public trabajadoresAux_DER: Trabajador[] = new Array<Trabajador>();
  loading: boolean;
  @ViewChild('buscar_IZQ') buscar_IZQ: ElementRef;
  @ViewChild('buscar_DER') buscar_DER: ElementRef;
  constructor(private router: Router,
              private service: ResponsablesService,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.inicializarVariables();
  }

  public permisos(permiso: string) {
    if((sessionStorage.permisos).includes(this.router.url + permiso)) {
      return false;
    } else {
      return true;
    }
  }

  private inicializarVariables(): void {
    this.trabajadoresAgregar = new Array<Trabajador>();
    this.trabajadoresQuitar = new Array<Trabajador>();
    this.listaIndicesQuitar = new Array<number>();
    this.listaIndicesAgregar = new Array<number>();
    this.textoCSelecccin = '';
    this.textoSSeleccion = '';
    this.consltarEmpresas();
  }

  public seleccionarTrabajadorAgregar(trabajador: Trabajador, indice: number): void {
    if (trabajador !== null && indice >= 0) {
      const existe = this.buscarTrabajador(this.trabajadoresAgregar, trabajador);
      trabajador.estadoTabla=existe;
      if (existe) {
        this.eliminarIndice(this.listaIndicesAgregar, indice);
        this.eliminarRegistroTrabajador(this.trabajadoresAgregar, trabajador);
      } else {
        this.trabajadoresAgregar.push(trabajador);
        this.listaIndicesAgregar.push(indice);
      }
    }
  }

  public seleccionarTrabajadorQuitar(trabajador: Trabajador, indice: number): void {
    if (trabajador !== null && indice >= 0) {
      const existe = this.buscarTrabajador(this.trabajadoresQuitar, trabajador);
      trabajador.estadoTabla=existe;
      if (existe) {
        this.eliminarIndice(this.listaIndicesQuitar, indice);
        this.eliminarRegistroTrabajador(this.trabajadoresQuitar, trabajador);
      } else {
        this.trabajadoresQuitar.push(trabajador);
        this.listaIndicesQuitar.push(indice);
      }
    }
  }

  public agregarTrabajadores() {
    if (this.trabajadoresAgregar.length > 0) {
      this.trabajadoresAgregar.forEach((trabajador) => {
        trabajador.estadoTabla=true;
        let trabajador_aux =  JSON.parse(JSON.stringify(trabajador));
        this.trabajadoreSeleccionados.push(trabajador_aux);
        if(this.texto_bool_DER)
          this.trabajadoresAux_DER.push(trabajador_aux);
      });
      this.eliminarRegistro(this.trabajadores, this.listaIndicesAgregar,this.trabajadoresAux_IZQ,this.texto_bool_IZQ);
      this.listaIndicesAgregar = new Array<number>();
      this.trabajadoresAgregar = new Array<Trabajador>();
    }
  }

  public quitarTrabajadores() {
    if (this.trabajadoresQuitar.length > 0) {
      this.trabajadoresQuitar.forEach((trabajador) => {
        trabajador.estadoTabla=true;
        let trabajador_aux =  JSON.parse(JSON.stringify(trabajador));
        this.trabajadores.push(trabajador_aux);
        if(this.texto_bool_IZQ)
          this.trabajadoresAux_IZQ.push(trabajador_aux);
      });
      this.eliminarRegistro(this.trabajadoreSeleccionados, this.listaIndicesQuitar,this.trabajadoresAux_DER,this.texto_bool_DER);
      this.listaIndicesQuitar = new Array<number>();
      this.trabajadoresQuitar = new Array<Trabajador>();
    }
  }

  private eliminarRegistro(trabajadores: Trabajador[], indice: number[],trabajadoresAux: Trabajador[],flag:boolean) {
    if (indice.length >= 0) {
        indice.forEach((numeroFila) => {
        trabajadores[numeroFila].estado='INACTIVO';
      });
      for( var i = trabajadores.length; i--;){
        /* Buscando en la lista de busqueda */
        if(flag){
          for( let j=0; j<trabajadoresAux.length; j++){
            if(trabajadores[i].codigo==trabajadoresAux[j].codigo){
              trabajadoresAux.splice(j,1);
              break;
            }
          }
        }
        if ( trabajadores[i].estado === 'INACTIVO') trabajadores.splice(i, 1);
      }

    }
  }

  private eliminarRegistroTrabajador(trabajadores: Trabajador[], trabajador: Trabajador): boolean {
    let contador = 0;
    trabajadores.forEach((trabajadorAuxiliar) => {
      if (trabajadorAuxiliar.codigo === trabajador.codigo) {
        trabajadores.splice(contador, 1);
        return true;
      }
      contador = contador + 1;
    });
    return false;
  }

  private buscarTrabajador(trabajadores: Trabajador[], trabajador: Trabajador): boolean {
    const trabajadorEncontrado = trabajadores.find( function (trabajadorBusqueda) {
      return trabajadorBusqueda.codigo === trabajador.codigo;
    });
    if (trabajadorEncontrado !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  private buscarIndice(listaIndice: number[], indice: number): number {
    const indiceEncontrado = listaIndice.find( function (numeroEncontrar) {
      return numeroEncontrar === indice;
    });
    return indiceEncontrado;
  }

  private eliminarIndice(listaIndice: number[], indice: number): number {
    let contador = 0;
    const indiceEliminar = this.buscarIndice(listaIndice, indice);
    listaIndice.forEach((numero) => {
      if (numero === indiceEliminar) {
        listaIndice.splice(contador, 1);
      }
      contador = contador + 1;
    });
    return indiceEliminar;
  }

  private pintarFila(codigo: number, estado: boolean): void {
    switch (estado){
      case false: jQuery('#' + codigo).css( 'background', '#1f659b' );
                  jQuery('#' + codigo).css( 'color', 'white' );
                  break;
      case true: jQuery('#' + codigo).css( 'background', 'white' );
                 jQuery('#' + codigo).css( 'color', '#676a6c' );
      default:   return;
    }
  }
  consltarEmpresas(){

    this.service.consultarEmpresas().subscribe(
      (data: Response)=>{
        this.empresas = data.resultado;
        if (data.estado != 'OK') {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
        } else {
          if (this.empresas.length == 1) {
            this.selectedEmpresa = this.empresas[0];
          }
        }
      },(error)=>this.controlarError(error)
    );
  }
  consultarOficina(){
    this.selectedActividad = new Actividad();
    this.actividades= new Array<Actividad>();
    this.service.consultarOficina(this.selectedEmpresa.codigo).subscribe(
      (data: Response)=>{
        this.oficinas = data.resultado;
        this.oficinas.sort((a,b) => {
          if (a.descripcion < b.descripcion){
            return -1;
          }
          if (a.descripcion > b.descripcion){
            return 1;
          }
          return 0;
        });
        if (data.estado != 'OK') {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
        } else {
          if (this.oficinas.length == 1) {
            this.selectedOficina = this.oficinas[0];
            this.consultarActividad(this.selectedOficina.codigo);
          }
        }
      },(error)=>this.controlarError(error)
    );
  };
  consultarActividad(codigoOficina:number){
    this.codigoOficina=codigoOficina;
    if(codigoOficina==0){
      this.selectedActividad=new Actividad();
    }
    this.service.consultarActividad(this.selectedEmpresa.codigo,codigoOficina).subscribe(
      (data: Response)=>{
        this.actividades = data.resultado;
        if (data.estado != 'OK') {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
        } else {
          if (this.actividades.length == 1) {
            this.selectedActividad = this.actividades[0];
            this.OnCambioActividad();
          }
        }
      },(error)=>this.controlarError(error)
    );
  };
  OnCambioEmpresa() {
    this.selectedOficina = new Oficina();
    this.selectedActividad = new Actividad();
    this.oficinas = new Array<Oficina>();
    this.actividades= new Array<Actividad>();
    this.initArrays();
    if(this.selectedEmpresa){
      this.tipoEmpresa = this.selectedEmpresa.tipoEmpresa;
      this.consultarOficina();
    }else{
      this.selectedEmpresa=new Empresa();
    }
  }
  OnCambioOficina() {
    this.initArrays();
    this.selectedActividad=new Actividad();
    this.actividades= new Array<Actividad>();
    if(this.selectedEmpresa && this.selectedOficina){
      this.consultarActividad(this.selectedOficina.codigo);
    }else{
      this.selectedOficina=new Oficina();
    }
  }
  OnCambioActividad(){
    this.initArrays();
    if(this.selectedActividad){
      this.loading = true;
      this.service.consultarPersonal(this.selectedEmpresa.codigo,this.codigoOficina,this.selectedActividad.codigo).subscribe(
        (responseX: Response)=>{
          this.trabajadores = responseX.resultado;
          if (responseX.estado == 'OK') {
            this.service.consultarPersonalSeleccionado(this.selectedEmpresa.codigo, this.codigoOficina, this.selectedActividad.codigo).subscribe(
              (responseY: Response) => {
                this.trabajadoreSeleccionados = responseY.resultado;
                if (responseY.estado != 'OK') {
                  this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
                } else {
                  this.loading = false;
                }
              },
              (error)=>this.controlarError(error)
            );
          }else{
            this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
          }
        },
        (error)=>this.controlarError(error)
      );
    }
  }
  initArrays(){
    this.trabajadoreSeleccionados = new Array<Trabajador>();
    this.trabajadores = new Array<Trabajador>();
    this.trabajadoresAux_DER = new Array<Trabajador>();
    this.trabajadoresAux_IZQ = new Array<Trabajador>();
    this.textoCSelecccin = '';
    this.textoSSeleccion = '';
    this.texto_bool_DER = false;
    this.texto_bool_IZQ = false;
  }
  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    if ( this.loading ) { this.loading = false; }
  }
  OnGuardar(){
    if(!this.trabajadoreSeleccionados &&
       !this.trabajadores &&
        this.trabajadores.length==0 &&
        this.trabajadoreSeleccionados.length==0 ){
      return;
    }
    if(this.texto_bool_DER){
      this.trabajadoreSeleccionados = this.trabajadoresAux_DER;
    }
    let arrayCodigo = [];
    this.trabajadoreSeleccionados.forEach(e=>{
      arrayCodigo.push(e.codigo);
    });
    this.loading=true;

    let item = new Credenciales();
    let credenciales: string;
    credenciales = sessionStorage.getItem('credenciales');
    item  = JSON.parse(credenciales);

    this.service.guaradarPersonal(arrayCodigo, this.selectedEmpresa.codigo, this.codigoOficina, this.selectedActividad.codigo, item.usuario).subscribe(
      (response: Response) => {
        if (response.estado == 'OK') {
          this.toastr.success('Se ha registrado correctamente', 'Acción Completada', { closeButton: true });
          this.OnCambioActividad();
          this.loading=false;
        }
        else
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      },
      (error)=>this.controlarError(error)
    );
  }
  OnBuscarOrigen(){
    if(this.texto_bool_IZQ){
      this.trabajadores = this.trabajadoresAux_IZQ;
      this.trabajadoresAux_IZQ = new Array<Trabajador>();
    }
    this.listaIndicesAgregar= new Array<number>();
    this.trabajadoresAgregar = new Array<Trabajador>();
    if (this.textoSSeleccion == '') {
      if (this.trabajadoresAux_IZQ && this.trabajadoresAux_IZQ.length > 0)
        this.trabajadores = this.trabajadoresAux_IZQ;
      this.trabajadoresAux_IZQ= new Array<Trabajador>();
      this.texto_bool_IZQ=false;
      return;
    }
    let re : RegExp;
    re = new RegExp(`${this.textoSSeleccion}`,`i`);
    this.trabajadores.forEach(e=>{
      if(e.nombreCompleto.search(re)!=-1){
        this.trabajadoresAux_IZQ.push(e);
      }
    });
    let arrayX = this.trabajadores.map(obj => ({...obj}));
    if(this.trabajadoresAux_IZQ.length==0)
      this.trabajadores=new Array<Trabajador>();
    else{
      this.trabajadores = this.trabajadoresAux_IZQ;
      this.texto_bool_IZQ=true;
    }
    this.trabajadoresAux_IZQ= arrayX;
  }
  OnBuscarSeleccion(){
    if(this.texto_bool_DER){
      this.trabajadoreSeleccionados = this.trabajadoresAux_DER;
      this.trabajadoresAux_DER = new Array<Trabajador>();
    }
    this.listaIndicesQuitar = new Array<number>();
    this.trabajadoresQuitar = new Array<Trabajador>();
    if (this.textoCSelecccin == '') {
      if (this.trabajadoresAux_DER && this.trabajadoresAux_DER.length > 0)
        this.trabajadoreSeleccionados = this.trabajadoresAux_DER;
      this.trabajadoresAux_DER= new Array<Trabajador>();
      this.texto_bool_DER=false;
      return;
    }
    let re : RegExp;
    re = new RegExp(`${this.textoCSelecccin}`,`i`);
    this.trabajadoreSeleccionados.forEach(e=>{
      if(e.nombreCompleto.search(re)!=-1){
        this.trabajadoresAux_DER.push(e);
      }
    });
    let arrayX = this.trabajadoreSeleccionados.map(obj => ({...obj}));
    if(this.trabajadoresAux_DER.length==0)
      this.trabajadoreSeleccionados=new Array<Trabajador>();
    else{
      this.trabajadoreSeleccionados = this.trabajadoresAux_DER;
      this.texto_bool_DER = true;
    }
    this.trabajadoresAux_DER= arrayX;
  }

  OnConfigurarBusqueda_IZQ() {
    this.buscar_IZQ.nativeElement.maxLength = 100;
    this.buscar_IZQ.nativeElement.onkeypress = (e) => {
    (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122);
      if (e.charCode == 13) {
        this.OnBuscarOrigen()
      }
    }
  }
  OnConfigurarBusqueda_DER() {
    this.buscar_DER.nativeElement.maxLength = 100;
    this.buscar_DER.nativeElement.onkeypress = (e) => {
    (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122);
      if (e.charCode == 13) {
        this.OnBuscarSeleccion()
      }
    };

  }
}
