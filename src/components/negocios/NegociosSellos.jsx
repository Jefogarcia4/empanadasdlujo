import { IconoChef, IconoLlama, IconoSarten } from './NegociosIconos';

// Sellos de producto. Se superponen a la fotografía principal en varios bloques.
const SELLOS = [
  { icon: <IconoChef />, label: 'Elaboración propia' },
  { icon: <IconoLlama />, label: 'Sabor D’lujo' },
  { icon: <IconoSarten />, label: 'Listos para freír' },
];

function NegociosSellos() {
  return (
    <ul className="neg-sellos">
      {SELLOS.map(({ icon, label }) => (
        <li key={label} className="neg-sello">
          <span className="neg-sello__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="neg-sello__label">{label}</span>
        </li>
      ))}
    </ul>
  );
}

export default NegociosSellos;
