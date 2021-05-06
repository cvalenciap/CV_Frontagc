export enum BandejaPersonalEvents {

  // Se dispara al pulsar el checkbox de un personal para su alta
  SELECT_DAR_ALTA = 'onSeleccionarPersonal',
  // Se dispara al pulsar sobre cualquier registro de la bandeja
  SELECT_ROW = 'onRowClick',
  // Limpia el registro seleccionado en bandeja
  CLEAN_SELECT_ROW = 'onLimpiarSeleccion',
  // Se dispara al cerrar modal dar alta
  CLOSE_DAR_ALTA = 'onCerrarModalDarAlta',
  // Se dispara al completarse o finalizarse el alta
  COMPLETE_DAR_ALTA = 'onCompleteDarAlta',
  // Se dispara al cerrar modal cesar personal
  CLOSE_CESAR_PERSONAL = 'onCerrarModalCesarPersonal'

}
