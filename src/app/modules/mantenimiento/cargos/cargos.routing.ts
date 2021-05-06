import { Routes } from '@angular/router';
import { BandejaCargosComponent } from './containers/bandeja-cargos/bandeja-cargos.component';
import { AsignarCargosComponent } from './containers/asignar-cargos/asignar-cargos.component';

export const CargosRouting: Routes = [
  {
    path: '',
    component: BandejaCargosComponent
  },
  {
    path: 'asignar',
    component: AsignarCargosComponent
  }
];
