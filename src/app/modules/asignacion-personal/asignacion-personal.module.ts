import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {BusquedaGruposOficinaComponent} from './busqueda-grupos-oficina/busqueda-grupos-oficina.component';
import {AsignarPersonalComponent} from './asignar-personal/asignar-personal.component';
import {BsDropdownModule, PaginationModule, TooltipModule} from 'ngx-bootstrap';
import {PaginacionModule} from '../../components/common/paginacion/paginacion.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MayusculasDirective} from './directivas/mayusculas.directive';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpinKitModule,
    SweetAlert2Module,
    PaginationModule,
    PaginacionModule,
    NgxPaginationModule,
    TooltipModule,
    BsDropdownModule
  ],
  declarations: [BusquedaGruposOficinaComponent, AsignarPersonalComponent, MayusculasDirective]
})
export class AsignacionPersonalModule { }
