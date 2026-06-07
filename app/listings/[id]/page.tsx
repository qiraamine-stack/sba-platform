"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/listings/${id}`)
      .then(r => r.json())
      .then(data => { setListing(data); setLoading(false); });
  }, [id]);

  const fmt = (n: number) => "$" + n?.toLocaleString();

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  if (!listing) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Listing not found</p></div>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/listings" className="text-sm text-blue-600 hover:underline mb-6 block">← Back to listings</Link>

        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full capitalize">{listing.industry}</span>
                {listing.sba_eligible && <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">✅ SBA Eligible</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-gray-500 mt-1">{listing.location} · Est. {listing.year_established}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{fmt(listing.asking_price)}</p>
              <p className="text-sm text-gray-400">Asking Price</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{listing.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h2>
            {[
              { label: "Annual Revenue", val: listing.annual_revenue },
              { label: "Annual Net Income", val: listing.annual_net_income },
              { label: "Asking Price", val: listing.asking_price },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{r.label}</span>
                <span className="font-semibold text-gray-900">{fmt(r.val)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Info</h2>
            {[
              { label: "Industry", val: listing.industry },
              { label: "Location", val: listing.location },
              { label: "Employees", val: listing.employees },
              { label: "Year Established", val: listing.year_established },
              { label: "Reason for Sale", val: listing.reason_for_sale },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{r.label}</span>
                <span className="font-semibold text-gray-900 capitalize">{r.val || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Run SBA Loan Calculator</h2>
            <p className="text-sm text-gray-600">See if you can finance this business with an SBA loan</p>
          </div>
          <Link href={`/calculator?price=${listing.asking_price}&income=${listing.annual_net_income}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            Calculate Loan →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Seller</h2>
          <p className="text-gray-600">{listing.seller_name}</p>
          <a href={`mailto:${listing.seller_email}`} className="text-blue-600 hover:underline text-sm">{listing.seller_email}</a>
        </div>
      </div>
    </main>
  );
}