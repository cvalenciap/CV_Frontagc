import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Paginacion } from 'src/app/models';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { Solicitud } from 'src/app/models/interface/solicitud';
import { EstadoSolicitud } from 'src/app/models/enums/estado-solicitud.enum';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-formulario-cambio-cargo',
  templateUrl: './formulario-cambio-cargo.component.html',
  styleUrls: ['./formulario-cambio-cargo.component.scss']
})
export class FormularioCambioCargoComponent implements OnInit, OnChanges, AfterContentChecked {

  alertOptionRechazar: SweetAlertOptions = {};
  config: MantenimientoPersonalConfig;
  enableAprobarRechazar: boolean;
  esAnalistaExterno: boolean;
  esAdmOficina: boolean;
  listaSolicitudesGrilla: Solicitud[];
  paginacion: Paginacion;
  personal: PersonalContratista;
  registroSeleccionado: Solicitud;
  rowClick: number = -1;
  @Input() listaSolicitudes: Solicitud[];
  @Output() aprobarSolicitudEmit = new EventEmitter();
  @Output() listarSolicitudes = new EventEmitter();
  @Output() rechazarSolicitudEmit = new EventEmitter();
  @ViewChild('aprobarSolicitudModal') aprobarSolicitudModal: SwalComponent;
  @ViewChild('modalConsulta') modalConsulta: SwalComponent;
  @ViewChild('nuevaSolicitud') modalSolicitud: SwalComponent;
  @ViewChild('rechazarSolicitudModal') rechazarSolicitudModal: SwalComponent;

  aprobarSolicitud(): void {
    this.aprobarSolicitudEmit.emit(this.registroSeleccionado);
    this.reset();
  }

  cambiarPagina(event: any) {
    this.paginacion.pagina = event.page;
    this.listarSolicitudesPorPagina();
  }

  cambiarRegistrosPorPagina(event: any) {
    this.paginacion.registros = event.rows;
    this.listarSolicitudesPorPagina();
  }

  cerrarModal() {
    this.modalSolicitud.nativeSwal.close();
  }

  constructor(private mantenimientoPersonalService: MantenimientoPersonalService,
    private cdRef: ChangeDetectorRef,
    private perfilService: PerfilService,
    private toastrService: ToastrService) {
    this.listaSolicitudes = [];
    this.enableAprobarRechazar = false;
    this.personal = JSON.parse(sessionStorage.getItem('personalContratista'));
  }

  eliminarSolicitud(solicitud: any) {
    const index = this.listaSolicitudes.indexOf(solicitud, 0);
    if (index > -1) {
      this.listaSolicitudes.splice(index, 1);
    }
    this.paginacion.totalRegistros = this.listaSolicitudes.length;
    this.listarSolicitudesPorPagina();
  }

  enviarDataDetalle(solicitud: any) {
    this.mantenimientoPersonalService.solicitud = solicitud;
  }

  listarSolicitudesPorPagina(): void {
    if (this.listaSolicitudes && this.listaSolicitudes.length > 0) {
      const inicio = (this.paginacion.pagina - 1) * this.paginacion.registros;
      const fin = (this.paginacion.registros * this.paginacion.pagina);
      this.listaSolicitudesGrilla = this.listaSolicitudes.slice(inicio, fin);
    }
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
    // this.listarSolicitudesPorPagina();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listaSolicitudes) {
      this.paginacion.totalRegistros = this.listaSolicitudes.length;
      this.listarSolicitudesPorPagina();
    }
  }

  ngOnInit() {
    this.listarSolicitudes.emit();
    this.config = this.mantenimientoPersonalService.configVentanaPorOpcion();
    this.esAnalistaExterno = this.perfilService.esAnalistaExterno();
    this.esAdmOficina = this.perfilService.esAdministradorOficina();
    this.paginacion = new Paginacion({ pagina: 1, registros: 10, totalRegistros: 0 });

    this.alertOptionRechazar = {
      input: 'textarea',
      imageUrl: 'assets/images/rechazar.png',
      imageWidth: 50,
      html: '<h5>Descripción del rechazo de solicitud:</h5>',
      showCancelButton: true,
      cancelButtonText: 'No ',
      confirmButtonText: 'Aceptar ',
      focusCancel: true,
      focusConfirm: false,
      inputValidator: (value) => {
        if (!value) {
          return !value && '<strong>Por favor ingrese comentario de la observación!</strong>';
        } else if (value.length > 200) {
          return value && '<strong>El texto ingresado no debe exceder de 200 caracteres</strong>';
        }
      }
    };
  }

  mostrarModalAprobar() {
    if (this.registroSeleccionado) {
      this.aprobarSolicitudModal.show();
    } else {
      this.toastrService.warning(Mensajes.SELECCIONAR_REGISTRO, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
  }

  mostrarModalRechazo() {
    if (this.registroSeleccionado) {
      this.rechazarSolicitudModal.show();

    } else {
      this.toastrService.warning(Mensajes.SELECCIONAR_REGISTRO, Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
    }
  }

  onRowClick(solicitud: any, i: number): void {
    if (this.esAdmOficina) {
      if (i === this.rowClick) {
        this.rowClick = -1;
        this.registroSeleccionado = null;
      } else {
        this.rowClick = i;
        this.registroSeleccionado = solicitud;
        this.enableAprobarRechazar = solicitud.estadoSolicitud.id === EstadoSolicitud.PENDIENTE_APROBACION ? true : false;
      }
    }
  }

  rechazarSolicitud(mensaje: string): void {
    this.registroSeleccionado.observacionRechazo = mensaje;
    this.rechazarSolicitudEmit.emit(this.registroSeleccionado);
    this.reset();
  }

  reset() {
    this.enableAprobarRechazar = false;
    this.rowClick = -1;
    this.registroSeleccionado = null;
  }

}
