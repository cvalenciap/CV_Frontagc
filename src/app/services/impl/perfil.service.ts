import { Injectable } from '@angular/core';
import { Parametro } from 'src/app/models/enums/parametro';
import { Credenciales } from 'src/app/models/credenciales';
import { BusquedaAvanzadaConfig } from 'src/app/models/interface/busqueda-avanzada-config';
import { TipoEmpresa } from 'src/app/models/enums/tipo-empresa';
import { CargasTrabajoService } from './cargas-trabajo.service';
import StorageUtil from 'src/app/modules/shared/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private perfil: string;
  private busquedaAvanzadaConfig: string;

  constructor(private cargaTrabajoService: CargasTrabajoService) {
    this.obtenerPerfil();
  }

  public obtenerUsuarioLogin(): string {
    const credenciales: Credenciales = JSON.parse(sessionStorage.getItem('credenciales').toString());
    return credenciales.usuario;
  }

  public obtenerPerfil(): void {
    this.perfil = sessionStorage.getItem('perfilAsignado');
  }

  public esAdministrador(): boolean {
    return this.perfil === Parametro.PERFIL_ADMINISTRADOR;
  }

  public esAnalistaInterno(): boolean {
    return this.perfil === Parametro.PERFIL_ANALISTA_INTERNO;
  }

  public esResponsableInterno(): boolean {
    return this.perfil === Parametro.PERFIL_RESPONSABLE;
  }

  public esAnalistaExterno(): boolean {
    return this.perfil === Parametro.PERFIL_ANALISTA_EXTERNO;
  }

  public esSupervisorExterno(): boolean {
    return this.perfil === Parametro.PERFIL_SUPERVISOR_EXTERNO;
  }

  public esAdministradorOficina(): boolean {
    return this.perfil === Parametro.PERFIL_ADMINISTRADOR_OFICINA;
  }

  public esAquafono(): boolean {
    return this.perfil === Parametro.PERFIL_AQUAFONO;
  }

  public esConsultaGeneral(): boolean {
    return this.perfil === Parametro.PERFIL_CONS_GEN;
  }

  public esConsultaPersonal(): boolean {
    return this.perfil === Parametro.PERFIL_CONS_PERS;
  }

  public validarAccion(accion: string): boolean {
    const acciones: string = StorageUtil.recuperarPrimitivoSession('acciones');
    return acciones.includes(accion);
  }

  public configBusquedaAvanzada(): string {
    if (this.esAdministrador() || this.esAquafono() || this.esConsultaGeneral()
        || this.esConsultaPersonal()) {
      const config: BusquedaAvanzadaConfig = {
        opcionTipoEmpresa: TipoEmpresa.SEDAPAL,
        mostrarComboUsuarios: true,
        mostrarGrupo: true,
        clearOficina: true,
        clearGrupo: true,
        clearContratista: true,
        clearActividad: true,
        mostrarOpcionAdministrador: true
      };
      return JSON.stringify(config);
    } else if (this.esAdministradorOficina()) {
      const config: BusquedaAvanzadaConfig = {
        opcionTipoEmpresa: TipoEmpresa.SEDAPAL,
        mostrarComboUsuarios: true,
        mostrarGrupo: true,
        clearOficina: false,
        clearGrupo: true,
        clearContratista: true,
        clearActividad: true,
        mostrarOpcionAdministrador: false
      };
      return JSON.stringify(config);
    } else if (this.esAnalistaInterno()) {
      const config: BusquedaAvanzadaConfig = {
        opcionTipoEmpresa: TipoEmpresa.SEDAPAL,
        mostrarComboUsuarios: false,
        mostrarGrupo: true,
        clearOficina: false,
        clearGrupo: false,
        clearContratista: true,
        clearActividad: true,
        mostrarOpcionAdministrador: false
      };
      return JSON.stringify(config);
    } else if (this.esResponsableInterno()) {
      const config: BusquedaAvanzadaConfig = {
        opcionTipoEmpresa: TipoEmpresa.SEDAPAL,
        mostrarComboUsuarios: true,
        mostrarGrupo: true,
        clearOficina: false,
        clearGrupo: false,
        clearContratista: true,
        clearActividad: true,
        mostrarOpcionAdministrador: false
      };
      return JSON.stringify(config);
    } else if (this.esAnalistaExterno() || this.esSupervisorExterno()) {
      const config: BusquedaAvanzadaConfig = {
        opcionTipoEmpresa: TipoEmpresa.CONTRATISTA,
        mostrarComboUsuarios: true,
        mostrarGrupo: false,
        clearOficina: false,
        clearGrupo: false,
        clearContratista: false,
        clearActividad: true,
        mostrarOpcionAdministrador: false
      };
      return JSON.stringify(config);
    }
  }

}
