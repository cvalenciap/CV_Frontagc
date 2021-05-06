import {BandejaAsignacionTrabajoComponent} from './bandeja-asignacion-trabajo/bandeja-asignacion-trabajo.component';
import { BandejaMonitoreoComponent } from './bandeja-monitoreo/bandeja-monitoreo.component';
import { BandejaInspecComercialesComponent } from './bandeja-inspecciones-comerciales/bandeja-inspecciones-comerciales.component';
import { BandejaDistComunicacionesComponent } from './bandeja-distribucion-comunicaciones/bandeja-distribucion-comunicaciones.component';
import { BandejaDistAvisosComponent } from './bandeja-distribucion-avisos/bandeja-distribucion-avisos.component';
import { BandejaMedidoresComponent } from './bandeja-medidores/bandeja-medidores.component';
import { BandejaCierresReaperturasComponent } from './bandeja-cierres-reaperturas/bandeja-cierres-reaperturas.component';
import { BandejaSostenibilidadComponent } from './bandeja-sostenibilidad/bandeja-sostenibilidad.component';

export const MonitoreoRoutes = [
  {path: 'bandeja-asignacion-trabajo', component: BandejaAsignacionTrabajoComponent},
  {path: 'bandeja-monitoreo', component: BandejaMonitoreoComponent},
  {path: 'bandeja-inspecciones-comerciales', component: BandejaInspecComercialesComponent},
  {path: 'bandeja-distribucion-comunicaciones', component: BandejaDistComunicacionesComponent},
  {path: 'bandeja-distribucion-avisos', component: BandejaDistAvisosComponent},
  {path: 'bandeja-medidores', component: BandejaMedidoresComponent},
  {path: 'bandeja-cierres-reaperturas', component: BandejaCierresReaperturasComponent},
  {path: 'bandeja-sostenibilidad', component: BandejaSostenibilidadComponent}
];
