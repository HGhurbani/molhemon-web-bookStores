const SECRET = 'molhemon-secret';
const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKey() {
  const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(SECRET));
  return crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function setItem(key, data) {
  const json = JSON.stringify(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(json);
  const cryptoKey = await getKey();
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
  const buffer = new Uint8Array(cipher);
  const payload = btoa(String.fromCharCode(...iv, ...buffer));
  sessionStorage.setItem(key, payload);
}

export async function getItem(key) {
  const payload = sessionStorage.getItem(key);
  if (!payload) return null;
  const data = Uint8Array.from(atob(payload), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const cipher = data.slice(12);
  const cryptoKey = await getKey();
  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, cipher);
    const decoded = decoder.decode(decrypted);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function removeItem(key) {
  sessionStorage.removeItem(key);
}
