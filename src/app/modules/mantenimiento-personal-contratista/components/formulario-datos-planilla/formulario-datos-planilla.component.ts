import { Component, OnInit, ChangeDetectorRef, OnDestroy, forwardRef, Input } from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { BsLocaleService, enGbLocale, defineLocale } from 'ngx-bootstrap';
import { FormBuilder, ControlValueAccessor, FormGroup, Validators, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { Constantes } from 'src/app/models/enums/constantes';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';

export interface DatosPlanillaValues {
  estadoLaboral: string;
  fechaIngreso: Date;
  motivoCese: string;
  fechaCese: string;
  observacion: string;
}

@Component({
  selector: 'app-formulario-datos-planilla',
  templateUrl: './formulario-datos-planilla.component.html',
  styleUrls: ['./formulario-datos-planilla.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormularioDatosPlanillaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormularioDatosPlanillaComponent),
      multi: true,
    }
  ]
})
export class FormularioDatosPlanillaComponent implements OnInit, ControlValueAccessor, OnDestroy {

  // TODO: Inicio Ver Detalle
  @Input() dataPersonalDetalle: PersonalContratista;
  // TODO: Fin Ver Detalle

  angForm: FormGroup;
  config: MantenimientoPersonalConfig;
  isSubmitted: boolean;
  subscriptions: Subscription[] = [];

  constructor(private mantenimientoPersonalService: MantenimientoPersonalService, private fb: FormBuilder,
    private localeService: BsLocaleService, private cd: ChangeDetectorRef) {
    // Inicio - Borro texto 'INVALID DATE' del datepicker
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    // Fin
    this.config = this.mantenimientoPersonalService.configVentanaPorOpcion();
    // TODO: Inicio Ver Detale
    if (sessionStorage.getItem('accionMantenimiento') !== 'VISUALIZAR') {
      this.crearFormulario();
      this.subscriptions.push(
        this.angForm.valueChanges.subscribe(value => {
          this.onChange(value);
          this.onTouched();
        })
      );
    }
    // TODO: Fin Ver Detalle
  }

  crearFormulario() {
    const accionMantenimiento = sessionStorage.getItem('accionMantenimiento');
    if (accionMantenimiento === 'REGISTRAR') {
      this.angForm = this.fb.group({
        estadoLaboral: ['A', Validators.required],
        fechaIngreso: ['', Validators.required],
        motivoCese: [''],
        fechaCese: [Constantes.FECHA_POR_DEFECTO],
        observacion: ['']
      });
    } else if (accionMantenimiento === 'MODIFICAR') {
      const personal = JSON.parse(sessionStorage.getItem('personalContratista'));
      this.angForm = this.fb.group({
        estadoLaboral: [personal.estadoLaboral.id, Validators.required],
        fechaIngreso: [FechaUtil.StringDDMMYYYYToDate(personal.fechaIngreso), Validators.required],
        motivoCese: [personal.motivoBaja.descripcionCorta],
        fechaCese: [personal.fechaBaja],
        observacion: [personal.observacionBaja]
      });
      if (personal.estadoPersonal.id === EstadoPersonal.ALTA) {
        this.config.inputFechaIngreso = false;
      }
    } else if (accionMantenimiento === 'VISUALIZAR') {
      this.angForm = this.fb.group({
        estadoLaboral: [this.dataPersonalDetalle.estadoLaboral.id],
        fechaIngreso: [this.dataPersonalDetalle.fechaIngreso],
        motivoCese: [this.dataPersonalDetalle.motivoBaja.codigo === 0 ? '' : this.dataPersonalDetalle.motivoBaja.descripcionCorta],
        fechaCese: [this.dataPersonalDetalle.fechaBaja],
        observacion: [this.dataPersonalDetalle.observacionBaja]
      });
    }

  }

  get f() { return this.angForm.controls; }

  get value(): DatosPlanillaValues {
    return this.angForm.value;
  }

  ngOnInit() {
    if (sessionStorage.getItem('accionMantenimiento') === 'VISUALIZAR') {
      this.crearFormulario();
    }
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  set value(value: DatosPlanillaValues) {
    this.angForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  submit() {
    this.isSubmitted = true;
  }

  validate(_: FormControl) {
    return this.angForm.valid ? null : { datosBasicos: { valid: false, }, };
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

}
