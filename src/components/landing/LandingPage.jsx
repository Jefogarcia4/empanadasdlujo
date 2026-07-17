import LandingHero from './LandingHero';
import LandingProcess from './LandingProcess';
import LandingAudience from './LandingAudience';
import LandingStarterCombos from './LandingStarterCombos';
import LandingBusinessSolutions from './LandingBusinessSolutions';
import LandingPortfolio from './LandingPortfolio';
import LandingPurchaseClarity from './LandingPurchaseClarity';
import LandingOurStory from './LandingOurStory';
import LandingBrandValues from './LandingBrandValues';
import LandingQualityProcess from './LandingQualityProcess';
import LandingOrderFAQ from './LandingOrderFAQ';
import LandingResources from './LandingResources';
import LandingNextStep from './LandingNextStep';

function LandingPage({ onNavigate }) {
  return (
    <main className="lp-main">
      <LandingHero onNavigate={onNavigate} />
      <LandingProcess />
      <LandingAudience onNavigate={onNavigate} />
      <LandingStarterCombos onNavigate={onNavigate} />
      <LandingBusinessSolutions onNavigate={onNavigate} />
      <LandingPortfolio onNavigate={onNavigate} />
      <LandingPurchaseClarity onNavigate={onNavigate} />
      <LandingOurStory onNavigate={onNavigate} />
      <LandingBrandValues />
      <LandingQualityProcess onNavigate={onNavigate} />
      <LandingOrderFAQ />
      <LandingResources />
      <LandingNextStep onNavigate={onNavigate} />
    </main>
  );
}

export default LandingPage;
