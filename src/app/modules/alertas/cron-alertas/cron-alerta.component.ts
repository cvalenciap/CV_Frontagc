import { Component, OnInit, ViewChild} from '@angular/core';
import { AlertasMonitoreoService } from '../../../services/impl/alertas.monitoreo.service';
import {Response, Crontab, AlertasTemplate, ParametrosCargaBandeja} from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { DigitalizadoService } from '../../../services/impl/digitalizado.service';

@Component({
    selector: 'app-cron-alerta',
    templateUrl: './cron-alerta.component.html',
    styleUrls: ['./cron-alerta.component.scss']
  })

  export class CronAlertaComponent implements OnInit {
    cron: string;
    cronTabList: Array<Crontab> = new Array<Crontab>();
    nuevoCrontab: Crontab;
    listaDiaMes: Array<String> = new Array<String>();
    listaMes: Array<String> = new Array<String>();
    listaDiaSemana: Array<String> = new Array<String>();
    items: Array<AlertasTemplate> = new Array<AlertasTemplate>();
    alerta: Array<AlertasTemplate> = new Array<AlertasTemplate>();
    cadenaDiasMes: string;
    cadenaDiasSemana: string;
    cadenaMes: string;
    minute: string;
    hour: string;
    listaEnvio: Array<string> = new Array<string>();
    editando: boolean = false;
    isLoading: boolean = false;
    public listaParametros: ParametrosCargaBandeja;
    @ViewChild('registrar') registrarModal: SwalComponent;
    constructor(private alertasMonitoreoService:AlertasMonitoreoService,
                private toastr:ToastrService) { }
    ngOnInit() {
      this.obtenerAlertaTemplate();
      this.parametros();
    }
    obtenerCrontab(){
        const this_ = this;
        this.alertasMonitoreoService.obtenerCrontab().subscribe(
          (response: any) => {
            this_.armaLista(response);
          },
          (error) => this.controlarError(error)
        );
    }

    controlarError(err) {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    obtenerAlertaTemplate(){
        this.isLoading = true;
        this.alertasMonitoreoService.obtenerAlertasTemplate().subscribe(
          (response: any) => {
            this.items = response.resultado;
            this.isLoading = false;
            this.obtenerCrontab();
          },
          (error) => this.controlarError(error)
        );
        this.suscribirLoading();
    }

    dayOfWeekAsString(dayIndex) {
        return ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][dayIndex] || '';
    }

    hourLater(hour){
        let hora='';
        switch(hour) {
            case '13': {
               hora = '1';
             break;
            }
            case '14': {
                hora = '2';
             break;
            }
            case '15': {
                hora = '3';
             break;
            }
            case '16': {
                hora = '4';
             break;
            }
            case '17': {
                hora = '5';
             break;
            }
            case '18': {
                hora = '6';
             break;
            }
            case '19': {
                hora = '7';
             break;
            }
            case '20': {
                hora = '8';
             break;
            }
            case '21': {
                hora = '9';
             break;
            }
            case '22': {
                hora = '10';
             break;
            }
            case '23': {
                hora = '11';
             break;
            }
            default: {
                hora = '12';
             break;
            }
         }

         return hora;
    }

    armaLista(cadena: String[]) {
            let mensajeTiempo = '';
            let nombreDias = [];
            let dias = '';
        for(let e=0;e<=cadena.length-1; e++) {
            this.nuevoCrontab =  new Crontab();
            let x = cadena[e].split(' ');
            let ucadena = x[x.length-1];
            let v_u_cadena = ucadena.split('=');

            let v_v_n_sec_template = v_u_cadena[1];
            if(v_v_n_sec_template){
                this.alerta = this.items.filter(item => item.n_sec_template === Number(v_v_n_sec_template));
            }

            let v_v_url=v_u_cadena[0];
            let v_v_cron_tiempo= x[0] + ' ' + x[1];
            if(x[0]!='' && x[0] != "#"){

                if(x[1]==='*/2'){
                    mensajeTiempo = 'Esta alerta se activará cada dos horas';
                }else{
                    let zona= Number(x[1])>=12?' PM</b>':' AM</b>';
                    let horaExacta = Number(x[1])>=12?this.hourLater(x[1]):x[1];
                    mensajeTiempo = 'Esta alerta se activará a la(s) <b>'+ horaExacta +':'+x[0]+''+ zona;
                }

                let list = x[4].split(',');
                if(list.length>2){
                    for(let i=0;i<list.length;i++){
                        nombreDias.push(this.dayOfWeekAsString(list[i]));
                    }

                dias=nombreDias.toString();

                mensajeTiempo = mensajeTiempo + ' en el o lo(s) día(s) correspondiente(s): <b>'+ dias +'</b>';

                nombreDias = [];
                }else{
                    dias = this.dayOfWeekAsString(x[4]);
                    mensajeTiempo = mensajeTiempo + ' en el o lo(s) día(s) correspondiente(s): <b>'+ dias +'</b>';
                    nombreDias = [];
                }

                this.nuevoCrontab.minute=x[0];
                this.nuevoCrontab.hour=x[1];
                this.nuevoCrontab.dayofmonth=x[2];
                this.nuevoCrontab.month=x[3];
                this.nuevoCrontab.dayofweek=x[4];
                this.nuevoCrontab.v_url=v_v_url+'='+v_v_n_sec_template;
                this.nuevoCrontab.n_sec_template=Number(v_v_n_sec_template);
                this.nuevoCrontab.v_cron_tiempo=v_v_cron_tiempo+ ' * * '+x[4];
                this.nuevoCrontab.v_editable=0;
                this.nuevoCrontab.v_description = this.alerta[0].v_nom_template;
                this.nuevoCrontab.v_detalle_tiempo = mensajeTiempo;
                this.cronTabList.push(this.nuevoCrontab);
            }
        }
    }

    parametros(){
        this.listaDiaMes.push("*");
        this.listaDiaSemana.push("*");
        this.listaMes.push("*");
        for(let e=1;e<=31;e++){
            this.listaDiaMes.push(e.toString());
        }
        for(let e=1;e<=7;e++){
            this.listaDiaSemana.push(e.toString());
        }
        for(let e=1;e<=12;e++){
            this.listaMes.push(e.toString());
        }
    }

    onChangeDiasMes(){
       // console.log(this.cadenaDiasMes);
        if(this.cadenaDiasMes.includes("*")) {
            this.cadenaDiasMes = "*";
            //console.log("aqui");
        }
        this.editando = true;

    }
    OnEditar(index: number){
        this.cronTabList[index].v_editable = 1;
        this.minute = this.cronTabList[index].minute;
        this.hour = this.cronTabList[index].hour;
        this.editando = true;
    }
    OnCancel(index: number) {
        this.cronTabList[index].v_editable = 0;
        this.minute = this.cronTabList[index].minute;
        this.hour = this.cronTabList[index].hour;
        this.editando = false;
    }
    OnUpdate(index: number){
        const this_=this;
        this.cronTabList[index].minute=this.minute;
        this.cronTabList[index].hour=this.hour;
        this.cronTabList[index].v_cron_tiempo=this.minute+' '+this.hour + ' * * *';
        const cronAlerta: Map<string, any> = new Map();
        cronAlerta.set("data", this.cronTabList);

      this.alertasMonitoreoService.registrarAlertas(cronAlerta).subscribe(
            (response: Response) => {
                this_.cronTabList[index].v_editable = 0;
                this_.editando = false;
                this_.toastr.success('Confirmación', 'Se actualizó el registro satisfactoriamente');
                this_.cronTabList=[];
                this_.listaEnvio=[];
                this_.minute=null;
                this_.hour=null;
                this_.obtenerCrontab();
            },
            (error) => this.controlarError(error)
          );
    }

    OnEliminar (index: number){
        const this_=this;
        this.cronTabList.splice(
            this.cronTabList.indexOf(this.cronTabList[index]), 1
          );
          const cronAlerta: Map<string, any> = new Map();
          cronAlerta.set("data", this.cronTabList);

        this.alertasMonitoreoService.registrarAlertas(cronAlerta).subscribe(
              (response: Response) => {
                  this_.editando = false;
                  this_.toastr.success('Confirmación', 'Se eliminó correctamente');
                  this_.cronTabList=[];
                  this_.listaEnvio=[];
                  this_.minute=null;
                  this_.hour=null;
                  this_.obtenerCrontab();
              },
              (error) => this.controlarError(error)
            );

    }
    listarItems(event) {
        const this_=this;
        for(let i=0;i<event.length;i++){
            this.cronTabList.push(event[i]);
        }
        const cronAlerta: Map<string, any> = new Map();
        cronAlerta.set("data", this.cronTabList);
      this.alertasMonitoreoService.registrarAlertas(cronAlerta).subscribe(
            (response: Response) => {
                this_.editando = false;
                this_.toastr.success('Confirmación', 'Se actualizó el registro satisfactoriamente');
                this_.cronTabList=[];
                this_.listaEnvio=[];
                this_.minute=null;
                this_.hour=null;
                this_.obtenerCrontab();
            },
            (error) => this.controlarError(error)
          );

      }

    private suscribirLoading(): void {
        this.alertasMonitoreoService.isLoading$.subscribe(isLoad => this.isLoading = isLoad);
    }

    onCancelRegistrar() {
        this.registrarModal.nativeSwal.close();
    }
}
