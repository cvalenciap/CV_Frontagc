import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import FechaUtil from 'src/app/modules/shared/util/fecha-util';
import { EstadoSolicitud } from 'src/app/models/enums/estado-solicitud.enum';
import { RequestParametro } from 'src/app/models/request/request-parametro';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Response, Oficina } from '../../../../models';
import { Parametro } from 'src/app/models/enums/parametro';
import { MotivoSolicitud } from 'src/app/models/enums/motivo-solicitud.enum';
import { CargoApiService } from 'src/app/services/impl/cargo-api.service';
import { Cargo } from 'src/app/models/interface/cargo';
import { Item } from 'src/app/models/item';
import { SolicitudApiService } from 'src/app/services/impl/solicitud-api.service';
import { PersonalContratista } from 'src/app/models/interface/personal-contratista';
import { TipoSolicitud } from 'src/app/models/enums/tipo-solicitud.enum';
import { MantenimientoPersonalService } from '../../services/mantenimiento-personal.service';

@Component({
    selector: 'app-solicitud-movimiento-personal',
    templateUrl: './solicitud-movimiento-personal.component.html',
    styleUrls: ['./solicitud-movimiento-personal.component.scss']
})
export class SolicitudMovimientoPersonalComponent implements OnInit {

    angForm: FormGroup;
    guardarRegistro: boolean;
    isSubmitted: boolean;
    listaMotivoMovimiento: any[];
    listaCargos: Cargo[];
    listaOficinas: Oficina[];
    listaItems: Item[];
    personal: PersonalContratista;
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
        private parametrosService: ParametrosService,
        private cargoApiService: CargoApiService,
        private mantenimientoPersonalService: MantenimientoPersonalService,
        private solicitudApiService: SolicitudApiService) {
        this.personal = JSON.parse(sessionStorage.getItem('personalContratista'));
    }

    crearFormulario() {
        this.angForm = this.fb.group({
            tipoSolicitud: [TipoSolicitud.SOLICITUD_MOVIMIENTO],
            fechaSolicitud: [FechaUtil.DateToStringDDMMYYYY(new Date)],
            motivo: ['', Validators.required],
            descripcion: [null],
            estado: [EstadoSolicitud.PENDIENTE_APROBACION]
        });
    }

    get f() { return this.angForm.controls; }

    guardar() {
        this.isSubmitted = true;
        if (this.angForm.valid) {
            this.guardarRegistro = true;
        }
    }



    habilitarControles(evento: string) {
        this.isSubmitted = false;
        this.removerControlesForm();
        this.resetListas();
        switch (evento) {
            case MotivoSolicitud.CAMBIO_OFICINA.toString(): {
                this.angForm.addControl('oficina', new FormControl('', Validators.required));
                this.listarOficinas(this.personal.item.id);
                break;
            }
            case MotivoSolicitud.CAMBIO_ITEM.toString(): {
                this.angForm.addControl('item', new FormControl('', Validators.required));
                //this.angForm.addControl('oficina', new FormControl('', Validators.required));
                this.listarItems();
                break;
            }
            case MotivoSolicitud.CAMBIO_OFICINA_CARGO.toString(): {
                this.angForm.addControl('cargo', new FormControl('', Validators.required));
                this.angForm.addControl('oficina', new FormControl('', Validators.required));
                this.listarCargos();
                this.listarOficinas(this.personal.item.id);
                break;
            }
            case MotivoSolicitud.CAMBIO_ITEM_CARGO.toString(): {
                this.angForm.addControl('cargo', new FormControl('', Validators.required));
                this.angForm.addControl('item', new FormControl('', Validators.required));
                //this.angForm.addControl('oficina', new FormControl('', Validators.required));
                this.listarCargos();
                this.listarItems();
                break;
            }
            default: {
                break;
            }
        }
    }

    listarCargos() {
        this.cargoApiService.obtenerListaCargos('G').subscribe((response: Response) => {
            this.listaCargos = response.resultado;
        },
            (error: any) => {
                console.error('error al obtener cargos:', error);
            });
    }

    listarItems() {
        this.solicitudApiService.obtenerListaItemEmpresa(this.personal.contratista.codigo).subscribe((response: Response) => {
            this.listaItems = response.resultado;
            this.listaItems = this.listaItems.filter(obj => obj.id !== this.personal.item.id);
        },
            (error: any) => {
                console.error('Error al obtener items: ', error);
            });
    }

    listarOficinas(codigoItem: any) {
        this.isSubmitted = false;
        this.angForm.addControl('oficina', new FormControl('', Validators.required));
        const codigoEmpresa = this.personal.contratista.codigo;
        this.solicitudApiService.obtenerListaOficinaItem(codigoEmpresa, codigoItem).subscribe((response: Response) => {
            this.listaOficinas = response.resultado;
            this.listaOficinas = this.listaOficinas.filter(obj => obj.codigo !== this.personal.oficina.codigo);
        },
            (error: any) => {
                console.error('Error al obtener oficinas: ', error);
            });
    }

    listarMotivoCambio() {
        const requestParametro: RequestParametro = {
            tipo: Parametro.TIPO_PARAM_MOV_PERS as number,
            codigo: 0,
            estado: 'G',
            detalle: 'G',
            descripcionCorta: 'G',
            valor: 'G',
            usuario: 'G'
        };
        this.parametrosService.consultarParametros(requestParametro, 1, 100).subscribe((response: Response) => {
            this.listaMotivoMovimiento = response.resultado;
            this.listaMotivoMovimiento = this.listaMotivoMovimiento.filter(obj => obj.codigo !== MotivoSolicitud.CAMBIO_CARGO);
        }, (error) => {
            console.error('error al obtener motivos de solicitud: ', error);
        });
    }

    ngOnInit(): void {
        this.guardarRegistro = false;
        this.crearFormulario();
        this.listarMotivoCambio();
    }

    removerControlesForm() {
        this.angForm.removeControl('cargo');
        this.angForm.removeControl('item');
        this.angForm.removeControl('oficina');
    }

    resetListas() {
        this.listaCargos = [];
        this.listaItems = [];
        this.listaOficinas = [];
    }

}
