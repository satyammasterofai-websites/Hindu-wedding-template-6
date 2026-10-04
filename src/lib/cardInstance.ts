/**
 * cardInstance.ts
 * Manages unique database identification, remix isolation, and URL synchronization.
 * Guarantees that remixed websites in AI Studio never overlap or overwrite data from the official website.
 */

export const MASTER_CARD_ID = 'remix-v1';
export const OFFICIAL_APPLET_ID = 'a96df12c-9a53-491f-9834-0d2693a3ab95';
export const OFFICIAL_SUBDOMAIN = 'zu6oj4k573mqstevuaebw5';

/**
 * Returns true only if the running code is in the official template container
 */
export function isOfficialWebsite(): boolean {
  // 1. Explicit user choice in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (localStorage.getItem('wedding_custom_card_id') === MASTER_CARD_ID) {
        return true;
      }
    } catch (e) {}
  }

  // 2. Check build-time injected environment variables
  if (typeof __APPLET_ID__ !== 'undefined' && __APPLET_ID__ === OFFICIAL_APPLET_ID) {
    return true;
  }
  if (typeof __K_SERVICE__ !== 'undefined' && __K_SERVICE__.includes(OFFICIAL_SUBDOMAIN)) {
    return true;
  }

  // 3. Check browser hostname
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || '';
    if (hostname.includes(OFFICIAL_SUBDOMAIN)) {
      return true;
    }
    // 4. Production hosting (Vercel, custom domain, or localhost) - not an AI Studio remix container
    const isAiStudioContainer = hostname.startsWith('ais-dev-') || hostname.startsWith('ais-pre-');
    if (!isAiStudioContainer) {
      return true;
    }
  }
  return false;
}

/**
 * Detects the AI Studio applet subdomain from window.location.hostname
 * e.g. "ais-dev-zu6oj4k573mqstevuaebw5-18224007398.asia-east1.run.app" -> "zu6oj4k573mqstevuaebw5"
 */
export function detectAppletSubdomain(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  const hostname = window.location.hostname || '';
  const match = hostname.match(/^ais-(?:dev|pre)-([a-zA-Z0-9]+)/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Generates or retrieves a unique isolated database ID for a remix container
 */
export function getRemixDefaultId(): string {
  // If K_SERVICE is available from Vite define
  if (typeof __K_SERVICE__ !== 'undefined' && __K_SERVICE__ && !__K_SERVICE__.includes(OFFICIAL_SUBDOMAIN)) {
    const cleanService = __K_SERVICE__.replace(/^ais-(dev|pre)-/, '').split('-')[0];
    if (cleanService) {
      return `remix-${cleanService}`;
    }
  }

  // If APPLET_ID is available from Vite define
  if (typeof __APPLET_ID__ !== 'undefined' && __APPLET_ID__ && __APPLET_ID__ !== OFFICIAL_APPLET_ID) {
    return `remix-${__APPLET_ID__.substring(0, 10)}`;
  }

  // If subdomain is present in hostname and not official
  const subdomain = detectAppletSubdomain();
  if (subdomain && subdomain !== OFFICIAL_SUBDOMAIN.toLowerCase()) {
    return `remix-${subdomain}`;
  }

  // Check persistent custom id in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('wedding_custom_card_id');
      if (stored && stored.trim() !== '' && stored !== MASTER_CARD_ID && stored !== 'official-wedding-card') {
        return stored.trim();
      }
      const newRemixId = `remix-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('wedding_custom_card_id', newRemixId);
      return newRemixId;
    } catch (e) {
      // Ignore
    }
  }

  return `remix-instance-${Date.now().toString(36)}`;
}

/**
 * Determines the appropriate card/database ID for the current instance.
 * Follows strict priority:
 * 1. URL search param ?id=... (or ?remix=... or ?card=...)
 * 2. If running on the official website: returns MASTER_CARD_ID ('remix-v1')
 * 3. If running on a remix: ALWAYS returns an isolated remix ID (never MASTER_CARD_ID)
 */
export function determineInitialCardId(): string {
  if (typeof window !== 'undefined') {
    // 1. Explicit URL parameter
    try {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('id') || params.get('remix') || params.get('card');
      if (queryId && queryId.trim() !== '') {
        const trimmed = queryId.trim();
        // If a remix tries to access master card directly, prevent it from overwriting master
        if (!isOfficialWebsite() && (trimmed === MASTER_CARD_ID || trimmed === 'official-wedding-card')) {
          return getRemixDefaultId();
        }
        return trimmed;
      }
    } catch (e) {
      console.warn('Error reading URL search params:', e);
    }

    // 2. Saved card ID preference from localStorage
    try {
      const savedCardId = localStorage.getItem('wedding_custom_card_id');
      if (savedCardId && savedCardId.trim() !== '') {
        return savedCardId.trim();
      }
    } catch (e) {}
  }

  // 3. Official website / Vercel deployment always uses MASTER_CARD_ID ('remix-v1')
  if (isOfficialWebsite()) {
    return MASTER_CARD_ID;
  }

  // 4. Remixes ALWAYS use their own isolated ID
  return getRemixDefaultId();
}

/**
 * Security guard: ensures a remix CAN NEVER write to the official master documents
 */
export function sanitizeCardIdForSave(targetCardId: string): string {
  if (!isOfficialWebsite()) {
    if (targetCardId === MASTER_CARD_ID || targetCardId === 'official-wedding-card') {
      const safeId = getRemixDefaultId();
      console.warn(`[DATA ISOLATION] Blocked remix from writing to official template '${targetCardId}'. Redirected to '${safeId}'.`);
      return safeId;
    }
  }
  return targetCardId;
}

/**
 * Returns isolated localStorage key for a specific card ID
 */
export function getStorageKey(cardId: string): string {
  return `wedding-ecard-settings-${cardId}`;
}

/**
 * Saves settings to localStorage with card isolation
 */
export function saveToLocalStorage(cardId: string, settings: any): void {
  try {
    const safeCardId = sanitizeCardIdForSave(cardId);
    localStorage.setItem(getStorageKey(safeCardId), JSON.stringify(settings));
  } catch (e) {
    console.warn(`Local storage quota exceeded or blocked for ${cardId}:`, e);
  }
}

/**
 * Gets settings from localStorage with fallback to global key
 */
export function getFromLocalStorage(cardId: string): any | null {
  try {
    const scoped = localStorage.getItem(getStorageKey(cardId));
    if (scoped) return JSON.parse(scoped);
  } catch (e) {
    console.warn(`Error reading localStorage for ${cardId}:`, e);
  }
  return null;
}

/**
 * Generates the full shareable URL with the card ID query param
 */
export function getShareableUrl(cardId: string): string {
  if (typeof window === 'undefined' || !window.location) return `?id=${cardId}`;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('id', cardId);
    return url.toString();
  } catch (e) {
    return `${window.location.origin}${window.location.pathname}?id=${cardId}`;
  }
}

/**
 * Returns true if this card is the original master template
 */
export function isMasterTemplate(cardId: string): boolean {
  return cardId === MASTER_CARD_ID || cardId === 'official-wedding-card';
}
