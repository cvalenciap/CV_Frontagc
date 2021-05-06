import {Component, OnInit,Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import {RequestEmpresa} from '../../../models/request/request-empresa';

@Component({
  selector: 'buscar-empresa',
  templateUrl: 'buscar-empresa.template.html',
  styleUrls: ['buscar-empresa.component.scss']
})
export class BuscarEmpresaComponent implements OnInit {
  public requestEmpresa: RequestEmpresa;

  listaNano: string[];
  minFecha: Date;
  maxFecha: Date;
  datePipe = new DatePipe('en-US');
  @Input('bandeja')
  bandeja: string;
  estadoDocumento: String[];
  public tipos: any[] = [{codigo: 'S', descripcion: 'Sedapal'}, {codigo: 'C', descripcion: 'Contratista'}];
  public estados: any[] = [{codigo: 'A', descripcion: 'Activo'}, {codigo: 'I', descripcion: 'Inactivo'}];

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.requestEmpresa = new RequestEmpresa();

    if(this.bandeja=="PENDIENTES"){
      this.estadoDocumento = ['TODOS','BORRADOR','OBSERVADO'];
    }
    if(this.bandeja=="VISADOS"){
      this.estadoDocumento = ['TODOS','POR VISAR','VISADO','OBSERVADO'];
    }
    if(this.bandeja=="FIRMADOS"){
      this.estadoDocumento = ['TODOS','POR FIRMAR','FIRMADO','OBSERVADO'];
    }
    this.listaNano = new Array<string>();
    var nano: number;    
    nano=+((new Date()).toISOString().substr(0,4));
    for(let i=0;i<=4;i++) {
      this.listaNano.push((nano-i).toString());
    }
  }

}
