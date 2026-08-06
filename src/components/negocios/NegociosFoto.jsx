import { useState } from 'react';
import { FiImage } from 'react-icons/fi';

/**
 * Imagen con marcador: mientras el archivo no exista en /public, muestra un
 * recuadro punteado. Al subirlo con la ruta indicada, la foto aparece sola.
 * `compacto` es para miniaturas, donde el rótulo ya va fuera de la imagen.
 */
function NegociosFoto({ src, alt, wrapClassName = '', nota, compacto = false }) {
  const [fallo, setFallo] = useState(false);

  if (fallo) {
    return (
      <div
        className={`neg-foto-vacia ${compacto ? 'neg-foto-vacia--compacta' : ''} ${wrapClassName}`}
        role="img"
        aria-label={alt}
      >
        <FiImage className="neg-foto-vacia__icon" aria-hidden="true" />
        {!compacto && <span className="neg-foto-vacia__label">{nota ?? alt}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={wrapClassName}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );
}

export default NegociosFoto;
