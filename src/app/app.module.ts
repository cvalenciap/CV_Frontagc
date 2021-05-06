import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import {  MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES} from './app.routes';
import { AppComponent } from './app.component';
// App views
// import { DashboardsModule } from './views/dashboards/dashboards.module';
import { AppviewsModule } from './views/appviews/appviews.module';

// App modules/components
import { SpinKitModule } from './components/common/spinkit/spinkit.module';
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { PaginacionModule } from './components/common/paginacion/paginacion.module';
import { DialogsModule} from './modules/dialogs/dialogs.module';
import { EmpresasModule} from './modules/empresas/empresas.module';
import { CargaTrabajoModule } from './modules/carga-trabajo/carga-trabajo.module';
import { TiposParametrosModule } from './modules/tipos-parametros/tipos-parametros.module';
import { AuthGuard } from './auth/auth.guard';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import {AsignarResponsablesComponent} from './modules/registro-responsables/asignar-responsables/asignar-responsables.component';
import {RegistroResponsablesModule} from './modules/registro-responsables/registro-responsables.module';
import {TokenInterceptor} from './auth/token.interceptor';
import {ErrorInterceptor} from './auth/error.interceptor';
import { NavegacionService } from './services/impl/navegacion.service';
import { MantenimientoPersonalContratistaModule } from './modules/mantenimiento-personal-contratista/mantenimiento-personal-contratista.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ItemsModule } from './modules/mantenimiento/items/items.module';
import { CargosModule } from './modules/mantenimiento/cargos/cargos.module';

import {AsignacionPersonalModule} from './modules/asignacion-personal/asignacion-personal.module';
import {NgxPaginationModule} from 'ngx-pagination';

import { PaginationModule } from 'ngx-bootstrap/pagination';

// INICIO - AGC114
import {DigitalizadosModule} from './modules/digitalizados/digitalizados.module';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
// FIN - AGC114
import { ImageViewerModule } from 'ng2-image-viewer';
import { TabsModule } from 'ngx-bootstrap';
import { MonthDatePickerComponent } from './shared/util/month-date-picker/month-date-picker.component';
import { MonitoreoModule } from './modules/monitoreo/monitoreo.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { AlertasModule } from './modules/alertas/alertas.module';

registerLocaleData(localeEsPe, 'es-PE');

@NgModule({
  declarations: [
    AppComponent,
    UploadFilesComponent,
    MonthDatePickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required for Toastr
    // 3rd party modules
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    SpinKitModule,
    NgxSummernoteModule,
    FileUploadModule,
    UploaderModule,
    NgSelectModule,
    NgbModule,
    // Routes
    RouterModule.forRoot(ROUTES, {onSameUrlNavigation: 'reload'}),
    // App modules
    AppviewsModule,
    // DashboardsModule,
    LayoutsModule,
    PaginacionModule,
    DialogsModule,
    UiSwitchModule,
    EmpresasModule,
    RegistroResponsablesModule,
    CargaTrabajoModule,
    TiposParametrosModule,
    MantenimientoPersonalContratistaModule,
    ItemsModule,
    CargosModule,
    AsignacionPersonalModule,
    NgxPaginationModule,
    DigitalizadosModule,
    PdfJsViewerModule,
    TabsModule,
    MatTabsModule,
    ImageViewerModule,
    PaginationModule,
    MonitoreoModule,
    ReportesModule,
    AlertasModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    DatePipe,
    Title,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private navegacionService: NavegacionService) {}
}
