"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: "",
    min_price: "",
    max_price: "",
    location: "",
    sba_eligible: "",
  });

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.industry) params.append("industry", filters.industry);
    if (filters.min_price) params.append("min_price", filters.min_price);
    if (filters.max_price) params.append("max_price", filters.max_price);
    if (filters.sba_eligible) params.append("sba_eligible", filters.sba_eligible);
    const res = await fetch(`https://web-production-19eab.up.railway.app/api/listings/?${params}`);
    const data = await res.json();
    let results = data;
    if (filters.location) {
      results = data.filter((l: any) =>
        l.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    setListings(results);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const handle = (e: any) => setFilters({ ...filters, [e.target.name]: e.target.value });

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

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Filter Listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Industry</label>
              <select name="industry" value={filters.industry} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                <option value="">All Industries</option>
                {["restaurant","retail","service","healthcare","technology","manufacturing","construction","transportation","other"]
                  .map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input type="number" name="min_price" value={filters.min_price} onChange={handle}
                placeholder="$0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input type="number" name="max_price" value={filters.max_price} onChange={handle}
                placeholder="No limit"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Location</label>
              <input type="text" name="location" value={filters.location} onChange={handle}
                placeholder="City or State"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SBA Eligible</label>
              <select name="sba_eligible" value={filters.sba_eligible} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                <option value="">All</option>
                <option value="true">SBA Eligible Only</option>
                <option value="false">Not SBA Eligible</option>
              </select>
            </div>
          </div>
          <button onClick={fetchListings}
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Apply Filters
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading listings...</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No listings match your filters</p>
            <button onClick={() => { setFilters({ industry: "", min_price: "", max_price: "", location: "", sba_eligible: "" }); fetchListings(); }}
              className="text-blue-600 font-medium">Clear filters</button>
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
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-2xl font-bold text-gray-900">{fmt(l.asking_price)}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-400">{l.location} · Est. {l.year_established}</p>
                    <p className="text-xs text-gray-400">Revenue: {fmt(l.annual_revenue)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}