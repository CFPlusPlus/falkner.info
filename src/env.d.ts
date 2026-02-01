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
