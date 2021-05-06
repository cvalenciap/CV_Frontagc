import {Routes} from '@angular/router';
import {StarterViewComponent} from './views/appviews/starterview.component';
import {LoginComponent} from './views/appviews/login.component';
import {BlankLayoutComponent} from './components/common/layouts/blankLayout.component';
import {BasicLayoutComponent} from './components/common/layouts/basicLayout.component';
import {EmpresasRoutes} from './modules/empresas/empresas.routes';
import {TiposParametrosRoutes} from './modules/tipos-parametros/tipos-parametros.routes';
import { ContrasenaComponent } from './views/appviews/contrasena.component';
import { CargaTrabajoRoutes } from './modules/carga-trabajo/carga-trabajo.routes';
import { MultiperfilComponent } from './views/appviews/multiperfil.component';
import { AuthGuard } from './auth/auth.guard';
import { CambiarContrasenaComponent } from './views/appviews/cambiar.component';
import { CargarArchivosComponent } from './components/cargar-archivos/cargar-archivos.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { RegistroResponsablesRoutes } from './modules/registro-responsables/registro-responsables.routes';
import { MantenimientoPersonalContratistaRouting } from './modules/mantenimiento-personal-contratista/mantenimiento-personal-contratista.routing';
import { HistoricoPersonalContratistaRouting } from './modules/mantenimiento-personal-contratista/historico-personal-contratista.routing';
import { HistoricoCargosContratistaRouting } from './modules/mantenimiento-personal-contratista/historico-cambio-cargo.routing';
import { ItemsRoutingModule } from './modules/mantenimiento/items/items-routing.module';
import { CargosRouting } from './modules/mantenimiento/cargos/cargos.routing';
import { AsignacionResponsablesRoutes } from './modules/asignacion-personal/asignacion-responsables.routes';
import { DigitalizadosRoutes } from 'src/app/modules/digitalizados/digitalizados.routes';
import { MonitoreoRoutes } from 'src/app/modules/monitoreo/monitoreo.routes';
import { ReportesRoutes } from './modules/reportes/reportes.routes';
import { AlertasRoutes } from './modules/alertas/alertas.routes';

export const ROUTES: Routes = [
  // Main redirect
  {path: '', redirectTo:  'login', pathMatch: 'full'},

  // App views
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'inicio', component: StarterViewComponent}
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'contrasena', component: ContrasenaComponent },
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'cambiar-contrasena/:usuario', component: CambiarContrasenaComponent },
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'multiperfil/:usuario', component: MultiperfilComponent },
    ]
  },
  {
    path: 'mantenimiento', component: BasicLayoutComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'empresas', component: BlankLayoutComponent,
        children: EmpresasRoutes
      },
{
        path: 'personal', component: BlankLayoutComponent,
        children: AsignacionResponsablesRoutes
      },
      {
        path: 'responsables', component: BlankLayoutComponent, children: RegistroResponsablesRoutes
      },
      {
        path: 'tipos-parametros', component: BlankLayoutComponent,
        children: TiposParametrosRoutes
      },
      {
        path: 'item', component: BlankLayoutComponent,
        children: ItemsRoutingModule
      },
      {
        path: 'cargos-open', component: BlankLayoutComponent,
        children: CargosRouting
      }
    ]
  },
  {
    path: 'carga-trabajo', component: BasicLayoutComponent,
    children: CargaTrabajoRoutes, canActivate: [AuthGuard]
  },
  {
    path: 'mantenimiento-personal-contratista', component: BasicLayoutComponent,
    children: MantenimientoPersonalContratistaRouting
  },
  {
    path: 'consulta-historico-personal', component: BasicLayoutComponent,
    children: HistoricoPersonalContratistaRouting
  },
  {
    path: 'consulta-historico-movi', component: BasicLayoutComponent,
    children: HistoricoCargosContratistaRouting
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'carga-masiva', component: CargarArchivosComponent}
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'upload', component: UploadFilesComponent}
    ]
  },
  {
    path: 'digitalizados', component: BasicLayoutComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: BlankLayoutComponent, children: DigitalizadosRoutes}
    ]
  },
  {
    path: 'monitoreo', component: BasicLayoutComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: BlankLayoutComponent, children: MonitoreoRoutes}
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: ReportesRoutes
  },
  {
    path: '', component: BasicLayoutComponent,
    children: AlertasRoutes
  },

  // Handle all other routes
  {path: '**',  redirectTo: 'login'}
];
