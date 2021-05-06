export enum Parametro {
  /* Estados de la Carga de Trabajo */
  POR_ENVIAR = 'PE',
  ENVIADO_POR_SEDAPAL = 'ES',
  OBSERVADO_POR_SEDAPAL = 'OS',
  ANULADO = 'AN',
  CERRADO = 'CE',
  ACEPTADO_POR_CONTRATISTA = 'AC',
  ENVIADO_POR_CONTRATISTA = 'EC',
  ENVIO_PARCIAL_CONTRATISTA = 'EPC',
  OBSERVADO_POR_CONTRATISTA = 'OC',
  /* Actividades */
  ACT_SGIO = 'SG',
  ACT_DISTRIB_AVISO_COBRANZA = 'DA',
  ACT_DISTRBUCION_COMUNICACIONES = 'DC',
  ACT_INSPECCIONES_COMERCIALES = 'IC',
  ACT_MEDIDORES = 'ME',
  ACT_TOMA_ESTADO = 'TE',
  /* Perfil Asignado */
  PERFIL_ADMINISTRADOR = '1',
  PERFIL_ANALISTA_INTERNO = '2',
  PERFIL_RESPONSABLE = '3',
  PERFIL_ANALISTA_EXTERNO = '4',
  PERFIL_SUPERVISOR_EXTERNO = '5',
  PERFIL_ADMINISTRADOR_OFICINA = '6',
  PERFIL_AQUAFONO = '7',
  PERFIL_CONS_GEN = '8',
  PERFIL_CONS_PERS = '9',
  /* Empresa Sedapal */
  CODIGO_SEDAPAL = 1,
  /* TipoParametro BusquedaPor */
  COD_USUARIO = 'U',
  /* GRUPOS */
  COD_GRUPO_GENERICO = 1,
  DESC_GRUPO_GENERICO = 'GRUPO GENERICO',
  /* Estados Registro */
  ACTIVO = 'A',
  INACTIVO = 'I',
  /* Parametros de exportacion a excel */
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  EXCEL_EXTENSION = '.xlsx',


  /* Valor de tamaño de archivos para Fotos y CV en Personal Contratista */
  PDF_EXTENSION = '.PDF',
  JPG_EXTENSION = '.JPG',
  TIPO_PARAM_TAMANO_ARCHIVO_PP = 23,
  PARAM_TAMANO_JPG_PP = 1,
  PARAM_TAMANO_PDF_PP = 2,

  /* Motivo Solicitud de Movimiento */
  TIPO_PARAM_MOV_PERS = 22,

  /* Oficina Grandes Clientes */
  OFI_GRANDES_CLIENTES = 5111

}
