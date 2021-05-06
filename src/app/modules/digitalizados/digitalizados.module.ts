import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaDigitalizadosComponent } from './bandeja-digitalizados/bandeja-digitalizados.component';
import { BandejaLogDigitalizadosComponent } from './bandeja-log-digitalizados/bandeja-log-digitalizados.component';
import {RouterModule} from '@angular/router';
import {AlertModule, BsDatepickerModule, BsDropdownModule, PaginationModule, TooltipModule, TabsModule} from 'ngx-bootstrap';
import {IcheckModule} from '../../components/forms/iCheck';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginacionModule} from '../../components/common/paginacion/paginacion.module';
import {UiSwitchModule} from 'ngx-ui-switch';
import {DialogsModule} from '../dialogs/dialogs.module';
import { FiltrosBandejaDigitalizadosComponent } from './modales/filtros-bandeja-digitalizados/filtros-bandeja-digitalizados.component';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {VisorPdfComponent} from '../../components/common/visor-pdf/visor-pdf.component';
import { FiltrosBandejaLogComponent } from './modales/filtros-bandeja-log/filtros-bandeja-log.component';
import { SharedModule } from 'src/app/models/sharedModule ';
import { DatePipe } from '@angular/common';
import { ImageViewerModule } from 'ng2-image-viewer';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule,
    ImageViewerModule
  ],
  declarations: [
    BandejaDigitalizadosComponent,
    BandejaLogDigitalizadosComponent,
    FiltrosBandejaDigitalizadosComponent,
    VisorPdfComponent,
    FiltrosBandejaLogComponent
  ],
  providers:[DatePipe]
})
export class DigitalizadosModule { }
