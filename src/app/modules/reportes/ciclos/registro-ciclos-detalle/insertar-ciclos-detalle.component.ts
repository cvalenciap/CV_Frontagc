import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CiclosDetalle, Actividad,Response } from 'src/app/models';
import { AccionCiclo } from 'src/app/models/enums';
import { CicloDetalleRequest } from 'src/app/models/request/ciclo-detalle-request';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../../../../app/services/impl/perfil.service';
import { CicloService } from '../../../../services/impl/ciclo.service';
@Component({
    selector: 'app-insertar-ciclos-detalles',
    templateUrl: './insertar-ciclos-detalle.component.html',
    styleUrls: ['./insertar-ciclos-detalle.component.scss']
  })

export class InsertarCiclosDetallesComponent implements OnInit {
    [x: string]: any;
    @Input()
    parametrosCiclo: any;
    listaActividad: Actividad = new Actividad();
    itemsDetalle: CiclosDetalle[];
    idCiclo: number;
    acciones: AccionCiclo;
    actividad: String;
    accionesType = AccionCiclo;
    accionesKeys = [];
    @Output()
    emisor: EventEmitter<any> = new EventEmitter();
    constructor(private toastr: ToastrService,
      private perfil: PerfilService,
      private cicloService: CicloService) {}

    ngOnInit() {
        this.parametrosCiclo = JSON.parse(this.parametrosCiclo);
        this.itemsDetalle = this.parametrosCiclo.itemsDetalle.length >0?this.parametrosCiclo.itemsDetalle:[];
        this.idCiclo = this.parametrosCiclo.idCiclo;
        this.listaActividad = this.parametrosCiclo.itemActividad;
        this.actividad='';
        this.accionesKeys = Object.keys(this.accionesType);
        this.acciones = AccionCiclo.LRC;
    }
    onCancel() {
        this.emisor.emit();
      }
    
    onCrear(){
      const request = new CicloDetalleRequest();
      request.n_idciclo = this.idCiclo;
      request.v_idacti = this.actividad;
      request.v_idaccion = this.acciones;
      request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
      this.cicloService.registrarCicloDetalle(request).subscribe(
        (response: Response) => {
          this.itemsDetalle = (response.resultado);
          this.toastr.success('Confirmación', 'Registros agregados correctamente', {closeButton: true});        
        },
        (error) => this.controlarError(error)
      );
     // this.emisor.emit();
    }

    OnEliminar(i){
       const request = new CicloDetalleRequest();
       request.n_idciclo = this.itemsDetalle[i].n_idciclo;
       request.n_idciclodet = this.itemsDetalle[i].n_idciclodet;
       request.a_v_usumod = this.perfil.obtenerUsuarioLogin();
       this.cicloService.eliminarCicloDetalle(request).subscribe(
         (response: Response) => {
           this.itemsDetalle = (response.resultado);
           this.toastr.success('Confirmación', 'Se eliminó el registro', {closeButton: true});        
         },
         (error) => this.controlarError(error)
       );
      // this.emisor.emit();

      
    }

    controlarError(err) {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
      if (this.loading) { this.loading = false; }
    }


}