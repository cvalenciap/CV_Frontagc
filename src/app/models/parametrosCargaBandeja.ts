import {Empresa,Oficina,Parametro,Actividad, Contratista, Zona} from './';

export class ParametrosCargaBandeja {
  [x: string]: any;
    listaEmpresa: Empresa[];
	listaOficina: Oficina[];
	listaEstado: Parametro[];
	listaEstadoDetalle: Parametro[];
	listaActividad: Actividad[];
	listaTipoZona: Zona[];
	listaPeriodo: Parametro[];
	listaCiclo: Parametro[];
	listaExisteFoto: Parametro[];
	listaTipoActividad: Parametro[];
	listaImposibilidad: Parametro[];
	listaIncidencia: Parametro[];
	listaEstadoServicio: Parametro[];
	listaEstadoMedidor: Parametro[];
	listaTipoInspeccion: Parametro[];
	listaResultadoInspeccion: Parametro[];
	listaTipoNotificacion: Parametro[];
	listaTipoEntrega: Parametro[];
	listaTipoOrdServicio: Parametro[];
	listaCodObservacion: Parametro[];
	listaTipoCarga: Parametro[];
	listaTipoInstalacion: Parametro[];
	listaTipoOrdServicioSGIO: Parametro[];
	listaTipoOrdTrabajoSGIO: Parametro[];
  listaAlertaFrecuencia: Parametro[];
	oficinas: Oficina[];
	codGrupo: number;
	descGrupo: string;
	codEmpresa: number;
	nomEmpresa: string;
  constructor() {
		this.listaEmpresa = new Array<Empresa>();
		this.listaActividad = new Array<Actividad>();
	    	this.listaOficina = new Array<Oficina>();
	}
}
