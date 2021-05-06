import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { AlertasMonitoreoService } from '../../../services/impl/alertas.monitoreo.service';
import { Response, Alerta, AlertasQuerie, AlertasTemplate} from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AlertaTemplateRequest } from 'src/app/models/request/alerta-template-request';
import { PerfilService } from 'src/app/services/impl/perfil.service';
@Component({
    selector: 'app-alerta-template',
    templateUrl: './alerta-template.component.html',
    styleUrls: ['./alerta-template.component.scss']
  })

  export class AlertaTemplateComponent implements OnInit {
     
    @Input()
    items: Array<AlertasTemplate> = new Array<AlertasTemplate>();
    nuevoTemplate: AlertasTemplate;
    listAlerta: Array<Alerta> = new Array<Alerta>();
    listAlertaQueries: Array<AlertasQuerie> = new Array<AlertasQuerie>();
    loading: boolean;
    isLoading: boolean = false;
    editarEstado: boolean = false;
    tipoAlerta: number;
    tipoTemplate: number;
    nombreTemplate: String;
    contenidoTemplate: String;
    tipo: number=1;
    @ViewChild('registrar') registrarModal: SwalComponent;
    constructor(
        private alertasMonitoreoService:AlertasMonitoreoService, 
        private toastr:ToastrService,
        private perfil: PerfilService) {

         }
    ngOnInit() {
       this.obtenerAlertaTemplate();
       this.obtenerAlerta();

    }

    onCancelRegistrar() {
      this.registrarModal.nativeSwal.close();
    }
    controlarError(err) {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }
    obtenerAlertaTemplate(){
        const this_ = this;
        this.isLoading = true;
        this.alertasMonitoreoService.obtenerAlertasTemplate().subscribe(
          (response: any) => {
            this_.items = response.resultado;
            this_.isLoading = false;
          },
          (error) => this.controlarError(error)
        );
        this.suscribirLoading();
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
      this.alertasMonitoreoService.obtenerAlertasQuerie(this.tipoAlerta,this.tipo).subscribe(
        (response: any) => {
          this_.listAlertaQueries = response.resultado;
        },
        (error) => this.controlarError(error)
      );
    }
    OnEditar(i){
      this.editarEstado = true;
      this.items[i].v_editable = 1;
      this.nombreTemplate = this.items[i].v_nom_template;
      this.contenidoTemplate = this.items[i].v_con_template_ca;
    }

    OnCancel(i) {
      this.editarEstado = false;
      this.items[i].v_editable = null;
      this.items[i].v_nom_template = this.nombreTemplate;
      this.items[i].v_con_template_ca = this.contenidoTemplate;
    }

    OnUpdate(i){
      const this_ = this;
      this.isLoading = true;
      const request = new AlertaTemplateRequest();
      request.n_sec_template = this.items[i].n_sec_template;
      request.v_nom_template = this.nombreTemplate;
      request.v_con_template_ca = this.contenidoTemplate;
      request.a_v_usumod = this.perfil.obtenerUsuarioLogin();

      this.alertasMonitoreoService.editarAlertaTemplate(request).subscribe(
        (response: Response) => {
          this_.items = response.resultado;
          this_.isLoading = false;
          this.editarEstado = false;
          this.toastr.success('Confirmación', 'Registro actualizado correctamente', {closeButton: true});        
        },
        (error) => this.controlarError(error)
      );

      this.suscribirLoading();
    }

    OnEliminar(i){
      const this_ = this;
      this.isLoading = true;
      const request = new AlertaTemplateRequest();
      request.n_sec_template = this.items[i].n_sec_template;

      this.alertasMonitoreoService.eliminarAlertaTemplate(request).subscribe(
        (response: Response) => {
          this_.items = response.resultado;
          this_.isLoading = false;
          this.toastr.success('Confirmación', 'Registro eliminado correctamente', {closeButton: true});        
        },
        (error) => this.controlarError(error)
      );

      this.suscribirLoading();
    }

    private suscribirLoading(): void {
      this.alertasMonitoreoService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
    }

    listarItems(event) {
      this.items = event;
    }
  }