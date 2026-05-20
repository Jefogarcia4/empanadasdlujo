const WHATSAPP_LINK = 'https://wa.me/573046028579';

function Hero() {
  return (
    <section className="tienda-hero">
      <a
        href={`${WHATSAPP_LINK}?text=Hola! Quiero hacer un pedido`}
        target="_blank"
        rel="noopener noreferrer"
        className="tienda-hero__banner-link"
      >
        <img
          src="/banner_header.png"
          alt="Empanadas D'lujo - El sabor auténtico en tu casa"
          className="tienda-hero__banner"
        />
      </a>
    </section>
  );
}

export default Hero;
