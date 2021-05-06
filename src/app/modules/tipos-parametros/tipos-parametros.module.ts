import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from '../../components/forms/iCheck';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { UiSwitchModule } from 'ngx-ui-switch';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {DialogsModule} from '../dialogs/dialogs.module';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
// views
import {TiposParametrosListaComponent} from './views/lista.component';
import {TiposParametrosEditarComponent} from './views/editar.component';
import {ParametrosListaComponent} from './component/lista.component';
import {ParametrosEditarComponent} from './component/editar.component';
import {AlertModule} from 'ngx-bootstrap';

// modules/components


@NgModule({
  declarations: [
    TiposParametrosListaComponent,
    TiposParametrosEditarComponent,
    ParametrosListaComponent,
    ParametrosEditarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    UiSwitchModule,
    PaginacionModule,
    DialogsModule,
    AlertModule.forRoot()
  ]
})
export class TiposParametrosModule { }
