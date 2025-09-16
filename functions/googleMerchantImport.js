import functions from 'firebase-functions';
import admin from 'firebase-admin';

try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

const db = admin.firestore();

function clampLimit(limit) {
  const parsed = Number.parseInt(limit, 10);
  if (Number.isNaN(parsed)) {
    return 5;
  }
  return Math.max(1, Math.min(parsed, 50));
}

async function fetchGoogleMerchantCatalog(merchantId, apiKey, limit = 5) {
  // محاكاة استدعاء Google Merchant API - في بيئة الإنتاج سيتم استبدالها
  void apiKey; // سيتم استخدامه مع التكامل الحقيقي لاحقاً
  const safeLimit = clampLimit(limit);
  const items = Array.from({ length: safeLimit }).map((_, index) => {
    const idNumber = String(index + 1).padStart(3, '0');
    return {
      offerId: `${merchantId}-${idNumber}`,
      title: `Imported Book ${index + 1}`,
      description: 'Imported automatically from Google Merchant feed.',
      price: (39.99 + index).toFixed(2),
      currency: 'SAR',
      availability: index % 4 === 0 ? 'out_of_stock' : 'in_stock',
      link: `https://books.example.com/${merchantId}/book-${idNumber}`,
      imageLink: `https://images.example.com/${merchantId}/book-${idNumber}.jpg`
    };
  });

  return { items };
}

function sanitiseCatalogItems(rawItems = [], merchantId) {
  const items = [];
  const warnings = [];

  rawItems.forEach((item, index) => {
    const offerId = (item.offerId || item.id || `${merchantId}-${index + 1}`).toString();
    const title = typeof item.title === 'string' ? item.title.trim() : '';

    if (!title) {
      warnings.push({
        code: 'missing-title',
        offerId,
        message: `Item ${offerId} is missing a title and was skipped.`
      });
      return;
    }

    const rawPrice = typeof item.price === 'object' ? item.price.value || item.price.amount : item.price;
    const price = Number.parseFloat(rawPrice);

    if (!Number.isFinite(price) || price <= 0) {
      warnings.push({
        code: 'invalid-price',
        offerId,
        message: `Item "${title}" has an invalid price and was skipped.`
      });
      return;
    }

    const currency = (item.currency || item.priceCurrency || item.price?.currency || 'SAR').toUpperCase();

    items.push({
      offerId,
      merchantId,
      title,
      description: typeof item.description === 'string' ? item.description.trim() : '',
      price: Math.round(price * 100) / 100,
      currency,
      availability: item.availability || item.stockStatus || 'in_stock',
      link: item.link || item.productLink || null,
      imageLink: item.imageLink || item.image || null
    });
  });

  return {
    items,
    warnings,
    skippedCount: rawItems.length - items.length
  };
}

export const importGoogleMerchantCatalog = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to import Google Merchant data.');
  }

  const { googleMerchantId, googleApiKey, options = {} } = data || {};
  const merchantId = typeof googleMerchantId === 'string' ? googleMerchantId.trim() : '';
  const apiKey = typeof googleApiKey === 'string' ? googleApiKey.trim() : '';
  const dryRun = Boolean(options.dryRun);
  const limit = clampLimit(options.limit ?? 5);

  if (!merchantId) {
    throw new functions.https.HttpsError('invalid-argument', 'googleMerchantId is required.');
  }

  if (!apiKey) {
    throw new functions.https.HttpsError('invalid-argument', 'googleApiKey is required.');
  }

  try {
    const catalog = await fetchGoogleMerchantCatalog(merchantId, apiKey, limit);
    const { items, warnings, skippedCount } = sanitiseCatalogItems(catalog.items, merchantId);

    const response = {
      success: true,
      importedCount: items.length,
      skippedCount,
      warnings,
      dryRun,
      preview: items.slice(0, 10)
    };

    if (!dryRun) {
      const merchantRoot = db.collection('integrations').doc('googleMerchant');
      const batch = db.batch();

      items.forEach((item) => {
        const docRef = merchantRoot.collection('catalog').doc(item.offerId);
        batch.set(docRef, {
          ...item,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });

      const logRef = merchantRoot.collection('imports').doc();
      batch.set(logRef, {
        merchantId,
        importedCount: items.length,
        skippedCount,
        warnings,
        dryRun,
        triggeredBy: context.auth.uid || null,
        requestedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await batch.commit();
    }

    return response;
  } catch (error) {
    console.error('Google Merchant import failed', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to import Google Merchant catalog.'
    );
  }
});
