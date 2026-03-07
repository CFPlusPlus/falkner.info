export type NavLink = {
  label: string;
  href: string;
  targetId?: string;
};

export const homeNavigation: readonly NavLink[] = [
  { label: "Selected Work", href: "/#selected-work", targetId: "selected-work" },
  { label: "Profil", href: "/#profil", targetId: "profil" },
  { label: "Impressionen", href: "/#impressionen", targetId: "impressionen" },
  { label: "Kontakt", href: "/#kontakt", targetId: "kontakt" },
] as const;

export const pageNavigation: readonly NavLink[] = [
  { label: "Start", href: "/" },
  { label: "Projekte", href: "/projekte" },
  { label: "Impressionen", href: "/impressionen" },
  { label: "Ueber", href: "/ueber" },
] as const;
