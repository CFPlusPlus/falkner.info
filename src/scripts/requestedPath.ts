export function initRequestedPath(): void {
  const target = document.querySelector<HTMLElement>("[data-requested-path]");
  if (target) target.textContent = window.location.pathname;
}
