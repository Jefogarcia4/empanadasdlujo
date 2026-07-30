import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { solicitarOtp, verificarOtp } from '../services/clienteAuth';
import '../styles/ClientePortal.css';

// Modal de ingreso del cliente: paso 1 pide el teléfono, paso 2 el código OTP de 6 dígitos.
function ClienteLoginModal({ onClose, onSuccess }) {
  const [step, setStep] = useState('telefono');
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const telefonoDigits = telefono.replace(/\D/g, '');
  const telefonoValido = telefonoDigits.length >= 10;
  const codigoValido = /^\d{6}$/.test(codigo);

  const handleSolicitar = async (e) => {
    e?.preventDefault();
    if (!telefonoValido || loading) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const resp = await solicitarOtp(telefonoDigits);
      setStep('codigo');
      // En modo prueba el API devuelve el código para poder verificar sin WhatsApp.
      setInfo(resp?.codigoDev
        ? `Modo prueba — tu código es: ${resp.codigoDev}`
        : 'Te enviamos un código por WhatsApp. Ingrésalo aquí.');
    } catch (err) {
      setError(err.message || 'No se pudo enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async (e) => {
    e?.preventDefault();
    if (!codigoValido || loading) return;
    setLoading(true);
    setError(null);
    try {
      const session = await verificarOtp(telefonoDigits, codigo);
      onSuccess?.(session);
    } catch (err) {
      setError(err.message || 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cliente-auth__backdrop" onClick={onClose}>
      <div className="cliente-auth" onClick={(ev) => ev.stopPropagation()}>
        <button type="button" className="cliente-auth__close" onClick={onClose} aria-label="Cerrar">×</button>

        <h2 className="cliente-auth__title">Ingreso de clientes</h2>
        <p className="cliente-auth__subtitle">
          {step === 'telefono'
            ? 'Consulta tus pedidos ingresando con tu número de WhatsApp.'
            : `Enviamos un código a +57 ${telefonoDigits}.`}
        </p>

        {step === 'telefono' && (
          <form className="cliente-auth__form" onSubmit={handleSolicitar}>
            <label className="cliente-auth__label">Número de celular</label>
            <div className="cliente-auth__phone">
              <span className="cliente-auth__prefix">+57</span>
              <input
                className="cliente-auth__input"
                type="tel"
                inputMode="numeric"
                autoFocus
                placeholder="3001234567"
                value={telefono}
                maxLength={15}
                onChange={(ev) => setTelefono(ev.target.value)}
              />
            </div>
            {error && <p className="cliente-auth__error">{error}</p>}
            <button type="submit" className="cliente-auth__submit" disabled={!telefonoValido || loading}>
              {loading ? 'Enviando…' : 'Enviar código'}
            </button>
          </form>
        )}

        {step === 'codigo' && (
          <form className="cliente-auth__form" onSubmit={handleVerificar}>
            <label className="cliente-auth__label">Código de 6 dígitos</label>
            <input
              className="cliente-auth__input cliente-auth__input--code"
              type="text"
              inputMode="numeric"
              autoFocus
              placeholder="••••••"
              value={codigo}
              maxLength={6}
              onChange={(ev) => setCodigo(ev.target.value.replace(/\D/g, ''))}
            />
            {info && !error && <p className="cliente-auth__info">{info}</p>}
            {error && <p className="cliente-auth__error">{error}</p>}
            <button type="submit" className="cliente-auth__submit" disabled={!codigoValido || loading}>
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
            <div className="cliente-auth__actions">
              <button type="button" className="cliente-auth__link" onClick={() => { setStep('telefono'); setError(null); setCodigo(''); }}>
                <FaArrowLeft aria-hidden="true" /> Cambiar número
              </button>
              <button type="button" className="cliente-auth__link" onClick={handleSolicitar} disabled={loading}>
                Reenviar código
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ClienteLoginModal;
