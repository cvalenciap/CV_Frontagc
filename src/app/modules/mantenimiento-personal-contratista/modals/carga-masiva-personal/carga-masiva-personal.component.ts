import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ProgressbarConfig } from 'ngx-bootstrap';
import { ExcelService } from 'src/app/services/impl/excel.service';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { CargaPersonalResponse } from 'src/app/models/interface/carga-personal-response';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { ResultadoCarga } from 'src/app/models/enums/resultado-carga.enum';
import { Parametro } from 'src/app/models/enums/parametro';
import { ResponseCargaArchivo } from 'src/app/models/interface/response-carga-archivo';
import { Paginacion } from 'src/app/models';
import PaginacionUtil from 'src/app/modules/shared/util/paginacion-util';
import { TramaPersonal } from 'src/app/models/interface/trama-personal';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { RequestParametro } from 'src/app/models/request/request-parametro';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import * as FileSaver from 'file-saver';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true, max: 100, value: 100 });
}

@Component({
  selector: 'app-carga-masiva-personal',
  templateUrl: './carga-masiva-personal.component.html',
  styleUrls: ['./carga-masiva-personal.component.scss'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class CargaMasivaPersonalComponent implements OnInit {

  @ViewChild('fileInputTxt') fileInputTxt: ElementRef;
  @Output() cerraCargaMasivaEvent = new EventEmitter();

  placeholderInputText: string = 'Seleccione Archivo';
  archivoDataPersonal: File;

  uploader: FileUploader;
  filesOverUploader: boolean = false;
  txtDataCargado: boolean = false;
  adjuntosCargados: boolean = false;
  disabledUpload: boolean = false;
  primeraSeleccion: boolean = false;
  loading: boolean = false;
  codContratista: string;
  regexAdjuntoFoto: RegExp;
  regexAdjuntoCv: RegExp;
  regexDni: RegExp = new RegExp(`^[0-9]{8}$`);

  mostrarCarga: boolean = true;
  mostrarCargaArchivo: boolean = false;
  mostrarCargaAdjuntos: boolean = false;
  mostrarResultados: boolean = false;

  tamanioMaxPdf: number = 0;
  tamanioMaxJpg: number = 0;

  porcentaje: number = 0;
  totalArchivos: number = 0;
  contadorArchivoActual: number = 0;
  listaTramaPersonal: TramaPersonal[] = [];
  resultadoCargaArchivo: CargaPersonalResponse[] = [];
  listaPaginada: CargaPersonalResponse[] = [];
  itemActual: CargaPersonalResponse;
  adjuntosActual: FileItem;

  paginacion: Paginacion;

  constructor(private excelService: ExcelService,
    private personalApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService,
    private parametrosService: ParametrosService) {
    this.paginacion = PaginacionUtil.paginacionVacia(5);
  }

  ngOnInit() {
    this.configUploader();
    this.obtenerTamanioMaximoJpg();
    this.obtenerTamanioMaximoPdf();
    this.obtenerCodigoContratista();
  }

  private actualizarUploader(items: Array<File>) {
    this.uploader.addToQueue(items);
  }

  private afterFirstDrop(data: FileList) {
    this.loading = true;
    const filesArray: Array<File> = new Array<File>();
    for (let i = 0; i < data.length; i++) {
      const file: File = data.item(i);
      const duplicados: Array<FileItem> = this.buscarFilesDuplicados(file);
      if (duplicados.length > 0) {
        this.eliminarDuplicados(duplicados);
      }
      filesArray.push(file);
    }
    this.actualizarUploader(filesArray);
    this.loading = false;
  }

  private buscarFilesDuplicados(fileBuscado: File): FileItem[] {
    return this.uploader.queue.filter(f => f._file.name === fileBuscado.name && f._file.type === fileBuscado.type);
  }
  private calcularPorcentaje(): number {
    return Math.round((this.contadorArchivoActual * 100) / this.totalArchivos);
  }

  private configUploader(): void {
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedMimeType: ['application/pdf', 'image/jpeg']
    });
  }

  private delay(milisegundos: number) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
  }

  private eliminarDuplicados(items: Array<FileItem>) {
    items.forEach(item => this.uploader.removeFromQueue(item));
  }

  private enableUpload(): void {
    this.disabledUpload = this.txtDataCargado && this.adjuntosCargados;
  }

  public exportarResultado() {
    const resultados: CargaPersonalResponse[] = this.resultadoCargaArchivo;
    this.excelService.exportarExcel(resultados.map(item => {
      return {
        'Nro.': item.nro,
        'Fila': item.nroRegistro,
        'Fecha Carga': item.fechaDeCarga,
        'DNI': item.numeroDocumento,
        'Detalle': item.detalle.join('\r\n'),
        'Estado': item.resultado
      };
    }), 'Carga_Masiva_Personal');
  }

  public getResultadoCargaEnum() {
    return ResultadoCarga;
  }

  public limpiarCarga(): void {
    this.uploader.clearQueue();
    this.uploader.queue.length = 0;
    this.archivoDataPersonal = null;
    this.placeholderInputText = 'Seleccionar Archivo';
    this.mostrarResultados = false;
    this.mostrarCargaArchivo = false;
    this.mostrarCarga = true;
    this.disabledUpload = false;
    this.adjuntosCargados = false;
  }

  private mostrarResultadosCarga(): void {
    this.mostrarCarga = false;
    this.mostrarCargaArchivo = false;
    this.mostrarCargaAdjuntos = false;
    this.paginarResultados();
    this.mostrarResultados = true;
    this.setFlagCargaMasivaCorrecta();
  }

  private obtenerAdjuntosPersonal(dni: string, tipoArchivo: string): File {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      const nombreArchivo: string = this.uploader.queue[i]._file.name;
      if ((nombreArchivo.includes(dni) && nombreArchivo.toUpperCase().endsWith(tipoArchivo))
        && this.validarNombreAdjunto(nombreArchivo)) {
        return this.uploader.queue[i]._file;
      }
    }
  }

  private obtenerCodigoContratista() {
    this.codContratista = sessionStorage.getItem('idEmpresa');
    this.regexAdjuntoFoto = new RegExp(`^(FOTO)\_${this.codContratista}\_[0-9]{8}\.(jpg|JPG)$`);
    this.regexAdjuntoCv = new RegExp(`^(CV)\_${this.codContratista}\_[0-9]{8}\.(pdf|PDF)$`);
  }

  private async obtenerTamanioMaximoPdf() {
    const paramPDF: RequestParametro = {
      tipo: Parametro.TIPO_PARAM_TAMANO_ARCHIVO_PP as number,
      codigo: Parametro.PARAM_TAMANO_PDF_PP as number,
      estado: 'G',
      detalle: 'G',
      descripcionCorta: 'G',
      valor: 'G',
      usuario: 'G'
    };

    await this.parametrosService.consultarParametros(paramPDF, 1, 1).toPromise()
      .then((response: any) => {
        this.tamanioMaxPdf = response.resultado[0].valor * 1024 * 1024;
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  private async obtenerTamanioMaximoJpg() {
    const paramPDF: RequestParametro = {
      tipo: Parametro.TIPO_PARAM_TAMANO_ARCHIVO_PP as number,
      codigo: Parametro.PARAM_TAMANO_JPG_PP as number,
      estado: 'G',
      detalle: 'G',
      descripcionCorta: 'G',
      valor: 'G',
      usuario: 'G'
    };

    await this.parametrosService.consultarParametros(paramPDF, 1, 1).toPromise()
      .then((response: any) => {
        this.tamanioMaxJpg = response.resultado[0].valor * 1024 * 1024;
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  public onClickFileInputTxt() {
    this.fileInputTxt.nativeElement.value = '';
  }

  public onCambioPagina(event) {
    this.paginarResultados(event.page);
  }

  public onCambioValorInput(event) {
    if (event.target.files[0].type === 'text/plain') {
      this.placeholderInputText = event.target.files[0].name;
      this.archivoDataPersonal = event.target.files[0];
      this.txtDataCargado = true;
      this.enableUpload();
    }
  }

  public onCargar() {
    let flag: boolean = true;
    for (let i = 0; i < this.uploader.queue.length; i++) {
      const element = this.uploader.queue[i];
      if (!this.validarTamanioArchivos(element._file)) {
        flag = false;
        if (element._file.type === 'application/pdf') {
          this.toastrUtil.showError(`El archivo ${element.file.name} excede el limite de ${this.tamanioMaxPdf}`);
        } else if (element._file.type === 'image/jpeg') {
          this.toastrUtil.showError(`El archivo ${element.file.name} excede el limite de ${this.tamanioMaxJpg}`);
        }
        break;
      }
    }
    if (flag) {
      this.procesarArchivoTexto();
    }
  }

  public onDescargarPlantilla() {
    this.personalApi.descargarPlantilla().subscribe(
      (response) => {
        const dataBlob = new Blob([response], {type: 'text/plain'});
        FileSaver.saveAs(dataBlob, 'plantilla_carga_personal.txt');
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public onEliminarItem(file: FileItem) {
    file.remove();
    this.adjuntosCargados = this.uploader.queue.length > 0 ? true : false;
    this.enableUpload();
  }

  public onFileOver(value: any) {
    this.filesOverUploader = value;
  }

  public onFileDrop(data: FileList) {
    if (this.primeraSeleccion) {
      this.afterFirstDrop(data);
    }
    this.primeraSeleccion = true;
    this.adjuntosCargados = this.uploader.queue.length > 0 ? true : false;
    this.enableUpload();
  }

  private paginarResultados(pagina: number = 1) {
    this.paginacion = new Paginacion({ pagina: pagina, registros: 5, totalRegistros: this.resultadoCargaArchivo.length });
    this.listaPaginada = PaginacionUtil.paginarData(this.resultadoCargaArchivo, this.paginacion);
  }

  private async procesarAdjuntos() {
    this.mostrarCargaArchivo = false;
    const procesados: CargaPersonalResponse[] = this.resultadoCargaArchivo
      .filter(item => item.resultado === ResultadoCarga.CORRECTO);
    if (procesados.length > 0) {
      this.mostrarCargaAdjuntos = true;
      this.totalArchivos = procesados.length;
      for (let idx = 0; idx < this.resultadoCargaArchivo.length; idx++) {
        const item: CargaPersonalResponse = this.resultadoCargaArchivo[idx];
        if (item.resultado === ResultadoCarga.CORRECTO) {
          await this.subirAdjuntoPersonal(idx);
          this.contadorArchivoActual++;
          this.porcentaje = this.calcularPorcentaje();
        }
      }
      this.mostrarResultadosCarga();
    } else {
      this.mostrarResultadosCarga();
    }
  }

  private async procesarArchivoTexto() {
    this.mostrarCarga = false;
    this.mostrarCargaArchivo = true;
    const formData: FormData = new FormData();
    formData.append('archivoCarga', this.archivoDataPersonal);
    await this.personalApi.procesarArchivoDataPersonal(formData).toPromise()
      .then(response => {
        if (response.estado === ResponseStatus.OK) {
          this.listaTramaPersonal = response.resultado;
          this.validarAdjuntosPersonal();
          this.procesarCargaMasiva();
        } else {
          this.toastrUtil.showError(`${response.error.mensaje}`);
          this.limpiarCarga();
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.limpiarCarga();
      });
  }

  private async procesarCargaMasiva() {
    await this.personalApi.cargaMasivaPersonal(this.listaTramaPersonal, this.archivoDataPersonal.name).toPromise()
      .then((response) => {
        if (response.estado === ResponseStatus.OK) {
          this.resultadoCargaArchivo = response.resultado;
          this.procesarAdjuntos();
        } else {
          this.toastrUtil.showError(`${response.error.mensaje}:
          - ${response.error.mensajeInterno}`);
          this.limpiarCarga();
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.limpiarCarga();
      });
  }

  private setFlagCargaMasivaCorrecta(): void {
    if (this.resultadoCargaArchivo.length > 0) {
      for (let index = 0; index < this.resultadoCargaArchivo.length; index++) {
        const element = this.resultadoCargaArchivo[index];
        if (element.resultado === ResultadoCarga.CORRECTO) {
          StorageUtil.almacenarObjetoSession(element, 'resultadoCargaMasiva');
          break;
        }
      }
    }
  }

  private async subirAdjuntoPersonal(idx: number) {
    const item = this.resultadoCargaArchivo[idx];
    const foto: File = this.obtenerAdjuntosPersonal(item.numeroDocumento, Parametro.JPG_EXTENSION);
    const cv: File = this.obtenerAdjuntosPersonal(item.numeroDocumento, Parametro.PDF_EXTENSION);
    const formData: FormData = new FormData();
    formData.append('foto', foto);
    formData.append('cv', cv);
    await this.personalApi.cargarAdjuntosPersonal(formData, item.numeroDocumento,
      item.codEmpleado1, item.codEmpleado2)
      .toPromise()
      .then(response => {
        if (response.estado === ResponseStatus.OK) {
          const resultado: ResponseCargaArchivo[] = response.resultado;
          const erroneos: ResponseCargaArchivo[] = resultado.filter(res => res.resultado !== ResultadoCarga.CORRECTO);
          if (erroneos.length > 0) {
            erroneos.forEach(err => {
              this.resultadoCargaArchivo[idx].detalle.push(err.mensaje);
            });
            this.resultadoCargaArchivo[idx].resultado = ResultadoCarga.INCORRECTO;
          }
        } else {
          this.resultadoCargaArchivo[idx].detalle.push(response.mensaje);
          this.resultadoCargaArchivo[idx].resultado = ResultadoCarga.INCORRECTO;
        }
      })
      .catch((err) => {
        console.error(err);
        this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
        this.limpiarCarga();
      });
  }

  private validarAdjuntosPersonal() {
    const listaFiles = this.uploader.queue;
    this.listaTramaPersonal.forEach(trama => {
      if (this.validarDni(trama.v_dni)) {
        let cantAdjuntos: number = 0;
        for (let i = 0; i < listaFiles.length; i++) {
          const nombreArchivo = listaFiles[i]._file.name;
          if (nombreArchivo.includes(trama.v_dni) && (nombreArchivo.endsWith('.pdf') || nombreArchivo.endsWith('.PDF'))) {
            if (this.validarNombreAdjunto(nombreArchivo)) {
              cantAdjuntos++;
            }
          }
          if (nombreArchivo.includes(trama.v_dni) && (nombreArchivo.endsWith('.jpg') || nombreArchivo.endsWith('.JPG'))) {
            if (this.validarNombreAdjunto(nombreArchivo)) {
              cantAdjuntos++;
            }
          }
        }
        trama.n_flag_archivos = cantAdjuntos;
      } else {
        trama.n_flag_archivos = 0;
      }
    });
  }

  private validarDni(dni: string): boolean {
    return this.regexDni.test(dni);
  }

  public validarNombreAdjunto(nombreArchivo: string): boolean {
    if (nombreArchivo.endsWith('.pdf') || nombreArchivo.endsWith('.PDF')) {
      return this.regexAdjuntoCv.test(nombreArchivo);
    }
    if (nombreArchivo.endsWith('.jpg') || nombreArchivo.endsWith('.JPG')) {
      return this.regexAdjuntoFoto.test(nombreArchivo);
    }
  }

  public validarTamanioArchivos(archivo: File): boolean {
    if (archivo.type === 'application/pdf') {
      return archivo.size <= this.tamanioMaxPdf;
    } else if (archivo.type === 'image/jpeg') {
      return archivo.size <= this.tamanioMaxJpg;
    }
  }

}
