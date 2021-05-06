import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dataFormularioDatosBasicos, dataFormularioDatosPlanilla, dataFormularioDatosSedapal } from '../../mock/data-ver-detalle';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';

@Component({
  selector: 'app-ver-detalle-personal',
  templateUrl: './ver-detalle-personal.component.html',
  styleUrls: ['./ver-detalle-personal.component.scss']
})
export class VerDetallePersonalComponent implements OnInit {

  titulo: string;

  @Input() dataPersonal: PersonalContratista;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.obtenerDataRouting();
  }

  private obtenerDataRouting(): void {
    this.activatedRoute.data.subscribe(data => {
      this.titulo = data.titulo;
    });
  }

}
