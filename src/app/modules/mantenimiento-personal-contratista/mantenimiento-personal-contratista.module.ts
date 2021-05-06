import { NgModule } from '@angular/core';

import { BandejaPersonalComponent } from './containers/bandeja-personal/bandeja-personal.component';
import { RegistroPersonalComponent } from './containers/registro-personal/registro-personal.component';
import { FormularioDatosBasicosComponent } from './components/formulario-datos-basicos/formulario-datos-basicos.component';
import { FormularioDatosPlanillaComponent } from './components/formulario-datos-planilla/formulario-datos-planilla.component';
import { FormularioDatosSedapalComponent } from './components/formulario-datos-sedapal/formulario-datos-sedapal.component';
import { FormularioCambioCargoComponent } from './components/formulario-cambio-cargo/formulario-cambio-cargo.component';
import { FormularioMovimientoPersonalComponent } from './components/formulario-movimiento-personal/formulario-movimiento-personal.component';
import { SharedModule } from '../shared/shared.module';
import { TablaPersonalContratistaComponent } from './components/tabla-personal-contratista/tabla-personal-contratista.component';
import { BusquedaAvanzadaPersonalContratistaComponent } from './modals/busqueda-avanzada-personal-contratista/busqueda-avanzada-personal-contratista.component';
import { DarAltaContratistaComponent } from './modals/dar-alta-contratista/dar-alta-contratista.component';
import { MaterialModule } from '../shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { CesarPersonalComponent } from './modals/cesar-personal/cesar-personal.component';
import { SolicitudCambioCargoComponent } from './modals/solicitud-cambio-cargo/solicitud-cambio-cargo.component';
import { ConsultaSolicitudCambioCargoComponent } from './modals/consulta-solicitud-cambio-cargo/consulta-solicitud-cambio-cargo.component';
import { ModificarPersonalComponent } from './containers/modificar-personal/modificar-personal.component';
import { DetalleSolicitudMovimientoPersonalComponent } from './modals/detalle-solicitud-movimiento-personal/detalle-solicitud-movimiento-personal.component';
import { SolicitudMovimientoPersonalComponent } from './modals/solicitud-movimiento-personal/solicitud-movimiento-personal.component';
import { CargaMasivaPersonalComponent } from './modals/carga-masiva-personal/carga-masiva-personal.component';
import { HistoricoPersonalComponent } from './containers/historico-personal/historico-personal.component';
import { HistoricoCargosComponent } from './containers/historico-cargos/historico-cargos.component';
import { BusquedaAvanzadaHistoricoComponent } from './modals/busqueda-avanzada-historico/busqueda-avanzada-historico.component';
import { TablaHistoricoPersonalComponent } from './components/tabla-historico-personal/tabla-historico-personal.component';
import { TablaHistoricoCargosComponent } from './components/tabla-historico-cargos/tabla-historico-cargos.component';
import { VerDetallePersonalComponent } from './components/ver-detalle-personal/ver-detalle-personal.component';
import { DetallePersonalComponent } from './containers/detalle-personal/detalle-personal.component';
import { ResultadoAltaComponent } from './components/resultado-alta/resultado-alta.component';

@NgModule({
  imports: [
    BsDatepickerModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    NgSelectModule
  ],
  declarations: [
    BandejaPersonalComponent,
    RegistroPersonalComponent,
    FormularioDatosBasicosComponent,
    FormularioDatosPlanillaComponent,
    FormularioDatosSedapalComponent,
    FormularioCambioCargoComponent,
    FormularioMovimientoPersonalComponent,
    TablaPersonalContratistaComponent,
    BusquedaAvanzadaPersonalContratistaComponent,
    DarAltaContratistaComponent,
    CesarPersonalComponent,
    SolicitudCambioCargoComponent,
    ConsultaSolicitudCambioCargoComponent,
    ModificarPersonalComponent,
    DetalleSolicitudMovimientoPersonalComponent,
    SolicitudMovimientoPersonalComponent,
    CargaMasivaPersonalComponent,
    HistoricoPersonalComponent,
    HistoricoCargosComponent,
    BusquedaAvanzadaHistoricoComponent,
    TablaHistoricoPersonalComponent,
    TablaHistoricoCargosComponent,
    VerDetallePersonalComponent,
    DetallePersonalComponent,
    ResultadoAltaComponent
  ]
})
export class MantenimientoPersonalContratistaModule { }
