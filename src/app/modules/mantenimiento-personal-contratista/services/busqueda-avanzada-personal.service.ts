import { Injectable } from '@angular/core';
import { cargos, oficinas, estadosLaboral, estadosSedapal, motivosCese, solicitud, estadosSolicitud } from '../mock/data-busqueda-avanzada-personal';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { BusquedaAvanzadaConfig } from 'src/app/models/interface/busqueda-avanzada-config';
import StorageUtil from '../../shared/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class BusquedaAvanzadaPersonalService {

  constructor(private perfilService: PerfilService) {
  }

  public obtenerDataCargos() {
    return this.recuperarParametrosBandeja().cargos;
  }

  public obtenerDataOficinas() {
    return this.recuperarParametrosBandeja().oficinas;
  }

  public obtenerDataEstadoLaboral() {
    return this.recuperarParametrosBandeja().estadoLaboral;
  }

  public obtenerDataEstadoSedapal() {
    return this.recuperarParametrosBandeja().estadoPersonal;
  }

  public obtenerDataMotivosCese() {
    return this.recuperarParametrosBandeja().motivosCese;
  }

  public obtenerDataTipoSolicitud() {
    return solicitud;
  }

  public obtenerDataEstadoSolicitud() {
    return this.recuperarParametrosBandeja().estadoSolicitud;
  }

  public obtenerDataContratistas() {
    return StorageUtil.recuperarObjetoSession('parametrosUsuario').listaEmpresa;
  }

  public configurarBusquedaAvanzada(): BusquedaAvanzadaConfig {
    if (this.perfilService.esAdministrador() || this.perfilService.esAdministradorOficina() ||
      this.perfilService.esAquafono() || this.perfilService.esConsultaGeneral()) {
      return {
        mostrarComboContratista: true,
        mostrarEstadoSedapal: true,
        clearOficina: true
      };
    } else if (this.perfilService.esAnalistaInterno() || this.perfilService.esResponsableInterno()) {
      return {
        mostrarComboContratista: true,
        mostrarEstadoSedapal: true,
        clearOficina: false
      };
    } else if (this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) {
      return {
        mostrarEstadoSedapal: true,
        clearOficina: false
      };
    }
  }

  private recuperarParametrosBandeja(): any {
    return StorageUtil.recuperarObjetoSession('parametrosBandejaPersonal');
  }

}
