import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  platform: [
    { href: "/colleges", label: "Browse Colleges" },
    { href: "/compare", label: "Compare Colleges" },
    { href: "/predictor", label: "College Predictor" },
    { href: "/saved", label: "Saved Colleges" },
  ],
  resources: [
    { href: "#", label: "Blog" },
    { href: "#", label: "Career Guide" },
    { href: "#", label: "Exam Calendar" },
    { href: "#", label: "Scholarship Finder" },
  ],
  legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">CampusLens</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover, compare, and choose the perfect college for your future.
              Data-driven decisions for your academic journey.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CampusLens. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for students across India
          </p>
        </div>
      </div>
    </footer>
  );
}
