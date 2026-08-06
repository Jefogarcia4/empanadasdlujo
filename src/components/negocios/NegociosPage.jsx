import NegociosHero from './NegociosHero';
import NegociosOrigen from './NegociosOrigen';
import NegociosSabor from './NegociosSabor';
import NegociosFormatos from './NegociosFormatos';
import NegociosCalculadora from './NegociosCalculadora';
import NegociosProveedor from './NegociosProveedor';
import NegociosRecursos from './NegociosRecursos';
import NegociosEmpezar from './NegociosEmpezar';
import '../../styles/Negocios.css';

// Página "Para negocios": los ocho bloques del diseño, uno debajo del otro.
function NegociosPage({ onNavigate }) {
  return (
    <main className="neg-main">
      {/* 1 · Portada */}
      <NegociosHero onNavigate={onNavigate} />
      {/* 2 · Desde el origen */}
      <NegociosOrigen />
      {/* 3 · Sabor y producción */}
      <NegociosSabor />
      {/* 4 · Elige según cómo vendes */}
      <NegociosFormatos onNavigate={onNavigate} />
      {/* 5 · Tirando calculadora */}
      <NegociosCalculadora />
      {/* 6 · Antes de elegir un proveedor */}
      <NegociosProveedor />
      {/* 7 · Recursos para negocios */}
      <NegociosRecursos onNavigate={onNavigate} />
      {/* 8 · Cómo empezar */}
      <NegociosEmpezar onNavigate={onNavigate} />
    </main>
  );
}

export default NegociosPage;
