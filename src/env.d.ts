/// <reference types="astro/client" />

declare interface ImportMetaEnv {
  readonly GIT_COMMIT_HASH: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Globale UI-APIs (vom Client-Bootstrap gesetzt).
 *
 * Hinweis: Wir tippen diese bewusst global, damit Script-Module
 * (z. B. Navbar/Lightbox) ohne `window as any` auskommen.
 */
declare global {
  type ScrollLockApi = {
    lock: () => void;
    unlock: () => void;
    /** Optional: wird z. B. in der Navbar verwendet. */
    isLocked?: () => boolean;
  };

  interface Window {
    __scrollLock?: ScrollLockApi;
  }
}

export {};
