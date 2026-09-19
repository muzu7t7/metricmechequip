import { useState, useEffect } from 'react';
import defaultProducts from '../data/products.json';

const STORAGE_KEY = 'mmequip_products_v1';

// ─── Image Compression ────────────────────────────────────────────────────────
// Resizes and compresses an image file to a JPEG data URL (~50–100 KB).
// This keeps localStorage usage manageable during the demo phase.
// When migrating to Firebase, replace this with a Firebase Storage upload.
export const compressImage = (file, maxDim = 900, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// ─── Seed helper ──────────────────────────────────────────────────────────────
const seed = () =>
  defaultProducts.map((p, i) => ({
    id:          `default-${i}`,
    name:        p.name,
    category:    p.category,
    description: '',
    specs:       '',
    inStock:     true,
    imageUrl:    p.image || '',
  }));

// ─── Initialize ───────────────────────────────────────────────────────────────
const initialize = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data — fall through to seed
  }
  const initial = seed();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useProducts = () => {
  const [products, setProducts] = useState(initialize);

  const persist = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // localStorage full (unlikely for demo)
      console.warn('Could not persist products:', e);
    }
    setProducts(list);
  };

  const addProduct = (data) => {
    const product = { ...data, id: `prod-${Date.now()}` };
    persist([...products, product]);
    return product;
  };

  const updateProduct = (id, data) => {
    persist(products.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProduct = (id) => {
    persist(products.filter((p) => p.id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct };
};

// ─── Categories Hook ──────────────────────────────────────────────────────────
// Categories live in localStorage so the admin can add new ones any time.
const CAT_KEY = 'mmequip_categories_v1';
const DEFAULT_CATS = ['Hoses & Tubes', 'Fittings & Couplings', 'Valves & Gauges', 'Maintenance'];

export const useCategories = () => {
  const [categories, setCategories] = useState(() => {
    try {
      const raw = localStorage.getItem(CAT_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* fall through */ }
    return DEFAULT_CATS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const raw = localStorage.getItem(CAT_KEY);
        if (raw) setCategories(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('mmequip_cats_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('mmequip_cats_updated', handleUpdate);
    };
  }, []);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return false;
    const updated = [...categories, trimmed];
    localStorage.setItem(CAT_KEY, JSON.stringify(updated));
    setCategories(updated);
    window.dispatchEvent(new Event('mmequip_cats_updated'));
    return true;
  };

  return { categories, addCategory };
};
