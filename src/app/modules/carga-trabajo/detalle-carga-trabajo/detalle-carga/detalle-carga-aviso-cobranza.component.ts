import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { CargaTrabajo } from "src/app/models/CargaTrabajo";
import { Paginacion } from "src/app/models";
import { CargasTrabajoService } from "src/app/services/impl/cargas-trabajo.service";
import { Medidores } from "src/app/models/Medidores";
import { ToastrService } from "ngx-toastr";
import { ResponseObject } from "src/app/models/response/response-object";
import { DistribucionAvisoCobranza } from "src/app/models/distribucionAvisoCobranza";

@Component({
  selector: 'app-detalle-aviso-cobranza',
  templateUrl: './detalle-carga-aviso-cobranza.component.html'
})
export class DetalleCargaAvisoCobranzaComponent implements OnInit {
  @Input() itemCargaTrabajo: CargaTrabajo;
  /* Objeto para paginación */
  paginacion: Paginacion;
  /* Lista de tareas */
  listaItems: DistribucionAvisoCobranza[];

  /* registro seleccionado */
  selectedRow: number;
  /* objeto seleccionado */
  selectedObject: CargaTrabajo;
  /* Codigo del registro */
  codigoRegistro: number;
  public uidRegistro: number;

  constructor(private service: CargasTrabajoService,
              private toastr: ToastrService) {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.listaItems = [];
    this.selectedRow = -1;
    this.codigoRegistro = 0;
  }

  ngOnInit(): void {
    this.obtenerDetalleTrabajo();
  }

  obtenerDetalleTrabajo(): void {
    this.service.obtenerDetalleTrabajoAvisoCobranza(this.itemCargaTrabajo.uidCargaTrabajo, this.codigoRegistro, this.paginacion).subscribe(
      (response: ResponseObject) => {
        this.listaItems = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerItemDetalleTrabajo(codigoRegistro): void{
    if(codigoRegistro && codigoRegistro > 0){      
      this.codigoRegistro = codigoRegistro;  
    }else{
      this.codigoRegistro = 0;    
    }
    this.obtenerDetalleTrabajo();
  }

  controlarError(error): void {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.obtenerDetalleTrabajo();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.obtenerDetalleTrabajo();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

}
