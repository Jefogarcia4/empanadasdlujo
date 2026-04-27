import LandingHero from './LandingHero';
import LandingStats from './LandingStats';
import LandingPainPoints from './LandingPainPoints';
import LandingProcess from './LandingProcess';
import LandingProducts from './LandingProducts';
import LandingHowToOrder from './LandingHowToOrder';
import LandingTestimonials from './LandingTestimonials';
import LandingFAQ from './LandingFAQ';
import LandingCTA from './LandingCTA';

function LandingPage({ onNavigate }) {
  return (
    <main className="lp-main">
      <LandingHero onNavigate={onNavigate} />
      <LandingStats />
      <LandingPainPoints />
      <LandingProcess />
      <LandingProducts onNavigate={onNavigate} />
      <LandingHowToOrder onNavigate={onNavigate} />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingCTA onNavigate={onNavigate} />
    </main>
  );
}

export default LandingPage;

