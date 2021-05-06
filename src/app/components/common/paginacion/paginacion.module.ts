import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {PaginacionSetComponent} from './paginacion-set.component';
import {PaginacionInfoComponent} from './paginacion-info.component';

@NgModule({
  declarations: [
    PaginacionSetComponent,
    PaginacionInfoComponent
  ],
  exports     : [
    PaginacionSetComponent,
    PaginacionInfoComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule
  ]
})

export class PaginacionModule {}
