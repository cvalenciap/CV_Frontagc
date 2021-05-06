import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginacion } from '../../../models';
import { FiltrosBandejaLogComponent } from '../modales/filtros-bandeja-log/filtros-bandeja-log.component';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { LogDigitalizado } from 'src/app/models/log-digitalizado';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Parametro } from 'src/app/models/enums/parametro';
import { Actividad } from 'src/app/models/actividad';
import { FiltrosBandejaLog } from 'src/app/models/filtro-bandeja.log';
import { ResponseObject } from 'src/app/models/response/response-object';
import { LogDigitalizadoService } from 'src/app/services/impl/logDigitalizado.service';
import { ValidacionService } from 'src/app/services/impl/validacion';

@Component({
  selector: 'app-bandeja-log-digitalizados',
  templateUrl: './bandeja-log-digitalizados.component.html',
  styleUrls: ['./bandeja-log-digitalizados.component.scss']
})
export class BandejaLogDigitalizadosComponent implements OnInit {

  /* Variables para manejo de filtros */
  // private filtros: FiltrosBandejaLog;
  /* Variable para mostrar el filtro de busqueda */
  public filtrosTexto: string;
  /* Variable para visualizar mensaje de filtro de busqueda */
  public mostrarFiltros: boolean;
  /* Variable para control del modal */
  @ViewChild(FiltrosBandejaLogComponent) filtrosBandejaLogComponent;
  /* Lista de digitalizados */
  public logDigitalizados: LogDigitalizado[];
  /* Objeto para filtros */
  private filtrosBusqueda: FiltrosBandejaLog;
  /* Variable para la paginación */
  public paginacion: Paginacion;
  /* Numero de suministro */
  public numeroSuministro: number;
  /* variable para load */
  public loading: boolean;
  /* Variable para validacion del botón Exportar */
  public verExportarExcel: boolean;
  /* Variable para controlar componente modal */
  public alertOption: SweetAlertOptions = {};
  @ViewChild('modalFiltrosBandejaLogDigitalizados') private modalFiltrosBandejaLogDigitalizados: SwalComponent;

  constructor(private sanitizer: DomSanitizer,
    private logDigitalizadoService: LogDigitalizadoService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public validacionNumero: ValidacionService) {
    this.filtrosBusqueda = null;
    this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
    this.verExportarExcel = false;
    this.logDigitalizados = new Array<LogDigitalizado>();
  }

