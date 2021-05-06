import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import { DialogsModule} from '../../modules/dialogs/dialogs.module';
import { CronAlertaComponent } from './cron-alertas/cron-alerta.component';
import { AlertaTemplateComponent } from './alertas-template/alerta-template.component';
import { RegistrarAlertaTemplateComponent } from './alertas-template/registrar-alerta-template/registrar-alerta-template.component';
import { RegistrarCronAlertaComponent } from './cron-alertas/registrar-cron-alerta/registrar-cron-alerta.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PaginacionModule,
    PaginationModule,
    DialogsModule
  ],
  declarations: [
    CronAlertaComponent,
    AlertaTemplateComponent,
    RegistrarAlertaTemplateComponent,
    RegistrarCronAlertaComponent
  ]
})
export class AlertasModule { }
