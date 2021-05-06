import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { Parametro,Paginacion,Response } from '../../../models';
import { RequestParametro } from '../../../models/request/request-parametro';
import { ResponseParametro } from '../../../models/response/response-parametro';
import { ParametrosService } from '../../../services/impl/parametros.service';
import { Estado } from 'src/app/models/enums/estado';
import { Credenciales } from 'src/app/models/credenciales';
import { formatDate } from '@angular/common';
import { looseIdentical } from '@angular/core/src/util';

@Component({
  selector: 'parametros-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss']
})
export class ParametrosListaComponent implements OnInit {

  items: Parametro[] = new Array<Parametro>();
  selectedRow: number;
  loading: boolean;
  item : Parametro;
  detalle:string;
  private sub: any;
  paginacion : Paginacion;
  requestParam: RequestParametro =new RequestParametro;
  constructor(private parametrosService:ParametrosService,
              private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private router:Router, 
              private toastr: ToastrService) {
    this.loading = false;
    this.paginacion = new Paginacion({registros: 10,pagina:1});
    this.selectedRow = -1;
  }
  ngOnInit() {
//inicio
let textoBusqueda = localStorage.getItem("textoBusqueda");
let parametroBusq = localStorage.getItem("parametroBusqueda");
if(textoBusqueda!=null && parametroBusq!=null){
  localStorage.setItem("texfinal",textoBusqueda);
  localStorage.setItem("paraFinal",parametroBusq);
  //eliminar Variables
  localStorage.removeItem("textoBusqueda");
  localStorage.removeItem("parametroBusqueda");
}
// Fin 
    this.sub = this.route.params.subscribe(params => {
      this.requestParam.codigo = +params['codigo'];
      
      if(this.requestParam.codigo){
        this.obtenerParametro();
      }
    });
  }
  initValues(){
    this.requestParam.tipo = this.requestParam.codigo;
    this.requestParam.codigo=0;
    this.requestParam.detalle='G';
    this.requestParam.descripcionCorta='G'
    this.requestParam.estado='G';
    this.requestParam.valor= 'G';
  }
  getParametros(){
    this.loading = true;
    this.parametrosService.consultarParametros(this.requestParam
                                                  ,this.paginacion.pagina
                                                  ,this.paginacion.registros)
      .subscribe((data:ResponseParametro)=>{
          this.loading = false;
          this.items = data.resultado;
          this.paginacion = data.paginacion;
        },
        (error) => this.controlarError(error)
       );
  }
  obtenerParametro(){
    this.parametrosService.obtenerTipoParametro(this.requestParam).subscribe(
      (response: ResponseParametro)=>{
        this.item = response.resultado[0];
        this.detalle=this.item.detalle;
        this.initValues();
        this.getParametros();
      },
      (error)=>this.controlarError(error)
    );
  }

  selectRow(index): void {
    this.selectedRow = index;
  }

  search(): void {
    this.loading = true;
  }
  showError() {
    this.toastr.error('Registro eliminado', 'Acción completada', {closeButton: true});
  }
  OnEditar(i:number){
    let url = `mantenimiento/tipos-parametros/editar/`+this.requestParam.tipo+`/`+this.items[i].codigo;
    this.router.navigate([url]);
  }
  OnNuevo(){
    let url = `mantenimiento/tipos-parametros/editar/`+this.requestParam.tipo+`/nuevo`;
    this.router.navigate([url]);
  }
  OnEliminar(i:number){
    this.requestParam.codigo=this.items[i].codigo;

    let item = new Credenciales();
    let  credenciales : string;
    credenciales = sessionStorage.getItem("credenciales");
    item  = JSON.parse(credenciales);
    this.requestParam.usuario = item.usuario;
    
    this.parametrosService.eliminarParametro(this.requestParam).subscribe(
      (response: Response)=>{
        if(response.estado=='OK'){          
          this.toastr.success('Registro eliminado', 'Acción completada', {closeButton: true});
          this.items[i].estado = Estado.INACTIVO;
          this.items[i].usuarioModificacion = item.usuario;
          this.items[i].fechaModificacion = formatDate(new Date(), 'dd/MM/yyyy H:mm:ss', 'es-PE');
        }else
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      },
      (error)=>this.controlarError(error)
    );
    
  }
  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getParametros();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getParametros();
  }
  OnRegresar(){
    let url = `mantenimiento/tipos-parametros`;
    this.router.navigate([url]);
  }
}
