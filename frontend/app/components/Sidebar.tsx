"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Barang", href: "/barang" },
    { name: "Penjualan", href: "/penjualan" },
    { name: "Pelanggan", href: "/pelanggan" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Inventory System</h2>
      </div>

      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`block px-4 py-3 hover:bg-gray-700 transition-colors ${
                  pathname === item.href
                    ? "bg-gray-700 border-l-4 border-white"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
