import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {StarterViewComponent} from './starterview.component';
import {LoginComponent} from './login.component';
import {ContrasenaComponent} from './contrasena.component';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';

import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import {FormsModule} from '@angular/forms';
import { CambiarContrasenaComponent } from './cambiar.component';
import { MultiperfilComponent } from './multiperfil.component';

@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    ContrasenaComponent,
    CambiarContrasenaComponent,
    MultiperfilComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PeityModule,
    SparklineModule,
    NgSelectModule,
    SpinKitModule
  ],
  exports: [
    StarterViewComponent,
    LoginComponent
  ],
})

export class AppviewsModule {
}
