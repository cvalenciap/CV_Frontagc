import {EmpresaConsultarComponent} from './empresa-consultar/empresa-consultar.component';
import {EmpresaAgregarEditarComponent} from './empresa-agregar-editar/empresa-agregar-editar.component';
import {EmpresaAsignarItemsComponent} from './empresa-asignar-items/empresa-asignar-items.component';

export const EmpresasRoutes = [
  {path: '', component: EmpresaConsultarComponent},
  {path: 'registrar', component: EmpresaAgregarEditarComponent},
  {path: 'editar/:codigo', component: EmpresaAgregarEditarComponent},
  {path: 'asignar', component: EmpresaAsignarItemsComponent}
];
