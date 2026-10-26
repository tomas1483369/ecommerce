import { Link, useParams } from 'react-router';
import { Container } from '../components/Container';
import { findInfoPage } from '../lib/categories';
import { buttonClass } from '../lib/ui';

// Informational pages (content pending) and the 404 page.
function PlaceholderPage({ kind }) {
  const { slug } = useParams();
  const entry = kind === 'info' ? findInfoPage(slug) : null;

  if (!entry) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">No encontramos esta página</h1>
        <p className="mt-3 text-body">
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </p>
        <Link to="/" className={buttonClass({ variant: 'dark', className: 'mt-8' })}>
          Volver al inicio
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{entry.name}</h1>
      <p className="mx-auto mt-4 max-w-md text-body">
        Estamos preparando esta sección. Mientras tanto, puedes ver todos los productos en la página
        de inicio.
      </p>
      <Link to="/" className={buttonClass({ variant: 'dark', className: 'mt-8' })}>
        Ver productos
      </Link>
    </Container>
  );
}

export default PlaceholderPage;
