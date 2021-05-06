import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { EstadoSolicitud } from 'src/app/models/enums/estado-solicitud.enum';
import { CargoApiService } from 'src/app/services/impl/cargo-api.service';
import { Cargo } from 'src/app/models/interface/cargo';
import { Response } from 'src/app/models/response';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { TipoSolicitud } from 'src/app/models/enums/tipo-solicitud.enum';
import { MotivoSolicitud } from 'src/app/models/enums/motivo-solicitud.enum';

@Component({
  selector: 'app-solicitud-cambio-cargo',
  templateUrl: './solicitud-cambio-cargo.component.html',
  styleUrls: ['./solicitud-cambio-cargo.component.scss']
})
export class SolicitudCambioCargoComponent implements OnInit {

  angForm: FormGroup;
  guardarRegistro: boolean;
  isSubmitted: boolean;
  listaCargos: Cargo[];
  @Output() cerrarModal = new EventEmitter();

  aceptar() {
    this.mantenimientoPersonalService.registrarSolicitud(this.angForm.value);
    this.cerrarModal.emit();
  }

  cancelar() {
    this.cerrarModal.emit();
  }

  cancelarRegistro() {
    this.guardarRegistro = false;
  }

  constructor(private fb: FormBuilder,
    private cargoApiService: CargoApiService,
    private mantenimientoPersonalService: MantenimientoPersonalService) {
    this.listaCargos = [];
    this.obtenerCargos();
  }

  crearFormulario() {
    this.angForm = this.fb.group({
      tipoSolicitud: [TipoSolicitud.SOLICITUD_CAMBIO_CARGO],
      fechaSolicitud: [FechaUtil.DateToStringDDMMYYYY(new Date)],
      motivo: [MotivoSolicitud.CAMBIO_CARGO],
      cargoNuevo: ['', Validators.required],
      estado: [EstadoSolicitud.PENDIENTE_APROBACION],
      descripcion: ['']
    });
  }

  get f() { return this.angForm.controls; }

  guardar() {
    this.isSubmitted = true;
    if (this.angForm.valid) {
      this.guardarRegistro = true;
    }
  }

  ngOnInit() {
    this.guardarRegistro = false;
    this.crearFormulario();
  }

  obtenerCargos() {
    this.cargoApiService.obtenerListaCargos('G').subscribe((response: Response) => {
      const personal = JSON.parse(sessionStorage.getItem('personalContratista'));
      response.resultado.forEach(element => {
        if (element.id !== personal.cargo.id) {
          this.listaCargos.push(element);
        }
      });
    },
      (error: any) => {
        console.error('error al obtener cargos:', error);
      });
  }

}
