import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BusquedaAvanzadaPersonalService } from '../../services/busqueda-avanzada-personal.service';
import { BusquedaAvanzadaConfig } from 'src/app/models/interface/busqueda-avanzada-config';
import { ComboDto } from 'src/app/models/combo-dto';
import { Cargo } from 'src/app/models/interface/cargo';
import { Oficina, Empresa } from 'src/app/models';
import { Estado } from 'src/app/models/interface/estado';
import { BusquedaPersonalContratista } from 'src/app/models/interface/busqueda-personal-contratista';
import { FiltroSalida } from 'src/app/models/interface/filtro-salida';
import { DatePipe } from '@angular/common';
import { PersonalContratistaRequest } from 'src/app/models/interface/personal-contratista-request';
import AgcUtil from 'src/app/modules/shared/util/agc-util';
import { BandejaPersonalService } from '../../services/bandeja-personal.service';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';

@Component({
  selector: 'app-busqueda-avanzada-personal-contratista',
  templateUrl: './busqueda-avanzada-personal-contratista.component.html',
  styleUrls: ['./busqueda-avanzada-personal-contratista.component.scss']
})
export class BusquedaAvanzadaPersonalContratistaComponent implements OnInit {

  @Output() busquedaAvanzadaEvent = new EventEmitter();
  @Output() cerrarModalEvent = new EventEmitter();

  config: BusquedaAvanzadaConfig;

  comboCargo: Cargo[] = [];
  comboOficina: Oficina[] = [];
  comboContratista: Empresa[] = [];
  comboEstadoLaboral: Estado[] = [];
  comboEstadoSedapal: Estado[] = [];
  comboMotivoCese: Estado[] = [];
  comboSolicitud: Estado[] = [];
  comboEstadoSolicitud: Estado[] = [];

  datosBusqueda: BusquedaPersonalContratista = {};
  dataFiltrosBandejaPersonal: FiltroSalida[] = [];

  placeholderPeriodo: string = this.datePipe.transform(Date.now(), 'MMyyyy');

  mostrarInternos: boolean = false;
  mostrarExternos: boolean = false;

  constructor(private busquedaService: BusquedaAvanzadaPersonalService,
    private datePipe: DatePipe,
    private bandejaPersonalService: BandejaPersonalService,
    private perfilService: PerfilService,
    private toastrUtil: ToastrUtilService) {
    this.obtenerConfiguracionBusqueda();
    this.obtenerDataCombos();
  }

  ngOnInit() {
    this.configurarModalBusquedaAvanzada();
  }

  private agregarDataFiltro(campo: string, value: any): void {
    this.eliminarFiltroRepetido(campo);
    const filtro: FiltroSalida = { tipoFiltro: campo, codigoTipoFiltro: 0, value };
    this.dataFiltrosBandejaPersonal.push(filtro);
    this.dataFiltrosBandejaPersonal.sort((a, b) => {
      if (a.tipoFiltro > b.tipoFiltro) { return 1; }
      if (a.tipoFiltro < b.tipoFiltro) { return -1; }
      return 0;
    });
  }

  private buscarIndiceFiltroRepetido(campo: string) {
    for (let i = 0; i < this.dataFiltrosBandejaPersonal.length; i++) {
      const item = this.dataFiltrosBandejaPersonal[i];
      if (item.tipoFiltro === campo) {
        return i;
      }
    }
  }

  // Emitters
  public busquedaAvanzada(): void {
    if (this.validarFlagSeleccionado()) {
      this.busquedaAvanzadaEvent.emit({
        dataBusqueda: this.setPersonalRequest(this.datosBusqueda),
        dataFiltros: this.dataFiltrosBandejaPersonal
      });
    } else {
      this.toastrUtil.showWarning(Mensajes.MSG_FILTROS_NO_SELECCIONADOS);
    }

  }

  public cerrarModal(): void {
    this.cerrarModalEvent.emit();
  }

  private configurarModalBusquedaAvanzada(): void {
    this.mostrarInternos = this.perfilService.esAdministrador() || this.perfilService.esAdministradorOficina() ||
      this.perfilService.esAnalistaInterno() || this.perfilService.esResponsableInterno() || this.perfilService.esAquafono() ||
      this.perfilService.esConsultaPersonal();

    this.mostrarExternos = this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno();
  }

  private eliminarFiltroRepetido(campo: string): void {
    const indice: number = this.buscarIndiceFiltroRepetido(campo);
    if (indice > -1) {
      this.dataFiltrosBandejaPersonal.splice(indice, 1);
    }
  }

  public getDatePipe() {
    return this.datePipe;
  }

  private obtenerConfiguracionBusqueda() {
    this.config = this.busquedaService.configurarBusquedaAvanzada();
  }

