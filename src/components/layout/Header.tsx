"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { ease } from "@/components/motion/tokens";
import { LinkButton, buttonClass } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { nav } from "@/content/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Close the sheet whenever the route changes (state adjusted during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Mobile nav: scroll lock, Escape, focus trap, focus return
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = [toggleRef.current!, ...focusables()];
        const first = els[0]!;
        const last = els[els.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,height] duration-500 ${
        open
          ? "border-b border-line bg-page"
          : scrolled
            ? "border-b border-line bg-page/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-x flex items-center justify-between transition-[height] duration-500 ${
          scrolled ? "h-16" : "h-[4.5rem]"
        }`}
      >
        <Link href="/" aria-label="CONSOLE INSURANCE — home" className="relative z-[60] rounded-lg">
          <span className="hidden sm:block">
            <Logo />
          </span>
          <span className="sm:hidden">
            <Logo variant="compact" />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                      active ? "text-fg" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand"
                        transition={{ duration: 0.5, ease: ease.out }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-[60] flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden lg:block">
            <Magnetic>
              <LinkButton href="/quote" className="min-h-11 px-5 text-sm">
                Get a Quote
              </LinkButton>
            </Magnetic>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border border-field-line text-fg transition hover:bg-brand-soft lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[55] flex flex-col bg-page px-[var(--gutter)] pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: ease.inOut }}
          >
            <div className="pointer-events-none absolute inset-0 atmosphere opacity-80" />
            <ul className="relative flex flex-col">
              {nav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: ease.out }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-16 items-center justify-between font-display text-2xl tracking-[-0.02em] ${
                        active ? "text-fg" : "text-fg-2"
                      }`}
                    >
                      {item.label}
                      <span aria-hidden className="text-brand">
                        {active ? "●" : "→"}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="relative mt-auto pt-10">
              <Link href="/quote" className={buttonClass("primary", "w-full")}>
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
