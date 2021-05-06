import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import {
  Component, OnInit, ChangeDetectorRef, OnChanges, AfterContentChecked, ViewChild,
  Input, Output, EventEmitter, SimpleChanges
} from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { Paginacion } from 'src/app/models';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { ToastrService } from 'ngx-toastr';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { Solicitud } from 'src/app/models/interface/solicitud';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { EstadoSolicitud } from 'src/app/models/enums/estado-solicitud.enum';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-formulario-movimiento-personal',
  templateUrl: './formulario-movimiento-personal.component.html',
  styleUrls: ['./formulario-movimiento-personal.component.scss']
})
export class FormularioMovimientoPersonalComponent implements OnInit, AfterContentChecked, OnChanges {

  alertOptionRechazar: SweetAlertOptions = {};
  config: MantenimientoPersonalConfig;
  enableAprobarRechazar: boolean;
  esAnalistaExterno: boolean;
  esAdmOficina: boolean;
  listaSolicitudesGrilla: any[];
  paginacion: Paginacion;
  personal: PersonalContratista;
  rowClick: number = -1;
  registroSeleccionado: Solicitud;
  @Input() listaSolicitudes: Solicitud[];
  @Output() aprobarSolicitudEmit = new EventEmitter();
  @Output() listarSolicitudes = new EventEmitter();
  @Output() rechazarSolicitudEmit = new EventEmitter();
  @ViewChild('aprobarSolicitudModal') aprobarSolicitudModal: SwalComponent;
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
    this.personal = JSON.parse(sessionStorage.getItem('personalContratista'));
  }

  eliminarMovimiento(movimiento: any) {
    const index = this.listaSolicitudes.indexOf(movimiento, 0);
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
    this.listarSolicitudesPorPagina();
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
    this.esAdmOficina = this.perfilService.esAdministradorOficina();
    this.esAnalistaExterno = this.perfilService.esAnalistaExterno();
    this.paginacion = new Paginacion({ pagina: 1, registros: 10, totalRegistros: 0 });
    // this.listarSolicitudesPorPagina();
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
