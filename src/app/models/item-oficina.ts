import { CamposAuditoria } from './interface/campos-auditoria';
import { Oficina } from '.';
import { Estado } from './interface/estado';
import { Item } from './item';

export interface ItemOficina extends CamposAuditoria {
    item?: Item;
    oficina?: Oficina;
    estado?: Estado;
    estadoSeleccion?: string;
    cantPersExtOfic?: number;
}
