import {TiposParametrosListaComponent} from './views/lista.component';
import {TiposParametrosEditarComponent} from './views/editar.component';
import {ParametrosListaComponent} from './component/lista.component';
import {ParametrosEditarComponent} from './component/editar.component';
export const TiposParametrosRoutes = [
  // Module routes
  {path: '', component: TiposParametrosListaComponent},
  {path: ':codigo', component: TiposParametrosEditarComponent},
  {path: 'nuevo', component: TiposParametrosEditarComponent},
  {path: 'editar/:codigo',component: ParametrosListaComponent},
  {path: 'editar/:codigo/nuevo',component: ParametrosEditarComponent},
  {path: 'editar/:codigo/:codigoParam',component: ParametrosEditarComponent}
];
