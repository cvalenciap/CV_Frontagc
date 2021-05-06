import { Component, OnInit } from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';

@Component({
  selector: 'app-detalle-personal',
  templateUrl: './detalle-personal.component.html',
  styleUrls: ['./detalle-personal.component.scss']
})
export class DetallePersonalComponent implements OnInit {

  config: MantenimientoPersonalConfig;
  listaCargos: Object[];
  listaItems: Object[];
  listaOficinas: Object[];
  listaTipoCargo: Object[];
  listaEstadoLaboral: Object[];
  estado: string;
  listaMotivoCese: Object[];
  motivoCese: string;
  fechaCese: string;
  nombreArchivo: string;
  tipoCargo: string;
  item: string;
  cargo: string;
  fechaAlta: string;
  fechaBaja: string;
  oficina: string;
  listaEstados: Object[];
  router: any;

  constructor() { }

  ngOnInit() {
  }

  createAttachment(fileInput) {
    const files = fileInput.target.files;
    const size = files[0].size;
    this.nombreArchivo = files[0].name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileInBase64 = reader.result as string;
    };
    reader.readAsDataURL(files[0]);
  }

  public Regresar() {
    this.router.navigate('/mantenimiento-personal-contratista/bandeja-personal/');
  }

}