  // Llenar Combos
  private obtenerDataCombos() {
    this.comboCargo = this.busquedaService.obtenerDataCargos();
    this.comboContratista = this.busquedaService.obtenerDataContratistas();
    this.comboOficina = this.busquedaService.obtenerDataOficinas();
    this.comboEstadoLaboral = this.busquedaService.obtenerDataEstadoLaboral();
    this.comboEstadoSedapal = this.busquedaService.obtenerDataEstadoSedapal();
    this.comboMotivoCese = this.busquedaService.obtenerDataMotivosCese();
    this.comboSolicitud = this.busquedaService.obtenerDataTipoSolicitud();
    this.comboEstadoSolicitud = this.busquedaService.obtenerDataEstadoSolicitud();
    if (this.comboOficina.length === 1) {
      this.datosBusqueda.oficina = this.comboOficina[0];
      this.dataFiltrosBandejaPersonal.push({ tipoFiltro: 'Oficina', codigoTipoFiltro: 0, value: this.comboOficina[0].descripcion });
    }
  }

  public onChangeCombo(event, campo: string): void {
    if (event !== null && event !== undefined) {
      this.agregarDataFiltro(campo, event.descripcion);
    } else {
      this.eliminarFiltroRepetido(campo);
    }
  }

  // TODO: Cambiar datePicker por input text con formato MMYYYY
  public onChangeFecIngreso(event, campo: string): void {
    if (event !== null && event !== undefined) {
      const value: string = this.datePipe.transform(event, 'MMyyyy');
      this.agregarDataFiltro(campo, value);
    } else {
      this.eliminarFiltroRepetido(campo);
    }
  }

  public onChangeFecCese(event, campo: string): void {
    if (event !== null && event !== undefined) {
      const value: string = this.datePipe.transform(event, 'dd/MM/yyyy');
      this.agregarDataFiltro(campo, value);
    } else {
      this.eliminarFiltroRepetido(campo);
    }
  }

  public onChangeInput(event, campo: string): void {
    if (event.target.value.trim() !== '' && event.target.value !== null && event.target.value !== undefined) {
      this.agregarDataFiltro(campo, event.target.value);
    } else {
      this.eliminarFiltroRepetido(campo);
    }
  }

  public onLimpiarFiltros(): void {
    const datosTemp = this.datosBusqueda;
    if (this.perfilService.esAnalistaExterno() || this.perfilService.esSupervisorExterno()) {
      this.datosBusqueda = {};
      this.datosBusqueda.oficina = datosTemp.oficina;
    } else if (this.perfilService.esAdministradorOficina()) {
      this.datosBusqueda = {};
    } else if (this.perfilService.esAdministrador() || this.perfilService.esConsultaGeneral()
      || this.perfilService.esAquafono()) {
      this.datosBusqueda = {};
    }
  }

  private setPersonalRequest(datos: BusquedaPersonalContratista): PersonalContratistaRequest {
    const request: PersonalContratistaRequest = this.bandejaPersonalService.configurarParametros();
    request.numeroDocumento = AgcUtil.validarCampoTexto(datos.dni) ? datos.dni : null;
    request.codigoEmpleado = AgcUtil.validarCampoTexto(datos.codigoSedapal) ? Number.parseInt(datos.codigoSedapal) : 0;
    request.nombres = AgcUtil.validarCampoTexto(datos.nombres) ? datos.nombres : null;
    request.apellidoPaterno = AgcUtil.validarCampoTexto(datos.apePaterno) ? datos.apePaterno : null;
    request.apellidoMaterno = AgcUtil.validarCampoTexto(datos.apeMaterno) ? datos.apeMaterno : null;
    request.codigoCargo = AgcUtil.validarCampoObjeto(datos.cargo) ? datos.cargo.id : null;
    request.idEmpresa = AgcUtil.validarCampoObjeto(datos.empresa) ? datos.empresa.codigo : 0;
    request.codigoOficina = AgcUtil.validarCampoObjeto(datos.oficina) ? datos.oficina.codigo.toString() : null;
    request.periodoIngreso = AgcUtil.validarCampoTexto(datos.fecIngreso) ? datos.fecIngreso : null;
    request.estadoLaboral = AgcUtil.validarCampoObjeto(datos.estadoLaboral) ? datos.estadoLaboral.id : null;
    request.estadoSedapal = AgcUtil.validarCampoObjeto(datos.estadoPersonal) ? datos.estadoPersonal.id : null;
    request.codMotivoCese = AgcUtil.validarCampoObjeto(datos.motivoCese) ? Number.parseInt(datos.motivoCese.id) : 0;
    request.fechaCese = AgcUtil.validarCampoTexto(datos.fecCese) ? this.datePipe.transform(datos.fecCese, 'dd/MM/yyyy') : null;
    request.tipoSolicitud = AgcUtil.validarCampoObjeto(datos.solicitud) ? Number.parseInt(datos.solicitud.id) : null;
    request.estadoSolicitud = AgcUtil.validarCampoObjeto(datos.estadoSolicitud) ? datos.estadoSolicitud.id : null;
    return request;
  }

  private validarFlagSeleccionado(): boolean {
    return (AgcUtil.validarCampoTexto(this.datosBusqueda.dni))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.codigoSedapal))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.nombres))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.apePaterno))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.apeMaterno))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.cargo))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.empresa))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.oficina))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.fecIngreso))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.estadoLaboral))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.estadoPersonal))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.motivoCese))
      || (AgcUtil.validarCampoTexto(this.datosBusqueda.fecCese))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.solicitud))
      || (AgcUtil.validarCampoObjeto(this.datosBusqueda.estadoSolicitud))
      ;
  }

}
