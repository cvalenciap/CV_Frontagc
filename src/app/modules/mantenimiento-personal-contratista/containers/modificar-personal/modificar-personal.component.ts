import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { FormularioDatosBasicosComponent } from '../../components/formulario-datos-basicos/formulario-datos-basicos.component';
import { FormularioDatosPlanillaComponent } from '../../components/formulario-datos-planilla/formulario-datos-planilla.component';
import { FormularioDatosSedapalComponent } from '../../components/formulario-datos-sedapal/formulario-datos-sedapal.component';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { Response } from 'src/app/models/response';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { Archivo } from 'src/app/models/interface/archivo';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import AgcUtil from 'src/app/modules/shared/util/agc-util';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/models/interface/solicitud';
import { Cargo } from 'src/app/models/interface/cargo';
import { Estado } from 'src/app/models/interface/estado';
import { TipoSolicitud } from 'src/app/models/enums/tipo-solicitud.enum';
import { Item } from 'src/app/models/item';
import { SolicitudApiService } from 'src/app/services/impl/solicitud-api.service';
import { Parametro } from 'src/app/models/parametro';
import { Oficina } from 'src/app/models/oficina';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';

@Component({
  selector: 'app-modificar-personal',
  templateUrl: './modificar-personal.component.html',
  styleUrls: ['./modificar-personal.component.scss']
})
export class ModificarPersonalComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  indEstadoAltaPersonal: boolean;
  listaSolicitudesCambioCargo: Solicitud[];
  listaSolicitudesMovimiento: Solicitud[];
  loading = false;
  personal: PersonalContratista;
  registerForm: FormGroup;
  @ViewChild(FormularioDatosBasicosComponent) formularioDatosBasicos: FormularioDatosBasicosComponent;
  @ViewChild(FormularioDatosPlanillaComponent) formularioDatosPlanilla: FormularioDatosPlanillaComponent;
  @ViewChild(FormularioDatosSedapalComponent) formularioDatosSedapal: FormularioDatosSedapalComponent;
  @ViewChild('confirmacionGuardar') modalConfirmacionGuardar: SwalComponent;

  aprobarSolicitud(solicitud: any) {
    solicitud.codigoEmpleado = this.personal.codigoEmpleado;
    solicitud.usuarioModificacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    this.solicitudApiService.aprobarSolicitud(solicitud).subscribe(
      (response: Response) => {
        this.toastrUtilService.showSuccess(response.resultado);
        /* if (solicitud.tipoSolicitud === TipoSolicitud.SOLICITUD_CAMBIO_CARGO.toString()) {
          this.listarSolicitudesCambioCargo();
        } else if (solicitud.tipoSolicitud === TipoSolicitud.SOLICITUD_MOVIMIENTO.toString()) {
          this.listarSolicitudesMovimiento();
        } */
        StorageUtil.almacenarObjetoSession(this.personal, 'personalSolicitudAprobada');
        this.router.navigateByUrl('/mantenimiento-personal-contratista/bandeja-personal');
      },
      (error: any) => {
        console.error(error);
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  constructor(private router: Router, private solicitudApiService: SolicitudApiService,
    private mantenimientoPersonalService: MantenimientoPersonalService,
    private formBuilder: FormBuilder,
    private personalContratistaApiService: PersonalContratistaApiService,
    private toastrUtilService: ToastrUtilService,
    private perfilService: PerfilService) {
    this.personal = JSON.parse(sessionStorage.getItem('personalContratista'));
    this.registerForm = this.formBuilder.group({
      datosBasicos: [],
      datosPlanilla: [],
      datosSedapal: []
    });
  }

  guardar(): void {
    this.loading = true;
    this.personalContratistaApiService.actualizarPersonalContratista(this.mapearPersonal()).subscribe(
      (response: Response) => {
        this.loading = false;
        if (response.estado === 'OK') {
          this.router.navigate(['/mantenimiento-personal-contratista/bandeja-personal']);
          this.toastrUtilService.showSuccess(Mensajes.MENSAJE_OK_ACTUALIZACION_PERSONAL);
        } else {
          this.toastrUtilService.showError(response.error.mensaje);
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  private limpiarObjetosSession(): void {
    StorageUtil.removerSession('personalSolicitudAprobada');
  }

  listarSolicitudesCambioCargo() {
    this.solicitudApiService.obtenerListaSolicitudCambioCargo(this.personal.codigoEmpleado).subscribe((response: Response) => {
      if (response.estado === 'OK') {
        this.listaSolicitudesCambioCargo = response.resultado;
      } else {
        this.toastrUtilService.showError(response.error.mensaje);
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  listarSolicitudesMovimiento() {
    this.solicitudApiService.obtenerListaSolicitudMovimiento(this.personal.codigoEmpleado).subscribe((response: Response) => {
      if (response.estado === 'OK') {
        this.listaSolicitudesMovimiento = response.resultado;
      } else {
        this.toastrUtilService.showError(response.error.mensaje);
      }
    },
      (error: any) => {
        this.toastrUtilService.showError(error.error.error.mensaje);
      });

  }

  mapearPersonal(): PersonalContratista {
    const personalContratista: PersonalContratista = {};
    // Datos basicos
    personalContratista.codigoEmpleado = this.registerForm.value.datosBasicos.codigoEmpleado;
    personalContratista.nombres = this.registerForm.value.datosBasicos.nombres.toUpperCase();
    personalContratista.apellidoPaterno = this.registerForm.value.datosBasicos.apellidoPaterno.toUpperCase();
    personalContratista.apellidoMaterno = this.registerForm.value.datosBasicos.apellidoMaterno.toUpperCase();
    personalContratista.direccion = this.registerForm.value.datosBasicos.direccion;
    personalContratista.fechaNacimiento = FechaUtil.DateToStringDDMMYYYY(this.registerForm.value.datosBasicos.fechaNacimiento);
    personalContratista.correoElectronico = this.registerForm.value.datosBasicos.correoElectronico;
    personalContratista.telefonoPersonal = this.registerForm.value.datosBasicos.telefonoPersonal;
    personalContratista.telefonoAsignado = this.registerForm.value.datosBasicos.celularAsignado;
    personalContratista.codigoEmpleadoContratista = this.registerForm.value.datosBasicos.codigoContratista;
    personalContratista.usuarioModificacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    if (this.formularioDatosBasicos.indCambioFoto) {
      const fotoFile: Archivo = {};
      fotoFile.dataArchivo = this.registerForm.value.datosBasicos.fotoData;
      fotoFile.nombreArchivo = this.formularioDatosBasicos.nombreArchivoFoto.toUpperCase();
      fotoFile.tipoArchivo = (AgcUtil.patternGetExtencionFile.exec(this.formularioDatosBasicos.nombreArchivoFoto)[1]).toUpperCase();
      personalContratista.archivoFotoPersonal = fotoFile;
      const fotoFileAnterior: Archivo = {};
      fotoFileAnterior.id = this.formularioDatosBasicos.personal.archivoFotoPersonal.id;
      fotoFileAnterior.rutaArchivo = this.formularioDatosBasicos.personal.archivoFotoPersonal.rutaArchivo;
      personalContratista.archivoFotoPersonalAnterior = fotoFileAnterior;
    }
    if (this.formularioDatosBasicos.indCambioCV) {
      const cvFile: Archivo = {};
      cvFile.dataArchivo = this.registerForm.value.datosBasicos.cvData;
      cvFile.nombreArchivo = this.formularioDatosBasicos.nombreArchivoCV.toUpperCase();
      cvFile.tipoArchivo = (AgcUtil.patternGetExtencionFile.exec(this.formularioDatosBasicos.nombreArchivoCV)[1]).toUpperCase();
      personalContratista.archivoCvPersonal = cvFile;
      const cvFileAnterior: Archivo = {};
      cvFileAnterior.id = this.formularioDatosBasicos.personal.archivoCvPersonal.id;
      cvFileAnterior.rutaArchivo = this.formularioDatosBasicos.personal.archivoCvPersonal.rutaArchivo;
      personalContratista.archivoCvPersonalAnterior = cvFileAnterior;
    }
    // Datos de planilla
    personalContratista.fechaIngreso = FechaUtil.DateToStringDDMMYYYY(this.registerForm.value.datosPlanilla.fechaIngreso);
    return personalContratista;
  }

  mapearSolicitudCambioCargo(formSolicitud: any): Solicitud {
    const solicitud: Solicitud = {};
    solicitud.tipoSolicitud = formSolicitud.tipoSolicitud;
    solicitud.fechaSolicitud = formSolicitud.fechaSolicitud;
    solicitud.descripcionSolicitud = formSolicitud.descripcion;
    /* Motivo solicitud */
    const motivoSolicitud: Parametro = new Parametro();
    motivoSolicitud.codigo = formSolicitud.motivo;
    solicitud.motivoSolicitud = motivoSolicitud;
    /* Datos Personal */
    const personal: PersonalContratista = {};
    personal.codigoEmpleado = this.personal.codigoEmpleado;
    personal.apellidoPaterno = this.personal.apellidoPaterno;
    personal.apellidoMaterno = this.personal.apellidoMaterno;
    personal.nombres = this.personal.nombres;
    personal.numeroDocumento = this.personal.numeroDocumento;
    personal.contratista = this.personal.contratista;
    solicitud.personal = personal;
    /* Estado */
    const estado: Estado = {};
    estado.id = formSolicitud.estado;
    solicitud.estadoSolicitud = estado;
    /* Cargo actual */
    solicitud.cargoActual = this.personal.cargo;
    /* Cargo destino */
    const cargoDestino: Cargo = {};
    cargoDestino.id = formSolicitud.cargoNuevo;
    solicitud.cargoDestino = cargoDestino;
    /* Item actual */
    solicitud.itemActual = this.personal.item;
    /* Item destino */
    solicitud.itemDestino = this.personal.item;
    /* Oficina actual */
    solicitud.oficinaActual = this.personal.oficina;
    /* Oficina destino */
    solicitud.oficinaDestino = this.personal.oficina;
    /* Auditoria */
    solicitud.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    return solicitud;
  }

  mapearSolicitudMovimiento(formSolicitud: any): Solicitud {
    const solicitud: Solicitud = {};
    solicitud.tipoSolicitud = formSolicitud.tipoSolicitud;
    solicitud.fechaSolicitud = formSolicitud.fechaSolicitud;
    solicitud.descripcionSolicitud = formSolicitud.descripcion;
    /* Motivo solicitud */
    const motivoSolicitud: Parametro = new Parametro();
    motivoSolicitud.codigo = formSolicitud.motivo;
    solicitud.motivoSolicitud = motivoSolicitud;
    /* Datos Personal */
    const personal: PersonalContratista = {};
    personal.codigoEmpleado = this.personal.codigoEmpleado;
    personal.apellidoPaterno = this.personal.apellidoPaterno;
    personal.apellidoMaterno = this.personal.apellidoMaterno;
    personal.nombres = this.personal.nombres;
    personal.numeroDocumento = this.personal.numeroDocumento;
    personal.contratista = this.personal.contratista;
    solicitud.personal = personal;
    /* Estado */
    const estado: Estado = {};
    estado.id = formSolicitud.estado;
    solicitud.estadoSolicitud = estado;
    /* Cargo actual */
    solicitud.cargoActual = this.personal.cargo;
    /* Cargo destino */
    if (formSolicitud.cargo) {
      const cargoDestino: Cargo = {};
      cargoDestino.id = formSolicitud.cargo;
      solicitud.cargoDestino = cargoDestino;
    } else {
      solicitud.cargoDestino = this.personal.cargo;
    }
    /* Item actual */
    solicitud.itemActual = this.personal.item;
    /* Item destino */
    if (formSolicitud.item) {
      const itemDestino: Item = {};
      itemDestino.id = formSolicitud.item;
      solicitud.itemDestino = itemDestino;
    } else {
      solicitud.itemDestino = this.personal.item;
    }
    /* Oficina actual */
    solicitud.oficinaActual = this.personal.oficina;
    /* Oficina destino */
    const oficinaDestino: Oficina = new Oficina();
    oficinaDestino.codigo = formSolicitud.oficina;
    solicitud.oficinaDestino = oficinaDestino;
    /* Auditoria */
    solicitud.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    return solicitud;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('accionMantenimiento');
    sessionStorage.removeItem('personalContratista');
    this.subscription.unsubscribe();
    this.mantenimientoPersonalService.resetRegistroSolicitud();
  }

  ngOnInit() {
    this.limpiarObjetosSession();
    if (this.personal.estadoPersonal.id === EstadoPersonal.ALTA) {
      this.indEstadoAltaPersonal = true;
    } else {
      this.indEstadoAltaPersonal = false;
    }

    this.registerForm.patchValue({
      datosBasicos: this.formularioDatosBasicos.value,
      datosPlanilla: this.formularioDatosPlanilla.value,
      datosSedapal: this.formularioDatosSedapal.value
    });

    this.subscription = this.mantenimientoPersonalService.crearSolicitud$
      .subscribe(formSolicitud => {
        if (formSolicitud !== 0) {
          if (formSolicitud.tipoSolicitud === TipoSolicitud.SOLICITUD_CAMBIO_CARGO) {
            this.registrarSolicitudCambioCargo(this.mapearSolicitudCambioCargo(formSolicitud));
          } else {
            this.registrarSolicitudMovimiento(this.mapearSolicitudMovimiento(formSolicitud));
          }
        }
      });
  }

  rechazarSolicitud(solicitud: Solicitud) {
    solicitud.codigoEmpleado = this.personal.codigoEmpleado;
    solicitud.usuarioModificacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    this.solicitudApiService.rechazarSolicitud(solicitud).subscribe(
      (response: Response) => {
        this.toastrUtilService.showSuccess(response.resultado);
        if (solicitud.tipoSolicitud === TipoSolicitud.SOLICITUD_CAMBIO_CARGO.toString()) {
          this.listarSolicitudesCambioCargo();
        } else if (solicitud.tipoSolicitud === TipoSolicitud.SOLICITUD_MOVIMIENTO.toString()) {
          this.listarSolicitudesMovimiento();
        }
      },
      (error: any) => {
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  registrarSolicitudCambioCargo(solicitud: Solicitud) {
    this.solicitudApiService.registrarSolicitudCambioCargo(solicitud).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
          this.toastrUtilService.showSuccess(response.resultado);
          this.listarSolicitudesCambioCargo();
        } else {
          this.toastrUtilService.showError(response.error.mensaje);
        }
      },
      (error: any) => {
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  registrarSolicitudMovimiento(solicitud: Solicitud) {
    this.solicitudApiService.registrarSolicitudMovimiento(solicitud).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
          this.toastrUtilService.showSuccess(response.resultado);
          this.listarSolicitudesMovimiento();
        } else {
          this.toastrUtilService.showError(response.error.mensaje);
        }
      },
      (error: any) => {
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  regresar() {
    this.router.navigate(['/mantenimiento-personal-contratista/bandeja-personal']);
  }

  submit() {
    this.formularioDatosBasicos.submit();
    this.formularioDatosPlanilla.submit();
    if (this.registerForm.valid) {
      this.modalConfirmacionGuardar.show();
    } else {
      if (!this.registerForm.controls.datosBasicos.valid) {
        this.toastrUtilService.showWarning('Existen campos obligatorios en Datos Basicos sin completar.');
      } else if (!this.registerForm.controls.datosPlanilla.valid) {
        this.toastrUtilService.showWarning('Existen campos obligatorios en Datos de Planilla sin completar.');
      }
    }
  }

}