  ngOnInit() {

    this.alertOption = {
      title: "Búsqueda Avanzada - Consulta Log de Digitalizados",
      showCancelButton: true,
      focusCancel: false,
      allowOutsideClick: true,
      confirmButtonText: "Buscar",
      cancelButtonText: "Cancelar",
      customClass: "buscar-empresa-swal",
      preConfirm: () => {
        let valida: boolean;
        var promise = new Promise(() => {
          let filtros: FiltrosBandejaLog = this.filtrosBandejaLogComponent.filtros;
          if (filtros.suministro ||
            filtros.usuario ||
            filtros.tipoAccion ||
            filtros.tipoArchivo ||
            filtros.fechaInicio ||
            filtros.fechaFin) {
            if (filtros.fechaInicio && !filtros.fechaFin || !filtros.fechaInicio && filtros.fechaFin) {
              valida = false;
              this.toastr.error("Debe ingresar Fecha Inicio y Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
            } else if (filtros.fechaInicio && filtros.fechaFin) {
              if (filtros.fechaInicio.setHours(0, 0, 0, 0) > filtros.fechaFin.setHours(0, 0, 0, 0)) {
                valida = false;
                this.toastr.error("La Fecha Inicio debe ser menor o igual a la Fecha Fin", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
              }
              /**/
            } else if (filtros.suministro && !Number(filtros.suministro)) {
              valida = false;
              this.toastr.error("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
              /**/
            } else {
              valida = true;
            }
          } else {
            valida = false;
            this.toastr.error("Debe seleccionar por lo menos un filtro", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
          }
        })
        return valida;
      }
    }
  }

  onObtenerLogDigitalizados(invocacion: string): void {
    this.loading = true;

    if (this.numeroSuministro) {
      if (Number(this.numeroSuministro)) {
        this.filtrosBusqueda = new FiltrosBandejaLog();
        this.filtrosBusqueda.suministro = this.numeroSuministro;
      } else {
        this.loading = false;
        // this.numeroSuministro = null;
        // this.logDigitalizados = new Array<LogDigitalizado>();
        // this.filtrosBusqueda = null;
        this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
        // this.filtrosTexto = "";
        this.toastr.error("El Número Suministro debe estar compuesto solo de números.", Mensajes.CAB_MESSAGE_AVISO, { closeButton: true });
      }
    }

    if (this.filtrosBusqueda) {
      this.logDigitalizadoService.obtenerLogDigitalizados(this.filtrosBusqueda, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: ResponseObject) => {
          if (response.resultado) {
            this.logDigitalizados = response.resultado;
          } else {
            this.logDigitalizados = new Array<LogDigitalizado>();
          }
          this.paginacion = new Paginacion(response.paginacion);
          this.mostrarInformacionFiltros();
          this.loading = false;
          this.verExportarExcel = true;
        },
        (error) => {
          this.loading = false;
          this.toastr.error("Ocurrió un error al realizar la búsqueda.", Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
        }
      );
    } else {
      this.loading = false;
    }
  }

  onPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.onObtenerLogDigitalizados('PAGINACION');
  }

  onPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    if (this.logDigitalizados.length > 0 && this.filtrosBusqueda) {
      this.onObtenerLogDigitalizados('PAGINACION');
    }
  }

  /* Método para obtener filtros del modal */
  public obtenerFiltrosModal(): void {
    this.numeroSuministro = null;
    this.filtrosBusqueda = this.filtrosBandejaLogComponent.filtros;
    this.onObtenerLogDigitalizados('MODAL');
  }

  private mostrarInformacionFiltros() {
    let mensaje = '<strong>Búsqueda Por: </strong>';

    if (this.filtrosBusqueda.suministro) {
      mensaje = mensaje + '<br/><strong>Número Suministro: </strong> <parrafo>' + this.filtrosBusqueda.suministro + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.usuario) {
      mensaje = mensaje + '<br/><strong>Usuario: </strong> <parrafo>' + this.filtrosBusqueda.usuario.toUpperCase() + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.tipoAccion) {
      let accion = this.filtrosBusqueda.tipoAccion == 'V' ? 'Visualizar' : this.filtrosBusqueda.tipoAccion == 'D' ? 'Descargar' : this.filtrosBusqueda.tipoAccion == 'I' ? 'Imprimir' : this.filtrosBusqueda.tipoAccion;
      mensaje = mensaje + '<br/><strong>Tipo Acción: </strong> <parrafo>' + accion + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.fechaInicio) {
      mensaje = mensaje + '<br/><strong>Fecha Inicio: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaInicio, 'dd/MM/yyyy') + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.filtrosBusqueda.fechaFin) {
      mensaje = mensaje + '<br/><strong>Fecha Fin: </strong> <parrafo>' + this.datePipe.transform(this.filtrosBusqueda.fechaFin, 'dd/MM/yyyy') + '</parrafo>' + ' ';
      this.mostrarFiltros = true;
    }
    if (this.mostrarFiltros) {
      this.filtrosTexto = mensaje;
    }
  }

  private eliminarFiltros(): void {
    this.filtrosBusqueda = null;
    this.mostrarFiltros = false;
    this.filtrosTexto = "";
    this.numeroSuministro = null;
    this.verExportarExcel = false;
    this.logDigitalizados = null;
    this.paginacion = new Paginacion({ registros: this.paginacion.registros, pagina: 1 });
  }

  generarArchivoExcel(): void {
    this.loading = true;
    this.logDigitalizadoService.generarArchivoExcelLogDigitalizados(this.filtrosBusqueda, 1, this.paginacion.totalRegistros).subscribe(
      (data) => {
        this.loading = false;
        var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, "Resultado_Log");
      },
      (error) => {
        this.loading = false;
        this.toastr.error(Mensajes.MESSAGE_ERROR_TRANSACCION, Mensajes.CAB_MESSAGE_ERROR, { closeButton: true });
      }
    );
  }
}
