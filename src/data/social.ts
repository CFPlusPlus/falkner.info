export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: readonly SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christian-falkner-60a45537b/",
  },
  { label: "GitHub", href: "https://github.com/CFPlusPlus" },
  { label: "Discord", href: "https://discord.minecraft-gilde.de/" },
] as const;
