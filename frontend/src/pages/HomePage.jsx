import { BenefitsSection } from '../components/home/BenefitsSection';
import { CampaignSection } from '../components/home/CampaignSection';
import { EssentialsSection } from '../components/home/EssentialsSection';
import { FavoritesSection } from '../components/home/FavoritesSection';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { InspirationSection } from '../components/home/InspirationSection';
import { OffersSection } from '../components/home/OffersSection';
import { Container } from '../components/Container';
import { PageError } from '../components/PageError';
import { HERO_SLIDES } from '../content/home';
import { useCatalog } from '../hooks/useCatalog';

// Section order and color budget follow docs/diseno.md ("Inicio"): one red band (offers), one
// black band (favorites), everything else light; each section has its own composition.
function HomePage() {
  const { products, bySlug, isLoading, error, refetch } = useCatalog();

  return (
    <>
      <h1 className="sr-only">TecnoSoftware: tecnología en Colombia</h1>
      <HeroCarousel slides={HERO_SLIDES} />
      {error ? (
        <Container className="py-16">
          <PageError
            message="No pudimos cargar los productos. Revisa tu conexión e intenta de nuevo."
            onRetry={refetch}
          />
        </Container>
      ) : (
        <EssentialsSection products={products} isLoading={isLoading} />
      )}
      {products.length > 0 ? <OffersSection bySlug={bySlug} /> : null}
      <CampaignSection />
      <FavoritesSection />
      <InspirationSection />
      <BenefitsSection />
    </>
  );
}
export default HomePage;
