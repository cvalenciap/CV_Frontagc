import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaCargosComponent } from './containers/bandeja-cargos/bandeja-cargos.component';
import { AsignarCargosComponent } from './containers/asignar-cargos/asignar-cargos.component';
import { BusquedaAvanzadaCargosComponent } from './components/busqueda-avanzada-cargos/busqueda-avanzada-cargos.component';
import { FiltroBasicoCargosComponent } from './components/filtro-basico-cargos/filtro-basico-cargos.component';
import { TablaMantenimientoCargosComponent } from './components/tabla-mantenimiento-cargos/tabla-mantenimiento-cargos.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    BandejaCargosComponent,
    AsignarCargosComponent,
    BusquedaAvanzadaCargosComponent,
    FiltroBasicoCargosComponent,
    TablaMantenimientoCargosComponent
  ]
})
export class CargosModule { }
