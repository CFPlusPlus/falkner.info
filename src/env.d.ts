/// <reference types="astro/client" />

declare interface ImportMetaEnv {
  readonly GIT_COMMIT_HASH: string;
  /**
   * Optional: Repository-URL (z.B. https://github.com/USER/REPO)
   * Wird im Footer für den Commit-Link genutzt.
   */
  readonly PUBLIC_REPO_URL?: string;
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
