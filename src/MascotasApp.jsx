import { useState, useEffect } from 'react'
import api from './services/api'
import FormularioNuevaMascota from './FormularioNuevaMascota'

function MascotasApp() {
  const [mascotas, setMascotas] = useState([])
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [choices, setChoices] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errores, setErrores] = useState(null)
  const [nuevoAutor, setNuevoAutor] = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [guardandoMascota, setGuardandoMascota] = useState(false)
  const [editandoEstado, setEditandoEstado] = useState(false)
  const [eliminandoMascota, setEliminandoMascota] = useState(false)

  useEffect(() => {
    fetchMascotas()
    fetchChoices()
  }, [])

  async function fetchMascotas() {
    try {
      setErrores(null)
      const res = await api.get('/mascotas/')
      setMascotas(res.data)
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al cargar mascotas' })
    } finally {
      setLoading(false)
    }
  }

  async function fetchChoices() {
    try {
      setErrores(null)
      const res = await api.get('/choices/')
      setChoices(res.data)
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al cargar opciones' })
    }
  }

  async function fetchDetalle(id) {
    try {
      setErrores(null)
      const res = await api.get(`/mascotas/${id}/`)
      setMascotaSeleccionada(res.data)
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al cargar detalle' })
    }
  }

  async function toggleDetalle(mascota) {
    // Si ya está abierta esta misma mascota, la cerramos.
    if (mascotaSeleccionada?.id === mascota.id) {
      setMascotaSeleccionada(null)
      return
    }
    // Si estamos abriendo otra mascota, primero cerramos cualquier
    // detalle previo para que el render no muestre dos.
    if (mascotaSeleccionada && mascotaSeleccionada.id !== mascota.id) {
      setMascotaSeleccionada(null)
    }
    await fetchDetalle(mascota.id)
  }

  async function crearMascota(formData) {
    try {
      setErrores(null)
      setGuardandoMascota(true)
      const res = await api.post('/mascotas/', formData)
      // Refrescamos la lista para que aparezca la nueva mascota.
      await fetchMascotas()
      setMostrarFormulario(false)
      return res.data
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al crear mascota' })
      throw err
    } finally {
      setGuardandoMascota(false)
    }
  }

  async function editarEstado(id, nuevoEstado) {
    try {
      setErrores(null)
      setEditandoEstado(true)
      await api.patch(`/mascotas/${id}/`, { estado: nuevoEstado })
      // Refrescamos la lista y el detalle (si está abierto) para
      // reflejar el nuevo estado.
      await fetchMascotas()
      if (mascotaSeleccionada?.id === id) {
        await fetchDetalle(id)
      }
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al editar estado' })
    } finally {
      setEditandoEstado(false)
    }
  }

  async function eliminarMascota(id) {
    try {
      setErrores(null)
      setEliminandoMascota(true)
      await api.delete(`/mascotas/${id}/`)
      // Si estaba abierta en el detalle, la cerramos.
      if (mascotaSeleccionada?.id === id) {
        setMascotaSeleccionada(null)
      }
      await fetchMascotas()
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al eliminar mascota' })
    } finally {
      setEliminandoMascota(false)
    }
  }

  async function agregarComentario(mascotaId, autor, contenido) {
    if (!autor.trim() || !contenido.trim()) {
      setErrores({ general: 'El nombre y el comentario no pueden estar vacíos' })
      return
    }
    try {
      setErrores(null)
      setEnviandoComentario(true)
      await api.post(`/mascotas/${mascotaId}/comentar/`, { autor, contenido })
      await fetchDetalle(mascotaId)
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al agregar comentario' })
    } finally {
      setEnviandoComentario(false)
    }
  }

  async function eliminarComentario(id, mascotaId) {
    try {
      setErrores(null)
      await api.delete(`/comentarios/${id}/`)
      await fetchDetalle(mascotaId)
    } catch (err) {
      setErrores(err.response?.data ?? { general: 'Error al eliminar comentario' })
    }
  }

  function confirmarEliminarMascota(mascota) {
    if (!mascota) return
    const confirmado = window.confirm(
      `¿Eliminar la mascota "${mascota.nombre}"? Esta acción no se puede deshacer.`
    )
    if (confirmado) {
      eliminarMascota(mascota.id)
    }
  }

  // ---- RENDER ----

  if (loading) {
    return (
      <div className="app">
        <p className="loading">Cargando mascotas...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>MascotasApp</h1>

      {errores && (
        <div className="error-msg">
          {errores.general && <p>{errores.general}</p>}
          {Object.keys(errores).filter(k => k !== 'general').length > 0 && (
            <ul>
              {Object.entries(errores).map(([campo, msgs]) => (
                <li key={campo}>
                  <strong>{campo}:</strong>{' '}
                  {Array.isArray(msgs) ? msgs.join(', ') : msgs}
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-sm" onClick={() => setErrores(null)}>
            Cerrar
          </button>
        </div>
      )}

      <div className="acciones">
        <button
          className="btn btn-primary"
          onClick={() => {
            setErrores(null)
            setMostrarFormulario(true)
          }}
        >
          + Nueva Mascota
        </button>
      </div>

      {/* Lista de mascotas */}
      <div className="lista-mascotas">
        {mascotas.map(m => (
          <div key={m.id} className="tarjeta">
            <img src={m.imagen} alt={m.nombre} />
            <div className="tarjeta-body">
              <h3>{m.nombre}</h3>
              <p>
                {m.tipo_animal} - {m.raza}
              </p>
              <p>
                <span className={`estado estado-${m.estado}`}>{m.estado}</span>
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toggleDetalle(m)}
              >
                {mascotaSeleccionada?.id === m.id ? 'Cerrar detalle' : 'Ver detalle'}
              </button>
            </div>

            {/* Detalle inline, debajo de la tarjeta seleccionada */}
            {mascotaSeleccionada?.id === m.id && (
              <div className="detalle">
                <h2>{mascotaSeleccionada.nombre}</h2>
                <img
                  src={mascotaSeleccionada.imagen}
                  alt={mascotaSeleccionada.nombre}
                />
                <p>
                  <strong>Descripción:</strong> {mascotaSeleccionada.descripcion}
                </p>
                <p>
                  <strong>Tipo:</strong> {mascotaSeleccionada.tipo_animal}
                </p>
                <p>
                  <strong>Raza:</strong> {mascotaSeleccionada.raza}
                </p>
                <p>
                  <strong>Edad:</strong> {mascotaSeleccionada.edad}
                </p>
                <p>
                  <strong>Sexo:</strong> {mascotaSeleccionada.sexo}
                </p>
                <p>
                  <strong>Tamaño:</strong> {mascotaSeleccionada.tamano}
                </p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span
                    className={`estado estado-${mascotaSeleccionada.estado}`}
                  >
                    {mascotaSeleccionada.estado}
                  </span>
                </p>

                {/* Editar estado + Eliminar mascota */}
                <div className="detalle-acciones">
                  {choices?.estado && (
                    <label>
                      Cambiar estado:{' '}
                      <select
                        value={mascotaSeleccionada.estado}
                        disabled={editandoEstado}
                        onChange={e =>
                          editarEstado(mascotaSeleccionada.id, e.target.value)
                        }
                      >
                        {choices.estado.map(op => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={eliminandoMascota}
                    onClick={() => confirmarEliminarMascota(mascotaSeleccionada)}
                  >
                    {eliminandoMascota ? 'Eliminando...' : 'Eliminar mascota'}
                  </button>
                </div>

                <h3>Comentarios</h3>
                {mascotaSeleccionada.comentarios?.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>
                    Sin comentarios aún.
                  </p>
                ) : (
                  mascotaSeleccionada.comentarios?.map(c => (
                    <div key={c.id} className="comentario">
                      <div>
                        <strong>{c.autor}</strong>
                        <p>{c.contenido}</p>
                        <small style={{ color: '#999' }}>
                          {c.fecha_creacion?.slice(0, 10)}
                        </small>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          eliminarComentario(c.id, mascotaSeleccionada.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}

                <div className="comentario-form">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nuevoAutor}
                    onChange={e => setNuevoAutor(e.target.value)}
                  />
                  <textarea
                    placeholder="Escribe un comentario..."
                    value={nuevoContenido}
                    onChange={e => setNuevoContenido(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={enviandoComentario}
                    onClick={() => {
                      agregarComentario(
                        mascotaSeleccionada.id,
                        nuevoAutor,
                        nuevoContenido
                      )
                      setNuevoAutor('')
                      setNuevoContenido('')
                    }}
                  >
                    {enviandoComentario ? 'Enviando...' : 'Comentar'}
                  </button>
                </div>

                <button
                  className="btn btn-warning"
                  onClick={() => setMascotaSeleccionada(null)}
                >
                  Cerrar detalle
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal crear mascota */}
      {mostrarFormulario && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!guardandoMascota) setMostrarFormulario(false)
          }}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Mascota</h2>
            <FormularioNuevaMascota
              choices={choices}
              onGuardar={crearMascota}
              onCerrar={() => setMostrarFormulario(false)}
              guardando={guardandoMascota}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MascotasApp