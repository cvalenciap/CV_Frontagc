import { Component, OnInit, OnDestroy, forwardRef, Input } from '@angular/core';
import { MantenimientoPersonalConfig } from 'src/app/models/mantenimiento-personal-config';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';
import { FormBuilder, FormGroup, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Constantes } from 'src/app/models/enums/constantes';
import { EstadoPersonal } from 'src/app/models/enums/estado-personal.enum';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';

export interface DatosSedapalValues {
  codigoSedapal: string;
  estadoCodigo: Date;
  fechaAlta: string;
  fechaBaja: string;
}

@Component({
  selector: 'app-formulario-datos-sedapal',
  templateUrl: './formulario-datos-sedapal.component.html',
  styleUrls: ['./formulario-datos-sedapal.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormularioDatosSedapalComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormularioDatosSedapalComponent),
      multi: true,
    }
  ]
})
export class FormularioDatosSedapalComponent implements OnInit, ControlValueAccessor, OnDestroy {

  // TODO: Inicio Ver Detalle
  @Input() dataPersonalDetalle: PersonalContratista;
  // TODO: Fin Ver Detalle

  angForm: FormGroup;
  config: MantenimientoPersonalConfig;
  isSubmitted: boolean;
  subscriptions: Subscription[] = [];

  constructor(private mantenimientoPersonalService: MantenimientoPersonalService, private fb: FormBuilder) {
    this.config = this.mantenimientoPersonalService.configVentanaPorOpcion();
    // TODO: Inicio Ver Detalle
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
        codigoSedapal: [''],
        // estadoCodigo: [Constantes.PENDIENTE_ALTA, Validators.required],
        estadoCodigo: [EstadoPersonal.PENDIENTE_DE_ALTA, Validators.required],
        fechaAlta: [Constantes.FECHA_POR_DEFECTO],
        fechaBaja: [Constantes.FECHA_POR_DEFECTO]
      });
    } else if (accionMantenimiento === 'MODIFICAR') {
      const personal = JSON.parse(sessionStorage.getItem('personalContratista'));
      this.angForm = this.fb.group({
        codigoSedapal: [personal.codigoEmpleado],
        estadoCodigo: [personal.estadoPersonal.id],
        fechaAlta: [personal.fechaAlta],
        fechaBaja: [personal.fechaBaja]
      });
    } else if (accionMantenimiento === 'VISUALIZAR') {
      this.angForm = this.fb.group({
        codigoSedapal: [this.dataPersonalDetalle.codigoEmpleado],
        estadoCodigo: [this.dataPersonalDetalle.estadoPersonal.id],
        fechaAlta: [this.dataPersonalDetalle.fechaAlta],
        fechaBaja: [this.dataPersonalDetalle.fechaBaja]
      });
    }
  }

  get f() { return this.angForm.controls; }

  get value(): DatosSedapalValues {
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

  set value(value: DatosSedapalValues) {
    this.angForm.setValue(value);
    this.onChange(value);
    this.onTouched();
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
