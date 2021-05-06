import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { FormularioDatosBasicosComponent } from '../../components/formulario-datos-basicos/formulario-datos-basicos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormularioDatosPlanillaComponent } from '../../components/formulario-datos-planilla/formulario-datos-planilla.component';
import { FormularioDatosSedapalComponent } from '../../components/formulario-datos-sedapal/formulario-datos-sedapal.component';
import { TipoCargoApiService } from 'src/app/services/impl/tipo-cargo-api.service';
import { Response } from 'src/app/models/response';
import { OficinasService } from 'src/app/services/impl/oficinas.service';
import { Oficina } from 'src/app/models/oficina';
import { ItemApiService } from 'src/app/services/impl/item-api.service';
import { CargoApiService } from 'src/app/services/impl/cargo-api.service';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { Cargo } from 'src/app/models/interface/cargo';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { Item } from 'src/app/models/item';
import { Archivo } from 'src/app/models/interface/archivo';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { Empresa } from 'src/app/models';
import { Estado } from 'src/app/models/interface/estado';
import AgcUtil from 'src/app/modules/shared/util/agc-util';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { AccionesMantPersonal } from 'src/app/models/enums/acciones-mant-personal.enum';

@Component({
  selector: 'app-registro-personal',
  templateUrl: './registro-personal.component.html',
  styleUrls: ['./registro-personal.component.scss']
})
export class RegistroPersonalComponent implements OnInit, OnDestroy {

  empresaUsuarioSesion: Empresa;
  flagRegistroSedapal: boolean = false;
  loading = false;
  registerForm: FormGroup;
  @ViewChild(FormularioDatosBasicosComponent) formularioDatosBasicos: FormularioDatosBasicosComponent;
  @ViewChild(FormularioDatosPlanillaComponent) formularioDatosPlanilla: FormularioDatosPlanillaComponent;
  @ViewChild(FormularioDatosSedapalComponent) formularioDatosSedapal: FormularioDatosSedapalComponent;
  @ViewChild('confirmacionGuardar') modalConfirmacionGuardar: SwalComponent;

  constructor(private router: Router, private toastrService: ToastrService, private tipoCargoApiService: TipoCargoApiService,
    private formBuilder: FormBuilder, private perfilService: PerfilService,
    private oficinasService: OficinasService, private itemApiService: ItemApiService, private cargoApiService: CargoApiService,
    private personalContratistaApiService: PersonalContratistaApiService, private toastrUtilService: ToastrUtilService) {
    this.empresaUsuarioSesion = JSON.parse(sessionStorage.getItem('EmpresaUsuarioSesion'));
    this.registerForm = this.formBuilder.group({
      datosBasicos: [],
      datosPlanilla: [],
      datosSedapal: []
    });
    this.setTipoRegistro();
  }

