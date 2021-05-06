import {Component, Input, OnInit} from '@angular/core';
import {Adjunto, Paginacion} from '../../../../models';
import {Credenciales} from '../../../../models/credenciales';
import {CargaTrabajo} from '../../../../models/CargaTrabajo';
import {DocumentosService} from '../../../../services/impl/documentos.service';
import {Response} from '../../../../models';
import {Error} from '../../../../models/response';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../environments/environment';
import {Parametro as EnumParametro} from '../../../../models/enums/parametro';
import * as $ from 'jquery';
import {ViewChild} from '@angular/core';
import {Mensajes} from 'src/app/models/enums/mensajes';
import {HttpResponseBase} from '@angular/common/http';
import {CargasTrabajoService} from 'src/app/services/impl/cargas-trabajo.service';
import {TipoAdjunto} from '../../../../models/enums/tipo-adjunto.enum';
import CargaArchivoUtil from '../../../../models/CargaArchivoUtil';
import {CargaMasivaResponse} from '../../../../models/response/carga-masiva-response';

@Component({
  selector: 'app-carga-archivos-detalle',
  templateUrl: './carga-archivos.component.html',
  styleUrls: ['./carga-archivos.component.scss']
})
export class CargaArchivosDetalleComponent implements OnInit {
  @Input() public uidRegistro: number;
  public message: string;
  public paginacion: Paginacion;
  public archivosSeleccionados: FileList;
  private credenciales: Credenciales;
  public cargaTrabajo: CargaTrabajo;
  private formData: FormData;
  public adjuntos: Adjunto[];
  public endpointFileServer: string;
  public nombreArchivo: string;
  esContratista: boolean = false;
  esSedapal: boolean = false;
  acciones: string = sessionStorage.getItem('acciones');
  existeArchivoMismoNombre: boolean;
  adjunto: Adjunto;
  /* Objeto Upload */
  @ViewChild('FileInput') FileInput;

  constructor(private documentService: DocumentosService, private toastr: ToastrService
    , private service: CargasTrabajoService) {
    this.endpointFileServer = environment.fileServerServiceEndpoint;
  }

  ngOnInit() {
    this.esSedapal = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_INTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_RESPONSABLE;
    this.esContratista = sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_ANALISTA_EXTERNO || sessionStorage.getItem('perfilAsignado') == EnumParametro.PERFIL_SUPERVISOR_EXTERNO;
    this.cargaTrabajo = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
    this.inicializarVariables();
  }

  public mostrarNombreArchivo() {
    $('#attach-file').on('change', function () {
      $('#input-file').text($(this).val());
    });
  }

  resetFile(): void {
    this.FileInput.nativeElement.value = '';
    this.existeArchivoMismoNombre = false;
  }

  getFile(nombreArchivo: string, extensionArchivo: string, rutaArchivo: string): void {
    this.documentService.getFile(extensionArchivo, rutaArchivo).subscribe((response: HttpResponseBase) => {
      if (extensionArchivo.toUpperCase() == 'PDF') {
        let file = new Blob([response], {type: 'application/pdf'});
        saveAs(file, nombreArchivo);
      } else {
        let file = new Blob([response], {type: 'image/jpeg'});
        saveAs(file, nombreArchivo);
      }
    }, (error) => {
      this.toastr.error('Error al descargar archivo', Mensajes.CAB_MESSAGE_ERROR, {closeButton: true});
    });
  }

  resetVariables(): void {
    this.FileInput.nativeElement.value = '';
    this.nombreArchivo = 'Seleccionar archivo';
    this.existeArchivoMismoNombre = false;
    this.adjunto = new Adjunto();
    this.archivosSeleccionados = null;
  }

