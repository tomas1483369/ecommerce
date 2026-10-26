import { BRAND_ICONS } from '../lib/brandIcons';

// Official brand mark (Simple Icons, CC0), in its brand color unless `color` overrides it
// (e.g. white glyph on a brand-colored button).
export function SocialIcon({ name, className = 'size-5', color }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" fill={color ?? icon.color} className={className} aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}
