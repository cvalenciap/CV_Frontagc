import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'carga-anular',
    templateUrl: './carga-anular.component.html'
  })
export class AnularCargaComponent implements OnInit {
    constructor() {}
    public motivo: string = '0';
    public boolCaja: boolean = false;
    public txtMotivo: string = '';
    ngOnInit(): void {

    }

    OnChange() {
        if(this.motivo=='2') {
            this.boolCaja = true;
        } else {
            this.boolCaja = false;
        }    
    }
}