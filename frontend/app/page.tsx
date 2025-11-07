"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalPenjualan: 0,
    totalPelanggan: 0,
  });

  // In a real app, you would fetch these stats from your API
  useEffect(() => {
    // Example API calls to get summary stats
    // const fetchStats = async () => {
    //   const [barangRes, penjualanRes, pelangganRes] = await Promise.all([
    //     fetch('/api/barang/stats'),
    //     fetch('/api/penjualan/stats'),
    //     fetch('/api/pelanggan/stats')
    //   ]);
    //
    //   const [barangData, penjualanData, pelangganData] = await Promise.all([
    //     barangRes.json(),
    //     penjualanRes.json(),
    //     pelangganRes.json()
    //   ]);
    //
    //   setStats({
    //     totalBarang: barangData.total,
    //     totalPenjualan: penjualanData.total,
    //     totalPelanggan: pelangganData.total
    //   });
    // };
    //
    // fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to your inventory management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Barang
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalBarang}
            </p>
            <Link
              href="/barang"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Penjualan
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalPenjualan}
            </p>
            <Link
              href="/penjualan"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Pelanggan
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalPelanggan}
            </p>
            <Link
              href="/pelanggan"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/barang"
              className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-gray-800">Manage Barang</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add, edit, or delete items
              </p>
            </Link>

            <Link
              href="/penjualan"
              className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-gray-800">Manage Penjualan</h3>
              <p className="text-sm text-gray-600 mt-1">
                Process sales transactions
              </p>
            </Link>

            <Link
              href="/pelanggan"
              className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-gray-800">Manage Pelanggan</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and manage customers
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
