import { Injectable } from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { EventInterface } from 'src/app/models/interface/event-interface';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// import { Credenciales } from 'src/app/models/credenciales';
import { Solicitud } from 'src/app/models/interface/solicitud';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoPersonalService {

  solicitud: Solicitud;
  private subject$ = new Subject();

  // Inicio - Observable para delegar el registro de solicitud al contenedor
  private _solicitudSource = new BehaviorSubject<any>(0);
  crearSolicitud$ = this._solicitudSource.asObservable();
  // Fin

  configVentanaPorOpcion(): MantenimientoPersonalConfig {
    const accionMantenimiento = sessionStorage.getItem('accionMantenimiento');
    if (accionMantenimiento === 'REGISTRAR') {
      return this.retornarConfigCrear();
    } else if (accionMantenimiento === 'MODIFICAR') {
      return this.retornarConfigModificar();
    } else if (accionMantenimiento === 'VISUALIZAR') {
      return {};
    }
  }

  constructor() {}

  emiteEvento(event: EventInterface) {
    this.subject$.next(event);
  }

  capturaEvento(nombreEvento: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventInterface) => e.evento === nombreEvento),
      map((e: EventInterface) => e['data'])
    ).subscribe(action);
  }

  public registrarSolicitud(solicitud: any) {
    this._solicitudSource.next(solicitud);
  }

  public resetRegistroSolicitud() {
    this._solicitudSource.next(0);
  }

  retornarConfigCrear(): MantenimientoPersonalConfig {
    return {
      inputDNI: true,
      botonCargarFoto: true,
      inputNombres: true,
      inputApellidoPaterno: true,
      inputApellidoMaterno: true,
      inputDireccion: true,
      comboTipoCargo: true,
      inputFechaNacimiento: true,
      comboCargo: true,
      comboItem: true,
      comboOficina: true,
      inputCorreo: true,
      inputTelfonoPersonal: true,
      inputCelularAsignado: true,
      inputCodigoContratista: true,
      botonCargarCV: true,
      botonDescargarCV: false,
      /** */
      inputEstadoLaboral: false,
      inputFechaIngreso: true,
      inputMotivoCese: false,
      inputFechaCese: false,
      inputObservacionCese: false,
      /** */
      inputCodigoSedapal: false,
      inputEstadoCodigo: false,
      inputFechaAlta: false,
      inputFechaBaja: false
    };
  }

  retornarConfigModificar(): MantenimientoPersonalConfig {
    return {
      inputDNI: false,
      botonCargarFoto: true,
      inputNombres: true,
      inputApellidoPaterno: true,
      inputApellidoMaterno: true,
      inputDireccion: true,
      comboTipoCargo: false,
      inputFechaNacimiento: true,
      comboCargo: false,
      comboItem: false,
      comboOficina: false,
      inputCorreo: true,
      inputTelfonoPersonal: true,
      inputCelularAsignado: true,
      inputCodigoContratista: true,
      botonCargarCV: true,
      botonDescargarCV: true,
      /** */
      inputEstadoLaboral: false,
      inputFechaIngreso: true,
      inputMotivoCese: false,
      inputFechaCese: false,
      inputObservacionCese: false,
      /** */
      inputCodigoSedapal: false,
      inputEstadoCodigo: false,
      inputFechaAlta: false,
      inputFechaBaja: false,
      /* Cambio Cargo */
      inputCodigoSedapalCC: false,
      inputCargoActualCC: false,
      botonAgregarSolicitud: true,
      botonAprobarCargo: true,
      botonRechazarCargo: true,
      /* Movimiento Personal */
      inputCodigoSedapalMov: false,
      inputCargoActual: false,
      inputOficinaActual: false,
      inputItemActual: false,
      btnAprobarMovimiento: true,
      btnRechazarMovimiento: true,
      btnSolicitarMovimiento: true
    };
  }
}
