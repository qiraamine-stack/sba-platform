"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const links = [
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
        <div className="flex items-center gap-6">
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
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hi, {user.full_name?.split(" ")[0]}</span>
              <button onClick={logout}
                className="text-sm text-gray-600 hover:text-red-500 transition">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                Sign In
              </Link>
              <Link href="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}