import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Credenciales } from '../../models/credenciales';
import { CargaTrabajo } from '../../models/CargaTrabajo';
import { Response } from '../../models';
import { Error } from '../../models/response';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { CargasTrabajoService } from 'src/app/services/impl/cargas-trabajo.service';
import { TipoAdjunto } from '../../models/enums/tipo-adjunto.enum';
import { CargaMasivaResponse } from '../../models/response/carga-masiva-response';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-cargar-archivos',
  templateUrl: './cargar-archivos.component.html',
  styleUrls: ['./cargar-archivos.component.scss']
})
export class CargarArchivosComponent implements OnInit {
  public disabledUpload: boolean;
  public showError: boolean;
  private apiEndpoint: string;
  public uploadForm: FormGroup;
  public listaForm: FormData[];
  public loading = false;
  private credenciales: Credenciales;
  private cargaTrabajo: CargaTrabajo;
  public errors: Error[];
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    allowedMimeType: ['application/pdf', 'image/jpeg']
  });
  public cargaMasivaResponse: CargaMasivaResponse;

  /* cambio carga archivos */
  totalArchivos: number = 0;
  totalSubidos: number = 0;
  totalFallidos: number = 0;
  mensajeCarga: string = '';
  /*  */

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private toastr: ToastrService,
              private service: CargasTrabajoService,
              private sessionService: SessionService) {
    this.apiEndpoint = environment.serviceEndpoint + '/piloto';
    this.listaForm = [];
    this.credenciales = JSON.parse(sessionStorage.getItem('credenciales'));
    this.cargaTrabajo = JSON.parse(localStorage.getItem('beanCargaTrabajo'));
  }

  ngOnInit() {
    this.initVariables();
    this.uploadForm = this.fb.group({
      document: [null, null],
      type: [null, Validators.compose([Validators.required])]
    });
  }

  private initVariables(): void {
    this.disabledUpload = true;
    this.showError = false;
  }

  private validateDisabled(): void {
    if (this.uploader.queue.length > 0) {
      this.disabledUpload = false;
    }
  }

  public uploadSubmit() {
    this.loading = true;
    this.service.obtenerSize().subscribe(
      async (response: Response) => {

        if (response.estado == 'OK') {
          var sizemax: number;

          for (let i = 0; i < this.uploader.queue.length; i++) {
            let tipoArchivo: string;
            let tamanioArchivo: number;

            switch (this.uploader.queue[i]._file['name'].substring(this.uploader.queue[i]._file['name'].lastIndexOf(".") + 1).toUpperCase()) {
              case "PDF":
                sizemax = Number(response.resultado.sizeMaxPDF) * 1024 * 1024;
                tipoArchivo = "PDF";
                tamanioArchivo = response.resultado.sizeMaxPDF;
                break;
              case "JPG":
                sizemax = response.resultado.sizeMaxJPG * 1024 * 1024;
                tipoArchivo = "JPG";
                tamanioArchivo = response.resultado.sizeMaxJPG;
                break;
            }

            if (this.uploader.queue[i]._file.size > sizemax) {
              this.toastr.error('El tamaño del archivo ' + tipoArchivo + ' no debe exceder de ' + tamanioArchivo + ' Mb' + " : " + this.uploader.queue[i]._file['name'], Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.loading = false;
              return;
            }
            if (this.cargaTrabajo.uidCargaTrabajo != this.uploader.queue[i]._file['name'].substring(0, this.uploader.queue[i]._file['name'].indexOf('-')) && this.cargaTrabajo.uidActividad != 'SG') {
              this.toastr.error(Mensajes.MESSAGE_VALIDACION_ARCHIVO_CARGA + " : " + this.uploader.queue[i]._file['name'], Mensajes.MESSAGE_VALIDACION_ARCHIVO);
              this.loading = false;
              return;
            }
          }
          const cantArchivos = this.uploader.queue.length;
          // if (cantArchivos > 0) {
          //   const vueltas = Math.ceil(cantArchivos / 500);
          //   let formData: FormData;
          //   for (let i = 0; i < vueltas; i++) {
          //     formData = new FormData();
          //     let fin = ((i + 1) * 500);
          //     if (i === vueltas - 1) {
          //       fin = cantArchivos;
          //     }
          //     for (let j = (i * 500); j < fin; j++) {
          //       formData.append('files', this.uploader.queue[j]._file, this.uploader.queue[j]._file['name']);
          //     }
          //     this.listaForm.push(formData);
          //   }
          //   for (let i = 0; i < vueltas; i++) {
          //     this.loading = true;
          //     this.getAsyncDataObservable(this.listaForm[i]).subscribe((response: CargaMasivaResponse) => {
          //       console.log(response);
          //       this.loading = false;
          //       this.errors = new Array<Error>();
          //       if (response.estado === 'OK') {
          //         console.log(response);
          //         this.cargaMasivaResponse = response;
          //       } else {
          //         console.log(response);
          //       }
          //       this.showError = true;
          //     }, (error) => {
          //       this.loading = false;
          //     });
          //   }
          // }

          /* mcortegana */
          if (cantArchivos > 0) {
            this.loading = true;
            for (let i = 0; i < cantArchivos; i++) {
              const formData: FormData = new FormData();
              formData.append('files', this.uploader.queue[i]._file, this.uploader.queue[i]._file['name']);
              this.listaForm.push(formData);
            }

            let continuar = true;
            this.totalArchivos = cantArchivos;

            for (let i = 0; i < this.listaForm.length; i++) {
              const element = this.listaForm[i];

              if (continuar) {
                if (i % 100 === 0) {
                  await this.sessionService.renovarCredenciales();
                }
                await this.getAsyncDataObservable(element).toPromise()
                  .then((respuesta: CargaMasivaResponse) => {
                    if (respuesta.estado === 'OK') {
                      this.totalSubidos = this.totalSubidos + respuesta.procesados;
                      this.totalFallidos = this.totalFallidos + respuesta.fallidos;
                      continuar = true;
                    } else {
                      this.mensajeCarga = respuesta.mensaje;
                      this.totalFallidos = this.totalArchivos - this.totalSubidos;
                      console.error(respuesta);
                      continuar = false;
                    }
                  }).catch(err => {
                    this.mensajeCarga = 'Ocurrió un error durante la carga de archivos';
                    this.totalFallidos = this.totalArchivos - this.totalSubidos;
                    continuar = false;
                    console.error(err);
                  });

              } else {
                break;
              }
            }

            this.loading = false;
            this.showError = true;
            console.log(this.showError);
          }
          /*  */

          // this.limpiar();

        } else {
          this.loading = false;
          this.toastr.error(response.resultado, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }

      },
      (error) => {
        this.loading = false;
        this.toastr.error('Se presentó un error al realizar carga masiva de archivos', Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }

  private readParameters(parameters: Map<string, any>): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    parameters.forEach((value, key) => {
      if (value) {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  async getAsyncData(data: FormData) {
    const parameters: Map<string, any> = new Map();
    parameters.set('usuario', this.credenciales.usuario);
    parameters.set('uidActividad', this.cargaTrabajo.uidActividad);
    const rpta = await this.http.post(`${this.apiEndpoint}/documentos`, data, { params: this.readParameters(parameters) }).toPromise();
  }

  private getAsyncDataObservable(data: FormData): Observable<CargaMasivaResponse> {
    const parameters: Map<string, any> = new Map();
    parameters.set('usuario', this.credenciales.usuario);
    parameters.set('uidActividad', this.cargaTrabajo.uidActividad);
    parameters.set('tipoAdjunto', TipoAdjunto.DETALLE);
    return this.http.post(`${this.apiEndpoint}/documentos`, data, { params: this.readParameters(parameters) });
  }

  limpiar() {
    this.totalArchivos = 0;
    this.totalSubidos = 0;
    this.totalFallidos = 0;
    this.mensajeCarga = '';
    this.listaForm.length = 0;
    this.showError = false;
    this.errors = new Array<Error>();
    this.uploader.clearQueue();
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedMimeType: ['application/pdf', 'image/jpeg']
    });
  }

}
