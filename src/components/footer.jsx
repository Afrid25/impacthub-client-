import Link from "next/link";
import { Mail, Phone, MapPin, X, ChevronRight } from "lucide-react";

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navLinks = [
  { name: "Upcoming Events", href: "/upcoming-events" },
  { name: "Create Event", href: "/events/create" },
  { name: "Manage Events", href: "/manage-events" },
  { name: "Joined Events", href: "/joined-events" },
  { name: "Login", href: "/login" },
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: <FacebookIcon /> },
  { name: "Instagram", href: "#", icon: <InstagramIcon /> },
  { name: "LinkedIn", href: "#", icon: <LinkedinIcon /> },
  { name: "X", href: "#", icon: <X className="h-5 w-5" /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Branding column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl">
                IH
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                ImpactHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A social development events platform connecting volunteers with
              community service initiatives. Together, we make a difference.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">
              Platform
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name} <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community column */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events/create"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Create an Event <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Events <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/joined-events"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Joined Events <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div className="text-foreground font-medium">
                    hello@impacthub.org
                  </div>
                  <div className="text-muted-foreground">
                    Support & inquiries
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div className="text-foreground font-medium">
                    +880 1234 567890
                  </div>
                  <div className="text-muted-foreground">
                    Mon - Fri, 9 AM - 6 PM
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div className="text-foreground font-medium">
                    Dhaka, Bangladesh
                  </div>
                  <div className="text-muted-foreground">
                    Community Service Hub
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Follow us on:
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="h-10 w-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 ImpactHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
