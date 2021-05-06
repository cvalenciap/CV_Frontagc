import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { VisorPdfComponent } from './visor-pdf/visor-pdf.component';

// views
import {BuscarCargaTrabajoComponent} from './carga-trabajo/carga-trabajo.component';
import {AnularCargaComponent} from '../carga-trabajo/bandeja/detalle-bandeja/carga-anular.component';
import {BuscarEmpresaComponent} from './buscar-empresa/buscar-empresa.component';
import {BuscarParametroComponent} from './buscar-parametro/buscar-parametro.component';


@NgModule({
  declarations: [    
    BuscarCargaTrabajoComponent,
    BuscarEmpresaComponent,
    BuscarParametroComponent,
    AnularCargaComponent,
    VisorPdfComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    NgSelectModule,
    FormsModule,
    PdfJsViewerModule
  ],
  exports: [
    BuscarCargaTrabajoComponent,
    BuscarEmpresaComponent,
    BuscarParametroComponent,
    AnularCargaComponent,
    VisorPdfComponent
  ]
})
export class DialogsModule { }
