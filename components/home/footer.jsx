"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@public/townspark_logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/shristi.poudel.1276",
    label: "Facebook",
  },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@townspark.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer id="about" className="bg-muted/30 border-t w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* 1. Branding Section (Left) */}
          <div className="flex-1 max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src={logo}
                  alt="Townspark"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Townspark</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Bridging the gap between residents and local authorities to build
              better communities together.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-background border hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 3. Links Section (Right) */}
          <div className="md:text-right">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* 2. Newsletter Section (Middle - Fills the spread) */}
          <div className="flex-1 max-w-md">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new features and community updates.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-background" />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Townspark. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for better
            communities
          </p>
        </div>
      </div>
    </footer>
  );
}
