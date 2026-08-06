import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaInfo, FaHandshake } from 'react-icons/fa';
import {
  FiClipboard,
  FiShoppingCart,
  FiTruck,
  FiHeadphones,
  FiTag,
  FiCalendar,
  FiChevronRight,
} from 'react-icons/fi';
import { IconoEmpanada, IconoFabrica, IconoSarten } from './NegociosIconos';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 6 — Antes de elegir un proveedor.
 *
 * Archivo esperado en /public/negocios/:
 *   proveedor-producto.jpg → dos empaques D'lujo con empanadas abiertas
 *                            alrededor, sobre fondo claro. Encuadre apaisado.
 *
 * Las objeciones se muestran desplegadas en escritorio y plegadas en móvil,
 * como en el diseño: se usa <details> nativo para que funcione con teclado
 * y lectores de pantalla sin lógica propia.
 */
const CRITERIOS = [
  {
    num: '1',
    icon: <IconoEmpanada />,
    titulo: 'El producto que recibes',
    desc: 'Revisa sabor, masa, relleno, tamaño y comportamiento durante la preparación.',
    listaTitulo: 'Preguntas orientativas',
    items: [
      '¿El formato corresponde a cómo quiero venderlo?',
      '¿La información del empaque es clara?',
    ],
  },
  {
    num: '2',
    icon: <IconoFabrica />,
    titulo: 'Lo que existe detrás del producto',
    desc: 'Verifica quién fabrica, cómo entrega el producto y qué información incluye.',
    listaTitulo: 'Preguntas orientativas',
    items: [
      '¿Es fabricante o comercializador?',
      '¿El producto viene formado, congelado e identificado?',
    ],
  },
  {
    num: '3',
    icon: <FiShoppingCart />,
    titulo: 'La forma en que puedes comprar',
    desc: 'Conoce mínimos, precios por volumen y posibilidad de combinar referencias.',
    listaTitulo: 'Información de D’lujo',
    items: ['Compra regular desde 2 paquetes.', 'Mayorista desde 10 paquetes combinados.'],
  },
  {
    num: '4',
    icon: <FiTruck />,
    titulo: 'La manera en que recibes el producto',
    desc: 'Confirma cobertura, anticipación, días de despacho y tarifa de entrega.',
    listaTitulo: 'Información de D’lujo',
    items: [
      'Pedidos con mínimo un día de anticipación.',
      'Rutas programadas dentro de la cobertura.',
    ],
  },
  {
    num: '5',
    icon: <FiHeadphones />,
    titulo: 'El apoyo antes y después de comprar',
    desc: 'Revisa si recibes información para preparar, conservar y reportar novedades.',
    listaTitulo: 'Preguntas orientativas',
    items: [
      '¿Puedo consultar cómo preparar la referencia?',
      '¿Sé qué hacer si encuentro una anomalía?',
    ],
  },
];

const OBJECIONES = [
  {
    icon: <FiTag />,
    titulo: '“El precio está caro”',
    desc: 'Compara el costo servido, las etapas incluidas y las condiciones de compra, no únicamente el precio del paquete.',
  },
  {
    icon: <IconoEmpanada />,
    titulo: '“Son muy pequeñas”',
    desc: 'El tamaño debe analizarse según la porción, el precio, la ocasión y la forma en que quieres vender el producto.',
  },
  {
    icon: <IconoSarten />,
    titulo: '“Se abren al freír”',
    desc: 'El almacenamiento, la temperatura del aceite y la técnica de preparación influyen en el resultado. Si una unidad presenta una anomalía, debe reportarse para revisión.',
  },
  {
    icon: <FiCalendar />,
    titulo: '“Necesito entrega inmediata”',
    desc: 'Una fábrica trabaja con producción y rutas programadas. Planificar la reposición ayuda a evitar faltantes y pedidos urgentes.',
  },
];

