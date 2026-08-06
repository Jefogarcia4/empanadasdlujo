import { useState } from 'react';
import { FaImage } from 'react-icons/fa';

/**
 * Imagen con placeholder: mientras no exista el archivo real en /public,
 * muestra un marcador con la descripción de la foto que hay que producir.
 * Al subir el archivo con la ruta indicada, la foto aparece sola.
 */
function NosotrosFoto({
  src,
  alt,
  className = '',
  wrapClassName = '',
  nota,
  // Para imágenes decorativas: si el archivo no existe, no deja marcador.
  ocultarSiFalla = false,
}) {
  const [fallo, setFallo] = useState(false);

  if (fallo) {
    if (ocultarSiFalla) return null;
    return (
      <div className={`nos-foto-vacia ${wrapClassName}`} role="img" aria-label={alt}>
        <FaImage className="nos-foto-vacia__icon" aria-hidden="true" />
        <span className="nos-foto-vacia__label">{nota ?? alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${wrapClassName}`.trim()}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );
}

export default NosotrosFoto;
