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
  GitCompareArrows,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCompareStore } from "@/store/compare-store";

/* ── Desktop nav links (segmented control) ────────────── */
const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
];

/* ── Mobile bottom‑tab links ──────────────────────────── */
const mobileTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/colleges", label: "Colleges", icon: GraduationCap },
  { href: "/predictor", label: "Predictor", icon: Brain },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const compareCount = useCompareStore((s) => s.colleges.length);

  return (
    <>
      {/* ═══════════════ TOP BAR ═══════════════ */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 w-full glass"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group ios-press">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <GraduationCap className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="text-lg font-semibold gradient-text tracking-tight">
              CampusLens
            </span>
          </Link>

          {/* ── Desktop: Segmented Control ── */}
          <nav className="hidden md:flex items-center">
            <div className="segmented-control flex items-center gap-0.5">
              {desktopLinks.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors duration-200 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="segmented-pill"
                        className="absolute inset-0 bg-background rounded-[8px] shadow-sm"
                        style={{ zIndex: -1 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    {link.label}
                    {link.href === "/compare" && compareCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            {/* Desktop: Saved shortcut */}
            {isSignedIn && (
              <Link
                href="/saved"
                className="hidden md:flex"
                title="Saved Colleges"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full ios-press"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Desktop: Compare shortcut */}
            <Link
              href="/compare"
              className="hidden md:flex relative"
              title="Compare"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full ios-press"
              >
                <GitCompareArrows className="h-4 w-4" />
              </Button>
              {compareCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="h-8 rounded-full text-xs px-4 ios-press hidden sm:inline-flex"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </motion.header>

      {/* ═══════════════ MOBILE BOTTOM TAB BAR ═══════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-bottom safe-bottom">
        <div className="flex items-stretch justify-around h-16">
          {mobileTabs.map((tab) => {
            const active = isActive(tab.href, pathname);
            const Icon = tab.icon;

            // If "Saved" and not signed in, wrap in SignInButton
            if (tab.href === "/saved" && !isSignedIn) {
              return (
                <SignInButton key={tab.href} mode="modal">
                  <button className="flex flex-1 flex-col items-center justify-center gap-0.5 ios-press text-muted-foreground">
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
                </SignInButton>
              );
            }

            // If "Profile" and not signed in, wrap in SignInButton
            if (tab.href === "/profile" && !isSignedIn) {
              return (
                <SignInButton key={tab.href} mode="modal">
                  <button className="flex flex-1 flex-col items-center justify-center gap-0.5 ios-press text-muted-foreground">
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
                </SignInButton>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 ios-press transition-colors duration-200 ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`h-5 w-5 ${
                      active && tab.href === "/saved" ? "fill-current" : ""
                    }`}
                  />
                  {/* Compare badge on Colleges tab */}
                  {tab.href === "/colleges" && compareCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                      {compareCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
