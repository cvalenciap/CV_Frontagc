import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { PaginacionModule } from 'src/app/components/common/paginacion/paginacion.module';
import { PaginationModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { SpinKitModule } from 'src/app/components/common/spinkit/spinkit.module';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ItemsComponent } from './container/items/items.component';
import { ListaItemComponent } from './components/lista-item/lista-item.component';
import { BusquedaBasicaItemComponent } from './components/busqueda-basica/busqueda-basica-item.component';
import { InfoBusquedaItemComponent } from './components/info-busqueda-item/info-busqueda-item.component';
import { BusquedaAvanzadaItemComponent } from './components/busqueda-avanzada/busqueda-avanzada-item.component';
import { AgregarEditarItemComponent } from './container/agregar-editar-item/agregar-editar-item.component';
import { AsignarOficinasItemComponent } from './container/asignar-oficinas-item/asignar-oficinas-item.component';
import { ItemApiService } from 'src/app/services/impl/item-api.service';
import { BusquedaItemSesionService } from './services/busqueda-item-sesion.service';

@NgModule({
  declarations: [
    AgregarEditarItemComponent,
    BusquedaBasicaItemComponent,
    BusquedaAvanzadaItemComponent,
    ItemsComponent,
    ListaItemComponent,
    InfoBusquedaItemComponent,
    AsignarOficinasItemComponent
  ],
  imports: [
    PaginacionModule,
    PaginationModule,
    FileUploadModule,
    SpinKitModule,
    DialogsModule,
    NgSelectModule,
    UploaderModule,
    SharedModule,
    UiSwitchModule
  ],
  entryComponents: [],
  providers: [ItemApiService, BusquedaItemSesionService]
})
export class ItemsModule { }
