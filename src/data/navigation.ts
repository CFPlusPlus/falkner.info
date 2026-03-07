export type NavLink = {
  label: string;
  href: string;
  targetId?: string;
};

export const homeNavigation: readonly NavLink[] = [
  { label: "Projekte", href: "/#selected-work", targetId: "selected-work" },
  { label: "Impressionen", href: "/#impressionen", targetId: "impressionen" },
  { label: "Über mich", href: "/#profil", targetId: "profil" },
  { label: "Kontakt", href: "/#kontakt", targetId: "kontakt" },
] as const;

export const pageNavigation: readonly NavLink[] = [
  { label: "Projekte", href: "/projekte" },
  { label: "Impressionen", href: "/impressionen" },
  { label: "Über mich", href: "/ueber" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;
