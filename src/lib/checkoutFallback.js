export function resolveCheckoutFallbackId(orderResult) {
  const fallbackId = orderResult?.order?.id || orderResult?.orderNumber || `temp_${Date.now()}`;
  const isTempId = typeof fallbackId === 'string' && fallbackId.startsWith('temp_');

  return { fallbackId, isTempId };
}
