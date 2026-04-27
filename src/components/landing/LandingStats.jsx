import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function CountUp({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('es-CO')}</span>;
}

const stats = [
  { value: 3200, prefix: '$', suffix: '', label: 'diferencia real vs competidor por paquete coctelero', icon: '💰' },
  { value: 500,  prefix: '',  suffix: '+', label: 'paquetes diarios (meta de despacho 2026)', icon: '📦' },
  { value: 10,   prefix: '',  suffix: '+', label: 'años de aprendizaje y proceso familiar', icon: '🏭' },
  { value: 15,   prefix: '',  suffix: 'K+', label: 'personas impactadas diariamente en pauta', icon: '👥' },
];

function LandingStats() {
  return (
    <section className="lp-stats">
      <div className="lp-container">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="lp-stats__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="lp-stats__icon">{s.icon}</div>
            <div className="lp-stats__number">
              {s.prefix}<CountUp end={s.value} />{s.suffix}
            </div>
            <div className="lp-stats__label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default LandingStats;

