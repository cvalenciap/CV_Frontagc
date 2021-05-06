import {Component, OnInit, ViewChild} from '@angular/core';
import {Actividad, Oficina, ParametrosCargaBandeja, Response} from '../../../../models';
import {CargasTrabajoService} from '../../../../services/impl/cargas-trabajo.service';
import {ToastrService} from 'ngx-toastr';
import {FiltrosBandejaDigitalizados} from 'src/app/models/filtro-bandeja.digitalizado';
import {Parametro} from 'src/app/models/enums/parametro';
import {DigitalizadoService} from 'src/app/services/impl/digitalizado.service';
import {Mensajes} from 'src/app/models/enums/mensajes';
import {ValidacionService} from 'src/app/services/impl/validacion';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-filtros-bandeja-digitalizados',
  templateUrl: './filtros-bandeja-digitalizados.component.html',
  styleUrls: ['./filtros-bandeja-digitalizados.component.scss']
})
export class FiltrosBandejaDigitalizadosComponent implements OnInit {
  public filtros: FiltrosBandejaDigitalizados;
  public listaParametros: ParametrosCargaBandeja;
  public estadoComponentes: EstadoComponentes;
  public oficina: Oficina;
  public ofi: number;
  public oficina1: Oficina;
  public clrOficina: boolean;

  @ViewChild('selectActividad') selectActividad: NgSelectComponent;
  @ViewChild('selectOficina') selectOficina: NgSelectComponent;

  constructor(private cargasService: CargasTrabajoService,
              private toastr: ToastrService,
              private digitalizadoService: DigitalizadoService,
              public validacionNumero: ValidacionService) {
    this.listaParametros = new ParametrosCargaBandeja();
    this.filtros = new FiltrosBandejaDigitalizados();
    this.filtros.actividad = new Actividad();
    this.filtros.oficina = new Oficina();
    this.estadoComponentes = new EstadoComponentes();
  }


  ngOnInit() {
    //Perfil
    this.digitalizadoService.consultarParametrosBusquedaDigitalizados().subscribe(
      (response: Response) => {
        this.listaParametros = response.resultado;
        this.listaParametros.listaOficina.length === 1 ? this.oficina = this.listaParametros.listaOficina[0] : this.oficina = null;
        this.listaParametros.listaOficina.length === 1 ? this.clrOficina = false : this.clrOficina = true;

        if (this.listaParametros.listaActividad.length === 1) {
          this.filtros.actividad = this.listaParametros.listaActividad[0];
          this.iniciarCamposFiltro(this.filtros.actividad.codigo);
        }
        //Segun Perfil
        if (sessionStorage.getItem('codOficina') != null) {
          this.filtros.oficina.codigo = this.oficina.codigo;
          this.filtros.oficina.descripcion = this.oficina.descripcion;
        }
      }
    );

  }

  onSeleccionarOficina(evento: any): void {
    this.filtros.oficina.descripcion = evento.descripcion;
  }


  onSeleccionarActividad(evento: any): void {
    this.estadoComponentes = new EstadoComponentes();
    this.filtros.actividad.descripcion = evento.descripcion;
    this.iniciarCamposFiltro(evento.codigo);
  }

  iniciarCamposFiltro(codigoActividad: string): void {
    switch (codigoActividad) {
      case Parametro.ACT_DISTRIB_AVISO_COBRANZA: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_DISTRBUCION_COMUNICACIONES: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        break;
      }
      case Parametro.ACT_INSPECCIONES_COMERCIALES: {
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        break;
      }
      case Parametro.ACT_MEDIDORES: {
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_TOMA_ESTADO: {
        this.estadoComponentes.inputOrdenServicio = false;
        this.estadoComponentes.inputOrdenTrabajo = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.ordenServicio = null;
        this.filtros.ordenTrabajo = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      case Parametro.ACT_SGIO: {
        this.estadoComponentes.inputNumeroCarga = false;
        this.estadoComponentes.inputNumeroCedula = false;
        this.estadoComponentes.inputNumeroReclamo = false;
        this.filtros.numeroCarga = null;
        this.filtros.numeroCedula = null;
        this.filtros.numeroReclamo = null;
        break;
      }
      default: {
        null;
        break;
      }
    }
  }

  detectarCambioFechas() {
    if (!(this.filtros.fechaInicio instanceof Date) || isNaN(this.filtros.fechaInicio.getTime())) {
      this.filtros.fechaInicio = null;
    }
    if (!(this.filtros.fechaFin instanceof Date) || isNaN(this.filtros.fechaFin.getTime())) {
      this.filtros.fechaFin = null;
    }
  }

  onLimpiarFiltros(): void {
    this.filtros.actividad = new Actividad();
    if (sessionStorage.getItem('codOficina') === null) {
      this.filtros.oficina = new Oficina();
    }
    this.filtros.fechaInicio = null;
    this.filtros.fechaFin = null;
    this.estadoComponentes.inputNumeroCarga = true;
    this.estadoComponentes.inputOrdenServicio = true;
    this.estadoComponentes.inputOrdenTrabajo = true;
    this.estadoComponentes.inputNumeroCedula = true;
    this.estadoComponentes.inputNumeroReclamo = true;
  }
}

class EstadoComponentes {
  inputNumeroCarga: boolean = true;
  inputOrdenServicio: boolean = true;
  inputOrdenTrabajo: boolean = true;
  inputNumeroCedula: boolean = true;
  inputNumeroReclamo: boolean = true;
}
