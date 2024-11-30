export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  authNavItems: [
    {
      label: "Dashboard",
      href: "/dash",
    },
    {
      label: "Usuário",
      href: "/user",
    },
    {
      label: "Reuniões",
      href: "/meetings",
    },
    {
      label: "Empresa",
      href: "/company",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
  },
};
