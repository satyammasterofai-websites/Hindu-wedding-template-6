/**
 * cardInstance.ts
 * Manages unique database identification, remix isolation, and URL synchronization.
 * Guarantees that remixed websites in AI Studio never overlap or overwrite data from the official website.
 */

export const MASTER_CARD_ID = 'official-wedding-card';
export const OFFICIAL_APPLET_ID = 'a96df12c-9a53-491f-9834-0d2693a3ab95';
export const OFFICIAL_SUBDOMAIN = 'zu6oj4k573mqstevuaebw5';
export const OFFICIAL_WEBSITE_NAME = 'Riyansh & Priyanshi Premium Template-3';

export const REMIX_DEFAULT_CARD_ID = 'nitin-sir-client-2';
export const REMIX_WEBSITE_NAME = 'Nitin sir client -2';

/**
 * Returns true only if the running code is in the official template container
 */
export function isOfficialWebsite(): boolean {
  // 1. Check build-time injected environment variables
  if (typeof __APPLET_ID__ !== 'undefined' && __APPLET_ID__) {
    return __APPLET_ID__ === OFFICIAL_APPLET_ID;
  }
  if (typeof __K_SERVICE__ !== 'undefined' && __K_SERVICE__) {
    return __K_SERVICE__.includes(OFFICIAL_SUBDOMAIN);
  }

  // 2. Check browser hostname
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || '';
    if (hostname.includes(OFFICIAL_SUBDOMAIN)) {
      return true;
    }
    // Any other AI Studio container (dev or preview) is definitively a remix!
    if (hostname.startsWith('ais-dev-') || hostname.startsWith('ais-pre-')) {
      return false;
    }
    // Production custom domain or Vercel
    return true;
  }
  return false;
}

/**
 * Returns the website name based on whether it is running on the official template or a remix
 */
export function getWebsiteName(): string {
  return isOfficialWebsite() ? OFFICIAL_WEBSITE_NAME : REMIX_WEBSITE_NAME;
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
  // Dedicated database document ID for the upcoming remix
  return REMIX_DEFAULT_CARD_ID;
}

/**
 * Determines the appropriate card/database ID for the current instance.
 * Follows strict isolation:
 * 1. Official website: ALWAYS returns MASTER_CARD_ID ('official-wedding-card')
 * 2. Remix website: ALWAYS returns isolated REMIX_DEFAULT_CARD_ID ('nitin-sir-client-2')
 */
export function determineInitialCardId(): string {
  // Official website always uses MASTER_CARD_ID ('official-wedding-card')
  if (isOfficialWebsite()) {
    return MASTER_CARD_ID;
  }

  // When running on a remix website:
  if (typeof window !== 'undefined') {
    // 1. Explicit URL parameter (if user provides custom ID)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('id') || params.get('remix') || params.get('card');
      if (queryId && queryId.trim() !== '') {
        const trimmed = queryId.trim();
        // A remix is strictly forbidden from accessing or overwriting the master card
        if (trimmed === MASTER_CARD_ID || trimmed === 'official-wedding-card' || trimmed === 'remix-v1') {
          return REMIX_DEFAULT_CARD_ID;
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
        const trimmed = savedCardId.trim();
        // Disallow remix from reading master card ID from legacy storage
        if (trimmed !== MASTER_CARD_ID && trimmed !== 'official-wedding-card' && trimmed !== 'remix-v1') {
          return trimmed;
        }
      }
    } catch (e) {}
  }

  // Default isolated database document for the upcoming remix
  return REMIX_DEFAULT_CARD_ID;
}

/**
 * Security guard: ensures a remix CAN NEVER write to the official master documents
 */
export function sanitizeCardIdForSave(targetCardId: string): string {
  if (!isOfficialWebsite()) {
    if (targetCardId === MASTER_CARD_ID || targetCardId === 'official-wedding-card' || targetCardId === 'remix-v1') {
      console.warn(`[DATA ISOLATION] Blocked remix from writing to official template '${targetCardId}'. Redirected to '${REMIX_DEFAULT_CARD_ID}'.`);
      return REMIX_DEFAULT_CARD_ID;
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
