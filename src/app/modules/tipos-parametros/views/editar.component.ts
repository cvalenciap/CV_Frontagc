import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Parametro, Response } from '../../../models';
import { RequestParametro } from '../../../models/request/request-parametro';
import { ResponseParametro } from '../../../models/response/response-parametro';
import { ParametrosService } from '../../../services/impl/parametros.service';
import { Estado } from 'src/app/models/enums';
import { validate } from 'class-validator';
import { Credenciales } from 'src/app/models/credenciales';


@Component({
  selector: 'tipos-parametros-editar',
  templateUrl: 'editar.template.html'
})
export class TiposParametrosEditarComponent {
  enable: boolean;
  private sub: any;
  location: Location;
  item: Parametro = new Parametro;
  text: string;
  requestParam: RequestParametro = new RequestParametro;
  /* validacion */
  invalid: boolean;
  errors: any;
  constructor(private parametrosService: ParametrosService,
    private router: Router,
    private route: ActivatedRoute,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    location: Location) {

    defineLocale('es', esLocale);
    this.location = location;
    this.localeService.use('es');
    this.text = "modificado";
    this.item.detalle = "";
  }
  ngOnInit() {
    //inicio
    let textoBusqueda = localStorage.getItem("textoBusqueda");
    let parametroBusq = localStorage.getItem("parametroBusqueda");
    if(textoBusqueda!=null && parametroBusq!=null){
      localStorage.setItem("texfinal", textoBusqueda);
      localStorage.setItem("paraFinal", parametroBusq);
      //eliminar Variables
      localStorage.removeItem("textoBusqueda");
      localStorage.removeItem("parametroBusqueda");
    }
    //Fin 

    this.sub = this.route.params.subscribe(params => {
      this.requestParam.codigo = +params['codigo'];
      if (this.requestParam.codigo) {
        this.obtenerParametro();
      } else {
        this.text = "almacenado";
      }
    });
  }
  obtenerParametro() {
    this.parametrosService.obtenerTipoParametro(this.requestParam).subscribe(
      (response: ResponseParametro) => {
        this.item = new Parametro();
        Object.assign(this.item, response.resultado[0]);
        this.enable = (this.item.estado == Estado.ACTIVO) ? true : false;
      }
    );
  }
  OnGuardar() {
    this.requestParam.detalle = this.item.detalle != null ? this.item.detalle.trim() : "";
    this.requestParam.estado = this.item.estado;
    this.item.descripcionCorta = " ";
    this.item.valor = " ";
    this.errors = {};
    validate(this.item).then(errors => {
      if (errors.length > 0) {
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.error(`Los siguientes campos no son válidos: ${mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
      } else {

        let item = new Credenciales();
        let credenciales: string;
        credenciales = sessionStorage.getItem("credenciales");
        item = JSON.parse(credenciales);
        this.requestParam.usuario = item.usuario;

        this.requestParam.estado = this.enable == true ? Estado.ACTIVO : Estado.INACTIVO;

        if (this.requestParam.codigo) {
          this.parametrosService.modificarTipoParametro(this.requestParam).subscribe((
            (response: Response) => {
              if (response.estado == "OK") {
                this.toastr.success("Se registraron correctamente los datos", "Confirmación", { closeButton: true });
                this.location.back();
              }
              else
                this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
            }
          ), (error) => this.controlarError(error));
        } else {
          this.parametrosService.nuevoTipoParametro(this.requestParam).subscribe((
            (response: Response) => {
              if (response.estado == "OK") {
                this.toastr.success("Se registraron correctamente los datos", "Confirmación", { closeButton: true });
                this.location.back();
              }
              else
                this.toastr.warning(response.error.mensaje, 'Aviso', { closeButton: true });
            }
          ),
            (error) => this.controlarError(error));
        }
      }
    });
  }

  showSuccess() {
    this.toastr.success('Registro ' + this.text, 'Acción completada!', { closeButton: true });
    this.router.navigate([`/mantenimiento/tipos-parametros`]);
  }
  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  Validar(event: string) {
    validate(this.item).then(errors => {
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
