import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BandejaPersonalService } from '../../services/bandeja-personal.service';
import { BandejaPersonalEvents } from 'src/app/models/enums/bandeja-personal-events.enum';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import StorageUtil from 'src/app/modules/shared/util/storage-util';
import { DatePipe } from '@angular/common';
import { CesarPersonalRequest } from 'src/app/models/request/cesar-personal-request';
import { PersonalContratistaApiService } from 'src/app/services/impl/personal-contratista-api.service';
import { ResponseObject } from 'src/app/models/response/response-object';
import { ToastrUtilService } from 'src/app/services/impl/toastr-util.service';
import { Mensajes } from 'src/app/models/enums/mensajes';
import { ResponseStatus } from 'src/app/models/enums/response-status.enum';
import { Estado } from 'src/app/models/interface/estado';
import { ResultadoCarga } from 'src/app/models/enums/resultado-carga.enum';
import { ValidarFechaCese } from 'src/app/modules/shared/validators/fecha-cese-validator';

@Component({
  selector: 'app-cesar-personal',
  templateUrl: './cesar-personal.component.html',
  styleUrls: ['./cesar-personal.component.scss']
})
export class CesarPersonalComponent implements OnInit {

  @Input() data: PersonalContratista;
  @Output() cesarPersonalEvent = new EventEmitter();

  comboMotivoCese: Estado[] = [];
  mostrarConfirmar: boolean = false;
  formularioCese: FormGroup;

  validMotivoCese: boolean = false;
  validFecCese: boolean = false;

  fechaMax: Date = new Date();

  cesarPersonalRequest: CesarPersonalRequest;

  loading: boolean = false;

  constructor(private bandejaService: BandejaPersonalService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private personalApi: PersonalContratistaApiService,
    private toastrUtil: ToastrUtilService) {
    this.comboMotivoCese = StorageUtil.recuperarObjetoSession('parametrosBandejaPersonal').motivosCese;
  }

  ngOnInit() {
    this.buildFormulario();
    this.observarFormulario();
  }

  private buildFormulario(): void {
    this.formularioCese = this.formBuilder.group({
      motivoCese: ['', Validators.required],
      fecCese: ['', [Validators.required, ValidarFechaCese]],
      observacion: null
    });
  }

  public getControl(controlName: string) {
    return this.formularioCese.get(controlName);
  }

  private observarFormulario() {
    this.formularioCese.statusChanges.subscribe(() => {
      const motivoCese = this.formularioCese.get('motivoCese');
      const fecCese = this.formularioCese.get('fecCese');
      this.validMotivoCese = motivoCese.invalid && (motivoCese.touched || motivoCese.dirty);
      this.validFecCese = fecCese.invalid && (fecCese.touched || fecCese.dirty);
    });
  }

  public async onCesarPersonal() {
    this.loading = true;
    await this.personalApi.cesarPersonal(this.cesarPersonalRequest).toPromise()
    .then((response: ResponseObject) => {
      if (response.estado === ResponseStatus.OK) {
        const resultadoCese: any = response.resultado;
        if (resultadoCese.resultado === ResultadoCarga.CORRECTO) {
          this.loading = false;
          this.cesarPersonalEvent.emit(resultadoCese.mensaje);
        } else {
          this.toastrUtil.showError(resultadoCese.mensaje);
          this.loading = false;
        }
      } else {
        console.error(response);
        this.loading = false;
        this.toastrUtil.showError(response.error.mensaje);
      }
    })
    .catch(err => {
      console.error(err);
      this.loading = false;
      this.toastrUtil.showError(Mensajes.MENSAJE_ERROR_GENERICO);
    });
  }

  onMostrarConfirmar(): void {
    if (this.formularioCese.valid) {
      this.cesarPersonalRequest = {
        codigoEmpleado: this.data.codigoEmpleado,
        codMotCese: this.formularioCese.get('motivoCese').value,
        fechaCese: this.datePipe.transform(this.formularioCese.get('fecCese').value, 'dd/MM/yyyy'),
        observacion: this.formularioCese.get('observacion').value
      };
      this.mostrarConfirmar = true;
    } else {
      this.validFecCese = !this.getControl('fecCese').valid;
      this.validMotivoCese = !this.getControl('motivoCese').valid;
    }
  }

  onOcultarConfirmar(): void {
    this.mostrarConfirmar = false;
  }

  onCerrarModalCesarPersonal(): void {
    this.bandejaService.emiteEvento({ evento: BandejaPersonalEvents.CLOSE_CESAR_PERSONAL });
  }

  private validarFecha(control: FormControl): ValidationErrors | undefined {
    return undefined;
  }

}
