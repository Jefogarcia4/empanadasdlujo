/*
 * Íconos de línea propios del módulo Para negocios.
 * Font Awesome no trae gorro de chef, llama de línea ni sartén, así que van
 * dibujados aquí con el mismo grosor de trazo que los de Feather (react-icons/fi)
 * que usa el resto del bloque.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconoChef = (props) => (
  <svg {...base} {...props}>
    <path d="M6.5 13.5A3.5 3.5 0 0 1 6 6.6a3.6 3.6 0 0 1 6-2.3 3.6 3.6 0 0 1 6 2.3 3.5 3.5 0 0 1-.5 6.9" />
    <path d="M6.5 13.5h11V19a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" />
    <path d="M9.5 16.5v3M14.5 16.5v3" />
  </svg>
);

export const IconoLlama = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3s4.5 3.6 4.5 8.2A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.8C7.5 8.4 9.6 6.6 9.6 6.6s.3 1.9 1.5 2.6C11.7 7.4 12 5 12 3z" />
    <path d="M8 17.5c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5" />
  </svg>
);

export const IconoSarten = (props) => (
  <svg {...base} {...props}>
    <path d="M3 10.5h12.5a0 0 0 0 1 0 0v1.5a6.25 6.25 0 0 1-12.5 0v-1.5a0 0 0 0 1 0 0z" />
    <path d="M15.5 11.5h3a2.5 2.5 0 0 0 2.5-2.5V7" />
    <path d="M6.5 7.5c.8-.7.8-1.6 0-2.3M9.5 7.5c.8-.7.8-1.6 0-2.3M12.5 7.5c.8-.7.8-1.6 0-2.3" />
  </svg>
);

export const IconoOlla = (props) => (
  <svg {...base} {...props}>
    <path d="M4 10.5h16v4.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M2.5 10.5h19" />
    <path d="M6.5 10.5 5 8M17.5 10.5 19 8" />
    <path d="M9.5 6.5c.7-.6.7-1.4 0-2M14.5 6.5c.7-.6.7-1.4 0-2" />
  </svg>
);

export const IconoVelocimetro = (props) => (
  <svg {...base} {...props}>
    <path d="M4 17.5a8.5 8.5 0 1 1 16 0" />
    <path d="M12 17.5 15.5 11" />
    <circle cx="12" cy="17.5" r="1.3" />
    <path d="M5.5 13.2 6.8 13.7M12 8.4v1.4M18.5 13.2l-1.3.5" />
  </svg>
);

export const IconoEmpanada = (props) => (
  <svg {...base} {...props}>
    <path d="M3.5 15.5c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8z" />
    <path d="M3.5 15.5h17" />
    <path d="M9 12.2h.01M12 11h.01M15 12.2h.01" strokeWidth="2.2" />
  </svg>
);

export const IconoAceite = (props) => (
  <svg {...base} {...props}>
    <path d="M10 3h4v2.5l2.2 2.6a3 3 0 0 1 .7 1.9V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a3 3 0 0 1 .7-1.9L10 5.5z" />
    <path d="M7 12h10" />
  </svg>
);

export const IconoMerma = (props) => (
  <svg {...base} {...props}>
    <path d="M4 4v16h16" />
    <path d="M7.5 17v-3.5M11 17v-6M14.5 17v-3M18 17v-7.5" />
    <path d="M8 7.5l4 2.5 4-4" />
    <path d="M16 3.5h2.5V6" />
  </svg>
);

export const IconoSalsa = (props) => (
  <svg {...base} {...props}>
    <path d="M3.5 11h17a8.5 8.5 0 0 1-8.5 8 8.5 8.5 0 0 1-8.5-8z" />
    <path d="M9 8c.9-.8.9-1.9 0-2.7M13 8.2c1.1-1 1.1-2.4 0-3.4" />
  </svg>
);

export const IconoCopa = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6.5h12l-1.4 12a2 2 0 0 1-2 1.8H9.4a2 2 0 0 1-2-1.8z" />
    <path d="M6.6 11h10.8" />
  </svg>
);

export const IconoServilleta = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M8 12l4-4 4 4-4 4z" />
  </svg>
);

export const IconoGota = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5c3 3.6 5.5 6.4 5.5 9.5a5.5 5.5 0 0 1-11 0c0-3.1 2.5-5.9 5.5-9.5z" />
  </svg>
);

export const IconoCajas = (props) => (
  <svg {...base} {...props}>
    <rect x="7.5" y="3" width="9" height="7" rx="1" />
    <path d="M11 3v3.2l1 -.8 1 .8V3" />
    <rect x="2.5" y="13" width="9" height="7" rx="1" />
    <path d="M6 13v3.2l1-.8 1 .8V13" />
    <rect x="12.5" y="13" width="9" height="7" rx="1" />
    <path d="M16 13v3.2l1-.8 1 .8V13" />
  </svg>
);

export const IconoCamionFrio = (props) => (
  <svg {...base} {...props}>
    <path d="M2.5 7.5h10v9h-10z" />
    <path d="M12.5 11h4l3 3v2.5h-7z" />
    <circle cx="6.5" cy="18.5" r="1.8" />
    <circle cx="16.5" cy="18.5" r="1.8" />
    <path d="M7.5 12h-3M6 10.5v3M4.9 10.9l2.2 2.2M7.1 10.9l-2.2 2.2" />
  </svg>
);

export const IconoNevera = (props) => (
  <svg {...base} {...props}>
    <rect x="6" y="2.5" width="12" height="19" rx="2" />
    <path d="M6 9.5h12" />
    <path d="M9 5.5v2M9 12v3" />
  </svg>
);

export const IconoMonedas = (props) => (
  <svg {...base} {...props}>
    <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" />
    <path d="M5.5 6.5v4c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-4" />
    <path d="M5.5 10.5v4c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-4" />
    <path d="M5.5 14.5v3c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-3" />
  </svg>
);

export const IconoBalanza = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4v16M8 20h8" />
    <path d="M4 7.5h16" />
    <path d="M4 7.5 1.8 13h4.4z" />
    <path d="M20 7.5 17.8 13h4.4z" />
    <circle cx="12" cy="4" r="1.3" />
  </svg>
);

export const IconoFabrica = (props) => (
  <svg {...base} {...props}>
    <path d="M3 20V11l5 3V11l5 3V8l5 3.5V20z" />
    <path d="M18 11.5V4h-2.5" />
    <path d="M6.5 17h1.5M11 17h1.5M15.5 17H17" />
  </svg>
);

export const IconoCamara = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="3 2.5"
    aria-hidden="true"
    {...props}
  >
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.8l1.2-2h6.9l1.2 2h2.9A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
    <circle cx="12" cy="12.8" r="3.6" />
  </svg>
);
