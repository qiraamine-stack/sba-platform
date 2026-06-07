"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/listings/${industry ? `?industry=${industry}` : ""}`)
      .then(r => r.json())
      .then(data => { setListings(data); setLoading(false); });
  }, [industry]);

  const fmt = (n: number) => "$" + n?.toLocaleString();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Businesses for Sale</h1>
            <p className="text-gray-500 mt-1">SBA-eligible businesses ready for acquisition</p>
          </div>
          <Link href="/listings/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            + List Your Business
          </Link>
        </div>

        <div className="mb-6">
          <select value={industry} onChange={e => setIndustry(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
            <option value="">All Industries</option>
            {["restaurant","retail","service","healthcare","technology","manufacturing","construction","transportation","other"]
              .map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading listings...</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No listings yet</p>
            <Link href="/listings/new" className="text-blue-600 font-medium">Be the first to list a business →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-6 block">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full capitalize">
                    {l.industry}
                  </span>
                  {l.sba_eligible && (
                    <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">
                      SBA Eligible
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{l.title}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{l.description}</p>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <p className="text-2xl font-bold text-gray-900">{fmt(l.asking_price)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {l.location} · Est. {l.year_established}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}