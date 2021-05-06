import { Component, OnInit, ChangeDetectorRef, forwardRef, OnDestroy, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { FormBuilder, FormGroup, Validators, NgForm, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';
import { BsLocaleService, enGbLocale, defineLocale } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { TipoCargo } from 'src/app/models/interface/tipo-cargo';
import { Oficina, Empresa } from 'src/app/models';
import { Item } from 'src/app/models/item';
import { Cargo } from 'src/app/models/interface/cargo';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Response } from '../../../../models';
import { RequestParametro } from 'src/app/models/request/request-parametro';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { Constantes } from 'src/app/models/enums/constantes';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { DocumentosService } from 'src/app/services/impl/documentos.service';
import { environment } from 'src/environments/environment';
import { fotoPersonalContratista } from '../../mock/data-valores-por-defecto';
import AgcUtil from 'src/app/modules/shared/util/agc-util';
import { Parametro } from 'src/app/models/enums/parametro';
import { CargosPersonal } from 'src/app/models/enums/tipo-cargos-personal.enum';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';
import { ItemApiService } from 'src/app/services/impl/item-api.service';

@Component({
  selector: 'app-formulario-datos-basicos',
  templateUrl: './formulario-datos-basicos.component.html',
  styleUrls: ['./formulario-datos-basicos.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormularioDatosBasicosComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormularioDatosBasicosComponent),
      multi: true,
    }
  ]
})
export class FormularioDatosBasicosComponent implements OnInit, ControlValueAccessor, OnDestroy {

  // TODO: Ver Detalle
  dataPersonalDetalle: PersonalContratista;
  cvDetalle: boolean = false;
  // TODO: Fin Ver Detalle
  @Output() buscarCargoEmit = new EventEmitter();
  @ViewChild('photoFileInput') photoFileInput: ElementRef;
  @ViewChild('cvFileInput') cvFileInput: ElementRef;

  angForm: FormGroup;
  config: MantenimientoPersonalConfig;
  flagRegistroSedapal: boolean = false;
  isSubmitted: boolean;
  indCambioFoto: boolean;
  indCambioCV: boolean;
  listaCargos: Cargo[];
  listaContratistas: Empresa[] = [];
  listaItems: Item[];
  listaOficinas: Oficina[];
  listaTipoCargo: TipoCargo[];
  mensajeValidacionCV: string;
  mensajeValidacionFoto: string;
  nombreArchivoCV: string;
  nombreArchivoFoto: string;
  personal: PersonalContratista;
  subscriptions: Subscription[] = [];
  fotoDefault: string;
  flagVistaDetalle: boolean = false;

  async obtenerFotoBase64FileServer(rutaArchivo: string) {
    const ruta = environment.fileServerServiceEndpoint + rutaArchivo;
    await this.obtenerDataBase64FileServer(ruta)
      .then(data => {
        this.angForm.patchValue({
          fotoData: 'data:image/jpeg;base64,' + data.resultado
        });
      })
      .catch(error => {
        console.error('Error al recuperar foto:', error.error.error.mensaje);
      });
  }

  buscarCargo(value: string) {
    if (value === CargosPersonal.CARGO_ATENC_PUBLICO || value === CargosPersonal.CARGO_SOPORTE_ADMIN) {
      this.angForm.controls['celularAsignado'].clearValidators();
      this.angForm.controls['celularAsignado'].updateValueAndValidity();
    } else {
      this.angForm.controls['celularAsignado'].setValidators([Validators.required]);
      this.angForm.controls['celularAsignado'].updateValueAndValidity();
    }
    this.buscarCargoEmit.emit(value);
  }

