import rawProducts from './products.json';

// Products are managed by editing src/data/products.json.
//
// Each entry:
//   name         (required) string
//   category     (required) string — any value; new categories appear in the filter automatically
//   description  (optional) string
//   inStock      (optional) boolean, defaults to true
//   image        (optional) URL, or a path inside /public, e.g. "products/hose.jpg"
//   sku          (optional) string, overrides the auto-generated "MM-1000" reference
//
// Auto-generated SKUs follow array position, so append new products at the END
// of the file to keep existing references stable.

const FALLBACK_CATEGORY = 'Other';

// Paths in /public need the Vite base prefix (the site is served from a
// sub-path on GitHub Pages). Absolute URLs and data URIs are left alone.
const resolveImage = (src) => {
  if (!src) return '';
  if (/^(https?:)?\/\/|^data:/i.test(src)) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`;
};

const normalize = (p, index) => ({
  id:          `product-${index}`,
  name:        String(p.name).trim(),
  category:    String(p.category ?? '').trim() || FALLBACK_CATEGORY,
  description: p.description ?? '',
  inStock:     p.inStock !== false,
  imageUrl:    resolveImage(p.image),
  sku:         p.sku ?? `MM-${1000 + index}`,
});

const entries = Array.isArray(rawProducts) ? rawProducts : [];

export const products = entries
  .map((p, index) => {
    if (!p || typeof p.name !== 'string' || !p.name.trim()) {
      console.warn(`products.json: entry #${index} skipped — "name" is required`, p);
      return null;
    }
    return normalize(p, index);
  })
  .filter(Boolean);

// Unique categories, in order of first appearance.
export const categories = [...new Set(products.map((p) => p.category))];
