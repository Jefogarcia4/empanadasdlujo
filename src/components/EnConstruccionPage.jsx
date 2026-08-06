import { FaTools, FaCheck, FaStore, FaWhatsapp } from 'react-icons/fa';
import { EN_CONSTRUCCION, WHATSAPP_COMERCIAL } from '../config/navigation';
import '../styles/EnConstruccion.css';

const FALLBACK = {
  title: 'Sección en construcción',
  intro: 'Estamos preparando el contenido de esta sección. Vuelve pronto.',
  bullets: [],
};

function EnConstruccionPage({ page, onNavigate }) {
  const { title, intro, bullets } = EN_CONSTRUCCION[page] ?? FALLBACK;

  return (
    <main className="wip">
      <section className="wip__card">
        <span className="wip__badge">
          <FaTools aria-hidden="true" /> Página en construcción
        </span>

        <h1 className="wip__title">{title}</h1>
        <p className="wip__intro">{intro}</p>

        {bullets.length > 0 && (
          <>
            <p className="wip__list-title">Lo que vas a encontrar aquí</p>
            <ul className="wip__list">
              {bullets.map((item) => (
                <li key={item} className="wip__item">
                  <FaCheck className="wip__check" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="wip__actions">
          <button
            type="button"
            className="wip__btn wip__btn--primary"
            onClick={() => onNavigate('tienda')}
          >
            <FaStore aria-hidden="true" /> Ver productos
          </button>
          <a
            className="wip__btn wip__btn--ghost"
            href={`https://wa.me/${WHATSAPP_COMERCIAL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp aria-hidden="true" /> Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

export default EnConstruccionPage;
