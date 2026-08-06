import { motion } from 'framer-motion';
import { FaRocket, FaCheckCircle, FaArrowRight, FaHandshake, FaMotorcycle } from 'react-icons/fa';
import { FiShoppingCart, FiBox, FiCalendar } from 'react-icons/fi';
import { IconoCajas, IconoCamionFrio, IconoFabrica } from './NegociosIconos';
import NegociosFoto from './NegociosFoto';
import { WHATSAPP_COMERCIAL } from '../../config/navigation';
import { DELIVERY_FEE } from '../../config/constants';

/*
 * Bloque 8 — Cómo empezar (cierre del módulo).
 *
 * Archivo esperado en /public/negocios/:
 *   empezar-portafolio.jpg → varias referencias D'lujo con la caja de
 *                            despacho y empanadas al frente, fondo claro.
 *
 * El valor del domicilio se toma de config/constants.js, el mismo que usa el
 * carrito: así no puede quedar una cifra distinta en cada sitio.
 */
const domicilio = `$${DELIVERY_FEE.toLocaleString('es-CO')}`;

const OPCIONES = [
  {
    num: '1',
    etiqueta: 'Para comenzar',
    icon: <FiShoppingCart />,
    titulo: 'Compra desde 2 paquetes',
    desc: 'Elige referencias individuales, combina dos productos o utiliza uno de nuestros combos para conocer el portafolio antes de comprar un volumen mayor.',
    puntos: [
      'Precios regulares.',
      'Posibilidad de combinar referencias.',
      'Alternativas para probar diferentes formatos.',
    ],
  },
  {
    num: '2',
    etiqueta: 'Para comprar por volumen',
    destacada: true,
    icon: <IconoCajas />,
    titulo: 'Precio mayorista desde 10 paquetes combinados',
    desc: 'Puedes mezclar referencias dentro del mismo pedido y acceder a los precios de volumen vigentes sin comprar diez paquetes de un solo producto.',
    puntos: [
      'Diez paquetes en total.',
      'Referencias combinables.',
      'Condiciones visibles antes de confirmar el pedido.',
    ],
  },
  {
    num: '3',
    etiqueta: 'Para recibir tu pedido',
    icon: <IconoCamionFrio />,
    titulo: 'Producción y rutas programadas',
    desc: 'Trabajamos como fábrica mediante pedidos anticipados y rutas organizadas dentro de nuestra cobertura actual.',
    puntos: [
      'Pedido con mínimo 1 día de anticipación.',
      'Despachos de lunes a sábado.',
      'No hay despachos domingos ni festivos.',
      'Cobertura desde Copacabana hasta La Estrella.',
      `Domicilio fijo de ${domicilio} dentro de la cobertura.`,
      'Pago por transferencia o efectivo.',
      'Posibilidad de pagar anticipadamente o al recibir.',
    ],
  },
];

const RESUMEN = [
  { icon: <FiBox />, label: 'Desde 2 paquetes' },
  { icon: <IconoCajas />, label: 'Mayorista desde 10 paquetes combinados' },
  { icon: <FaMotorcycle />, label: `Domicilio ${domicilio}` },
  { icon: <FiCalendar />, label: 'Pedidos con mínimo 1 día de anticipación' },
];

function NegociosEmpezar({ onNavigate }) {
  return (
    <section id="neg-empezar" className="neg-empezar" aria-labelledby="neg-empezar-titulo">
      <div className="neg-empezar__inner">
        <div className="neg-empezar__top">
          <motion.div
            className="neg-empezar__copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <span className="neg-badge neg-badge--rojo">
              <FaRocket className="neg-badge__icon" aria-hidden="true" />
              Cómo empezar
            </span>

            <h2 id="neg-empezar-titulo" className="neg-title">
              Empieza con una compra que tenga sentido para tu negocio
            </h2>

            <span className="neg-rule" aria-hidden="true" />

            <p className="neg-text">
              Puedes comenzar con pocas referencias, probar qué funciona mejor
              para tu público o realizar una compra de mayor volumen combinando
              productos del portafolio.
            </p>

            <p className="neg-text">
              Elige directamente tus productos o cuéntanos cómo vendes para
              orientarte sobre formatos y cantidades.
            </p>
          </motion.div>

          <motion.div
            className="neg-empezar__media"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NegociosFoto
              src="/negocios/empezar-portafolio.jpg"
              alt="Referencias de Empanadas D’lujo junto a la caja de despacho"
              wrapClassName="neg-empezar__img"
              nota="Portafolio y caja de despacho"
            />
          </motion.div>
        </div>

        <motion.ol
          className="neg-empezar__opciones"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          {OPCIONES.map((o) => (
            <li
              key={o.num}
              className={`neg-opcion${o.destacada ? ' neg-opcion--destacada' : ''}`}
            >
              <div className="neg-opcion__head">
                <span className="neg-opcion__num" aria-hidden="true">{o.num}</span>
                <span className="neg-opcion__etiqueta">{o.etiqueta}</span>
              </div>

              <div className="neg-opcion__titular">
                <span className="neg-opcion__icon" aria-hidden="true">{o.icon}</span>
                <h3 className="neg-opcion__title">{o.titulo}</h3>
              </div>

              <p className="neg-opcion__desc">{o.desc}</p>

              <ul className="neg-opcion__puntos">
                {o.puntos.map((p) => (
                  <li key={p} className="neg-opcion__punto">
                    <FaCheckCircle className="neg-opcion__check" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </motion.ol>

        <p className="neg-empezar__aviso">
          <span className="neg-empezar__aviso-icon" aria-hidden="true">
            <IconoFabrica />
          </span>
          <span>
            <strong>
              Nuestra operación está enfocada en fabricación y pedidos
              programados.
            </strong>
            <br />
            No funcionamos como un establecimiento de venta abierto al público.
          </span>
        </p>

        <motion.div
          className="neg-empezar__cta"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-empezar__cta-icon" aria-hidden="true">
            <FaHandshake />
          </span>

          <p className="neg-empezar__cta-texto">
            Tú decides con qué referencias comenzar.
            <br />
            <em>
              Nosotros te mostramos las condiciones con claridad antes de
              confirmar tu pedido.
            </em>
          </p>

          <div className="neg-empezar__cta-acciones">
            <button
              type="button"
              className="neg-btn neg-btn--primary neg-btn--flecha"
              onClick={() => onNavigate('tienda')}
            >
              Ver productos para negocios <FaArrowRight aria-hidden="true" />
            </button>
            <a
              className="neg-btn neg-btn--claro neg-btn--flecha"
              href={`https://wa.me/${WHATSAPP_COMERCIAL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Recibir orientación <FaArrowRight aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <ul className="neg-empezar__resumen">
          {RESUMEN.map((r) => (
            <li key={r.label} className="neg-resumen">
              <span className="neg-resumen__icon" aria-hidden="true">{r.icon}</span>
              <span className="neg-resumen__label">{r.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default NegociosEmpezar;
