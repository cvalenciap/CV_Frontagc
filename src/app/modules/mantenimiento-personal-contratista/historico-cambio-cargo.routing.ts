import { Routes, RouterModule } from '@angular/router';
import { HistoricoCargosComponent } from './containers/historico-cargos/historico-cargos.component';

export const HistoricoCargosContratistaRouting: Routes = [
  {
    path: 'consulta',
    component: HistoricoCargosComponent,
    data: {titulo: 'Consulta Histórico de Movimientos de Cargo', tipoHistorico: 'M'}
  }
];
