import { useState, useEffect } from 'react'
import api from './api/api.js'
import { toast, ToastContainer } from 'react-toastify'

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
      toast.error('No se pudieron cargar las mascotas')
      
    } finally {
      setLoading(false)
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
          toast.success('¡Mascota creada con éxito! 🐾')
      } catch (err) {
        if (!err.response) {
          setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
          toast.error('Error de conexión. Verifica tu Internet.')
        } else if (err.response.status === 404) {
          setErrores({ general: 'Recurso no encontrado.' })
          toast.error('Recurso no encontrado.')
        } else {
          setErrores(err.response?.data || {general: 'Error al crear mascota' })
          toast.error('Error al crear mascota')
        }
      } finally {
        setEnviando(false)
      }
  }

  async function editarEstado(id, nuevoEstado) {
    try {
      const res = await api.patch(`/mascotas/${id}/`, { estado: nuevoEstado})
      setMascotas(prev => prev.map(m => m.id === id ? { ...m, ...res.data } : m))
      if (mascotaSeleccionada?.id === id) {
        setMascotaSeleccionada(prev => ({ ...prev, ...res.data}))
      }
      toast.success('Estado actualizado ✅')
    } catch (err) {
      if (!err.response) {
        setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
        toast.error('Error de conexión. Verifica tu Internet.')
      } else if (err.response.status === 404){
        setErrores({ general: 'Mascota no encontrada.' })
        toast.error('Mascota no encontrada.')
      } else {
        setErrores(err.response?.data || { general: 'Error al actualizar estado.' })
        toast.error('Error al actualizar estado.')
      }
    }
  }



  async function eliminarMascota(id) {
    if(!window.confirm('¿Estás seguro de eliminar esta mascota?')) return
    try {
      await api.delete(`/mascotas/${id}/`)
      setMascotas(prev => prev.filter(m => m.id !== id))
      cerrarDetalle()
      toast.success('Mascota eliminada 🗑️')
    } catch (err) {
      if(!err.response){
        setErrores({ general: 'Error de conexión. Verifica tu Internet.' })
        toast.error('Error de conexión. Verifica tu Internet.')
      } else if (err.response.status === 404) {
        setErrores({ general: 'Mascota no encontrada' })
        toast.error('Mascota no encontrada')
      } else {
        setErrores(err.response?.data || { general: 'Error al eliminar mascota' })
        toast.error('Error al eliminar mascota')
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando mascotas...</span>
      </div>
    </div>
  )

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <h1 className="mb-4 text-center">🐾 MascotasApp</h1>

      {errores && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errores.general && <p className="mb-1">{errores.general}</p>}
          {Object.keys(errores).filter(k => k !== 'general').length > 0 && (
            <ul className="mb-0">
              {Object.entries(errores).map(([campo, msgs]) => (
                <li key={campo}><strong>{campo}:</strong> {Array.isArray(msgs) ? msgs.join(', ') : msgs}</li>
              ))}
            </ul>
          )}
          <button type="button" className="btn-close" onClick={() => setErrores(null)}></button>
        </div>
      )}

      <div className="mb-4">
        <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
          + Nueva Mascota
        </button>
      </div>

      {/* Lista de mascotas */}
      <div className="row g-4">
        {mascotas.map(m => (
          <div key={m.id} className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <img src={m.imagen} alt={m.nombre} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{m.nombre}</h5>
                <p className="card-text text-muted mb-2">{m.tipo_animal} - {m.raza}</p>
                <span className={`badge mb-3 align-self-start text-bg-${m.estado === 'en_adopcion' ? 'success' : m.estado === 'adoptado' ? 'secondary' : 'warning'}`}>
                  {m.estado}
                </span>
                <button className="btn btn-outline-primary btn-sm mt-auto" onClick={() => fetchDetalle(m.id)}>
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detalle de mascota seleccionada */}
      {mascotaSeleccionada && (
        <div className="card mt-4 shadow-sm">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={mascotaSeleccionada.imagen} alt={mascotaSeleccionada.nombre} className="img-fluid rounded-start h-100" style={{ objectFit: 'cover' }} />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h2 className="card-title">{mascotaSeleccionada.nombre}</h2>
                <p className="card-text"><strong>Descripción:</strong> {mascotaSeleccionada.descripcion}</p>

                <div className="row">
                  <div className="col-6"><p><strong>Tipo:</strong> {mascotaSeleccionada.tipo_animal}</p></div>
                  <div className="col-6"><p><strong>Raza:</strong> {mascotaSeleccionada.raza}</p></div>
                  <div className="col-6"><p><strong>Edad:</strong> {mascotaSeleccionada.edad}</p></div>
                  <div className="col-6"><p><strong>Sexo:</strong> {mascotaSeleccionada.sexo}</p></div>
                  <div className="col-6"><p><strong>Tamaño:</strong> {mascotaSeleccionada.tamano}</p></div>
                  <div className="col-6">
                    <p><strong>Estado:</strong> <span className="badge text-bg-info">{mascotaSeleccionada.estado}</span></p>
                  </div>
                </div>

                <div className="d-flex align-items-end gap-2 my-3">
                  <div>
                    <label className="form-label mb-1">Cambiar estado</label>
                    <select className="form-select" value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
                      {choices?.estado?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={() => editarEstado(mascotaSeleccionada.id, nuevoEstado)}>
                    Guardar
                  </button>
                </div>

                <h4>Comentarios</h4>
                {mascotaSeleccionada.comentarios?.length === 0 ? (
                  <p className="text-muted fst-italic">Sin comentarios aún.</p>
                ) : (
                  mascotaSeleccionada.comentarios?.map(c => (
                    <div key={c.id} className="border-bottom py-2">
                      <strong>{c.autor}</strong>
                      <p className="mb-0">{c.contenido}</p>
                      <small className="text-muted">{c.fecha_creacion?.slice(0, 10)}</small>
                    </div>
                  ))
                )}

                {/* TAREA: agregar formulario para nuevo comentario */}

                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-danger" onClick={() => eliminarMascota(mascotaSeleccionada.id)}>
                    Eliminar Mascota
                  </button>
                  <button className="btn btn-outline-secondary" onClick={cerrarDetalle}>Cerrar detalle</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear mascota */}
      {mostrarFormulario && (
        <>
          <div className="modal d-block" tabIndex="-1" onClick={() => setMostrarFormulario(false)}>
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Nueva Mascota</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarFormulario(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" name="nombre" placeholder="Nombre" value={nuevaMascota.nombre} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="descripcion" placeholder="Descripción" value={nuevaMascota.descripcion} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Edad</label>
                    <input className="form-control" name="edad" type="number" placeholder="Edad" value={nuevaMascota.edad} onChange={handleChange} />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tipo</label>
                      <select className="form-select" name="tipo_animal" value={nuevaMascota.tipo_animal} onChange={handleChange}>
                        <option value="">Selecciona tipo</option>
                        {choices?.tipo_animal?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Raza</label>
                      <select className="form-select" name="raza" value={nuevaMascota.raza} onChange={handleChange}>
                        <option value="">Selecciona raza</option>
                        {choices?.raza?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Sexo</label>
                      <select className="form-select" name="sexo" value={nuevaMascota.sexo} onChange={handleChange}>
                        <option value="">Selecciona sexo</option>
                        {choices?.sexo?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tamaño</label>
                      <select className="form-select" name="tamano" value={nuevaMascota.tamano} onChange={handleChange}>
                        <option value="">Selecciona tamaño</option>
                        {choices?.tamano?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Estado</label>
                      <select className="form-select" name="estado" value={nuevaMascota.estado} onChange={handleChange}>
                        {choices?.estado?.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Imagen</label>
                      <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={crearMascota} disabled={enviando}>
                    {enviando ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  )
}

export default App
