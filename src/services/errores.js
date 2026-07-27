const MENSAJES_POR_ESTADO = {
  400: 'Debes completar todos los campos.',
  404: 'La mascota no fue encontrada.',
  500: 'No fue posible cargar la información.',
}

export function obtenerMensajeError(err, mensajePorDefecto) {
  const status = err?.response?.status
  const data = err?.response?.data

  if (status === 400 && data && typeof data === 'object') {
    const errores = {}
    Object.entries(data).forEach(([campo, mensajes]) => {
      errores[campo] = Array.isArray(mensajes) ? mensajes.join(', ') : String(mensajes)
    })
    return errores
  }

  if (status && MENSAJES_POR_ESTADO[status]) {
    return { general: MENSAJES_POR_ESTADO[status] }
  }

  if (err?.message && !err?.response) {
    return { general: 'No fue posible conectar con el servidor.' }
  }

  return { general: mensajePorDefecto || 'Ocurrió un error inesperado.' }
}
