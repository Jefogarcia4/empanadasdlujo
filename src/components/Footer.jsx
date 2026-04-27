function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <p>
        © {currentYear} <span className="footer-brand">Empanadas D'Lujo</span>. 
        Todos los derechos reservados.
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
        🥟 Hecho con amor y tradición
      </p>
    </footer>
  );
}

export default Footer;
