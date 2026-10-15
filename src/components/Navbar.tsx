"use client";

import { IconActivity } from "@tabler/icons-react";
import { useSyncExternalStore } from "react";
import { site } from "@/config/site";

const links = [
  { href: "#especialidades", label: "Tratamentos" },
  { href: "#onde-doi", label: "Onde dói?" },
  { href: "#metodo", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
];

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const isScrolled = () => window.scrollY > 40;
const isScrolledOnServer = () => false;

/** Navbar fixa: transparente no topo, vira glass ao rolar. */
export function Navbar() {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer);

  return (
    <header>
      <nav className={`nav${scrolled ? " is-scrolled" : ""}`} aria-label="Principal">
        <a className="nav__brand" href="#inicio">
          <IconActivity size={20} aria-hidden="true" />
          {site.brand}
        </a>
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <a className="btn btn-primary btn--sm mag" href="#contato">
          Agendar
        </a>
        <span className="nav__progress" data-scroll-progress="" aria-hidden="true" />
      </nav>
    </header>
  );
}