  constructor(private mantenimientoPersonalService: MantenimientoPersonalService, private fb: FormBuilder,
    private toastrUtilService: ToastrUtilService, private localeService: BsLocaleService,
    private cd: ChangeDetectorRef, private parametrosService: ParametrosService,
    private documentosService: DocumentosService, private perfilService: PerfilService,
    private itemApiService: ItemApiService) {
    // Inicio - Borro texto 'INVALID DATE' del datepicker
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    // Fin
    this.config = this.mantenimientoPersonalService.configVentanaPorOpcion();
    const accionMantenimiento = sessionStorage.getItem('accionMantenimiento');

    if (accionMantenimiento === 'REGISTRAR') {
      if ((this.perfilService.esAnalistaInterno() || this.perfilService.esResponsableInterno())
        && this.perfilService.validarAccion(AccionesMantPersonal.REGISTRAR_PERSONAL)) {
        this.flagRegistroSedapal = true;
        this.obtenerContratistas();
        this.crearFormularioRegistroSedapal();
      } else {
        this.crearFormularioRegistro();
      }
    } else if (accionMantenimiento === 'MODIFICAR') {
      this.crearFormularioModificacion();
      if (this.personal.estadoPersonal.id === EstadoPersonal.ALTA) {
        this.bloquearCamposInformacionPersonal();
      }
    } else if (accionMantenimiento === 'VISUALIZAR') {
      this.dataPersonalDetalle = StorageUtil.recuperarObjetoSession('dataPersonalDetalle');
      this.cvDetalle = true;
      this.flagVistaDetalle = true;
      this.crearFormularioConsulta();
    }

    this.indCambioFoto = false;
    this.indCambioCV = false;
    this.subscriptions.push(
      this.angForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  bloquearCamposInformacionPersonal() {
    this.config.inputNombres = false;
    this.config.inputApellidoPaterno = false;
    this.config.inputApellidoMaterno = false;
    this.config.inputDireccion = false;
    this.config.inputFechaNacimiento = false;
    this.config.inputCorreo = false;
    this.config.inputTelfonoPersonal = false;
    this.config.inputCelularAsignado = false;
    this.config.inputCodigoContratista = false;
    this.config.botonCargarFoto = false;
    this.config.botonCargarCV = false;
  }

  public buscarItem(codEmpresa: string) {
    this.itemApiService.obtenerListaItemEmpresa(Number.parseInt(codEmpresa), StorageUtil.recuperarObjetoSession('codOficina'))
      .toPromise()
      .then((response: Response) => {
        this.listaItems = AgcUtil.ObjectToArray(response.resultado);
      })
      .catch(err => {
        console.error(err);
        this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      });
  }

  private obtenerContratistas(): void {
    this.listaContratistas = StorageUtil.recuperarObjetoSession('parametrosUsuario').listaEmpresa;
  }

  crearFormularioRegistro() {
    this.nombreArchivoFoto = '';
    this.nombreArchivoCV = '';
    this.fotoDefault = fotoPersonalContratista;
    this.angForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(AgcUtil.patterDNI)]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
      tipoCargo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      item: ['', Validators.required],
      cargo: ['', Validators.required],
      correoElectronico: ['', [Validators.pattern(AgcUtil.patternEmail)]],
      oficina: ['', Validators.required],
      telefonoPersonal: [''],
      celularAsignado: ['', Validators.required],
      codigoContratista: [''],
      fotoData: ['', Validators.required],
      cvData: ['', Validators.required]
    });
  }

  crearFormularioRegistroSedapal() {
    this.nombreArchivoFoto = '';
    this.nombreArchivoCV = '';
    this.fotoDefault = fotoPersonalContratista;
    this.angForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(AgcUtil.patterDNI)]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
      tipoCargo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      contratista: ['', Validators.required],
      item: ['', Validators.required],
      cargo: ['', Validators.required],
      correoElectronico: ['', [Validators.pattern(AgcUtil.patternEmail)]],
      oficina: ['', Validators.required],
      telefonoPersonal: [''],
      celularAsignado: [''],
      codigoContratista: [''],
      fotoData: ['', Validators.required],
      cvData: ['', Validators.required]
    });
  }

  crearFormularioModificacion() {
    this.personal = JSON.parse(sessionStorage.getItem('personalContratista'));
    this.fillCombosPersonal(this.personal);
    this.nombreArchivoFoto = '';
    this.angForm = this.fb.group({
      codigoEmpleado: [this.personal.codigoEmpleado],
      dni: [this.personal.numeroDocumento, [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(AgcUtil.patterDNI)]],
      nombres: [this.personal.nombres, Validators.required],
      apellidoPaterno: [this.personal.apellidoPaterno, Validators.required],
      apellidoMaterno: [this.personal.apellidoMaterno, Validators.required],
      direccion: [this.personal.direccion, Validators.required],
      tipoCargo: [this.personal.tipoCargo.id, Validators.required],
      fechaNacimiento: [FechaUtil.StringDDMMYYYYToDate(this.personal.fechaNacimiento), Validators.required],
      item: [this.personal.item.id, Validators.required],
      cargo: [this.personal.cargo.id, Validators.required],
      correoElectronico: [this.personal.correoElectronico, [Validators.pattern(AgcUtil.patternEmail)]],
      oficina: [this.personal.oficina.codigo, Validators.required],
      telefonoPersonal: [this.personal.telefonoPersonal],
      celularAsignado: [this.personal.telefonoAsignado, Validators.required],
      codigoContratista: [this.personal.codigoEmpleadoContratista],
      fotoData: ['', Validators.required],
      cvData: [this.personal.archivoCvPersonal ? this.personal.archivoCvPersonal.rutaArchivo : '', Validators.required]
    });
    // this.obtenerFotoBase64FileServer(this.personal.archivoFotoPersonal.rutaArchivo);
    if (this.personal.archivoFotoPersonal.rutaArchivo) {
      this.obtenerFotoBase64FileServer(this.personal.archivoFotoPersonal.rutaArchivo);
    } else {
      this.fotoDefault = fotoPersonalContratista;
    }
  }

  crearFormularioConsulta() {
    this.fillCombosPersonal(this.dataPersonalDetalle);
    this.angForm = this.fb.group({
      dni: [this.dataPersonalDetalle.numeroDocumento],
      nombres: [this.dataPersonalDetalle.nombres],
      apellidoPaterno: [this.dataPersonalDetalle.apellidoPaterno],
      apellidoMaterno: [this.dataPersonalDetalle.apellidoMaterno],
      direccion: [this.dataPersonalDetalle.direccion],
      tipoCargo: [this.dataPersonalDetalle.tipoCargo.id],
      fechaNacimiento: [this.dataPersonalDetalle.fechaNacimiento],
      contratista: [this.dataPersonalDetalle.contratista.descripcion],
      item: [this.dataPersonalDetalle.item.id],
      cargo: [this.dataPersonalDetalle.cargo.id],
      correoElectronico: [this.dataPersonalDetalle.correoElectronico],
      oficina: [this.dataPersonalDetalle.oficina.codigo],
      telefonoPersonal: [this.dataPersonalDetalle.telefonoPersonal],
      celularAsignado: [this.dataPersonalDetalle.telefonoAsignado],
      codigoContratista: [this.dataPersonalDetalle.codigoEmpleadoContratista],
      fotoData: [fotoPersonalContratista],
      cvData: [this.dataPersonalDetalle.archivoCvPersonal ? this.dataPersonalDetalle.archivoCvPersonal.rutaArchivo : '', Validators.required]
    });
    this.obtenerFotoBase64FileServer(this.dataPersonalDetalle.archivoFotoPersonal.rutaArchivo);
    // this.obtenerDataBase64FileServer(this.dataPersonalDetalle.archivoCvPersonal.rutaArchivo);
  }

  createPhotoAttachment(fileInput: any) {
    const files = fileInput.target.files;
    if (this.validarFoto(files)) {
      this.nombreArchivoFoto = files[0].name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileInBase64 = reader.result as string;
        this.angForm.patchValue({
          fotoData: reader.result
        });
      };
      reader.readAsDataURL(files[0]);
      this.indCambioFoto = true;
    }
  }

  createFileAttachment(fileInput: any) {
    const files = fileInput.target.files;
    if (this.validarCV(files)) {
      this.nombreArchivoCV = files[0].name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileInBase64 = reader.result as string;
        this.angForm.patchValue({
          cvData: reader.result
        });
      };
      reader.readAsDataURL(files[0]);
      this.indCambioCV = true;
    }
  }

  descargarCV() {
    const accionMantenimiento = sessionStorage.getItem('accionMantenimiento');
    if (accionMantenimiento === 'VISUALIZAR') {
      this.documentosService.getFile('PDF', this.dataPersonalDetalle.archivoCvPersonal.rutaArchivo).subscribe((response) => {
        saveAs(new Blob([response]), this.dataPersonalDetalle.archivoCvPersonal.nombreArchivo);
      }, (error) => {
        const errorFileServerJSON = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(error.error)));
        this.toastrUtilService.showError(errorFileServerJSON.error);
      });
    } else {
      this.documentosService.getFile('PDF', this.personal.archivoCvPersonal.rutaArchivo).subscribe((response) => {
        saveAs(new Blob([response]), this.personal.archivoCvPersonal.nombreArchivo);
      }, (error) => {
        const errorFileServerJSON = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(error.error)));
        this.toastrUtilService.showError(errorFileServerJSON.error);
      });
    }
  }

  fillCombosPersonal(personal: PersonalContratista) {
    if (personal.cargo) {
      this.listaCargos = [];
      this.listaCargos.push(personal.cargo);
    }
    if (personal.item) {
      this.listaItems = [];
      this.listaItems.push(personal.item);
    }
    if (personal.oficina) {
      this.listaOficinas = [];
      this.listaOficinas.push(personal.oficina);
    }
    if (personal.tipoCargo) {
      this.listaTipoCargo = [];
      this.listaTipoCargo.push(personal.tipoCargo);
    }
  }

  get f() { return this.angForm.controls; }

  get value(): any {
    return this.angForm.value;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
  }

  onChange: any = () => { };

  obtenerDataBase64FileServer(rutaArchivo: string) {
    return this.documentosService.obtenerArchivoBase64FileServer(rutaArchivo).toPromise();
  }

  onTouched: any = () => { };

  refreshCVFileInput() {
    this.cvFileInput.nativeElement.value = '';
  }

  refreshPhotoFileInput() {
    this.photoFileInput.nativeElement.value = '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  reset() {
    // this.mensajeValidacionCV = '';
  }

  submit() {
    this.reset();
    this.isSubmitted = true;
  }

  validarCV(files: any): boolean {
    this.mensajeValidacionCV = '';
    // Valido tipo archivo
    if (!new RegExp(`^.*\.(pdf|PDF)$`).test(files[0].name)) {
      this.mensajeValidacionCV = 'Solo se acepta archivos con extensión .PDF';
      return false;
    }
    // Valido nombre del archivo
    /*const idEmpresa = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
    const namePatt = new RegExp(`^(cv|CV)\_${idEmpresa}\_[0-9]{8}\.(pdf|PDF)$`);
    if (!namePatt.test(files[0].name)) {
      this.mensajeValidacionCV = 'El nombre del archivo debe ser: CV_' + idEmpresa + '_[DNI del personal].PDF';
      return false;
    }*/
    // Valido tamaño archivo
    const requestParametro: RequestParametro = {
      tipo: Parametro.TIPO_PARAM_TAMANO_ARCHIVO_PP as number,
      codigo: Parametro.PARAM_TAMANO_PDF_PP as number,
      estado: 'G',
      detalle: 'G',
      descripcionCorta: 'G',
      valor: 'G',
      usuario: 'G'
    };
    this.parametrosService.consultarParametros(requestParametro, 1, 1).subscribe((response: Response) => {
      const sizeParamPDFByte = response.resultado[0].valor * 1024 * 1024;
      if (files[0].size > sizeParamPDFByte) {
        this.mensajeValidacionCV = 'El tamaño del archivo PDF no debe exceder de ' + response.resultado[0].valor + ' Mb';
        return false;
      }
    }, (error) => {
      this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      return false;
    });
    return true;
  }

  validarFoto(files: any): boolean {
    this.mensajeValidacionFoto = '';
    // Valido tipo archivo
    if (!new RegExp(`^.*\.(jpg|JPG)$`).test(files[0].name)) {
      this.mensajeValidacionFoto = 'Solo se acepta archivos con extensión .JPG';
      return false;
    }
    // Valido nombre del archivo
    // const idEmpresa = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
    // const namePatt = new RegExp(`^(foto|FOTO)\_${idEmpresa}\_[0-9]{8}\.(jpg|JPG)$`);
    // if (!namePatt.test(files[0].name)) {
    //   this.mensajeValidacionFoto = 'El nombre del archivo debe ser: FOTO_' + idEmpresa + '_[DNI del personal].JPG';
    //   return false;
    // }
    // Valido tamaño archivo
    const requestParametro: RequestParametro = {
      tipo: Parametro.TIPO_PARAM_TAMANO_ARCHIVO_PP as number,
      codigo: Parametro.PARAM_TAMANO_JPG_PP as number,
      estado: 'G',
      detalle: 'G',
      descripcionCorta: 'G',
      valor: 'G',
      usuario: 'G'
    };
    this.parametrosService.consultarParametros(requestParametro, 1, 1).subscribe((response: Response) => {
      const sizeParamJPGByte = response.resultado[0].valor * 1024 * 1024;
      if (files[0].size > sizeParamJPGByte) {
        this.mensajeValidacionFoto = 'El tamaño del archivo JPG no debe exceder de ' + response.resultado[0].valor + ' Mb';
        return false;
      }
    }, (error) => {
      this.toastrUtilService.showError(Mensajes.MESSAGE_ERROR_TRANSACCION);
      return false;
    });
    return true;
  }

  validarNombreCV(): boolean {
    this.mensajeValidacionCV = '';
    let idEmpresa = 0;
    if (!this.f.dni.invalid && this.nombreArchivoCV) {
      if (this.flagRegistroSedapal) {
        if (!this.f.contratista.invalid) {
          idEmpresa = Number.parseInt(this.f.contratista.value);
        } else {
          this.toastrUtilService.showWarning('Seleccione el contratista');
        }
      } else {
        idEmpresa = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
      }
      if (idEmpresa > 0) {
        const dni = this.f.dni.value;
        const namePatt = new RegExp(`^(cv|CV)\_${idEmpresa}\_${dni}\.(pdf|PDF)$`);
        if (!namePatt.test(this.nombreArchivoCV)) {
          this.mensajeValidacionCV = 'El nombre del archivo debe ser: CV_' + idEmpresa + '_' + dni + '.PDF';
          return false;
        }
      } else {
        this.mensajeValidacionCV = 'Debe seleccionar un contratista';
        return false;
      }
    }
    return true;
  }

  validarNombreFoto(): boolean {
    this.mensajeValidacionFoto = '';
    let idEmpresa = 0;
    if (!this.f.dni.invalid && this.nombreArchivoFoto) {
      if (this.flagRegistroSedapal) {
        if (!this.f.contratista.invalid) {
          idEmpresa = Number.parseInt(this.f.contratista.value);
        } else {
          this.toastrUtilService.showWarning('Seleccione el contratista');
        }
      } else {
        idEmpresa = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
      }
      if (idEmpresa > 0) {
        const dni = this.f.dni.value;
        const namePatt = new RegExp(`^(foto|FOTO)\_${idEmpresa}\_${dni}\.(jpg|JPG)$`);
        if (!namePatt.test(this.nombreArchivoFoto)) {
          this.mensajeValidacionFoto = 'El nombre del archivo debe ser: FOTO_' + idEmpresa + '_' + dni + '.JPG';
          return false;
        }
      } else {
        this.mensajeValidacionFoto = 'Debe seleccionar un contratista';
        return false;
      }
    }
    return true;
  }

  validate(_: FormControl) {
    return this.angForm.valid ? null : { datosBasicos: { valid: false, }, };
  }

  set value(value: any) {
    this.angForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

}
