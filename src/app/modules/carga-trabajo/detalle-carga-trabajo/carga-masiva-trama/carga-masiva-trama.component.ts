import * as $ from 'jquery';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargaComponent } from './modal-carga.component';
import { ToastrService } from 'ngx-toastr';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { CargasTrabajoService } from 'src/app/services/impl/cargas-trabajo.service';
import { Response } from 'src/app/models/response';
import { CargaTrabajo } from 'src/app/models/CargaTrabajo';
import { ModalOptions, BsModalService } from 'ngx-bootstrap';
import { ModalResultadoCargaEjecucionComponent } from 'src/app/modules/carga-trabajo/modales/modal-resultado-carga-archivo_ejecucion/modal-resultado-carga-archivo-ejecucion.component';
import { Credenciales } from 'src/app/models/credenciales';

@Component({
  selector: 'app-carga-masiva-trama',
  templateUrl: './carga-masiva-trama.component.html',
  styleUrls: ['./carga-masiva-trama.component.scss'],
  providers: [BsModalService]
})
export class CargaMasivaTramaComponent implements OnInit {
  /* I/O de datos */
  @Output() emitEventCargaMasivaTrama:EventEmitter<Number> = new EventEmitter<Number>();
  @Input() datosRegistro: CargaTrabajo;
  @Output() emitEventEjecucionCarga:EventEmitter<boolean> = new EventEmitter<boolean>();
  /* Archivos seleccionados */
  archivosSeleccionados: FileList;
  /* Archivo seleccionado */
  archivoSeleccionado: File;
  /* Variable para busqueda de detalle trabajo */
  itemCargaTrabajo: number;
  /* Nombre del archivo seleccionado */
  nombreArchivoSeleccionado: string;
  /* Objeto formulario */
  formData: FormData
  /* Objeto Upload */
  @ViewChild('FileInput') FileInput;
  acciones: string = sessionStorage.getItem("acciones");

  constructor(private modalService: NgbModal,
              private bsService: BsModalService,
              private toastr: ToastrService,
              private cargaTrabajoService: CargasTrabajoService) { 
    this.nombreArchivoSeleccionado = "Seleccione archivo de carga";
    this.formData = new FormData();
  }

  ngOnInit() {
    this.itemCargaTrabajo = null;
  }

  onBuscarItemDetalleTrabajo():void{
      this.emitEventCargaMasivaTrama.emit(this.itemCargaTrabajo);
  }  

  resetFile(): void{
    this.FileInput.nativeElement.value = '';
  }

  seleccionarArchivo(evento) {   
    if(evento.target.files.length > 0){
      let name: string = evento.target.files[0].name;
      let extension: string = name.substring(name.lastIndexOf(".")+1,name.length);
      if(extension.toLowerCase() == 'zip'){
        this.archivoSeleccionado = evento.target.files[0];
        this.nombreArchivoSeleccionado = evento.target.files[0].name;

        this.formData.append('uploadFile', this.archivoSeleccionado, this.archivoSeleccionado.name);  
        this.formData.append('fileType', 'zip');
      }else{
        this.archivoSeleccionado = null;
        this.nombreArchivoSeleccionado = "Seleccione archivo de carga";
        this.toastr.warning(Mensajes.MESSAGE_CARGA_ARCHIVO_SOLO_ZIP, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
    }
  }

  onCargarArchivoEjecucion(): void{

    this.emitEventEjecucionCarga.emit(true);
    
    let item = new Credenciales();
    let  credenciales : string;
    credenciales = sessionStorage.getItem("credenciales");
    item  = JSON.parse(credenciales);
    const codOficExt = Number(sessionStorage.getItem('codOficina'));

    this.cargaTrabajoService.cargarArchivoEjecucion(this.formData, this.datosRegistro.uidActividad, this.datosRegistro.uidCargaTrabajo,
      item.usuario, codOficExt).subscribe(
      (response: Response) => {
        this.emitEventEjecucionCarga.emit(false);
        if(response.estado == 'OK'){
          const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title: "Registro Acción Ejecutada",
                resultadoEjecucion: response.resultado
            },
            class: 'modal-lg'
          }
          const modalEjecucion = this.bsService.show(ModalResultadoCargaEjecucionComponent, config);
    
        }else{          
          const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title: "Registro Acción Ejecutada",
                resultadoEjecucion: response.error.mensajeInterno
            },
            class: 'modal-lg'
          }
          const modalEjecucion = this.bsService.show(ModalResultadoCargaEjecucionComponent, config);
        }                
      } ,
      error => {
        this.emitEventEjecucionCarga.emit(false);
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
      )
      this.archivoSeleccionado = null;
      this.nombreArchivoSeleccionado = "Seleccione archivo de carga";
      this.formData = new FormData();
  }

  cargaMasivaArchivos() {
    const modalRef = this.modalService.open(ModalCargaComponent);
  }

}
