import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Show, SignInButton, useAuth, UserButton } from '@clerk/react';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import {
  CATEGORIES,
  categoryPath,
  stockedSubcategories,
  subcategoryPath,
} from '../lib/categories';
import { linkClass } from '../lib/ui';
import { STORE_WHATSAPP_NUMBER, whatsappUrl } from '../lib/whatsapp';
import { useScrolled } from '../hooks/useScrolled';
import { useCart } from '../store/cart';
import { SearchDialog } from './SearchDialog';

// Delay before closing the mega menu, so moving the mouse from the link to the panel doesn't flicker.
const CLOSE_DELAY_MS = 150;

// Same for every category: real pages only (a list of look-alike links that all open the
// category page would promise content that does not exist).
const HELP_LINKS = [
  { label: 'Garantía', to: '/informacion/garantia' },
  { label: 'Envíos y devoluciones', to: '/informacion/envios-y-devoluciones' },
];

const supportUrl = whatsappUrl(
  STORE_WHATSAPP_NUMBER,
  'Hola, necesito ayuda con una compra en TecnoSoftware',
);

function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`shrink-0 text-[15px] font-extrabold tracking-[0.12em] text-ink lg:text-lg lg:tracking-[0.14em] xl:text-xl xl:tracking-[0.18em] ${className}`}
    >
      TECNOSOFTWARE
    </Link>
  );
}

