import { Routes } from '@angular/router';
import { HistoricoPersonalComponent } from './containers/historico-personal/historico-personal.component';
import { VerDetallePersonalComponent } from './components/ver-detalle-personal/ver-detalle-personal.component';

export const HistoricoPersonalContratistaRouting: Routes = [
  {
    path: 'consulta',
    component: HistoricoPersonalComponent,
    data: {titulo: 'Consulta Histórico de Personal', tipoHistorico: 'P'}
  }
];
