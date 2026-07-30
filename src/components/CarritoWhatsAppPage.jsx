import { useEffect, useState } from 'react';
import { FaLink, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { fetchCarrito, marcarCarritoConvertido } from '../services/carrito';
import { fetchProducts, fetchCombos } from '../services/api';
import CartPage from './CartPage';

// Página del link de carrito por WhatsApp (/carrito/{token}). Precarga el borrador (items +
// datos del cliente) en el carrito y reutiliza CartPage como checkout, de modo que la compra
// se completa en el navegador y dispara el pixel de Meta igual que el flujo normal.
function CarritoWhatsAppPage({ token, onNavigate }) {
  const { hydrateCart } = useCart();
  const [status, setStatus] = useState('loading'); // loading | ready | not_found | converted | error
  const [initialForm, setInitialForm] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [carrito, products, combos] = await Promise.all([
          fetchCarrito(token),
          fetchProducts(),
          fetchCombos(),
        ]);

        if (!mounted) return;

        if (!carrito) {
          setStatus('not_found');
          return;
        }
        if (carrito.estado === 'CONVERTIDO') {
          setStatus('converted');
          return;
        }

        // Hidrata los items del borrador matcheando por id contra el catálogo ya mapeado.
        const cartItems = (carrito.items ?? [])
          .map((it) => {
            const base = it.idCombo
              ? combos.find((c) => c.idCombo === it.idCombo)
              : products.find((p) => p.id === it.codigoSku);
            if (!base) return null;
            return { ...base, quantity: it.cantidad };
          })
          .filter(Boolean);

        hydrateCart(cartItems);

        setInitialForm({
          nombre: carrito.nombre,
          apellidos: carrito.apellidos,
          telefono: carrito.telefono,
          email: carrito.email,
          direccion: carrito.direccion,
          casaApartamento: carrito.casaApartamento,
          ciudad: carrito.ciudad,
          departamento: carrito.departamento,
          codigoPostal: carrito.codigoPostal,
          pais: carrito.pais,
          comentarios: carrito.observaciones,
        });
        setStatus('ready');
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setErrorMsg(err?.message || '');
        setStatus('error');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, hydrateCart]);

  if (status === 'loading') {
    return (
      <main className="cart-page">
        <p className="products-status">Cargando tu carrito...</p>
      </main>
    );
  }

  if (status === 'not_found') {
    return (
      <main className="cart-page">
        <div className="cart-page__empty">
          <p><FaLink aria-hidden="true" /> Este enlace de carrito no existe o expiró.</p>
          <button className="cart-page__go-store" onClick={() => onNavigate('tienda')}>
            Ir a la tienda
          </button>
        </div>
      </main>
    );
  }

  if (status === 'converted') {
    return (
      <main className="cart-page">
        <div className="cart-page__empty">
          <p><FaCheckCircle aria-hidden="true" /> Este carrito ya fue convertido en un pedido.</p>
          <button className="cart-page__go-store" onClick={() => onNavigate('tienda')}>
            Ir a la tienda
          </button>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="cart-page">
        <div className="cart-page__empty">
          <p><FaTimesCircle aria-hidden="true" /> No se pudo cargar tu carrito.</p>
          {errorMsg && <p className="cart-status__detail">{errorMsg}</p>}
          <button className="cart-page__go-store" onClick={() => onNavigate('tienda')}>
            Ir a la tienda
          </button>
        </div>
      </main>
    );
  }

  return (
    <CartPage
      onNavigate={onNavigate}
      initialForm={initialForm}
      onOrderCreated={(pedidoId) => marcarCarritoConvertido(token, pedidoId)}
    />
  );
}

export default CarritoWhatsAppPage;
