"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Browse Listings" },
    { href: "/listings/new", label: "List a Business" },
    { href: "/calculator", label: "Calculator" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SBA Platform
        </Link>
        <div className="flex gap-6">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
