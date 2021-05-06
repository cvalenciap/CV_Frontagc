import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {EmpresasRoutes} from './empresas.routes';

// views
import { EmpresaConsultarComponent } from './empresa-consultar/empresa-consultar.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginacionModule} from '../../components/common/paginacion/paginacion.module';
import {PaginacionInfoComponent} from '../../components/common/paginacion/paginacion-info.component';
import {PaginacionSetComponent} from '../../components/common/paginacion/paginacion-set.component';
import { EmpresaAgregarEditarComponent } from './empresa-agregar-editar/empresa-agregar-editar.component';
import {UiSwitchModule} from 'ngx-ui-switch';
import {DialogsModule} from '../dialogs/dialogs.module';
import {AlertModule} from 'ngx-bootstrap';
import { EmpresaAsignarItemsComponent } from './empresa-asignar-items/empresa-asignar-items.component';
// modules/components


@NgModule({
  declarations: [
    EmpresaConsultarComponent,
    EmpresaAgregarEditarComponent,
    EmpresaAsignarItemsComponent
  ],
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
    AlertModule.forRoot()
  ]
})
export class EmpresasModule { }
