import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Empresa, Paginacion} from 'src/app/models';
import {CargaTrabajo} from '../../../../models/CargaTrabajo';
import {ToastrService} from 'ngx-toastr';
import {Parametro} from 'src/app/models/enums/parametro';
import {EmpresasService} from 'src/app/services/impl/empresas.service';
import {ResponseObject} from 'src/app/models/response/response-object';
import {validate} from 'class-validator';
import {BsLocaleService, defineLocale, esLocale} from 'ngx-bootstrap';
import {DetalleCargaTomaEstadosComponent} from '../detalle-carga/detalle-carga-toma-estados.component';
import {CargasTrabajoService} from 'src/app/services/impl/cargas-trabajo.service';
import {TomaEstados} from 'src/app/models/TomaEstados';

@Component({
  selector: 'app-datos-consulta',
  templateUrl: './datos-consulta.component.html',
  styleUrls: ['./datos-consulta.component.scss']
})
export class DatosConsultaComponent implements OnInit {
  @Input() datosRegistro: CargaTrabajo;
  @Output() listaItems: TomaEstados[];

  @Output() fechaInicioVigencia: Date = null;
  @Output() fechaFinVigencia: Date = null;
  @Output() contratista: Empresa = new Empresa();

  @Output() emitEventAdjuntos: EventEmitter<number> = new EventEmitter<number>();
  @Output() emitEventFechas: EventEmitter<[Date, Date]> = new EventEmitter<[Date, Date]>();
  @Output() emitEventContratista: EventEmitter<Empresa> = new EventEmitter<Empresa>();

  listaEmpresas: Empresa[];

  blnContratista = false;
  blnFechaCarga = false;
  blnFechaSedapal = false;
  blnFechaContratista = false;

  /* Manejo de errores */
  errors: any;

  /* Id contratista */
  idConstratista: string;
  comentario: string;
  viewAdjuntos: number;
  paginacion: Paginacion = new Paginacion({'pagina': 1, 'registros': 10});

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private empresaService: EmpresasService,
              private service: CargasTrabajoService) {

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.listaEmpresas = [];
    this.idConstratista = '0';
    this.comentario = '';
  }

  @ViewChild(DetalleCargaTomaEstadosComponent) detalleCargaTomaEstadosComponent;

  ngOnInit() {
    this.viewAdjuntos = 0;
    if (this.datosRegistro.uidEstado == Parametro.POR_ENVIAR || this.datosRegistro.uidEstado == Parametro.OBSERVADO_POR_CONTRATISTA) {
      if (this.datosRegistro.uidContratista > 0) {
        const contratista = new Empresa();
        contratista.codigo = this.datosRegistro.uidContratista;
        this.emitEventContratista.emit(contratista);
      }
      this.consultarEmpresas(Number(sessionStorage.getItem('codigoTrabajador')));
    } else {
      let empresa = new Empresa();
      empresa.codigo = this.datosRegistro.uidContratista;
      empresa.descripcion = this.datosRegistro.descContratista;
      this.listaEmpresas.push(empresa);
      this.idConstratista = this.datosRegistro.uidContratista.toString();
    }

  }

  changeViewAdjuntos() {
    localStorage.setItem('viewAdjuntos', this.viewAdjuntos.toString());
    this.emitEventAdjuntos.emit(+localStorage.getItem('viewAdjuntos'));
  }

  onSetearError(errors): void {
    this.errors = errors;
  }

  onChangeContratista() {
    this.contratista = this.listaEmpresas.find(x => x.codigo == +this.idConstratista);
    this.fechaInicioVigencia = this.contratista.fechaInicioVigencia;
    this.fechaFinVigencia = this.contratista.fechaFinVigencia;
    this.emitEventFechas.emit([this.fechaInicioVigencia, this.fechaFinVigencia]);
    this.emitEventContratista.emit(this.contratista);
  }

  consultarEmpresas(idPers: number) {
    this.empresaService.listarEmpresaPersonal(idPers).subscribe((response: ResponseObject) => {
      this.listaEmpresas = response.resultado;
      this.fechaInicioVigencia = this.listaEmpresas[0].fechaInicioVigencia;
      this.fechaFinVigencia = this.listaEmpresas[0].fechaFinVigencia;
      this.contratista = this.listaEmpresas[0];
      this.emitEventFechas.emit([this.fechaInicioVigencia, this.fechaFinVigencia]);
      this.datosRegistro.uidContratista > 0 || this.datosRegistro.uidContratista ? this.idConstratista = this.datosRegistro.uidContratista.toString() : null;
      if (this.listaEmpresas.length == 1 && this.datosRegistro.uidContratista == 0) {
        this.idConstratista = this.listaEmpresas[0].codigo.toString();
        this.datosRegistro.uidContratista = this.listaEmpresas[0].codigo;
        this.fechaInicioVigencia = this.listaEmpresas[0].fechaInicioVigencia;
        this.fechaFinVigencia = this.listaEmpresas[0].fechaFinVigencia;
        this.contratista = this.listaEmpresas[0];
        this.emitEventFechas.emit([this.fechaInicioVigencia, this.fechaFinVigencia]);
        this.emitEventContratista.emit(this.contratista);
      }
    }, (error) => {
      this.toastr.error(error, 'Error', {closeButton: true});
    });
  }

  onValidar(): void {
    this.datosRegistro.uidContratista = Number(this.idConstratista);
    Number(this.idConstratista) > 0 || this.idConstratista ? this.datosRegistro.uidContratista = Number(this.idConstratista) : null;

    this.errors = {};
    validate(this.datosRegistro).then(errors => {
      if (errors.length > 0) {
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, {value: e.constraints[Object.keys(e.constraints)[0]]});
        });
        this.controlarError(errors);
      }
    });
  }

  controlarError(error) {
    this.toastr.error(error, 'Error', {closeButton: true});
  }

}
