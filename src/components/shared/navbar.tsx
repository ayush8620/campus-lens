"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {
  GraduationCap,
  Home,
  Brain,
  Heart,
  User,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCompareStore } from "@/store/compare-store";
import { useState, useEffect } from "react";

/* ── Desktop nav links ──────────────────────────────── */
const desktopLinks = [
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
  { href: "/saved", label: "Saved" },
];

/* ── Mobile bottom‑tab links ──────────────────────────── */
const mobileTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/colleges", label: "Colleges", icon: GraduationCap },
  { href: "/predictor", label: "Predictor", icon: Brain },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

/* ── Mobile menu links ──────────────────────────────── */
const mobileMenuLinks = [
  { href: "/", label: "Home" },
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
  { href: "/saved", label: "Saved" },
  { href: "/profile", label: "Profile" },
];

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const compareCount = useCompareStore((s) => s.colleges.length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for shrink effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ═══════════════ FLOATING TOP BAR ═══════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
          className={`pointer-events-auto mt-5 mx-4 w-full max-w-[calc(100%-2rem)] md:w-auto transition-all duration-500 ease-out ${
            scrolled ? "mt-3" : "mt-5"
          }`}
        >
          <nav
            className={`floating-navbar w-full flex items-center gap-2 transition-all duration-500 ease-out ${
              scrolled
                ? "px-5 py-2 shadow-lg"
                : "px-6 py-3 shadow-xl"
            }`}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* ── LEFT: Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 ios-press mr-2 md:mr-4"
              aria-label="CampusLens Home"
            >
              <span className="text-xl md:text-2xl font-bold floating-nav-logo select-none">
                CL
              </span>
            </Link>

            {/* ── CENTER: Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {desktopLinks.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`floating-nav-link relative px-3 lg:px-4 py-2 text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {/* Compare badge */}
                    {link.href === "/compare" && compareCount > 0 && (
                      <span className="absolute -top-1 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                        {compareCount}
                      </span>
                    )}
                    {/* Active underline indicator */}
                    {active && (
                      <motion.div
                        layoutId="floating-nav-underline"
                        className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-[2px] rounded-full bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Spacer */}
            <div className="flex-1 md:hidden" />

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center gap-1.5 ml-2 md:ml-4 shrink-0">
              {/* Desktop: Auth */}
              <div className="hidden md:flex items-center gap-1.5">
                {isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-7 w-7",
                      },
                    }}
                  />
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      size="sm"
                      className="h-7 rounded-full text-[10px] px-3 ios-press font-semibold uppercase tracking-wider"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Mobile: Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center h-8 w-8 rounded-full hover:bg-accent/50 transition-colors ios-press"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </motion.header>
      </div>

      {/* ═══════════════ MOBILE FULLSCREEN MENU ═══════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-xl md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden floating-mobile-menu"
            >
              <nav className="flex flex-col p-2" aria-label="Mobile navigation">
                {mobileMenuLinks.map((link, i) => {
                  const active = isActive(link.href, pathname);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-200 ios-press ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        {link.label}
                        {link.href === "/compare" && compareCount > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {compareCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth in mobile menu */}
                <div className="mt-2 pt-2 border-t border-border/50 px-4 py-3">
                  {isSignedIn ? (
                    <div className="flex items-center gap-3">
                      <UserButton
                        appearance={{
                          elements: { avatarBox: "h-8 w-8" },
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Account</span>
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full rounded-xl ios-press h-11 font-semibold uppercase tracking-wider text-xs">
                        Sign In
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
