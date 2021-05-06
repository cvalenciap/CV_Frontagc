import { TipoOpcion } from '../enums/tipo-opcion.enum';
import { CustomFiltroBasicoDataArray } from './custom-filtro-basico-data-array';

export interface CustomFiltroBasicoData {
  tipoOpcion: TipoOpcion;
  descripcion: string;
  placeholder: string;
  codigo?: any;
  data?: Array<CustomFiltroBasicoDataArray>;
}
