import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { Parametro, Response } from '../../../models';
import { RequestParametro } from '../../../models/request/request-parametro';
import { ResponseParametro } from '../../../models/response/response-parametro';
import { ParametrosService } from '../../../services/impl/parametros.service';
import { Estado } from '../../../models/enums';
import {validate} from 'class-validator';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { Credenciales } from 'src/app/models/credenciales';

@Component({
  selector: 'parametros-editar',
  templateUrl: 'editar.template.html'
})
export class ParametrosEditarComponent {
    enable : boolean;
    requestParam: RequestParametro =new RequestParametro;
    itemParamCodigo: number;
    itemTipoCodigo: number;
    itemTipo: Parametro = new Parametro;
    itemParam: Parametro = new Parametro;
    text: string;
    item: Parametro=new Parametro;
    location: Location;
    private sub: any;
    /* validacion */
    invalid: boolean;
    errors: any;
    
  constructor(private parametrosService:ParametrosService,
              private route: ActivatedRoute,
              private router: Router,
              private localeService: BsLocaleService, 
              private toastr: ToastrService,
              location: Location) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.location = location;
    this.itemParam.detalle="";
    this.itemParam.descripcionCorta="";
    this.itemParam.valor="";
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.itemTipoCodigo = +params['codigo'];  
      this.itemParamCodigo= +params['codigoParam'];
      if(!this.itemParamCodigo)
        this.text = "almacenado";
      this.obtenerTipoParametro();
      this.text = "modificado";
    });
  }
  obtenerTipoParametro(){
    this.requestParam.codigo = this.itemTipoCodigo;
    this.parametrosService.obtenerTipoParametro(this.requestParam).subscribe(
      (response: ResponseParametro)=>{
        Object.assign(this.itemTipo, response.resultado[0]);
        if(this.itemParamCodigo)
          this. obtenerParametro(); 
        else  
          this.enable = true;
      },
      (error)=>this.controlarError(error) 
    );
  }
  obtenerParametro(){
    this.requestParam.codigo = this.itemParamCodigo;
    this.requestParam.tipo = this.itemTipoCodigo;
    this.parametrosService.obtenerParametro(this.requestParam).subscribe(
      (response:ResponseParametro)=>{      
        Object.assign(this.itemParam, response.resultado[0]);
        this.enable = (this.itemParam.estado==Estado.ACTIVO)?true:false;
      },
      (error)=> this.controlarError(error)
    );
  }
  OnGuardar(){
    this.requestParam.detalle=this.itemParam.detalle;
    this.requestParam.descripcionCorta=this.itemParam.descripcionCorta;
    this.requestParam.estado=this.enable?Estado.ACTIVO:Estado.INACTIVO;
    this.requestParam.valor=this.itemParam.valor;
    this.requestParam.tipo=this.itemTipoCodigo;
    this.requestParam.codigo=this.itemParamCodigo;

    this.errors = {};
    validate(this.itemParam).then(errors => {
      if (errors.length > 0) {
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });        
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.error(`Los siguientes campos no son válidos: ${mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
      } else {
        let item = new Credenciales();
        let  credenciales : string;
        credenciales = sessionStorage.getItem("credenciales");
        item  = JSON.parse(credenciales);
        this.requestParam.usuario = item.usuario;        
        if(this.itemParamCodigo){
         this.parametrosService.modificarParametro(this.requestParam).subscribe((
           (response:Response)=>{
              if(response.estado=="OK")
                {
                  this.toastr.success("Se registraron correctamente los datos", "Confirmación", { closeButton: true});
                  this.location.back();
                }
              else
                this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
           }
         ),
         (error)=>this.controlarError(error)); 
        }else{
          this.parametrosService.nuevoParametro(this.requestParam).subscribe((
            (response:Response)=>{
              if(response.estado=="OK")
                {
                this.toastr.success("Se registraron correctamente los datos", "Confirmación", { closeButton: true});
                this.location.back();
                }
              else
                this.toastr.warning(response.error.mensaje, 'Aviso', {closeButton: true});
            }
         ),
         (error)=>this.controlarError(error)); 
        }
      }
    });
  }
  showSuccess() {
    this.toastr.success('Registro '+this.text, 'Acción completada', {closeButton: true});
    this.router.navigate([`/mantenimiento/tipos-parametros/editar/`+this.itemTipoCodigo]);
  }
  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  Validar(event: string) {
    validate(this.itemParam).then( errors => {
      this.errors = {};
      this.invalid = errors.length > 0;
      if (errors.length > 0) {
        errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
        });
      }
    });
  }
}
