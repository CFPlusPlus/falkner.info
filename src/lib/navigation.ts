import { homeNavigation, pageNavigation } from "../data/navigation";

export type { NavLink } from "../data/navigation";

// Rueckwaertskompatibel fuer bestehende Komponenten/Seiten.
export const navLinks = homeNavigation;
export const secondaryNavLinks = pageNavigation;

