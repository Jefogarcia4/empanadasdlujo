// Navegación principal del sitio (menú hamburguesa).
// `page` es la clave interna que App.jsx usa para decidir qué renderizar,
// `icon` referencia el mapa de íconos del Header.
export const MENU_ITEMS = [
  { page: 'landing', label: 'Inicio', icon: 'home' },
  { page: 'negocios', label: 'Para negocios', icon: 'briefcase' },
  { page: 'tienda', label: 'Productos', icon: 'store' },
  { page: 'proceso', label: 'Proceso y calidad', icon: 'quality' },
  { page: 'nosotros', label: 'Nosotros', icon: 'users' },
  { page: 'contacto', label: 'Contacto', icon: 'contact' },
];

// URL asociada a cada página con ruta propia. Las páginas que no aparecen aquí
// (carrito, detalle de producto) navegan sin cambiar de ruta.
export const PAGE_PATHS = {
  tienda: '/',
  landing: '/inicio',
  negocios: '/para-negocios',
  proceso: '/proceso-y-calidad',
  nosotros: '/nosotros',
  contacto: '/contacto',
  mis_pedidos: '/mis-pedidos',
};

// Secciones que aún no tienen contenido: se renderizan con EnConstruccionPage.
export const EN_CONSTRUCCION = {
  negocios: {
    title: 'Para negocios',
    intro:
      'Estamos preparando el espacio para dueños de puestos de fritos, cafeterías, tiendas y servicios de catering que quieren vender nuestras empanadas.',
    bullets: [
      'Rentabilidad y margen por paquete',
      'Combos de arranque para probar sin invertir de más',
      'Condiciones de precio por mayor desde 10 paquetes',
    ],
  },
  proceso: {
    title: 'Proceso y calidad',
    intro:
      'Aquí vas a poder conocer cómo producimos: masa, relleno, congelado y los controles que hacemos en cada lote.',
    bullets: [
      'Ficha técnica de cada producto',
      'Cadena de frío y manejo del congelado',
      'Controles de calidad por lote',
    ],
  },
  contacto: {
    title: 'Contacto',
    intro:
      'Muy pronto vas a encontrar aquí todos nuestros canales de atención. Mientras tanto, escríbenos por WhatsApp y te respondemos.',
    bullets: [
      'Asesoría comercial para negocios',
      'Horarios de atención y tiempos de respuesta',
      'Cobertura de despachos en el Área Metropolitana',
    ],
  },
};

// Número comercial para los CTA de WhatsApp de las páginas en construcción.
export const WHATSAPP_COMERCIAL = '573018798189';
