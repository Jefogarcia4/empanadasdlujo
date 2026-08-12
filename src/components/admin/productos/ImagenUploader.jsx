import { useRef, useState } from 'react';
import { FaImage, FaUpload } from 'react-icons/fa';
import {
  IMAGEN_MAX_MB,
  IMAGEN_TIPOS,
  subirImagenProducto,
} from '../../../services/catalogoAdmin';

/**
 * Bloque de imagen compartido por productos y combos: preview, carga por botón o
 * arrastrar-y-soltar, y campo de ruta manual (los items antiguos usan rutas
 * relativas tipo /img_products/xxx.jpg servidas por el frontend).
 */
function ImagenUploader({ url, onChange, onSessionExpired, etiqueta = 'Imagen' }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [rota, setRota] = useState(false);
  const inputRef = useRef(null);

  const cambiar = (valor) => {
    setRota(false);
    onChange(valor);
  };

  // Se valida en el cliente para dar respuesta inmediata; el API vuelve a validar
  // por la firma real del archivo.
  const procesarArchivo = async (file) => {
    if (!file) return;
    setError(null);

    if (!IMAGEN_TIPOS.includes(file.type)) {
      setError('Formato no soportado. Usa JPG, PNG, WebP o GIF.');
      return;
    }
    if (file.size > IMAGEN_MAX_MB * 1024 * 1024) {
      setError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el máximo es ${IMAGEN_MAX_MB} MB.`);
      return;
    }

    setSubiendo(true);
    try {
      const { url: subida } = await subirImagenProducto(file);
      cambiar(subida);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setError(err.message || 'No se pudo subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div
      className={`pform__imagen${arrastrando ? ' pform__imagen--drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastrando(false);
        if (!subiendo) procesarArchivo(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="pform__preview">
        {url && !rota ? (
          <img src={url} alt="Vista previa" onError={() => setRota(true)} />
        ) : (
          <div className="pform__preview-vacia">
            <FaImage aria-hidden="true" />
            <span>{rota ? 'No se pudo cargar' : 'Sin imagen'}</span>
          </div>
        )}
        {subiendo && (
          <div className="pform__preview-cargando">
            <span className="precio-cell__spinner" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="pform__imagen-ctrl">
        <span className="pform__label">{etiqueta}</span>

        <div className="pform__imagen-acciones">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            <FaUpload aria-hidden="true" /> {subiendo ? 'Subiendo…' : 'Subir imagen'}
          </button>

          {url && !subiendo && (
            <button
              type="button"
              className="pform__imagen-quitar"
              onClick={() => { cambiar(''); setError(null); }}
            >
              Quitar
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            className="visually-hidden"
            accept={IMAGEN_TIPOS.join(',')}
            onChange={(e) => {
              procesarArchivo(e.target.files?.[0]);
              e.target.value = ''; // permite volver a elegir el mismo archivo
            }}
          />
        </div>

        <span className="pform__hint">
          Arrastra una imagen aquí o súbela · JPG, PNG, WebP o GIF · máx {IMAGEN_MAX_MB} MB
        </span>

        <label className="pform__field pform__imagen-url">
          <span className="pform__hint">…o escribe la ruta / URL a mano</span>
          <input
            className="pform__input"
            type="text"
            maxLength={255}
            placeholder="/img_products/emp_carne.jpg"
            value={url}
            onChange={(e) => cambiar(e.target.value)}
          />
        </label>

        {error && <span className="pform__imagen-error">{error}</span>}
      </div>
    </div>
  );
}

export default ImagenUploader;
