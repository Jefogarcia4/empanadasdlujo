import { useState } from 'react';

const WHATSAPP_BUTTONS = [
  { label: 'Chat IA - Asesoría 24/7', phone: '573046028579' },
  { label: 'Asesoría Comercial', phone: '573018798189' },
];

const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.45 1.32-1.99 1.4-.53.08-1.18.11-1.9-.12-.44-.14-1-.32-1.74-.64-3.06-1.32-5.06-4.4-5.21-4.61-.15-.21-1.25-1.66-1.25-3.17 0-1.51.79-2.25 1.07-2.56.28-.3.61-.38.81-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.6.86 2.07.93 2.22.08.15.13.32.02.53-.1.21-.16.34-.31.52-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.3.79 1.31 1.7 2.12 1.17 1.04 2.16 1.37 2.46 1.52.3.15.48.13.66-.08.18-.21.76-.89.96-1.19.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.12.07.72-.18 1.41Z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

function WhatsAppFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`wa-fab ${open ? 'wa-fab--open' : ''}`}>
      <div className="wa-fab__menu" role="menu" aria-hidden={!open}>
        {WHATSAPP_BUTTONS.map(({ label, phone }) => (
          <a
            key={phone}
            className="wa-fab__btn"
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            aria-label={`${label} por WhatsApp`}
          >
            <WhatsAppIcon className="wa-fab__icon" />
            <span className="wa-fab__label">{label}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className="wa-fab__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar opciones de WhatsApp' : 'Abrir opciones de WhatsApp'}
      >
        {open ? (
          <CloseIcon className="wa-fab__icon" />
        ) : (
          <WhatsAppIcon className="wa-fab__icon" />
        )}
      </button>
    </div>
  );
}

export default WhatsAppFab;
