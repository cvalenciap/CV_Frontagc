import {Component, OnInit,Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'buscar-parametro',
  templateUrl: 'buscar-parametro.template.html',
  styleUrls: ['buscar-parametro.component.scss']
})
export class BuscarParametroComponent implements OnInit {
  public estado: string;
  public nombre: string;

  constructor(private localeService: BsLocaleService, private toastr: ToastrService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.nombre = '';
  }

  OnBuscar() {
  }

}
