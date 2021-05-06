import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {AlertModule, BsDatepickerModule, BsDropdownModule, PaginationModule, TooltipModule} from 'ngx-bootstrap';
import {IcheckModule} from '../../components/forms/iCheck';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginacionModule} from '../../components/common/paginacion/paginacion.module';
import {UiSwitchModule} from 'ngx-ui-switch';
import {DialogsModule} from '../dialogs/dialogs.module';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import { SharedModule } from 'src/app/models/sharedModule ';
import { DatePipe } from '@angular/common';
import { DemoMaterialModule, TabsModule } from 'src/app/components/tabs/tabConsultas/tabconsultaruc.module';
import { ImageViewerModule } from 'ng2-image-viewer';
import { BandejaAsignacionTrabajoComponent } from './bandeja-asignacion-trabajo/bandeja-asignacion-trabajo.component';
import { BandejaMonitoreoComponent } from './bandeja-monitoreo/bandeja-monitoreo.component';
import { BandejaInspecComercialesComponent } from './bandeja-inspecciones-comerciales/bandeja-inspecciones-comerciales.component';
import { BandejaDistComunicacionesComponent } from './bandeja-distribucion-comunicaciones/bandeja-distribucion-comunicaciones.component';
import { BandejaDistAvisosComponent } from './bandeja-distribucion-avisos/bandeja-distribucion-avisos.component';
import { BandejaMedidoresComponent } from './bandeja-medidores/bandeja-medidores.component';
import { BandejaCierresReaperturasComponent } from './bandeja-cierres-reaperturas/bandeja-cierres-reaperturas.component';
import { BandejaSostenibilidadComponent } from './bandeja-sostenibilidad/bandeja-sostenibilidad.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PaginacionModule,
    UiSwitchModule,
    DialogsModule,
    TooltipModule,
    AlertModule.forRoot(),
    PdfJsViewerModule,
    SharedModule,
    TabsModule,
    DemoMaterialModule,
    ImageViewerModule
  ],
  declarations: [
    BandejaAsignacionTrabajoComponent,
    BandejaMonitoreoComponent,
    BandejaInspecComercialesComponent,
    BandejaDistComunicacionesComponent,
    BandejaDistAvisosComponent,
    BandejaMedidoresComponent,
    BandejaCierresReaperturasComponent,
    BandejaSostenibilidadComponent
  ],
  providers:[DatePipe]
})

export class MonitoreoModule { }