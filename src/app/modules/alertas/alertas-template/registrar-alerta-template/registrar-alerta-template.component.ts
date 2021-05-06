import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AlertasMonitoreoService } from '../../../../services/impl/alertas.monitoreo.service';
import { Response, Alerta, AlertasQuerie, AlertasTemplate} from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { AlertaTemplateRequest } from 'src/app/models/request/alerta-template-request';
import { PerfilService } from 'src/app/services/impl/perfil.service';
@Component({
    selector: 'app-registrar-alerta-template',
    templateUrl: './registrar-alerta-template.component.html',
    styleUrls: ['./registrar-alerta-template.component.scss']
  })

  export class RegistrarAlertaTemplateComponent implements OnInit {
    [x: string]: any;
    listAlerta: Array<Alerta> = new Array<Alerta>();
    listAlertaQueries: Array<AlertasQuerie> = new Array<AlertasQuerie>();
    tipoAlerta: number;
    nombreTemplate: String;
    contenidoTemplate: String;
    tipoTemplate: number;
    tipo: number = 1;
    @Output()
    emisor: EventEmitter<any> = new EventEmitter();
    @Output()
    emisorItems: EventEmitter<Array<AlertasTemplate>> = new EventEmitter();
    
    constructor(
        private alertasMonitoreoService:AlertasMonitoreoService, 
        private toastr:ToastrService,
        private perfil: PerfilService) {}
  
      ngOnInit() {
          this.obtenerAlerta();
      }

      onCancel() {
        this.emisor.emit();
      }

      controlarError(err) {
        this.toastr.error('Se presentó un error inesperado en la última acción ', 'Error', { closeButton: true });
      }
      obtenerAlerta(){
        const this_ = this;
        this.alertasMonitoreoService.obtenerAlertas(this.tipo).subscribe(
          (response: any) => {
            this_.listAlerta = response.resultado;
          },
          (error) => this.controlarError(error)
        );
    }

    obtenerAlertaQueries(){
        const this_ = this;
        this.alertasMonitoreoService.obtenerAlertasQuerie(this.tipoAlerta, this.tipo).subscribe(
          (response: any) => {
            this_.listAlertaQueries = response.resultado;
          },
          (error) => this.controlarError(error)
        );
    }

    onCrear(){
        const request = new AlertaTemplateRequest();
        request.n_id_sec_queries = this.tipoTemplate;
        request.v_nom_template = this.nombreTemplate;
        request.v_con_template_ca = this.contenidoTemplate;
        request.a_v_usucre = this.perfil.obtenerUsuarioLogin();
        this.alertasMonitoreoService.registrarAlertaTemplate(request).subscribe(
          (response: Response) => {
            this.items = (response.resultado) as Array<AlertasTemplate>;
            this.emisorItems.emit(this.items);
            this.toastr.success('Confirmación', 'Registros agregados correctamente', {closeButton: true});        
          },
          (error) => this.controlarError(error)
        );
         this.emisor.emit();
    }

  }