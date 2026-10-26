import Footer from './Footer';
import Navbar from './Navbar';
import { WhatsAppFloat } from './WhatsAppFloat';

// Pages own their width: they wrap content in <Container> or render full-bleed sections.
function Layout({ children }) {
  return (
    <div className="flex min-h-svh flex-col bg-paper-soft text-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
export default Layout;
