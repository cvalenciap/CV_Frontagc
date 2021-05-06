import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-modal-resultado-carga-ejecucion',
  templateUrl: './modal-resultado-carga-archivo-ejecucion.component.html'
})
export class ModalResultadoCargaEjecucionComponent implements OnInit {
    resultadoEjecucion: string;

    constructor(public bsModalRef: BsModalRef,
                private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.resultadoEjecucion = "";
    }
  
    ngOnInit() {
    }
    
    OnCerrar(){
      this.bsModalRef.hide();
    }

    
    
}