
import { ItemsComponent } from './container/items/items.component';
import { AgregarEditarItemComponent } from './container/agregar-editar-item/agregar-editar-item.component';
import { AsignarOficinasItemComponent } from './container/asignar-oficinas-item/asignar-oficinas-item.component';

export const ItemsRoutingModule = [
  { path: '', component: ItemsComponent },
  { path: 'editar', component: AgregarEditarItemComponent },
  { path: 'asignar-oficina', component: AsignarOficinasItemComponent}
];
