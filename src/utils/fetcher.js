// Centralized fetch helper that respects DISABLE_CACHE for dev testing
const isCacheDisabled = process.env.DISABLE_CACHE === 'true';

export async function fetchJson(url, options = {}) {
  const cacheMode = isCacheDisabled ? 'no-store' : (options.cache ?? 'force-cache');
  const headers = {
    ...(options.headers || {}),
    ...(isCacheDisabled ? { 'Cache-Control': 'no-store' } : {}),
  };
  const res = await fetch(url, { ...options, cache: cacheMode, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function fetchNoStore(url, options = {}) {
  return fetchJson(url, { ...options, cache: 'no-store' });
}

export async function fetchRevalidate(url, seconds = 60, options = {}) {
  if (isCacheDisabled) return fetchNoStore(url, options);
  return fetch(url, { ...options, next: { revalidate: seconds } });
}

export default fetchJson;


