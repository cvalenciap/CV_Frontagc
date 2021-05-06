import {BandejaComponent} from './bandeja/bandeja.component';
import {DetalleCargaTrabajoComponent} from './detalle-carga-trabajo/detalle-carga-trabajo.component';

export const CargaTrabajoRoutes = [
  // Module routes
   {path: '', component: BandejaComponent},
   {path: 'detalle', component: DetalleCargaTrabajoComponent}
];
