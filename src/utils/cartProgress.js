import { MIN_PACKAGES, WHOLESALE_THRESHOLD } from '../config/constants';

// Estado de compra del carrito: cuánto falta para la compra mínima y para el
// precio mayorista. Solo los paquetes individuales avanzan hacia el mayorista;
// los combos cumplen la compra mínima pero conservan su precio especial.
//
// `eligiblePackages` = paquetes de referencias individuales.
// `comboUnits`       = combos en el carrito.
export function buildCartProgress({ eligiblePackages = 0, comboUnits = 0 }) {
  const packages = Math.max(0, eligiblePackages);
  const combos = Math.max(0, comboUnits);

  const minMet = combos > 0 || packages >= MIN_PACKAGES;
  const missingForMin = Math.max(MIN_PACKAGES - packages, 0);
  const missingForWholesale = Math.max(WHOLESALE_THRESHOLD - packages, 0);
  const wholesaleMet = packages >= WHOLESALE_THRESHOLD;

  const plural = (n, one, many) => (n === 1 ? one : many);

  let key;
  let icon;
  let title;
  let desc;

  if (packages + combos === 0) {
    key = 'vacio';
    icon = 'cart';
    title = 'Comienza agregando tus productos';
    desc = `Agrega al menos ${MIN_PACKAGES} paquetes para completar la compra mínima.`;
  } else if (!minMet) {
    key = 'minimo-pendiente';
    icon = 'box';
    title = `Te ${plural(missingForMin, 'falta', 'faltan')} ${missingForMin} ${plural(
      missingForMin,
      'paquete',
      'paquetes'
    )} para completar tu compra`;
    desc = `Agrega al menos ${MIN_PACKAGES} paquetes para completar la compra mínima.`;
  } else if (wholesaleMet) {
    key = 'mayorista';
    icon = 'tag';
    title = 'Ya alcanzaste la cantidad mayorista';
    desc =
      'Los precios mayoristas ya fueron aplicados a todas las referencias elegibles del pedido.';
  } else if (missingForWholesale === 1) {
    key = 'casi';
    icon = 'star';
    title = 'Estás a 1 paquete del precio mayorista';
    desc =
      'Agrega 1 paquete elegible más y se aplicarán los precios mayoristas a las referencias correspondientes.';
  } else if (packages === 0) {
    key = 'solo-combo';
    icon = 'combo';
    title = `${plural(combos, 'Tu combo ya cumple', 'Tus combos ya cumplen')} la compra mínima`;
    desc =
      'El combo mantiene su precio especial. Agrega referencias individuales si quieres avanzar hacia el precio mayorista.';
  } else {
    key = 'minimo-ok';
    icon = 'bag';
    title = 'Ya cumpliste la compra mínima';
    desc = 'Puedes seguir agregando productos para acceder al precio mayorista.';
  }

  // Mensaje bajo la barra: siempre dice cuánto falta en paquetes elegibles.
  let progressMsg;
  if (wholesaleMet) {
    progressMsg =
      'Los precios mayoristas ya fueron aplicados a todas las referencias elegibles del pedido.';
  } else if (packages === 0) {
    progressMsg = combos
      ? 'El combo mantiene su precio especial. Agrega referencias individuales si quieres avanzar hacia el precio mayorista.'
      : `Combina referencias individuales hasta completar ${WHOLESALE_THRESHOLD} paquetes elegibles y acceder a los precios mayoristas.`;
  } else if (missingForWholesale === 1) {
    progressMsg =
      'Agrega 1 paquete elegible más y se aplicarán los precios mayoristas a las referencias correspondientes.';
  } else {
    progressMsg = `Te faltan ${missingForWholesale} paquetes elegibles para acceder a precios mayoristas.`;
  }

  return {
    key,
    icon,
    title,
    desc,
    packages,
    combos,
    minMet,
    missingForMin,
    missingForWholesale,
    wholesaleMet,
    minLabel: minMet
      ? 'Compra mínima alcanzada'
      : `${packages} de ${MIN_PACKAGES} paquetes`,
    // Pasado el umbral ya no tiene sentido el "de 10".
    progressLabel:
      packages > WHOLESALE_THRESHOLD
        ? `${packages} paquetes elegibles`
        : `${packages} de ${WHOLESALE_THRESHOLD} paquetes elegibles`,
    progressPct: Math.min(packages / WHOLESALE_THRESHOLD, 1) * 100,
    // pendiente (bajo la compra mínima) · avance · completo
    tone: wholesaleMet ? 'completo' : minMet ? 'avance' : 'pendiente',
    progressMsg,
    comboNote:
      combos > 0 && packages > 0
        ? `Tienes ${combos} ${plural(combos, 'combo', 'combos')} con precio especial. ${plural(
            combos,
            'El combo no modifica',
            'Los combos no modifican'
          )} este progreso ni ${plural(combos, 'recibe', 'reciben')} descuento mayorista adicional.`
        : null,
  };
}
