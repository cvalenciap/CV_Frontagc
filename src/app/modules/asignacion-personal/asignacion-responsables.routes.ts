import {BusquedaGruposOficinaComponent} from './busqueda-grupos-oficina/busqueda-grupos-oficina.component';
import {AsignarPersonalComponent} from './asignar-personal/asignar-personal.component';

export const AsignacionResponsablesRoutes = [
  {
    path: '', component: BusquedaGruposOficinaComponent,
  },
  {
    path: 'asignar', component: AsignarPersonalComponent
  }
];
