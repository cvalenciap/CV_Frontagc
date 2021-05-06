export interface MantenimientoPersonalConfig {
    /* Datos Basicos */
    inputDNI?: boolean;
    botonCargarFoto?: boolean;
    inputNombres?: boolean;
    inputApellidoPaterno?: boolean;
    inputApellidoMaterno?: boolean;
    inputDireccion?: boolean;
    comboTipoCargo?: boolean;
    inputFechaNacimiento?: boolean;
    comboCargo?: boolean;
    comboItem?: boolean;
    comboOficina?: boolean;
    inputCorreo?: boolean;
    inputTelfonoPersonal?: boolean;
    inputCelularAsignado?: boolean;
    inputCodigoContratista?: boolean;
    botonCargarCV?: boolean;
    botonDescargarCV?: boolean;
    /* Datos de Planilla */
    inputEstadoLaboral?: boolean;
    inputFechaIngreso?: boolean;
    inputMotivoCese?: boolean;
    inputFechaCese?: boolean;
    inputObservacionCese?: boolean;
    /* Datos de Sedapal */
    inputCodigoSedapal?: boolean;
    inputEstadoCodigo?: boolean;
    inputFechaAlta?: boolean;
    inputFechaBaja?: boolean;
    comboEstadoLaboral?: boolean;
    comboEstadoCodigo?: boolean;
    /* Cambio de Cargo */
    inputCodigoSedapalCC?: boolean;
    inputCargoActualCC?: boolean;
    botonAgregarSolicitud?: boolean;
    botonAprobarCargo?: boolean;
    botonRechazarCargo?: boolean;
    /* Movimientos */
    inputCodigoSedapalMov?: boolean;
    inputCargoActual?: boolean;
    inputOficinaActual?: boolean;
    inputItemActual?: boolean;
    btnAprobarMovimiento?: boolean;
    btnRechazarMovimiento?: boolean;
    btnSolicitarMovimiento?: boolean;
}
