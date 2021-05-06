import { ComboDto } from "src/app/models/combo-dto";
import { Estado } from "src/app/models/interface/estado";

export const cargos: Array<any> = [
  {
    codigo: 'PN411',
    descripcion: 'Supervisor'
  },
  {
    codigo: 'PN412',
    descripcion: 'Controlador de Campo'
  },
  {
    codigo: 'PN413',
    descripcion: 'Operario Comercial'
  },
  {
    codigo: 'PN421',
    descripcion: 'Operario Comercial Especializado'
  },
  {
    codigo: 'PN422',
    descripcion: 'Operario'
  },
  {
    codigo: 'PN423',
    descripcion: 'Operario Especializado'
  },
  {
    codigo: 'PN431',
    descripcion: 'Gestor de Servicio o Counter'
  },
  {
    codigo: 'PN423',
    descripcion: 'Coordinador de Base'
  },
  {
    codigo: 'PN423',
    descripcion: 'Analista de sistemas '
  },
  {
    codigo: 'PN423',
    descripcion: 'Ingeniero de Seguridad'
  },
  {
    codigo: 'PN423',
    descripcion: 'Soporte Administrativo '
  }
];

export const oficinas: Array<any> = [
  {
    codigo: '2211',
    descripcion: 'Oficina Comas'
  },
  {
    codigo: '2111',
    descripcion: 'Oficina Callao'
  },
  {
    codigo: '3211',
    descripcion: 'Oficina Ate Vitarte'
  },
  {
    codigo: '3111',
    descripcion: 'Oficina Breña'
  },
  {
    codigo: '3311',
    descripcion: 'Oficina San Juan de  Lurigancho'
  },
  {
    codigo: '4111',
    descripcion: 'Oficina Surquillo'
  },
  {
    codigo: '4211',
    descripcion: 'Oficina Villa El Salvador'
  },
  {
    codigo: '1001',
    descripcion: 'Oficina Servicios y Clientes Especiales'
  }
];

export const estadosLaboral: Array<any> = [
  {
    codigo: 'AC',
    descripcion: 'ACTIVO'
  },
  {
    codigo: 'CE',
    descripcion: 'CESADO'
  }
];

export const estadosSedapal: Array<any> = [
  {
    codigo: 'PA',
    descripcion: 'PENDIENTE ALTA'
  },
  {
    codigo: 'BA',
    descripcion: 'BAJA'
  },
  {
    codigo: 'AL',
    descripcion: 'ALTA'
  }
];

export const motivosCese: Array<any> = [
  {
    codigo: '001',
    descripcion: 'Termino de Contrato'
  },
  {
    codigo: '002',
    descripcion: 'Renuncia'
  },
  {
    codigo: '003',
    descripcion: 'Falta Grave'
  },
  {
    codigo: '004',
    descripcion: 'Abandono de Trabajo'
  },
  {
    codigo: '005',
    descripcion: 'Código No especificado'
  }
];

export const solicitud: Estado[] = [
  {
    id: '0',
    descripcion: 'Sin solicitud'
  },
  {
    id: '1',
    descripcion: 'Cambio de Cargo'
  },
  {
    id: '2',
    descripcion: 'Movimiento'
  }
];

export const estadosSolicitud: Array<any> = [
  {
    codigo: '001',
    descripcion: 'Pendiente de Aprobación'
  },
  {
    codigo: '002',
    descripcion: 'Aprobado'
  },
  {
    codigo: '003',
    descripcion: 'Rechazado'
  }
];
