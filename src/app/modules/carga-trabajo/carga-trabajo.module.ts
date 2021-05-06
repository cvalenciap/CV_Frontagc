import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaginacionModule } from '../../components/common/paginacion/paginacion.module';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import { BsDatepickerModule, BsDropdownModule} from 'ngx-bootstrap';
import { BandejaComponent } from './bandeja/bandeja.component';
import { BusquedaBandejaComponent } from './bandeja/busqueda-bandeja/busqueda-bandeja.component';
import { DetalleBandejaComponent } from './bandeja/detalle-bandeja/detalle-bandeja.component';
import { DetalleCargaTrabajoComponent } from './detalle-carga-trabajo/detalle-carga-trabajo.component';
import {DatosConsultaComponent} from './detalle-carga-trabajo/datos-consulta/datos-consulta.component';
import { CargaArchivosComponent } from './detalle-carga-trabajo/carga-archivos/carga-archivos.component';
import {CargarArchivosComponent} from '../../components/cargar-archivos/cargar-archivos.component';
import {FileUploadModule} from 'ng2-file-upload';
import { CargaMasivaTramaComponent } from './detalle-carga-trabajo/carga-masiva-trama/carga-masiva-trama.component';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { ModalCargaComponent } from './detalle-carga-trabajo/carga-masiva-trama/modal-carga.component';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { CargaArchivosDetalleComponent } from './detalle-carga-trabajo/carga-masiva-trama/carga-archivos.component';
import {DialogsModule} from '../dialogs/dialogs.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {AlertModule} from 'ngx-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { DetalleCargaMedidoresComponent } from '../carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-medidores.component'
import { DetalleCargaDistribucionComunicacionesComponent } from '../carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-distribucion-comunicaciones.component'
import { DetalleCargaInspeccionesComercialesComponent } from '../carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-inspecciones-comerciales.component'
import { DetalleCargaTomaEstadosComponent } from '../carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-toma-estados.component'
import { DetalleCargaAvisoCobranzaComponent } from '../carga-trabajo/detalle-carga-trabajo/detalle-carga/detalle-carga-aviso-cobranza.component'
//import { NumberOnlyDirective } from '../../models/numberOnly';
import { ModalResultadoCargaEjecucionComponent } from "../carga-trabajo/modales/modal-resultado-carga-archivo_ejecucion/modal-resultado-carga-archivo-ejecucion.component";
import {ModalBackdropComponent} from 'ngx-bootstrap'
import { ModalContainerComponent, ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    DatosConsultaComponent,
    BandejaComponent,
    BusquedaBandejaComponent,
    DetalleBandejaComponent,
    DetalleCargaTrabajoComponent,
    CargaArchivosComponent,
    CargarArchivosComponent,
    CargaMasivaTramaComponent,
    ModalCargaComponent,
    CargaArchivosDetalleComponent,
    DetalleCargaMedidoresComponent,
    DetalleCargaDistribucionComunicacionesComponent,
    DetalleCargaInspeccionesComercialesComponent,
    DetalleCargaTomaEstadosComponent,
    DetalleCargaAvisoCobranzaComponent,
    //NumberOnlyDirective,
    ModalResultadoCargaEjecucionComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    PaginacionModule,
    PaginationModule,
    BsDropdownModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    ModalModule,
    FileUploadModule,
    SpinKitModule,
    DialogsModule,
    NgSelectModule,
    SweetAlert2Module,
    UploaderModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    BrowserModule
  ],
  entryComponents: [ModalCargaComponent, ModalBackdropComponent, ModalContainerComponent,
    ModalResultadoCargaEjecucionComponent]
})
export class CargaTrabajoModule { }
