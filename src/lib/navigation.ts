export type NavLink = {
  label: string;
  href: string;
  /** Optional: ID der Zielsektion für Active-State via IntersectionObserver */
  targetId?: string;
};

export const navLinks: readonly NavLink[] = [
  { label: "Über", href: "#about", targetId: "about" },
  { label: "Projekte", href: "#projects", targetId: "projects" },
  { label: "Interessen", href: "#stack", targetId: "stack" },
  { label: "Bilder", href: "#gallery", targetId: "gallery" },
  { label: "Kontakt", href: "#contact", targetId: "contact" },
] as const;
