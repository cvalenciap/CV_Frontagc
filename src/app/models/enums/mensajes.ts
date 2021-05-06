export enum Mensajes {
    CAB_MESSAGE_ERROR                   = 'Error',
    CAB_MESSAGE_AVISO                   = 'Aviso',
    CAB_MESSAGE_OK                      = 'Éxito',
    MESSAGE_ERROR_TRANSACCION           = 'No se realizó la transacción',
    MESSAGE_OK_TRANSACCION              = 'Se realizó correctamente la transacción',
    MESSAGE_VALIDACION_CAMPOS           = 'Exiten campos con información inválida',
    MESSAGE_ANULA_CARGA_TRABAJO         = 'Se anuló la Carga de Trabajo',
    MESSAGE_NO_EXISTE_DETALLE_CARGA     = 'La carga de trabajo no tiene detalle',
    MESSAGE_ACTIVIDAD_NO_DEFINIDA       = 'Actividad de la carga de trabajo no definida',
    MESSAGE_CARGA_ARCHIVO_SOLO_ZIP      = 'Solo se permite cargar archivos con extensión Zip',
    MESSAGE_EMPRESA                     = 'No se han completado los campos obligatorios',
    MESSAGE_PARAMETROS                  = 'No se han completado los campos obligatorios',

  MENSAJE_ERROR_GENERICO = 'Ocurrió al realizar la ultima acción',

    MESSAGE_VALIDACION_ARCHIVO          = 'Validación de archivos',
    MESSAGE_TIPO_ARCHIVO                = 'Solo se acepta archivos con extensión de .pdf o .jpg',
    MESSAGE_VALIDACION_ARCHIVO_CARGA    = 'Existen archivos que no están asociados a la Carga de Trabajo',

    MESSAGE_NO_EXISTE_INFORMACION_PARA_DESCARGA = 'No existe información a descargar',
  MENSAJE_ERROR_OBTENER_PARAMETROS = 'Ocurrio un error al obtener parametros del usuario',
  MENSAJE_ERROR_USUARIOS_CARGA = 'Ocurrió un error al obtener los usuarios de carga',
  MENSAJE_ERROR_GRUPOS_FUNCIONALES = 'Ocurrió un error al obtener los grupos funcionales asociados a la oficina seleccionada',

  /* Mensajes para la funcionalidad Mantenimiento Grupos */
  MENSAJE_OK_CREAR_GRUPO = 'Se ha registrado el grupo correctamente',
  MENSAJE_OK_MODIFICAR_GRUPO = 'Se ha actualizado el grupo correctamente',
  MENSAJE_OK_ELIMINAR_GRUPO = 'Se ha eliminado el grupo correctamente',
  MENSAJE_VALIDACION_GRUPO = 'Debe ingresar la descripción del grupo',


  /* Mensajes para la funcionalidad Personal Contratista */
  MENSAJE_OK_REGISTRO_PERSONAL = 'Se ha registrado los datos del nuevo personal correctamente',
  MENSAJE_OK_ACTUALIZACION_PERSONAL = 'Se ha actualizado los datos del personal correctamente',

  // ITEMS MESSAGES
  MENSAJE_OK_CREAR_ITEM = 'Se ha registrado el item correctamente',
  MENSAJE_OK_MODIFICAR_ITEM = 'Se ha actualizado el item correctamente',
  MENSAJE_OK_ELIMINAR_ITEM = 'Se ha eliminado el item correctamente',
  MENSAJE_VALIDACION_ITEM = 'Debe ingresar la descripción del item',

  MENSAJE_PERSONAL_PENDIENTE_NO_SELEC = 'Debe seleccionar registro(s) para el Alta',
  PERSONAL_CESE_NO_SELEC = 'Debe seleccionar el registro para el Cese',
  PERSONAL_SELECCIONADO_CESADO = 'El personal seleccionado ya se encuentra cesado',
  PERSONAL_SELECCIONADO_PEND_ALTA = 'El personal seleccionado debe estar en estado \"ALTA\"',

  SELECCIONAR_REGISTRO = 'Debe seleccionar un registro',
  NO_ESTADO_PA = 'Debe seleccionar un registro en estado \"Pendiente de Aprobación\"',
  MENSAJE_ERROR_PARAMS_BANDEJA_PERSONAL = 'Ocurrio un error al obtener los parametros de bandeja de personal',

  MENSAJE_NO_PERSONAL_PENDIENTE = 'No se encontro personal pendiente de alta',

  MENSAJE_CESE_MASIVO_EJECUTADO = 'Ya ha sido dado de baja todo el personal por el término de contrato',

  MENSAJE_DAR_ALTA = 'Se ha dado de alta al personal que no tendrá acceso al AGC; al personal que accederá al AGC tiene que terminar el alta en la opción Mantenimiento/Grupo Personal',

  // Filtro vacio
  MSG_FILTRO_VACIO = 'No ha ingresado ningún valor',

  MSG_FILTROS_NO_SELECCIONADOS = 'Debe seleccionar por lo menos un filtro',
  MSG_FECHA_DESDE_OBLIGATORIA = 'Debe ingresar la fecha de inicio para la consulta',
  MSG_FECHA_HASTA_OBLIGATORIA = 'Debe ingresar la fecha de fin para la consulta',
  MSG_ERROR_EXPORTAR_DATA = 'Ocurrio un error al exportar la información',

  // Mant cargos
  MSG_LISTA_AGREGAR_VACIA = 'Debe seleccionar al menos una actividad disponible',
  MSG_LISTA_QUITAR_VACIA = 'Debe seleccionar al menos una actividad asignada'

}
