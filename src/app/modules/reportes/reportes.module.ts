import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import { InformeActividadEjecutadaComponent } from './informe-actividad-ejecutada/informe-actividad-ejecutada.component';
import { InformeActividadEjecutadaConsolidadoComponent } from './informe-actividad-ejecutada-consolidado/informe-actividad-ejecutada-consolidado.component';
import { DialogsModule} from '../../modules/dialogs/dialogs.module';
import { ProgramaValoresComponent } from './programa-valores/programa-valores.component';
import { InsertarProgramaValoresComponent } from './programa-valores/registro-programa-valores/insertar-programa-valores.component';
import { RendimientoComponent } from './rendimientos/rendimiento.component';
import { InsertarRendimientoComponent } from './rendimientos/registro-rendimientos/insertar-rendimiento.component';
import { EfectividadActividadTomaEstadoComponent } from './efectividad-actividad-toma-estado/efectividad-actividad-toma-estado.component';
import { EfectividadLectorTomaEstadoComponent } from './efectividad-lector-toma-estado/efectividad-lector-toma-estado.component';
import { EfectividadNotificacionesComponent } from './efectividad-notificaciones/efectividad-notificaciones.component';
import { EfectividadInspeccionComercialComponent } from './efectividad-inspeccion-comercial/efectividad-inspeccion-comercial.component';
import { EfectividadActividadAvisoCobranzaComponent } from './efectividad-actividad-aviso-cobranza/efectividad-actividad-aviso-cobranza.component';
import { EfectividadInspeccionInternaComponent } from './efectividad-inspeccion-interna/efectividad-inspeccion-interna.component';
import { EfectividadCierreComponent } from './efectividad-cierre/efectividad-cierre.component';
import { EfectividadReaperturaComponent } from './efectividad-reapertura/efectividad-reapertura.component';
import { CumplimientoCicloLectorComponent } from './cumplimiento-ciclo-lector/cumplimiento-ciclo-lector.component';
import { CumplimientoActividadNotificacionComponent } from './cumplimiento-actividad-notificacion/cumplimiento-actividad-notificacion.component';
import { CumplimientoActividadRecibidoComponent } from './cumplimiento-actividad-recibido/cumplimiento-actividad-recibido.component';
import { CumplimientoActividadInspeccionComponent } from './cumplimiento-actividad-inspeccion/cumplimiento-actividad-inspeccion.component';
import { CumplimientoActividadCierreComponent } from './cumplimiento-actividad-cierre/cumplimiento-actividad-cierre.component';
import { CumplimientoActividadReaperturaComponent } from './cumplimiento-actividad-reapertura/cumplimiento-actividad-reapertura.component';
import { CiclosComponent } from './ciclos/ciclos.component';
import { InsertarCiclosComponent } from './ciclos/registro-ciclos/insertar-ciclos.component';
import { InsertarCiclosDetallesComponent } from './ciclos/registro-ciclos-detalle/insertar-ciclos-detalle.component';
import { InformeEfectividadSostenibilidadComponent } from './efectividad-sostenibilidad/informe-efectividad-sostenibilidad.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PaginacionModule,
    PaginationModule,
    DialogsModule
  ],
  declarations: [
    InformeActividadEjecutadaComponent,
    InformeActividadEjecutadaConsolidadoComponent,
    ProgramaValoresComponent,
    InsertarProgramaValoresComponent,
    RendimientoComponent,
    InsertarRendimientoComponent,
    EfectividadActividadTomaEstadoComponent,
    EfectividadLectorTomaEstadoComponent,
    EfectividadNotificacionesComponent,
    EfectividadInspeccionComercialComponent,
    EfectividadActividadAvisoCobranzaComponent,
    EfectividadInspeccionInternaComponent,
    EfectividadCierreComponent,
    EfectividadReaperturaComponent,
    CumplimientoCicloLectorComponent,
    CumplimientoActividadNotificacionComponent,
    CumplimientoActividadRecibidoComponent,
    CumplimientoActividadInspeccionComponent,
    CumplimientoActividadCierreComponent,
    CumplimientoActividadReaperturaComponent,
    CiclosComponent,
    InsertarCiclosComponent,
    InsertarCiclosDetallesComponent,
    InformeEfectividadSostenibilidadComponent
  ]
})
export class ReportesModule { }
