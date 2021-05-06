import { Component, OnInit } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'mensaje-sistema',
  templateUrl: 'mensaje-sistema.template.html',
  styleUrls: [ 'mensaje-sistema.component.scss' ]
})
export class MensajeSistemaComponent implements OnInit {

  mensaje:string;

  constructor() {
    this.mensaje = `Estimados usuarios : la  version 7.3 del sistema se ha implementado 
    tres nuevos servidores que atenderan las peticiones en forma balaceada, 
    con dicho cambio mejoraremos los tiempos de respuesta del sistema. 
    Para reportar problemas y nuevas configuraciones en el sistema se debe generar 
    un ticket de atencion por mesa de ayuda al anexo 3710.`;
  }

  ngOnInit() {
    jQuery(".marquee .system-message").text(this.mensaje);
  }
}
