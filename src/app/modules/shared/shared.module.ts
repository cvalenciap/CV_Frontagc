import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoWhiteSpaceDirective } from './directives/no-white-space.directive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { BsDropdownModule, BsDatepickerModule, PaginationModule, ProgressbarModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { NumberOnlyDirective } from './directives/numberOnly';
import { MaterialModule } from './material/material.module';
import { SpinKitModule } from 'src/app/components/common/spinkit/spinkit.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginacionModule } from 'src/app/components/common/paginacion/paginacion.module';
import { FileUploadModule } from 'ng2-file-upload';
import { CustomFiltroBasicoComponent } from './components/custom-filtro-basico/custom-filtro-basico.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomFiltrosBusquedaComponent } from './components/custom-filtros-busqueda/custom-filtros-busqueda.component';
import { DateOnlyDirective } from './directives/date-only.directive';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { WordsOnlyDirective } from './directives/words-only.directive';
import { FormatoPeriodoDirective } from './directives/formato-periodo.directive';//
import { PeriodoPipe } from './pipes/periodo.pipe';
//import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
//import { IconDefinition } from '@ant-design/icons-angular';
//import * as AllIcons from '@ant-design/icons-angular/icons';
import { MonthDatePickerComponent } from './util/month-date-picker/month-date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonReturnComponent } from './util/botton-return.component';

/*const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
*/
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    NgbModule.forRoot(),
    BsDropdownModule,
    BsDatepickerModule,
    SweetAlert2Module,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [
    NoWhiteSpaceDirective,
    NumberOnlyDirective,
    NumericOnlyDirective,
    DateOnlyDirective,
    WordsOnlyDirective,
    FormatoPeriodoDirective,
    CustomFiltroBasicoComponent,
    CustomFiltrosBusquedaComponent,PeriodoPipe, MonthDatePickerComponent,ButtonReturnComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NoWhiteSpaceDirective,
    NumberOnlyDirective,
    NumericOnlyDirective,
    DateOnlyDirective,
    WordsOnlyDirective,
    FormatoPeriodoDirective,
    ModalModule,
    AlertModule,
    TooltipModule,
    BsDropdownModule,
    BsDatepickerModule,
    SweetAlert2Module,
    SpinKitModule,
    NgSelectModule,
    PaginacionModule,
    PaginationModule,
    FileUploadModule,
    ProgressbarModule,
    CustomFiltroBasicoComponent,
    CustomFiltrosBusquedaComponent,
    PeriodoPipe,
   // NgZorroAntdModule,
    MonthDatePickerComponent,
    ButtonReturnComponent
  ]
 // providers   : [ { provide: NZ_ICONS, useValue: icons } ]
})
export class SharedModule { }
