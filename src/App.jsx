import { useState, useEffect } from 'react'
import api from './api/api.js'

function App() {
  const [mascotas, setMascotas] = useState([])
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [choices, setChoices] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errores, setErrores] = useState(null)
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '',
    descripcion: '',
    edad: '',
    raza: '',
    tipo_animal: '',
    sexo: '',
    tamano: '',
    estado: 'en_adopcion',
    imagen: null
  })
  const [enviando, setEnviando] = useState(false)

  const[nuevoEstado, setNuevoEstado] = useState('')

  useEffect(() => {
    fetchMascotas()
    fetchChoices()
  }, [])
  useEffect(() => {
    if (mascotaSeleccionada) {
      setNuevoEstado(mascotaSeleccionada.estado)
    }
  }, [mascotaSeleccionada])

  async function fetchMascotas() {
    try {
      const res = await api.get('/mascotas/')
      setMascotas(res.data)
    } catch {
    
    } 
  }
  function handleChange(e) {
    const { name, value } = e.target
    setNuevaMascota(prev => ({...prev, [name]: value}))
  }

  function handleFileChange(e){
    setNuevaMascota(prev => ({...prev, imagen: e.target.files[0] }))
  }

  function resetFormulario(){
    setNuevaMascota({
    nombre: '',
    descripcion: '',
    edad: '',
    raza: '',
    tipo_animal: '',
    sexo: '',
    tamano: '',
    estado: 'en_adopcion',
    imagen: null
    })
    setMostrarFormulario(false)
    setErrores(null)
  }

  async function fetchChoices() {
    try {
      const res = await api.get('/choices/')
      setChoices(res.data)
    } catch (err) {
      console.warn('Error al obtener catálogos:', err.response?.data ?? err.message)
    }
  }

  async function fetchDetalle(id) {
    try {
      const res = await api.get(`/mascotas/${id}/`)
      setMascotaSeleccionada(res.data)
    } catch  {
    
    }
  }

  // TAREA: implementar crearMascota()
  async function crearMascota() {
    setEnviando(true)
    setErrores(null)
    try {
      const fd = new FormData () 
        fd.append('nombre', nuevaMascota.nombre)
        fd.append('descripcion', nuevaMascota.descripcion)
        fd.append('edad', nuevaMascota.edad)
        fd.append('raza', nuevaMascota.raza)
        fd.append('tipo_animal', nuevaMascota.tipo_animal)
        fd.append('sexo', nuevaMascota.sexo)
        fd.append('tamano', nuevaMascota.tamano)
        fd.append('estado', nuevaMascota.estado)
      if (nuevaMascota.imagen) fd.append('imagen', nuevaMascota.imagen)

        const res = await api.post('/mascotas/', fd)
          setMascotas(prev => [...prev, res.data])
          resetFormulario()
      } catch (err) {
        if (!err.response) {
          setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
        } else if (err.response.status === 404) {
          setErrores({ general: 'Recurso no encontrado.' })
        } else {
          setErrores(err.response?.data || {general: 'Error al crear mascota' })
        }
      }
  }

  async function editarEstado(id, nuevoEstado) {
    try {
      const res = await api.patch(`/mascotas/${id}/`, { estado: nuevoEstado})
      setMascotas(prev => prev.map(m => m.id === id ? { ...m, ...res.data } : m))
      if (mascotaSeleccionada?.id === id) {
        setMascotaSeleccionada(prev => ({ ...prev, ...res.data}))
      }
    } catch (err) {
      if (!err.response) {
        setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
      } else if (err.response.status === 404){
        setErrores({ general: 'Mascota no encontrada.' })
      } else {
        setErrores(err.response?.data || { general: 'Error al actualizar estado.' })
      }
    }
  }



  async function eliminarMascota(id) {
    if(!window.confirm('¿Estás seguro de eliminar esta mascota?')) return
    try {
      await api.delete(`/mascotas/${id}/`)
      setMascotas(prev => prev.filter(m => m.id !== id))
      cerrarDetalle()
    } catch (err) {
      if(!err.response){
        setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
      } else if (err.response.status === 404) {
        setErrores({ general: 'Mascota no encontrada' })
      } else {
        setErrores(err.response?.data || { general: 'Error al eliminar mascota' })
      }
    }
  }
  
  // TAREA: implementar agregarComentario()
  async function agregarComentario(mascotaId, autor, contenido) {
    // usar: await api.post(`/mascotas/${mascotaId}/comentar/`, { autor, contenido })
  }

  // TAREA: implementar eliminarComentario()
  async function eliminarComentario(id, mascotaId) {
    // usar: await api.delete(`/comentarios/${id}/`)
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

          <div className="editar-estado">
            <label>Cambiar estado:</label>
            <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
              {choices?.estado?.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            <button className="btn btn-sm btn-primary" onClick={() => editarEstado(mascotaSeleccionada.id, nuevoEstado)}>
              Guardar
            </button>
          </div>

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
              </div>
            ))
          )}

          {/* TAREA: agregar formulario para nuevo comentario */}
          <button className="btn btn-danger" onClick={() => eliminarMascota(mascotaSeleccionada.id)}>
            Eliminar Mascota
          </button>
          <button className="btn btn-warning" onClick={cerrarDetalle}>Cerrar detalle</button>
        </div>
      )}

      {/* Modal crear mascota */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Mascota</h2>
              <input name="nombre" placeholder="Nombre" value={nuevaMascota.nombre} onChange={handleChange} />
              <textarea name="descripcion" placeholder="Descripción" value={nuevaMascota.descripcion} onChange={handleChange} />
              <input name="edad" type="number" placeholder="Edad" value={nuevaMascota.edad} onChange={handleChange} />

              <select name="tipo_animal" value={nuevaMascota.tipo_animal} onChange={handleChange}>
                <option value="">Selecciona tipo</option>
                {choices?.tipo_animal?.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <select name="raza" value={nuevaMascota.raza} onChange={handleChange}>
                <option value="">Selecciona raza</option>
                {choices?.raza?.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <select name="sexo" value={nuevaMascota.sexo} onChange={handleChange}>
                <option value="">Selecciona sexo</option>
                {choices?.sexo?.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <select name="tamano" value={nuevaMascota.tamano} onChange={handleChange}>
                <option value="">Selecciona tamaño</option>
                {choices?.tamano?.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <select name="estado" value={nuevaMascota.estado} onChange={handleChange}>
                {choices?.estado?.map(op => <option key={op} value={op}>{op}</option>)}
              </select>

              <input type="file" accept="image/*" onChange={handleFileChange} />

              <div className="form-actions">
                <button className="btn btn-warning" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={crearMascota} disabled={enviando}>
                  {enviando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
