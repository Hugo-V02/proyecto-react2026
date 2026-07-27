import { useState, useEffect } from 'react'

/**
 * Formulario para crear una nueva mascota.
 *
 * Props:
 *  - choices: objeto con los choices del backend ({ estado, tipo_animal, sexo, tamano }).
 *  - onGuardar(formData): callback que recibe un FormData listo para enviar al backend.
 *  - onCerrar(): callback para cerrar el modal.
 *  - guardando: bool que desactiva el botón mientras se está enviando.
 */
function FormularioNuevaMascota({ choices, onGuardar, onCerrar, guardando }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [raza, setRaza] = useState('')
  const [edad, setEdad] = useState('')
  const [imagen, setImagen] = useState(null)
  const [estado, setEstado] = useState('')
  const [tipoAnimal, setTipoAnimal] = useState('')
  const [sexo, setSexo] = useState('')
  const [tamano, setTamano] = useState('')
  const [erroresLocales, setErroresLocales] = useState(null)

  // Inicializamos los selects con la primera opción disponible
  // cuando se reciben los choices.
  useEffect(() => {
    if (!choices) return
    if (!estado && choices.estado?.length) setEstado(choices.estado[0].value)
    if (!tipoAnimal && choices.tipo_animal?.length)
      setTipoAnimal(choices.tipo_animal[0].value)
    if (!sexo && choices.sexo?.length) setSexo(choices.sexo[0].value)
    if (!tamano && choices.tamano?.length) setTamano(choices.tamano[0].value)
  }, [choices, estado, tipoAnimal, sexo, tamano])

  function validar() {
    const errs = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    if (!descripcion.trim()) errs.descripcion = 'La descripción es obligatoria'
    if (!raza.trim()) errs.raza = 'La raza es obligatoria'
    if (edad === '' || edad === null) {
      errs.edad = 'La edad es obligatoria'
    } else if (Number.isNaN(Number(edad)) || Number(edad) < 0) {
      errs.edad = 'La edad debe ser un número válido'
    }
    return errs
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length > 0) {
      setErroresLocales(errs)
      return
    }
    setErroresLocales(null)

    // Construimos FormData para soportar subida de imagen (multipart).
    const formData = new FormData()
    formData.append('nombre', nombre.trim())
    formData.append('descripcion', descripcion.trim())
    formData.append('raza', raza.trim())
    formData.append('edad', String(Number(edad)))
    formData.append('estado', estado)
    formData.append('tipo_animal', tipoAnimal)
    formData.append('sexo', sexo)
    formData.append('tamano', tamano)
    if (imagen) formData.append('imagen', imagen)

    try {
      await onGuardar(formData)
    } catch {
      // Los errores del backend los maneja el padre (MascotasApp).
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="form-group">
        <label htmlFor="mascota-nombre">Nombre</label>
        <input
          id="mascota-nombre"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: Firulais"
        />
        {erroresLocales?.nombre && (
          <p className="error-campo">{erroresLocales.nombre}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mascota-descripcion">Descripción</label>
        <textarea
          id="mascota-descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Cuenta algo sobre la mascota..."
        />
        {erroresLocales?.descripcion && (
          <p className="error-campo">{erroresLocales.descripcion}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mascota-raza">Raza</label>
        <input
          id="mascota-raza"
          type="text"
          value={raza}
          onChange={e => setRaza(e.target.value)}
          placeholder="Ej: Mestizo"
        />
        {erroresLocales?.raza && (
          <p className="error-campo">{erroresLocales.raza}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mascota-edad">Edad</label>
        <input
          id="mascota-edad"
          type="number"
          min="0"
          value={edad}
          onChange={e => setEdad(e.target.value)}
          placeholder="Ej: 3"
        />
        {erroresLocales?.edad && (
          <p className="error-campo">{erroresLocales.edad}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mascota-imagen">Imagen</label>
        <input
          id="mascota-imagen"
          type="file"
          accept="image/*"
          onChange={e => setImagen(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="mascota-estado">Estado</label>
        <select
          id="mascota-estado"
          value={estado}
          onChange={e => setEstado(e.target.value)}
          disabled={!choices?.estado}
        >
          {choices?.estado?.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="mascota-tipo">Tipo de animal</label>
        <select
          id="mascota-tipo"
          value={tipoAnimal}
          onChange={e => setTipoAnimal(e.target.value)}
          disabled={!choices?.tipo_animal}
        >
          {choices?.tipo_animal?.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="mascota-sexo">Sexo</label>
        <select
          id="mascota-sexo"
          value={sexo}
          onChange={e => setSexo(e.target.value)}
          disabled={!choices?.sexo}
        >
          {choices?.sexo?.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="mascota-tamano">Tamaño</label>
        <select
          id="mascota-tamano"
          value={tamano}
          onChange={e => setTamano(e.target.value)}
          disabled={!choices?.tamano}
        >
          {choices?.tamano?.map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-warning"
          onClick={onCerrar}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando || !choices}
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

export default FormularioNuevaMascota