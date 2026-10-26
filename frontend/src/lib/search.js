// Accent- and case-insensitive product search over the loaded catalog.
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function searchProducts(products, query, limit = 8) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const nameMatches = [];
  const otherMatches = [];
  for (const p of products) {
    const haystack = normalize(`${p.name} ${p.category} ${p.description}`);
    if (!terms.every((t) => haystack.includes(t))) continue;
    const name = normalize(p.name);
    (terms.every((t) => name.includes(t)) ? nameMatches : otherMatches).push(p);
  }
  return [...nameMatches, ...otherMatches].slice(0, limit);
}
