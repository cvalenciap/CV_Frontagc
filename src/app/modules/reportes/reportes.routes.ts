import {InformeActividadEjecutadaComponent} from './informe-actividad-ejecutada/informe-actividad-ejecutada.component';
import {InformeActividadEjecutadaConsolidadoComponent} from './informe-actividad-ejecutada-consolidado/informe-actividad-ejecutada-consolidado.component';
import { ProgramaValoresComponent } from './programa-valores/programa-valores.component';
import { RendimientoComponent } from './rendimientos/rendimiento.component';
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
import { InformeEfectividadSostenibilidadComponent } from './efectividad-sostenibilidad/informe-efectividad-sostenibilidad.component';

export const ReportesRoutes = [
  {path: 'informe-actividad-ejecutada', component: InformeActividadEjecutadaComponent},
  {path: 'informe-actividad-ejecutada-consolidado', component: InformeActividadEjecutadaConsolidadoComponent},
  {path: 'programa-mensual', component: ProgramaValoresComponent},
  {path: 'rendimiento', component: RendimientoComponent},
  {path: 'informe-actividad-toma-estado', component: EfectividadActividadTomaEstadoComponent},
  {path: 'informe-lector-toma-estado', component: EfectividadLectorTomaEstadoComponent},
  {path: 'informe-efectividad-notificaciones', component: EfectividadNotificacionesComponent},
  {path: 'informe-efectividad-inspeccion-comercial', component: EfectividadInspeccionComercialComponent},
  {path: 'informe-efectividad-aviso-cobranza', component: EfectividadActividadAvisoCobranzaComponent},
  {path: 'informe-efectividad-inspeccion-interna', component: EfectividadInspeccionInternaComponent},
  {path: 'informe-efectividad-cierre', component: EfectividadCierreComponent},
  {path: 'informe-efectividad-reapertura', component: EfectividadReaperturaComponent},
  {path: 'informe-cumplimiento-ciclo-lector', component: CumplimientoCicloLectorComponent},
  {path: 'informe-cumplimiento-notificacion', component: CumplimientoActividadNotificacionComponent},
  {path: 'informe-cumplimiento-recibido', component: CumplimientoActividadRecibidoComponent},
  {path: 'informe-cumplimiento-inspeccion-comercial', component: CumplimientoActividadInspeccionComponent},
  {path: 'informe-cumplimiento-cierre', component: CumplimientoActividadCierreComponent},
  {path: 'informe-cumplimiento-reapertura', component: CumplimientoActividadReaperturaComponent},
  {path: 'ciclos', component: CiclosComponent},
  {path: 'informe-efectividad-sostenibilidad', component: InformeEfectividadSostenibilidadComponent}
];