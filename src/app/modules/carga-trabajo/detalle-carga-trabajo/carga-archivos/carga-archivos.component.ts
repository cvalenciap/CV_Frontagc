import { Component, Input, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatosConsulta } from '../../../../models/datosConsulta';
import { EstadoCargaTrabajo } from '../../../../models/enums/estado-carga-trabajo';
import { DocumentosService } from '../../../../services/impl/documentos.service';
import { Adjunto, Paginacion, PageRequest } from '../../../../models';
import { Credenciales } from '../../../../models/credenciales';
import { CargaTrabajo } from '../../../../models/CargaTrabajo';
import { Response } from '../../../../models';
import { saveAs } from 'file-saver';
import { environment } from '../../../../../environments/environment';
import { Parametro as EnumParametro } from '../../../../models/enums/parametro';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ViewChild } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { HttpResponseBase } from '@angular/common/http/src/response';
import { CargasTrabajoService } from 'src/app/services/impl/cargas-trabajo.service';
import CargaArchivoUtil from '../../../../models/CargaArchivoUtil';

@Component({
  selector: 'app-carga-archivos',
  templateUrl: './carga-archivos.component.html',
  styleUrls: ['./carga-archivos.component.scss']
})
export class CargaArchivosComponent implements OnInit {
  public formData: FormData;
  private credenciales: Credenciales;
  private cargaTrabajo: CargaTrabajo;
  public adjuntosContratista: Adjunto[];
  public adjuntosSedapal: Adjunto[];
  public paginacionSedapal: Paginacion;
  public paginacionContratista: Paginacion;
  public endpointFileServer: string;
  public nombreSedapal: string;
  public nombreContratista: string;
  @Input() datosRegistro: DatosConsulta;
  archivosSeleccionados: FileList;
  esContratista: boolean = false;
  esSedapal: boolean = false;
  acciones: string = sessionStorage.getItem('acciones');

  /* Objeto Upload */
  @ViewChild('FileInputSedapal') FileInputSedapal;
  @ViewChild('FileInputContratista') FileInputContratista;

  pagSedapal: PageRequest = new PageRequest();
  pagContratista: PageRequest = new PageRequest();

  constructor(private router: Router, private toastr: ToastrService, private documentService: DocumentosService
    , private service: CargasTrabajoService) {
    this.endpointFileServer = environment.fileServerServiceEndpoint;
    this.credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    this.cargaTrabajo = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
    this.pagSedapal.pagina = 1;
    this.pagSedapal.registros = 10;

    this.pagContratista.pagina = 1;
    this.pagContratista.registros = 10;


    this.paginacionSedapal = new Paginacion({ pagina: 1, registros: 10, totalPaginas: 1, totalRegistros: 1 });
    this.paginacionContratista = new Paginacion({ pagina: 1, registros: 10, totalPaginas: 1, totalRegistros: 1 });
  }

  ngOnInit() {
    this.esSedapal = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_INTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_RESPONSABLE;
    this.esContratista = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_EXTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_SUPERVISOR_EXTERNO;

    this.nombreSedapal = 'Seleccionar archivo';
    this.nombreContratista = 'Seleccionar archivo';

    Observable.forkJoin([
      this.getAllAttachFilesSedapal(),
      this.getAllAttachFilesContratista()
    ]).subscribe(response => {
    },
      error => this.toastr.error('Error al cargar documentos adjuntos', Mensajes.MESSAGE_VALIDACION_ARCHIVO));
  }

