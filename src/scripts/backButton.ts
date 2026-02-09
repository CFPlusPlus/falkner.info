const BOUND_ATTR = "data-back-btn-bound";

function hasHistory(): boolean {
  return window.history.length > 1;
}

export function initBackButton(): void {
  const btn = document.querySelector<HTMLElement>("#backBtn");
  const hint = document.querySelector<HTMLElement>("[data-back-fallback]");
  if (!btn) return;
  if (btn.hasAttribute(BOUND_ATTR)) return;

  btn.setAttribute(BOUND_ATTR, "true");
  btn.addEventListener("click", () => {
    if (hasHistory()) {
      window.history.back();
      return;
    }

    hint?.classList.remove("hidden");
    window.location.href = "/";
  });
}
