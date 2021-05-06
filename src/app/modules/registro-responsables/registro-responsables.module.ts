import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarResponsablesComponent } from './asignar-responsables/asignar-responsables.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {RouterModule} from '@angular/router';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpinKitModule,
    SweetAlert2Module
  ],
  declarations: [
    AsignarResponsablesComponent
  ]
})
export class RegistroResponsablesModule { }