  guardar() {
    this.loading = true;
    this.personalContratistaApiService.registrarPersonalContratista(this.mapearPersonal()).subscribe(
      (response: Response) => {
        this.loading = false;
        if (response.estado === 'OK') {
          StorageUtil.almacenarObjetoSession(this.mapearPersonal(), 'registroPersonalRequest');
          StorageUtil.almacenarObjetoSession('REGISTRADO', 'flagRegistrado');
          this.toastrUtilService.showSuccess(Mensajes.MENSAJE_OK_REGISTRO_PERSONAL);
          this.router.navigate(['/mantenimiento-personal-contratista/bandeja-personal']);
        } else {
          StorageUtil.almacenarObjetoSession('NOREGISTRADO', 'flagRegistrado');
          this.toastrUtilService.showError(response.error.mensaje);
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastrUtilService.showError(error.error.error.mensaje);
      });
  }

  mapearPersonal(): PersonalContratista {
    const personalContratista: PersonalContratista = {};
    // Datos basicos
    personalContratista.numeroDocumento = this.registerForm.value.datosBasicos.dni;
    personalContratista.nombres = this.registerForm.value.datosBasicos.nombres.toUpperCase();
    personalContratista.apellidoPaterno = this.registerForm.value.datosBasicos.apellidoPaterno.toUpperCase();
    personalContratista.apellidoMaterno = this.registerForm.value.datosBasicos.apellidoMaterno.toUpperCase();
    personalContratista.direccion = this.registerForm.value.datosBasicos.direccion;
    personalContratista.fechaNacimiento = FechaUtil.DateToStringDDMMYYYY(this.registerForm.value.datosBasicos.fechaNacimiento);
    personalContratista.correoElectronico = this.registerForm.value.datosBasicos.correoElectronico;
    personalContratista.telefonoPersonal = this.registerForm.value.datosBasicos.telefonoPersonal;
    personalContratista.telefonoAsignado = this.registerForm.value.datosBasicos.celularAsignado;
    personalContratista.codigoEmpleadoContratista = this.registerForm.value.datosBasicos.codigoContratista;
    personalContratista.usuarioCreacion = StorageUtil.recuperarObjetoSession('credenciales').usuario;
    const item: Item = {};
    item.id = this.registerForm.value.datosBasicos.item;
    personalContratista.item = item;
    const cargo: Cargo = {};
    cargo.id = this.registerForm.value.datosBasicos.cargo;
    personalContratista.cargo = cargo;
    const oficina: Oficina = new Oficina;
    oficina.codigo = this.registerForm.value.datosBasicos.oficina;
    personalContratista.oficina = oficina;
    const fotoFile: Archivo = {};
    fotoFile.dataArchivo = this.registerForm.value.datosBasicos.fotoData;
    fotoFile.nombreArchivo = this.formularioDatosBasicos.nombreArchivoFoto.toUpperCase();
    fotoFile.tipoArchivo = (new RegExp(`(?:\.([^.]+))?$`).exec(this.formularioDatosBasicos.nombreArchivoFoto)[1]).toUpperCase();
    personalContratista.archivoFotoPersonal = fotoFile;
    const cvFile: Archivo = {};
    cvFile.dataArchivo = this.registerForm.value.datosBasicos.cvData;
    cvFile.nombreArchivo = this.formularioDatosBasicos.nombreArchivoCV.toUpperCase();
    cvFile.tipoArchivo = (new RegExp(`(?:\.([^.]+))?$`).exec(this.formularioDatosBasicos.nombreArchivoCV)[1]).toUpperCase();
    personalContratista.archivoCvPersonal = cvFile;
    const empresa: Empresa = new Empresa;
    if (this.flagRegistroSedapal) {
      empresa.codigo = this.registerForm.value.datosBasicos.contratista;
    } else {
      empresa.codigo = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
    }
    personalContratista.contratista = empresa;
    // Datos de planilla
    personalContratista.fechaIngreso = FechaUtil.DateToStringDDMMYYYY(this.registerForm.value.datosPlanilla.fechaIngreso);
    const estadoLaboral: Estado = {};
    estadoLaboral.id = this.registerForm.value.datosPlanilla.estadoLaboral;
    personalContratista.estadoLaboral = estadoLaboral;
    // Datos de Sedapal
    const estadoPersonal: Estado = {};
    estadoPersonal.id = this.registerForm.value.datosSedapal.estadoCodigo;
    personalContratista.estadoPersonal = estadoPersonal;

    return personalContratista;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('accionMantenimiento');
  }

  ngOnInit() {
    this.registerForm.patchValue({
      datosBasicos: this.formularioDatosBasicos.value,
      datosPlanilla: this.formularioDatosPlanilla.value,
      datosSedapal: this.formularioDatosSedapal.value
    });
    this.obtenerTiposCargo();
    this.obtenerOficinas();
    this.obtenerItems();
  }

  obtenerCargos(codigoTipoCargo: string) {
    this.cargoApiService.obtenerListaCargos(codigoTipoCargo).subscribe((response: Response) => {
      this.formularioDatosBasicos.listaCargos = AgcUtil.ObjectToArray(response.resultado);
    },
      (error: any) => {
        this.toastrService.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      });
  }

  obtenerItems() {
    if (!this.flagRegistroSedapal) {
      const codigoEmpresa = Number.parseInt(sessionStorage.getItem('idEmpresa').toString());
      const codigoOficina = Number.parseInt(sessionStorage.getItem('codOficina').toString());
      this.itemApiService.obtenerListaItemEmpresa(codigoEmpresa, codigoOficina).subscribe((response: Response) => {
        this.formularioDatosBasicos.listaItems = AgcUtil.ObjectToArray(response.resultado);
      },
        (error: any) => {
          this.toastrService.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        });
    }
  }


  obtenerOficinas() {
    const codigoTrabajador = Number.parseInt(sessionStorage.getItem('codigoTrabajador').toString());
    this.oficinasService.retornarOficinaLogin(codigoTrabajador).subscribe((response: Response) => {
      this.formularioDatosBasicos.listaOficinas = AgcUtil.ObjectToArray(response.resultado);
    },
      (error: any) => {
        this.toastrService.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      });
  }

  obtenerTiposCargo() {
    this.tipoCargoApiService.obtenerListaTipoCargo().subscribe((response: Response) => {
      this.formularioDatosBasicos.listaTipoCargo = response.resultado;
    },
      (error: any) => {
        this.toastrService.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      });
  }

  regresar() {
    this.router.navigate(['/mantenimiento-personal-contratista/bandeja-personal']);
  }

  private setTipoRegistro(): void {
    if ((this.perfilService.esAnalistaInterno() || this.perfilService.esResponsableInterno())
      && this.perfilService.validarAccion(AccionesMantPersonal.REGISTRAR_PERSONAL)) {
      this.flagRegistroSedapal = true;
    } else {
      this.flagRegistroSedapal = false;
    }
  }

  submit() {
    this.formularioDatosBasicos.submit();
    this.formularioDatosPlanilla.submit();
    const nombreCvValido = this.formularioDatosBasicos.validarNombreCV();
    const nombreFotoValido = this.formularioDatosBasicos.validarNombreFoto();
    if (nombreCvValido && nombreFotoValido && this.registerForm.valid) {
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
