import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignarPersonalService } from '../../../services/impl/asignar-personal.service';
import { Location } from '@angular/common';
import { GrupoOficina } from '../../../models/grupo-oficina';
import { GrupoPersonal } from '../../../models/grupo-personal';
import { ToastrService } from 'ngx-toastr';
import { Paginacion, Trabajador } from '../../../models';
import { RequestAsignarPersonal } from '../../../models/request-asignar-personal';
import swal from 'sweetalert2';
import { Mensajes } from '../../../models/enums/mensajes';
import { ValidacionAsignarPersonal } from '../../../models/validacion-asignar-personal';
import { Parametro } from '../../../models/enums/parametro';
import { PerfilService } from 'src/app/services/impl/perfil.service';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';

@Component({
  selector: 'app-asignar-personal',
  templateUrl: './asignar-personal.component.html',
  styles: []
})
export class AsignarPersonalComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,
    private asignarPersonalService: AsignarPersonalService,
    private location: Location,
    private toastr: ToastrService,
    private perfilService: PerfilService) {
    this.habilitarPanel();
  }

  usuarioIngresado: string;

  datosBusqueda: GrupoOficina;
  personalBuscado: Trabajador = null;
  paginacion: Paginacion;

  codigoBusqueda: string = '';
  datosPersonalBuscado: string = '';
  filtroUsuario: string = '';
  parametroBusquedaPor: string = Parametro.COD_USUARIO;
  placeholderBusquedaPor: string = 'Busqueda por...';
  $mostrarTabla: boolean = false;
  $mostrarBuscado: boolean = false;
  $loading: boolean = true;
  $enableMostrarPanelAgregar: boolean = false;
  paginacionConfig: any;

  listaPersonalEncontrado: Array<GrupoPersonal>;
  listaPersonalAux: Array<GrupoPersonal>;
  listaMensajes: Array<string> = new Array<string>();

  private static retornarDatoPersonal(personal: Trabajador): string {
    return `${personal.codigo} - ${personal.nombre}`;
  }

  ngOnInit() {
    this.obtenerDatosGrupoOficina();
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('datosGrupoOficina');
  }

  private habilitarPanel() {
    this.$enableMostrarPanelAgregar = this.perfilService.esAdministradorOficina();
  }

  private obtenerDatosGrupoOficina(): void {
    this.datosBusqueda = JSON.parse(sessionStorage.getItem('datosGrupoOficina'));
    this.obtenerPersonalDelGrupo(this.datosBusqueda);
  }

  private obtenerPersonalDelGrupo(datosBusqueda: GrupoOficina) {
    this.mostrarLoading();
    this.asignarPersonalService.obtenerPersonalPorGrupo(datosBusqueda.empresa.codigo, datosBusqueda.oficina.codigo, datosBusqueda.grupo.idGrupo)
      .subscribe(data => {
        this.listaPersonalEncontrado = data;
        this.cargarDatosPaginacion(data);
        this.$mostrarTabla = true;
        this.ocultarLoading();
      });
  }

  private cargarDatosPaginacion(data: Array<GrupoPersonal>, registros: number = 10): void {
    this.paginacion = new Paginacion({ registros: registros, totalRegistros: data.length });
    this.paginacionConfig = {
      itemsPerPage: this.paginacion.registros,
      currentPage: this.paginacion.pagina,
      totalItems: this.paginacion.totalRegistros
    };
  }

  public buscarPersonalPorCodigo(): void {
    if (this.codigoBusqueda.trim() === '') {
      this.toastr.error('Debe ingresar un Usuario');
    } else if (!this.codigoBusqueda.trim().match('(AGC[0-9]{5})')) {
      this.toastr.error('Formato de código inválido');
    } else {
      this.asignarPersonalService.obtenerPersonalPorCodigo(this.codigoBusqueda.trim(), this.datosBusqueda.empresa.tipoEmpresa)
        .subscribe(data => {
          if (data) {
            this.usuarioIngresado = this.codigoBusqueda;
            this.personalBuscado = data;
            this.datosPersonalBuscado = AsignarPersonalComponent.retornarDatoPersonal(data);
            this.$mostrarBuscado = true;
          }
        });
    }
  }

  private retornarRequestAsignarPersonal(trabajador: Trabajador): RequestAsignarPersonal {
    const personal: RequestAsignarPersonal = new RequestAsignarPersonal();
    personal.idPersona = trabajador.codigo;
    personal.idEmpresa = this.datosBusqueda.empresa.codigo;
    personal.idOficina = this.datosBusqueda.oficina.codigo;
    personal.idGrupo = this.datosBusqueda.grupo.idGrupo;
    personal.usuarioAuditoria = JSON.parse(sessionStorage.getItem('credenciales')).usuario;
    personal.trabajador = trabajador;
    return personal;
  }

  public limpiarInputCodUsuario(): void {
    this.datosPersonalBuscado = '';
    this.codigoBusqueda = '';
    this.personalBuscado = null;
    this.$mostrarBuscado = false;
  }

  public regresarBusquedaGrupos(): void {
    this.location.back();
  }

  private validarPersonalAgregar(codUsuario: string): boolean {
    let valido = true;
    if (codUsuario.trim() === '') {
      this.listaMensajes.push('Debe ingresar un código de usuario');
      valido = false;
    } else if (this.personalBuscado === null) {
      this.listaMensajes.push('Debe buscar un personal para ser asignado');
      valido = false;
    } else if (this.validarExistenciaDeCodUsuario(codUsuario.trim())) {
      this.listaMensajes.push('El personal seleccionado ya existe en este grupo');
      valido = false;
    } else if (!this.validarPerfilDeAgregarUsuario()) {
      valido = false;
    }
    return valido;
  }

  private async validarExistenciaDePersonal(request: RequestAsignarPersonal) {
    return await this.asignarPersonalService.validarExistenciadePersonal(request).toPromise();
  }

  private async validarEliminarPersonal(request: RequestAsignarPersonal) {
    return await this.asignarPersonalService.validarEliminarPersonal(request).toPromise();
  }

  private validarExistenciaDeCodUsuario(codUsuario: string): boolean {
    let existe = false;
    this.listaPersonalEncontrado.forEach(item => {
      if (item.trabajador.codUsuario === codUsuario) {
        existe = true;
      }
    });
    return existe;
  }

  private validarPerfilDeAgregarUsuario(): boolean {
    let valido: boolean = true;
    if (this.personalBuscado.perfil.codigo.toString() === Parametro.PERFIL_ADMINISTRADOR_OFICINA
      || this.personalBuscado.perfil.codigo.toString() === Parametro.PERFIL_CONS_GEN
    ) {
      valido = this.datosBusqueda.grupo.idGrupo === Parametro.COD_GRUPO_GENERICO;
      if (!valido) {
        this.listaMensajes.push('El personal seleccionado solo puede pertenecer al grupo genérico');
      }
    }
    if (this.personalBuscado.perfil.codigo.toString() === Parametro.PERFIL_ADMINISTRADOR
      || this.personalBuscado.perfil.codigo.toString() === Parametro.PERFIL_AQUAFONO) {
      valido = false;
      if (!valido) {
        this.listaMensajes.push('El personal seleccionado no puede ser asignado a una oficina');
      }
    }
    return valido;
  }

  public filtrarUsuarios(): void {
    if (this.parametroBusquedaPor === Parametro.COD_USUARIO) {
      this.placeholderBusquedaPor = 'Usuario';
      this.filtrarUsuariosPorCodUsuario();
    }
  }

  filtrarUsuariosPorCodUsuario() {
    if (this.filtroUsuario.trim() !== '') {
      const listaFiltrada: Array<GrupoPersonal> = this.listaPersonalEncontrado.filter(item => {
        return item.trabajador.codUsuario === this.filtroUsuario.trim();
      });
      if (listaFiltrada.length > 0) {
        this.filtroUsuario = '';
        this.listaPersonalEncontrado = listaFiltrada;
        this.cargarDatosPaginacion(listaFiltrada);
      } else {
        this.toastr.warning('No se encontró ningún personal que coincida con el código de usuario ingresado', 'Aviso');
      }
    } else {
      this.obtenerPersonalDelGrupo(this.datosBusqueda);
    }
  }

  private seleccionarParametroBusqueda(tipoFiltro: string): void {
    this.parametroBusquedaPor = tipoFiltro;
  }

  private limpiarFiltroBusqueda(): void {
    this.filtroUsuario = '';
    this.obtenerPersonalDelGrupo(this.datosBusqueda);
  }

  public mostrarMensajeEliminarPersonal(personal: GrupoPersonal): void {
    swal({
      title: `¿Desea eliminar a ${personal.trabajador.nombre} de este grupo?`,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No gracias',
      focusConfirm: false,
      focusCancel: true,
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50
    }).then(result => {
      if (result.value) {
        this.eliminarPersonal(personal);
      }
    });
  }

  public mostrarMensajeAgregar() {
    swal({
      title: `<h3>¿Está seguro que desea agregar a ${this.personalBuscado.nombre} a este grupo?</h3>`,
      showCancelButton: true,
      confirmButtonText: 'Si, agregar',
      cancelButtonText: 'No gracias',
      focusConfirm: false,
      focusCancel: true,
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50
    }).then(result => {
      if (result.value) {
        this.agregarPersonal();
      }
    });
  }

  private mostrarMensajeValidacionPersonal(mensaje: string): void {
    swal({
      title: 'Aviso',
      imageUrl: 'assets/images/advertencia.png',
      imageWidth: 50,
      allowOutsideClick: false,
      html: `<h4>${mensaje}</h4>`
    });
  }

  private async eliminarPersonal(personal: GrupoPersonal) {
    this.mostrarLoading();
    const eliminarTrabajadorRequest: RequestAsignarPersonal = this
      .retornarRequestAsignarPersonal(personal.trabajador);
    const validacion: ValidacionAsignarPersonal = await this.validarEliminarPersonal(eliminarTrabajadorRequest);
    if (validacion.existe >= 1) {
      this.toastr.error(validacion.mensaje, Mensajes.CAB_MESSAGE_AVISO);
      this.ocultarLoading();
    } else {
      this.asignarPersonalService.eliminarPersonal(eliminarTrabajadorRequest)
        .subscribe(data => {
          this.listaPersonalEncontrado = data;
          this.cargarDatosPaginacion(data);
          this.limpiarInputCodUsuario();
          this.toastr.success('Se eliminó el personal con éxito', Mensajes.CAB_MESSAGE_OK);
          this.ocultarLoading();
        });
    }
  }

  private ocultarLoading(): void {
    this.$loading = false;
  }

  private mostrarLoading(): void {
    this.$loading = true;
  }

  public async agregarPersonal() {
    if (this.validarPersonalAgregar(this.codigoBusqueda.trim())) {
      this.mostrarLoading();
      const agregarTrabajadorRequest: RequestAsignarPersonal = this
        .retornarRequestAsignarPersonal(this.personalBuscado);
      const validacion: ValidacionAsignarPersonal = await this.validarExistenciaDePersonal(agregarTrabajadorRequest);
      if (validacion.existe === 0) {
        const asignarPersonalRequest: RequestAsignarPersonal = this.retornarRequestAsignarPersonal(this.personalBuscado);
        this.asignarPersonalService.agregarPersonal(asignarPersonalRequest).subscribe(data => {
          if (data.estado === ResponseStatus.OK) {
            this.listaPersonalEncontrado = data.resultado;
            this.cargarDatosPaginacion(data.resultado);
            if (data.mensaje !== null && data.mensaje !== undefined) {
              this.toastr.success(data.mensaje, Mensajes.CAB_MESSAGE_OK);
            }
            this.limpiarInputCodUsuario();
            this.toastr.success('Se agregó el personal con éxito', Mensajes.CAB_MESSAGE_OK);
          } else {
            this.toastr.error(Mensajes.MENSAJE_ERROR_GENERICO, Mensajes.CAB_MESSAGE_ERROR);
          }
          this.ocultarLoading();
        }, (err) => {
          console.error(err);
          this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION);
          this.$loading = false;
        });
      } else if (validacion.existe === 1) {
        this.mostrarMensajeValidacionPersonal(validacion.mensaje);
        this.ocultarLoading();
      }
    } else {
      this.listaMensajes.forEach(mensaje => {
        this.toastr.error(mensaje, Mensajes.CAB_MESSAGE_AVISO);
        this.listaMensajes.length = 0;
      });
    }
  }

  public onCambiarPagina(event): void {
    this.paginacion.pagina = event.page;
    this.paginacionConfig.currentPage = this.paginacion.pagina;
  }

  public onCambioRegistros(event): void {
    this.cargarDatosPaginacion(this.listaPersonalEncontrado, event.rows);
  }

  public onCodigoBusquedaChange(event) {
    let validador;
    validador = event.keycode || event.which;
    const tecla = String.fromCharCode(validador).toUpperCase().toString();
    const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';
    const especiales = [8, 6];
    let tecla_especial = false;
    for (const i in especiales) {
      if (validador === especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) === -1 && !tecla_especial) {
      return false;
    }
    if (this.codigoBusqueda.length >= 8) {
      return false;
    }
  }

}
