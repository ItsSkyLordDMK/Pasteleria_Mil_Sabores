// Basic offers/discounts helper
// Supports per-product `oferta` objects on product overrides with shape:
// { type: 'percentage'|'fixed', value: number, label?: string }

export function calculateItemPricing(product) {
  const unitPrice = Number(product.precio || 0);
  const oferta = product.oferta || null;
  if (!oferta || !oferta.type) {
    return { unitPrice, discountPerUnit: 0, finalUnitPrice: unitPrice };
  }

  let discountPerUnit = 0;
  try {
    if (oferta.type === 'percentage') {
      const pct = Number(oferta.value || 0);
      discountPerUnit = unitPrice * (pct / 100);
    } else if (oferta.type === 'fixed') {
      discountPerUnit = Number(oferta.value || 0);
    }
  } catch (e) {
    discountPerUnit = 0;
  }

  const finalUnitPrice = Math.max(0, unitPrice - discountPerUnit);
  return { unitPrice, discountPerUnit, finalUnitPrice };
}

export default { calculateItemPricing };