function NegociosProveedor() {
  // En móvil las objeciones se pliegan; en escritorio quedan abiertas.
  const [plegable, setPlegable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sincronizar = () => setPlegable(mq.matches);
    sincronizar();
    mq.addEventListener('change', sincronizar);
    return () => mq.removeEventListener('change', sincronizar);
  }, []);

  return (
    <section id="neg-proveedor" className="neg-prov" aria-labelledby="neg-prov-titulo">
      <div className="neg-prov__inner">
        <div className="neg-prov__top">
          <motion.div
            className="neg-prov__copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <span className="neg-badge neg-badge--rojo">
              <FiClipboard className="neg-badge__icon" aria-hidden="true" />
              Antes de elegir un proveedor
            </span>

            <h2 id="neg-prov-titulo" className="neg-title">
              Un proveedor se evalúa por todo lo que debe responder
            </h2>

            <span className="neg-rule" aria-hidden="true" />

            <p className="neg-text">
              El precio es importante, pero no es el único criterio. También
              debes revisar qué producto recibes, cómo se comporta en tu
              operación, bajo qué condiciones compras y qué respuesta encuentras
              cuando necesitas apoyo.
            </p>

            <p className="neg-text">
              Utiliza esta lista para comparar opciones y decidir qué proveedor
              puede adaptarse mejor a la forma en que funciona tu negocio.
            </p>
          </motion.div>

          <motion.div
            className="neg-prov__media"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NegociosFoto
              src="/negocios/proveedor-producto.jpg"
              alt="Empaques de Empanadas D’lujo rodeados de empanadas abiertas"
              wrapClassName="neg-prov__img"
              nota="Producto y empaque D’lujo"
            />
          </motion.div>
        </div>

        <motion.ol
          className="neg-prov__criterios"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          {CRITERIOS.map((c) => (
            <li key={c.num} className="neg-criterio">
              <div className="neg-criterio__head">
                <span className="neg-criterio__num" aria-hidden="true">{c.num}</span>
                <span className="neg-criterio__icon" aria-hidden="true">{c.icon}</span>
              </div>

              <h3 className="neg-criterio__title">{c.titulo}</h3>
              <p className="neg-criterio__desc">{c.desc}</p>

              <p className="neg-criterio__sub">{c.listaTitulo}</p>
              <ul className="neg-criterio__lista">
                {c.items.map((i) => (
                  <li key={i} className="neg-criterio__item">
                    <FaCheckCircle className="neg-criterio__check" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </motion.ol>

        <div className="neg-prov__dudas">
          <motion.div
            className="neg-objeciones"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="neg-objeciones__title">
              Lo que parece una objeción también puede ser una pregunta por resolver
            </h3>

            <div className="neg-objeciones__grid">
              {OBJECIONES.map((o) => (
                <details key={o.titulo} className="neg-objecion" open={!plegable}>
                  <summary className="neg-objecion__head">
                    <span className="neg-objecion__icon" aria-hidden="true">{o.icon}</span>
                    <span className="neg-objecion__title">{o.titulo}</span>
                    <FiChevronRight className="neg-objecion__chevron" aria-hidden="true" />
                  </summary>
                  <p className="neg-objecion__desc">{o.desc}</p>
                </details>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="neg-proveedor-actual"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="neg-proveedor-actual__icon" aria-hidden="true">
              <FaHandshake />
            </span>
            <h3 className="neg-proveedor-actual__title">¿Ya tienes proveedor?</h3>
            <p className="neg-proveedor-actual__desc">
              No necesitas cambiar de proveedor sin evaluar. Compara producto,
              costos, condiciones, logística y capacidad de respuesta.
            </p>
          </motion.div>
        </div>

        <motion.p
          className="neg-prov__cierre"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-prov__cierre-icon" aria-hidden="true">
            <FaStar />
          </span>
          <span className="neg-prov__cierre-texto">
            Un buen proveedor no solo entrega producto.
            <br />
            <em className="neg-prov__cierre-em">
              También deja claro qué ofrece, cómo debe manejarse y bajo qué
              condiciones responde.
            </em>
          </span>
          <span className="neg-prov__cierre-deco" aria-hidden="true">
            <IconoEmpanada />
            <IconoEmpanada />
          </span>
        </motion.p>

        <p className="neg-prov__nota">
          <span className="neg-prov__nota-icon" aria-hidden="true">
            <FaInfo />
          </span>
          <span>
            <strong>Nota:</strong> Las condiciones, coberturas y tiempos pueden
            variar según el producto, la programación y el área de despacho. Te
            invitamos a consultar los detalles antes de realizar tu pedido.
          </span>
        </p>
      </div>
    </section>
  );
}

export default NegociosProveedor;
