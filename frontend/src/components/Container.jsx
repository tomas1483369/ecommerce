// Page-width wrapper; full-bleed sections (hero, dark bands) render outside it.
export function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1240px] px-4 md:px-6 ${className}`}>{children}</Tag>
  );
}