function CartLink({ count }) {
  return (
    <Link
      to="/cart"
      className="relative flex size-10 items-center justify-center sm:size-11 rounded-full hover:bg-paper-soft"
      aria-label={count > 0 ? `Carrito, ${count} productos` : 'Carrito'}
    >
      <ShoppingCartIcon className="size-[22px]" strokeWidth={1.8} aria-hidden />
      {count > 0 ? (
        <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white tabular-nums">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}

function AccountButton() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="flex size-10 items-center justify-center sm:size-11 rounded-full hover:bg-paper-soft"
            aria-label="Iniciar sesión"
          >
            <UserIcon className="size-[22px]" strokeWidth={1.8} aria-hidden />
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <span className="flex size-10 items-center justify-center sm:size-11">
          <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
        </span>
      </Show>
    </>
  );
}

function MegaMenu({ category, id }) {
  return (
    <div
      id={id}
      className="absolute inset-x-0 top-full border-t border-line bg-paper shadow-[0_24px_40px_rgba(0,0,0,0.08)] motion-safe:animate-[panel-in_180ms_ease-out]"
    >
      <div className="mx-auto flex max-w-[1240px] gap-12 px-6 pt-8 pb-10">
        <ul className="grid flex-1 grid-cols-5 gap-4">
          {stockedSubcategories(category).map((sub) => {
            const SubIcon = sub.icon;
            return (
              <li key={sub.name}>
                <Link
                  to={subcategoryPath(category.slug, sub.name)}
                  className="group flex flex-col items-center gap-3 rounded-xl p-3 text-center text-sm font-medium transition-colors hover:text-brand"
                >
                  <span className="flex size-28 items-center justify-center rounded-xl bg-paper-soft transition-colors group-hover:bg-brand-soft">
                    <SubIcon
                      className="size-11 text-ink transition-colors group-hover:text-brand"
                      strokeWidth={1.2}
                      aria-hidden
                    />
                  </span>
                  {sub.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex w-60 flex-col gap-3.5 border-l border-line pl-8">
          <p className="mb-1 text-sm font-bold">Ayuda para comprar</p>
          {HELP_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm hover:text-brand">
              {l.label}
            </Link>
          ))}
          <Link to={categoryPath(category.slug)} className={`mt-2 text-sm ${linkClass}`}>
            Ver todo en {category.name} ›
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose, isAdmin }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // keep keyboard focus inside the panel while it is open
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-[60] flex flex-col bg-paper motion-safe:animate-[panel-in_200ms_ease-out] lg:hidden"
    >
      <div className="flex h-14 items-center justify-between border-b border-line pr-1 pl-4">
        <Logo />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center sm:size-11 rounded-full hover:bg-paper-soft"
          aria-label="Cerrar menú"
        >
          <XIcon className="size-[22px]" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <nav aria-label="Categorías" className="flex-1 overflow-y-auto overscroll-contain">
        <Link
          to="/"
          className="flex min-h-14 items-center border-b border-line px-5 text-[17px] font-medium"
        >
          Tienda
        </Link>
        {CATEGORIES.map((c) => {
          const expanded = openSection === c.slug;
          const panelId = `menu-section-${c.slug}`;
          return (
            <div key={c.slug} className="border-b border-line">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenSection(expanded ? null : c.slug)}
                className={`flex min-h-14 w-full items-center justify-between px-5 text-left text-[17px] ${expanded ? 'font-bold' : 'font-medium'}`}
              >
                {c.name}
                <ChevronDownIcon
                  className={`size-[18px] transition-transform ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {expanded ? (
                <ul id={panelId} className="flex flex-col pr-5 pb-4 pl-8">
                  {stockedSubcategories(c).map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={subcategoryPath(c.slug, sub.name)}
                        className="block py-2.5 text-[15px]"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={categoryPath(c.slug)}
                      className="block py-2.5 text-[15px] font-bold text-brand"
                    >
                      Ver todo en {c.name}
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-line px-5 pt-4 pb-6 text-[15px]">
        <Show when="signed-in">
          <Link to="/orders" className="py-2.5">
            Mis pedidos
          </Link>
        </Show>
        {isAdmin ? (
          <Link to="/admin" className="py-2.5">
            Administrar productos
          </Link>
        ) : null}
        {supportUrl ? (
          <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="py-2.5">
            Soporte por WhatsApp ↗
          </a>
        ) : null}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button" className="py-2.5 text-left font-bold">
              Iniciar sesión
            </button>
          </SignInButton>
        </Show>
      </div>
    </div>
  );
}

const Navbar = () => {
  const { getToken, isSignedIn } = useAuth();
  const location = useLocation();
  const [openSlug, setOpenSlug] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef(null);
  const triggerRefs = useRef({});
  const hamburgerRef = useRef(null);
  const searchButtonRef = useRef(null);

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch('/api/me', { getToken }),
    enabled: isSignedIn,
  });
  const isAdmin = meData?.user?.role === 'admin';
  const hasUtilityLinks = Boolean(supportUrl) || isSignedIn || isAdmin;

  const cartCount = useCart((s) => s.items.reduce((n, line) => n + line.quantity, 0));

  // Huawei-style: solid at the top, frosted translucent once the page scrolls;
  // solid again while the mega menu is open so it stays readable
  const scrolled = useScrolled();
  const translucent = scrolled && !openSlug;

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (slug) => {
      cancelClose();
      setOpenSlug(slug);
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenSlug(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);

  // navigating anywhere closes both menus (state adjusted during render, not in an effect)
  const routeKey = location.pathname + location.search;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    setOpenSlug(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!openSlug) return undefined;
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      const trigger = triggerRefs.current[openSlug];
      setOpenSlug(null);
      trigger?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openSlug]);

  return (
    <header
      data-scrolled={translucent ? 'true' : 'false'}
      className={`sticky top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        translucent
          ? 'bg-white/95 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/85'
          : 'bg-paper'
      }`}
    >
      {hasUtilityLinks ? (
        <div className="hidden border-b border-line lg:block">
          <div className="mx-auto flex max-w-[1240px] justify-end gap-6 px-6 py-2 text-[13px] font-medium">
            {supportUrl ? (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                Soporte
              </a>
            ) : null}
            <Show when="signed-in">
              <Link to="/orders" className="hover:text-brand">
                Mis pedidos
              </Link>
            </Show>
            {isAdmin ? (
              <Link to="/admin" className="hover:text-brand">
                Administrar
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className="relative border-b border-line"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-14 max-w-[1240px] items-center gap-3 pr-1 pl-4 sm:gap-6 lg:h-16 lg:px-6 xl:gap-9"
        >
          <Logo />

          <ul className="hidden h-full flex-1 items-stretch gap-5 lg:flex xl:gap-6">
            <li className="flex" onMouseEnter={() => setOpenSlug(null)}>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center border-b-2 text-sm font-medium transition-colors hover:text-brand xl:text-[15px] ${isActive ? 'border-brand' : 'border-transparent'}`
                }
              >
                Tienda
              </NavLink>
            </li>
            {CATEGORIES.map((c) => {
              const open = openSlug === c.slug;
              const menuId = `mega-${c.slug}`;
              return (
                <li
                  key={c.slug}
                  className="flex"
                  onMouseEnter={() => openMenu(c.slug)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setOpenSlug(null);
                  }}
                >
                  <NavLink
                    ref={(el) => {
                      triggerRefs.current[c.slug] = el;
                    }}
                    to={categoryPath(c.slug)}
                    onFocus={() => openMenu(c.slug)}
                    aria-expanded={open}
                    aria-controls={menuId}
                    className={({ isActive }) =>
                      `flex items-center border-b-2 text-sm font-medium transition-colors hover:text-brand xl:text-[15px] ${isActive || open ? 'border-brand' : 'border-transparent'}`
                    }
                  >
                    {c.name}
                  </NavLink>
                  {open ? <MegaMenu category={c} id={menuId} /> : null}
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center sm:size-11 rounded-full hover:bg-paper-soft"
              aria-label="Buscar"
              aria-haspopup="dialog"
            >
              <SearchIcon className="size-[22px]" strokeWidth={1.8} aria-hidden />
            </button>
            <CartLink count={cartCount} />
            <AccountButton />
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center sm:size-11 rounded-full hover:bg-paper-soft lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <MenuIcon className="size-[22px]" strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen ? <MobileMenu onClose={closeMobile} isAdmin={isAdmin} /> : null}
      {searchOpen ? <SearchDialog onClose={closeSearch} /> : null}
    </header>
  );
};

export default Navbar;
