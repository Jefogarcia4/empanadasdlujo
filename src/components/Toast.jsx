import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = useCallback((message, duration = 2500) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast ${toast.visible ? 'show' : ''}`}>
        <FaCheckCircle className="toast-icon" aria-hidden="true" />
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
