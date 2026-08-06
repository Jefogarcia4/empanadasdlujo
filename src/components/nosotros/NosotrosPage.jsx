import NosotrosHistoria from './NosotrosHistoria';
import NosotrosEvolucion from './NosotrosEvolucion';
import NosotrosDesafio from './NosotrosDesafio';
import NosotrosSolucion from './NosotrosSolucion';
import NosotrosPresentacion from './NosotrosPresentacion';
import NosotrosEquipo from './NosotrosEquipo';
import NosotrosAvanzar from './NosotrosAvanzar';
import NosotrosCierre from './NosotrosCierre';
import '../../styles/Nosotros.css';

// Página "Nosotros": los ocho bloques del diseño, uno debajo del otro.
function NosotrosPage({ onNavigate }) {
  return (
    <main className="nos-main">
      {/* 1 · Nuestra historia */}
      <NosotrosHistoria onNavigate={onNavigate} />
      {/* 2 · Nuestra evolución */}
      <NosotrosEvolucion />
      {/* 3 · El desafío que decidimos resolver */}
      <NosotrosDesafio />
      {/* 4 · Nuestra solución productiva */}
      <NosotrosSolucion />
      {/* 5 · Presentación e información */}
      <NosotrosPresentacion />
      {/* 6 · Padre e hijo */}
      <NosotrosEquipo />
      {/* 7 · Nuestra forma de avanzar */}
      <NosotrosAvanzar />
      {/* 8 · Lo que construimos para ti */}
      <NosotrosCierre onNavigate={onNavigate} />
    </main>
  );
}

export default NosotrosPage;
