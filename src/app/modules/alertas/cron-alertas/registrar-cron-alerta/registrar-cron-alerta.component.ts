import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Crontab, Alerta, AlertasQuerie, Response, ParametrosCargaBandeja, AlertasTemplate} from 'src/app/models';
import { AlertasMonitoreoService } from '../../../../services/impl/alertas.monitoreo.service';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../../../environments/environment';
import {DigitalizadoService} from "../../../../services/impl/digitalizado.service";
import {MonitoreoService} from "../../../../services/impl/monitoreo.service";
import {FrecAlerta} from "../../../../models/FrecAlerta";


@Component({
    selector: 'app-registrar-cron-alerta',
    templateUrl: './registrar-cron-alerta.component.html',
    styleUrls: ['./registrar-cron-alerta.component.scss']
  })

  export class RegistrarCronAlertaComponent implements OnInit {
    nuevoCrontab: Crontab;
    minutos: string;
    horas: string;
    periodo: string;
    //Elección cada dos horas inicio
    minutosInicio: string;
    horasInicio: string;
    periodoInicio: string;
  //Elección cada dos horas fin
    minutosFin: string;
    horasFin: string;
    periodoFin: string;
    dias: string[];
    personalizado: string;
    listaHoras: string[];
    listaMinutos: string[];
    listaTiempo: string[];
    listaDias: any[];
    listaPersonalizada: any[];
    radioEleccion: string;
    idTemplate:Array<String> = ["1","2","3"];
    cronTabList: Array<Crontab> = new Array<Crontab>();
    listAlerta: Array<Alerta> = new Array<Alerta>();
    listAlertaQueries: Array<AlertasQuerie> = new Array<AlertasQuerie>();
    tipoAlerta: number;
    tipoTemplate: number;
    tipo: number = 2;
    @Output()
    emisor: EventEmitter<any> = new EventEmitter();
    @Output()
    emisorItems: EventEmitter<Array<Crontab>> = new EventEmitter();
    listaFrecAlerta: FrecAlerta;
    totalPeriodo: number;


      constructor(private toastr:ToastrService,
        private alertasMonitoreoService:AlertasMonitoreoService,
                  private monitoreoService:MonitoreoService) {}

      ngOnInit() {
        this.obtenerAlerta();
        this.minutos = '';
        this.horas = '';
        this.tipoAlerta = 1;
        this.listaHoras = ["1","2","3","4","5","6","7","8","9","10","11","12"];
        this.listaMinutos = ["00","01","02","03","04","05","06","07","08","09","10",
        "11","12","13","14","15","16","17","18","19","20","21","22","23","24","25",
        "26","27","28","29","30","31","32","33","34","35","36","37","38","39","40",
        "41","42","43","44","45","46","47","48","49","50","51","52","53","54","55",
        "56","57","58","59"];
        this.listaTiempo = ["AM","PM"];
        this.listaDias = [
          { id: 0, name: 'Domingo' },
          { id: 1, name: 'Lunes' },
          { id: 2, name: 'Martes' },
          { id: 3, name: 'Miércoles' },
          { id: 4, name: 'Jueves' },
          { id: 5, name: 'Viernes' },
          { id: 6, name: 'Sábado' }];
        this.radioEleccion = '';
        this.obtenerAlertaQueries();
        this.listaFrecAlerta =JSON.parse(sessionStorage.getItem('listaAlertaFrecuencia'));
        console.log(this.listaFrecAlerta);
        this.totalPeriodo = 0;
      }

      onRegistrarCron(){
        const this_=this;
        let valorPersonalizado = '';

        if(this.periodo === 'PM'){
          switch(this.horas) {
            case '1': {
              this.horas = '13';
             break;
            }
            case '2': {
              this.horas = '14';
             break;
            }
            case '3': {
              this.horas = '15';
             break;
            }
            case '4': {
              this.horas = '16';
             break;
            }
            case '5': {
              this.horas = '17';
             break;
            }
            case '6': {
              this.horas = '18';
             break;
            }
            case '7': {
              this.horas = '19';
             break;
            }
            case '8': {
              this.horas = '20';
             break;
            }
            case '9': {
              this.horas = '21';
             break;
            }
            case '10': {
              this.horas = '22';
             break;
            }
            case '11': {
              this.horas = '23';
             break;
            }
            default: {
              this.horas = '12';
             break;
            }
         }
        }

        if(this.radioEleccion==='2'){

          if(this.periodoInicio === 'PM'){
            switch(this.horasInicio) {
              case '1': {
                this.horasInicio = '13';
                break;
              }
              case '2': {
                this.horasInicio = '14';
                break;
              }
              case '3': {
                this.horasInicio = '15';
                break;
              }
              case '4': {
                this.horasInicio = '16';
                break;
              }
              case '5': {
                this.horasInicio = '17';
                break;
              }
              case '6': {
                this.horasInicio = '18';
                break;
              }
              case '7': {
                this.horasInicio = '19';
                break;
              }
              case '8': {
                this.horasInicio = '20';
                break;
              }
              case '9': {
                this.horasInicio = '21';
                break;
              }
              case '10': {
                this.horasInicio = '22';
                break;
              }
              case '11': {
                this.horasInicio = '23';
                break;
              }
              default: {
                this.horasInicio = '12';
                break;
              }
            }
          }

          if(this.periodoFin === 'PM'){
            switch(this.horasFin) {
              case '1': {
                this.horasFin = '13';
                break;
              }
              case '2': {
                this.horasFin = '14';
                break;
              }
              case '3': {
                this.horasFin = '15';
                break;
              }
              case '4': {
                this.horasFin = '16';
                break;
              }
              case '5': {
                this.horasFin = '17';
                break;
              }
              case '6': {
                this.horasFin = '18';
                break;
              }
              case '7': {
                this.horasFin = '19';
                break;
              }
              case '8': {
                this.horasFin = '20';
                break;
              }
              case '9': {
                this.horasFin = '21';
                break;
              }
              case '10': {
                this.horasFin = '22';
                break;
              }
              case '11': {
                this.horasFin = '23';
                break;
              }
              default: {
                this.horasFin = '12';
                break;
              }
            }
          }

          this.totalPeriodo = (Number(this.horasFin) - Number(this.horasInicio))/Number(this.personalizado);
          valorPersonalizado = this.horasInicio+'-'+this.horasFin+'/'+this.personalizado;
          this.alertasMonitoreoService.editarPeriodoAlerta(this.totalPeriodo).subscribe();

        }

        let minuto = this.minutos===''?this.minutosInicio:this.minutos;
        console.log(minuto);
        let hora = this.horas===''?valorPersonalizado:this.horas;
        console.log(hora);
        let v_v_cron_tiempo= minuto + ' ' + hora +' * * '+ this.dias.toString();

        console.log(v_v_cron_tiempo);

        for(let i=0;i<this.listAlertaQueries.length;i++){
            this.nuevoCrontab =  new Crontab();
            this.nuevoCrontab.minute= minuto;
            this.nuevoCrontab.hour= hora;
            this.nuevoCrontab.dayofmonth="*";
            this.nuevoCrontab.month="*";
            this.nuevoCrontab.dayofweek=this.dias.toString();
            this.nuevoCrontab.v_url=environment.serviceEndpoint+"/api/lanza_alertas?n_sec_template=" + this.listAlertaQueries[i].n_sec_queries;
            this.nuevoCrontab.n_sec_template= Number(this.listAlertaQueries[i].n_sec_queries);
            this.nuevoCrontab.v_cron_tiempo=v_v_cron_tiempo;
            this.nuevoCrontab.v_editable=0;

            this.cronTabList.push(this.nuevoCrontab);
        }

        this.emisorItems.emit(this.cronTabList);
        this.emisor.emit();

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
            console.log(this_.listAlertaQueries);

          },
          (error) => this.controlarError(error)
        );
    }

    chackAccion($event){
        this.radioEleccion = $event.target.value;
    }
  }
