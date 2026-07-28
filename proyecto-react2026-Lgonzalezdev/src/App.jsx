import { useState, useEffect } from 'react'
import api from './services/api'

function App() {
  const [mascotas, setMascotas] = useState([])
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [choices, setChoices] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errores, setErrores] = useState(null)
  const [nuevoAutor, setNuevoAutor] = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)

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

  // TAREA: implementar crearMascota()
  async function crearMascota(formData) {
    // usar: await api.post('/mascotas/', formData)
  }

  // TAREA: implementar editarEstado()
  async function editarEstado(id, nuevoEstado) {
    // usar: await api.patch(`/mascotas/${id}/`, { estado: nuevoEstado })
  }

  // TAREA: implementar eliminarMascota()
  async function eliminarMascota(id) {
    // usar: await api.delete(`/mascotas/${id}/`)
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

  function cerrarDetalle() {
    setMascotaSeleccionada(null)
  }

  // ---- RENDER ----

  if (loading) return <div className="app"><p className="loading">Cargando mascotas...</p></div>

  return (
    <div className="app">
      <h1>MascotasApp</h1>

      {errores && (
        <div className="error-msg">
          {errores.general && <p>{errores.general}</p>}
          {Object.keys(errores).filter(k => k !== 'general').length > 0 && (
            <ul>
              {Object.entries(errores).map(([campo, msgs]) => (
                <li key={campo}><strong>{campo}:</strong> {Array.isArray(msgs) ? msgs.join(', ') : msgs}</li>
              ))}
            </ul>
          )}
          <button className="btn btn-sm" onClick={() => setErrores(null)}>Cerrar</button>
        </div>
      )}

      <div className="acciones">
        <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
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
              <p>{m.tipo_animal} - {m.raza}</p>
              <p><span className={`estado estado-${m.estado}`}>{m.estado}</span></p>
              <button className="btn btn-primary btn-sm" onClick={() => fetchDetalle(m.id)}>
                Ver detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detalle de mascota seleccionada */}
      {mascotaSeleccionada && (
        <div className="detalle">
          <h2>{mascotaSeleccionada.nombre}</h2>
          <img src={mascotaSeleccionada.imagen} alt={mascotaSeleccionada.nombre} />
          <p><strong>Descripción:</strong> {mascotaSeleccionada.descripcion}</p>
          <p><strong>Tipo:</strong> {mascotaSeleccionada.tipo_animal}</p>
          <p><strong>Raza:</strong> {mascotaSeleccionada.raza}</p>
          <p><strong>Edad:</strong> {mascotaSeleccionada.edad}</p>
          <p><strong>Sexo:</strong> {mascotaSeleccionada.sexo}</p>
          <p><strong>Tamaño:</strong> {mascotaSeleccionada.tamano}</p>
          <p><strong>Estado:</strong> <span className={`estado estado-${mascotaSeleccionada.estado}`}>{mascotaSeleccionada.estado}</span></p>

          {/* TAREA: agregar botón para editar estado y eliminar mascota */}

          <h3>Comentarios</h3>
          {mascotaSeleccionada.comentarios?.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>Sin comentarios aún.</p>
          ) : (
            mascotaSeleccionada.comentarios?.map(c => (
              <div key={c.id} className="comentario">
                <div>
                  <strong>{c.autor}</strong>
                  <p>{c.contenido}</p>
                  <small style={{ color: '#999' }}>{c.fecha_creacion?.slice(0, 10)}</small>
                </div>
                <button className="btn btn-danger btn-sm"
                  onClick={() => eliminarComentario(c.id, mascotaSeleccionada.id)}>
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
                agregarComentario(mascotaSeleccionada.id, nuevoAutor, nuevoContenido)
                setNuevoAutor('')
                setNuevoContenido('')
              }}
            >
              {enviandoComentario ? 'Enviando...' : 'Comentar'}
            </button>
          </div>

          <button className="btn btn-warning" onClick={cerrarDetalle}>Cerrar detalle</button>
        </div>
      )}

      {/* Modal crear mascota */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Mascota</h2>
            {/* TAREA: agregar formulario con inputs, selects, file input y botón guardar */}
            <div className="form-actions">
              <button className="btn btn-warning" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