  getFile(nombreArchivo: string, extensionArchivo: string, rutaArchivo: string): void {
    this.documentService.getFile(extensionArchivo, rutaArchivo).subscribe((response: HttpResponseBase) => {
      if (extensionArchivo.toUpperCase() == 'PDF') {
        let file = new Blob([response], { type: 'application/pdf' });
        saveAs(file, nombreArchivo);
      } else {
        let file = new Blob([response], { type: 'image/jpeg' });
        saveAs(file, nombreArchivo);
      }
    }, (error) => {
      this.toastr.error('Error al descargar archivo', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
    });
  }

  mostrarNombreArchivoContratista() {
    $('#file-contratista').on('change', function () {
      $('#input-contratista').text($(this).val());
    });
  }

  seleccionarArchivoContratista(evento) {
    this.service.obtenerSize().subscribe(
      (response: Response) => {
        if (response.estado == 'OK') {
          let sizeMaxPDF = response.resultado.sizeMaxPDF * 1024 * 1024;
          let sizeMaxJPG = response.resultado.sizeMaxJPG * 1024 * 1024;

          this.nombreContratista = evento.target.files[0].name;
          if (evento.target.files[0].type === 'application/pdf') {
            if (evento.target.files[0].size > sizeMaxPDF) {
              this.toastr.error('El tamaño del archivo PDF no debe exceder de ' + response.resultado.sizeMaxPDF + ' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreContratista = 'Seleccionar archivo';
              this.formData = new FormData();
            } else {
              this.archivosSeleccionados = evento.target.files;
            }
          } else if (evento.target.files[0].type === 'image/jpeg') {
            if (evento.target.files[0].size > sizeMaxJPG) {
              this.toastr.error('El tamaño del archivo JPG no debe exceder de ' + response.resultado.sizeMaxJPG + ' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreContratista = 'Seleccionar archivo';
              this.formData = new FormData();
            } else {
              this.archivosSeleccionados = evento.target.files;
            }
          } else {
            this.toastr.error(Mensajes.MESSAGE_TIPO_ARCHIVO, Mensajes.MESSAGE_VALIDACION_ARCHIVO);
            this.archivosSeleccionados = null;
            this.nombreContratista = 'Seleccionar archivo';
            this.formData = new FormData();
          }
        } else {
          this.toastr.error(response.resultado, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      },
      (error) => {
        this.toastr.error('Se presentó un error al realizar carga del archivo.', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }

  resetFileConstratista(): void {
    this.FileInputContratista.nativeElement.value = '';
  }

  mostrarNombreArchivoSedapal() {
    $('#file-sedapal').on('change', function () {
      $('#input-sedapal').text($(this).val());
    });
  }

  seleccionarArchivoSedapal(evento) {
    this.service.obtenerSize().subscribe(
      (response: Response) => {
        if(response.estado == 'OK'){
          let sizeMaxPDF = response.resultado.sizeMaxPDF * 1024 * 1024;
          let sizeMaxJPG = response.resultado.sizeMaxJPG * 1024 * 1024;

          this.nombreSedapal = evento.target.files[0].name;
          if (evento.target.files[0].type === 'application/pdf') {
            if(evento.target.files[0].size > sizeMaxPDF){
              this.toastr.error('El tamaño del archivo PDF no debe exceder de '+response.resultado.sizeMaxPDF+' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreSedapal = "Seleccionar archivo";
              this.formData = new FormData();
            }else{
              this.archivosSeleccionados = evento.target.files;
            }
          } else if (evento.target.files[0].type === 'image/jpeg') {
            if(evento.target.files[0].size > sizeMaxJPG){
              this.toastr.error('El tamaño del archivo JPG no debe exceder de '+response.resultado.sizeMaxJPG+' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreSedapal = "Seleccionar archivo";
              this.formData = new FormData();
            }else{
              this.archivosSeleccionados = evento.target.files;
            }
          } else {
            this.toastr.error(Mensajes.MESSAGE_TIPO_ARCHIVO, Mensajes.MESSAGE_VALIDACION_ARCHIVO);
            this.archivosSeleccionados = null;
            this.nombreSedapal = "Seleccionar archivo";
            this.formData = new FormData();
          }
        } else{
          this.toastr.error(response.resultado,Mensajes.CAB_MESSAGE_ERROR, {closeButton : true});
        }
      },
      (error) => {
        this.toastr.error('Se presentó un error al realizar carga del archivo.',Mensajes.CAB_MESSAGE_ERROR, {closeButton : true});
      }
    )
  }

  resetFileSedapal(): void {
    this.FileInputSedapal.nativeElement.value = '';
  }

  OnEnviar() {
    this.toastr.info('Se ha enviado el cargo correctamente', 'Acción completada', { closeButton: true });
    this.router.navigate(['/carga-trabajo']);
  }

  OnRegresar() {
    this.router.navigate(['/carga-trabajo']);
  }

  OnObservar(descripcion: string) {
    this.toastr.info('Se observó correctamente', 'Acción completada', { closeButton: true });
    this.router.navigate(['/carga-trabajo']);
  }

  private saveDocument(tipoOrigen: string): void {
    this.formData = new FormData();
    this.formData.append('file', this.archivosSeleccionados[0], this.archivosSeleccionados[0].name);
    const dataFormulario: FormData = this.formData;
      // Comentado por bloqueo de peticion HEAD en el servidor de produccion
    /*this.documentService.verificarEstadoFileserver().subscribe((responseEstado) => {
      
    }, (error) => {
      this.toastr.error(CargaArchivoUtil.ERROR_FILESERVER, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
    });*/
    this.documentService.saveDocument(dataFormulario).subscribe((response) => {
      if (response.mensaje === CargaArchivoUtil.FILESERVER_OK) {
        this.guardarRegistroAdjunto(tipoOrigen, response);
      }
    }, (error) => {
      this.toastr.error(CargaArchivoUtil.ERROR_FILESERVER, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
    });

    this.archivosSeleccionados = null;
    this.nombreSedapal = 'Seleccionar archivo';
    this.nombreContratista = 'Seleccionar archivo';
    this.formData = new FormData();
  }

  guardarRegistroAdjunto(tipoOrigen: string, responseAdjunto: any) {
    const adjunto: Adjunto = new Adjunto();
    adjunto.uidCarga = this.cargaTrabajo.uidCargaTrabajo;
    adjunto.tipoOrigen = tipoOrigen;
    adjunto.nombre = responseAdjunto.nombreReal;
    adjunto.extension = responseAdjunto.extension;
    adjunto.ruta = responseAdjunto.url;
    adjunto.ruta = this.getPathUploadFile(responseAdjunto.url);
    adjunto.usuarioCreacion = this.credenciales.usuario;
    this.documentService.saveInformationDocument(adjunto).subscribe((responseInformation: Response) => {
      if (responseInformation.estado === 'OK') {
        if (this.esContratista) {
          this.getAllAttachFilesContratista();
          this.nombreContratista = 'Seleccionar archivo';
        } else {
          this.getAllAttachFilesSedapal();
          this.nombreSedapal = 'Seleccionar archivo';
        }
        this.toastr.show(responseAdjunto.mensaje, Mensajes.CAB_MESSAGE_OK, { closeButton: true });
      } else {
        this.toastr.error(responseInformation.error.mensaje, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    }, (error) => {
      this.toastr.error(CargaArchivoUtil.ERROR_GUARDAR_REGISTRO, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
    });
  }

  public getAllAttachFilesContratista(): string {
    this.adjuntosContratista = new Array<Adjunto>();
    this.documentService.getAttachFilesContratista(this.writeParameters(), this.pagContratista).subscribe((attachFilesContratista: Response) => {
      this.pagContratista = attachFilesContratista.paginacion;
      const allAttachFilesContratista: Adjunto[] = attachFilesContratista.resultado;
      allAttachFilesContratista.forEach((attachFileContratista) => {
        if (attachFileContratista.estado === 'A') {
          this.adjuntosContratista.push(attachFileContratista);
        }
      });
    }, (error) => {
      this.toastr.error('Error adjuntando Documentos Contratista', 'Error', { closeButton: true });
    });
    return 'result';
  }


  public getAllAttachFilesSedapal(): string {
    this.adjuntosSedapal = new Array<Adjunto>();

    this.documentService.getAttachFilesSedapal(this.writeParameters(), this.pagSedapal).subscribe((attachFilesSedapal: Response) => {
      this.pagSedapal = attachFilesSedapal.paginacion;
      const allAttachFilesSedapal: Adjunto[] = attachFilesSedapal.resultado;
      allAttachFilesSedapal.forEach((attachFileSedapal) => {
        if (attachFileSedapal.estado === 'A') {
          this.adjuntosSedapal.push(attachFileSedapal);
        }
      });
    }, (error) => {
      this.toastr.error('Error adjuntando Documentos Sedapal', 'Error', { closeButton: true });
    });
    return 'result';
  }

  public deleteAttachFile(adjunto: Adjunto): void {
    const parameters: Map<string, any> = new Map();
    parameters.set('uidCarga', adjunto.uidCarga);
    parameters.set('uidAdjunto', adjunto.uidAdjunto);
    parameters.set('usuarioCreacion', this.credenciales.usuario);
    this.documentService.deleteAttachFile(parameters).subscribe((responseDelete: Response) => {
      this.documentService.deleteAttachFileServer(this.endpointFileServer + adjunto.ruta).subscribe((responseFile) => {
      }, (errorFileServer) => {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
      });
      this.toastr.show(responseDelete.resultado, 'Acción realizada', { closeButton: true });
      this.getAllAttachFilesSedapal();
      this.getAllAttachFilesContratista();
    }, (error) => {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    });
  }

  private writeParameters(): Map<string, any> {
    const parameters: Map<string, any> = new Map();
    parameters.set('V_V_IDCARGA', this.cargaTrabajo.uidCargaTrabajo);
    return parameters;
  }

  private getPathUploadFile(originalPath: string): string {
    let returnPath = '/';
    const arrayStringPath: string[] = originalPath.split('/');
    for (let index = 5; index < arrayStringPath.length; index++) {
      if (index === (arrayStringPath.length - 1)) {
        returnPath = returnPath + arrayStringPath[index];
      } else {
        returnPath = returnPath + arrayStringPath[index] + '/';
      }
    }
    return returnPath;
  }

  OnPageChangedContratista(event) {
    this.pagContratista.pagina = event.page;
    this.getAllAttachFilesContratista();
  }

  OnPageChangedSedapal(event) {
    this.pagSedapal.pagina = event.page;
    this.getAllAttachFilesSedapal();
  }

  OnPageOptionChangedSedapal(event) {
    this.pagSedapal.registros = event.rows;
    this.pagSedapal.pagina = 1;
    this.getAllAttachFilesSedapal();
  }

  OnPageOptionChangedContratista(event) {
    this.pagContratista.registros = event.rows;
    this.pagContratista.pagina = 1;
    this.getAllAttachFilesContratista();
  }


}
