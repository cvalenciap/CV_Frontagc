import { Routes, RouterModule } from '@angular/router';
import { BandejaPersonalComponent } from './containers/bandeja-personal/bandeja-personal.component';
import { RegistroPersonalComponent } from './containers/registro-personal/registro-personal.component';
import { ModificarPersonalComponent } from './containers/modificar-personal/modificar-personal.component';
import { DetallePersonalComponent } from './containers/detalle-personal/detalle-personal.component';

export const MantenimientoPersonalContratistaRouting: Routes = [
  {
    path: 'bandeja-personal',
    component: BandejaPersonalComponent
  },
  {
    path: 'registrar',
    component: RegistroPersonalComponent
  },
  {
    path: 'modificar',
    component: ModificarPersonalComponent
  },
  {
    path: 'detalle',
    component: DetallePersonalComponent
  }
];