  public seleccionarArchivo(evento) {
    this.service.obtenerSize().subscribe(
      (response: Response) => {

        if (response.estado == 'OK') {

          let sizeMaxPDF = response.resultado.sizeMaxPDF * 1024 * 1024;
          let sizeMaxJPG = response.resultado.sizeMaxJPG * 1024 * 1024;

          this.nombreArchivo = evento.target.files[0].name;

          const inicio = evento.target.files[0].name.indexOf('-') + 1;
          const final = evento.target.files[0].name.indexOf('_');
          const numeroItemArchivo = evento.target.files[0].name.slice(inicio, final);

          if (this.cargaTrabajo.uidCargaTrabajo != evento.target.files[0].name.substring(0, evento.target.files[0].name.indexOf('-')) && this.cargaTrabajo.uidActividad != 'SG') {
            this.toastr.error(Mensajes.MESSAGE_VALIDACION_ARCHIVO_CARGA + ' : ' + evento.target.files[0].name, Mensajes.MESSAGE_VALIDACION_ARCHIVO);
            this.archivosSeleccionados = null;
            this.nombreArchivo = 'Seleccionar archivo';
            this.formData = new FormData();
          } else if (Number(numeroItemArchivo) != this.uidRegistro) {
            this.toastr.error(CargaArchivoUtil.ERROR_NRO_ITEM_CARGA, Mensajes.CAB_MESSAGE_AVISO, {closeButton: true});
            this.archivosSeleccionados = null;
            this.nombreArchivo = 'Seleccionar archivo';
            this.formData = new FormData();
          } else if (evento.target.files[0].type === 'application/pdf') {
            if (evento.target.files[0].size > sizeMaxPDF) {
              this.toastr.error('El tamaño del archivo PDF no debe exceder de ' + response.resultado.sizeMaxPDF + ' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreArchivo = 'Seleccionar archivo';
              this.formData = new FormData();
            } else {
              this.archivosSeleccionados = evento.target.files;
            }
          } else if (evento.target.files[0].type === 'image/jpeg') {
            if (evento.target.files[0].size > sizeMaxJPG) {
              this.toastr.error('El tamaño del archivo JPG no debe exceder de ' + response.resultado.sizeMaxJPG + ' Mb', Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.archivosSeleccionados = null;
              this.nombreArchivo = 'Seleccionar archivo';
              this.formData = new FormData();
            } else {
              this.archivosSeleccionados = evento.target.files;
            }
          } else {
            this.toastr.error(Mensajes.MESSAGE_TIPO_ARCHIVO, Mensajes.MESSAGE_VALIDACION_ARCHIVO);
            this.archivosSeleccionados = null;
            this.nombreArchivo = 'Seleccionar archivo';
            this.formData = new FormData();
          }

        } else {
          this.toastr.error(response.resultado, Mensajes.CAB_MESSAGE_ERROR, {closeButton: true});
        }
      },
      (error) => {
        this.toastr.error('Se presentó un error al realizar carga masiva de archivos', Mensajes.CAB_MESSAGE_ERROR, {closeButton: true});
      }
    );
  }

  private getParameters(opcion: string): Map<string, any> {
    const parameters: Map<string, any> = new Map();
    if (opcion === 'save') {
      parameters.set('usuario', this.credenciales.usuario);
      parameters.set('uidActividad', this.cargaTrabajo.uidActividad);
      parameters.set('tipoAdjunto', TipoAdjunto.DETALLE);
    } else {
      parameters.set('uidCarga', this.cargaTrabajo.uidCargaTrabajo);
      parameters.set('uidRegistro', this.uidRegistro);
      parameters.set('pagina', this.paginacion.pagina);
      parameters.set('registros', this.paginacion.registros);
    }

    return parameters;
  }

  private inicializarVariables() {
    this.existeArchivoMismoNombre = false;
    this.adjunto = new Adjunto();
    this.paginacion = new Paginacion({pagina: 1, registros: 10});
    this.nombreArchivo = 'Seleccionar archivo';
    this.credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    this.cargaTrabajo = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
    this.adjuntos = new Array<Adjunto>();
    this.obtenerAdjuntosPorCargaRegistro();
  }

  validarAdjunto(idCarga: string, idRegistro: number, nombreAdjunto: string): void {
    let cargaTrabajo = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
    this.documentService.verificarExistenciaArchivoCargado(cargaTrabajo.uidCargaTrabajo, this.uidRegistro, this.nombreArchivo).subscribe((response: Response) => {
      if (response.estado == 'OK') {
        this.adjunto = response.resultado;
        if (this.adjunto.nombre) {
          this.existeArchivoMismoNombre = true;
        } else {
          this.saveAttchFile();
        }
      } else {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      }
    }, (errorResponse) => {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    });
  }

  guardarAdjunto(): void {
    this.existeArchivoMismoNombre = false;
    // this.deleteAttachFile(this.adjunto);
    this.saveAttchFile();
  }

  public saveAttchFile(): void {
    this.formData = new FormData();
    this.formData.append('files', this.archivosSeleccionados[0], this.archivosSeleccionados[0].name);

    let inicio = this.archivosSeleccionados[0].name.indexOf('-') + 1;
    let final = this.archivosSeleccionados[0].name.indexOf('_');
    let numeroItemArchivo = this.archivosSeleccionados[0].name.slice(inicio, final);

    if (Number(numeroItemArchivo) == this.uidRegistro) {
      this.documentService.saveAttchFileToDetails(this.formData, this.getParameters('save')).subscribe((response: CargaMasivaResponse) => {
        console.log(response);
        if (response.estado == 'OK') {
          if (response.fallidos === 0) {
            if (this.existeArchivoMismoNombre) {
              this.toastr.show(CargaArchivoUtil.MENSAJE_ARCHIVO_ACTUAIZADO, CargaArchivoUtil.TITULO_ADJUNTAR, {closeButton: true});
            } else {
              this.toastr.show(CargaArchivoUtil.MENSAJE_ARCHIVO_GUARDADO, CargaArchivoUtil.TITULO_ADJUNTAR, {closeButton: true});
            }
            this.obtenerAdjuntosPorCargaRegistro();
          } else {
            response.listaErrores.forEach(error => {
              this.toastr.error(`${error.mensajeInterno}`, Mensajes.CAB_MESSAGE_AVISO, {closeButton: true});
            });
          }
        } else {
          // const errores: Error[] = response.resultado;
          // this.toastr.error(errores[0].mensaje, 'Error Adjuntar Archivo', {closeButton: true});
          this.toastr.error(response.mensaje, 'Error Adjuntar Archivo', {closeButton: true});
        }

      }, (errorResponse) => {
        // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      });
    } else {
      this.toastr.error('El archivo seleccionado no corresponde al item de carga', 'Error', {closeButton: true});
    }
    this.archivosSeleccionados = null;
    this.nombreArchivo = 'Seleccionar archivo';
    this.formData = new FormData();
  }

  private obtenerAdjuntosPorCargaRegistro(): void {
    this.documentService.getAttachFilesDetails(this.getParameters('get')).subscribe((response: Response) => {
      this.adjuntos = response.resultado;
      this.paginacion = response.paginacion;
      if (!this.paginacion) {
        this.paginacion = new Paginacion({pagina: 1, registros: 10});
      }
    }, (error) => {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    });
  }

  public deleteAttachFile(adjunto: Adjunto): void {
    const parameters: Map<string, any> = new Map();
    parameters.set('uidCarga', adjunto.uidCarga);
    parameters.set('uidRegistro', this.uidRegistro);
    parameters.set('uidAdjunto', adjunto.uidAdjunto);
    this.documentService.deleteAttachFileDetails(parameters).subscribe((responseDelete: Response) => {
      this.documentService.deleteAttachFileServer(this.endpointFileServer + adjunto.ruta).subscribe((responseFile) => {
      }, (errorFileServer) => {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      });
      if (!this.existeArchivoMismoNombre) {
        this.toastr.show(responseDelete.resultado, 'Acción realizada', {closeButton: true});
      }
      this.obtenerAdjuntosPorCargaRegistro();
    }, (error) => {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    });
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.obtenerAdjuntosPorCargaRegistro();
  }

}
