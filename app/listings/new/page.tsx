"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", industry: "other",
    location: "", asking_price: "", annual_revenue: "",
    annual_net_income: "", year_established: "",
    employees: "", reason_for_sale: "",
    seller_name: "", seller_email: ""
  });

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    const res = await fetch("https://web-production-19eab.up.railway.app/api/listings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        asking_price: +form.asking_price,
        annual_revenue: +form.annual_revenue,
        annual_net_income: +form.annual_net_income,
        year_established: +form.year_established,
        employees: +form.employees,
      })
    });
    const data = await res.json();
    if (data.id) router.push(`/listings/${data.id}`);
    setLoading(false);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Business</h1>
        <p className="text-gray-500 mb-8">Fill in your business details to create a listing</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h2>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Business Title</label>
            <input name="title" value={form.title} onChange={handle}
              placeholder="e.g. Profitable Pizza Restaurant in Austin" className={inputClass} />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handle}
              rows={3} placeholder="Describe your business..."
              className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Industry</label>
              <select name="industry" value={form.industry} onChange={handle} className={inputClass}>
                {["restaurant","retail","service","healthcare","technology","manufacturing","construction","transportation","other"]
                  .map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handle}
                placeholder="City, State" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Year Established</label>
              <input type="number" name="year_established" value={form.year_established}
                onChange={handle} placeholder="2010" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Employees</label>
              <input type="number" name="employees" value={form.employees}
                onChange={handle} placeholder="5" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Financials</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Asking Price</label>
              <input type="number" name="asking_price" value={form.asking_price}
                onChange={handle} placeholder="500000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Annual Revenue</label>
              <input type="number" name="annual_revenue" value={form.annual_revenue}
                onChange={handle} placeholder="300000" className={inputClass} />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Annual Net Income</label>
            <input type="number" name="annual_net_income" value={form.annual_net_income}
              onChange={handle} placeholder="100000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Reason for Sale</label>
            <input name="reason_for_sale" value={form.reason_for_sale} onChange={handle}
              placeholder="Retirement, relocation, etc." className={inputClass} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Info</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Name</label>
              <input name="seller_name" value={form.seller_name} onChange={handle}
                placeholder="John Smith" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Email</label>
              <input name="seller_email" value={form.seller_email} onChange={handle}
                placeholder="john@example.com" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
          {loading ? "Creating listing..." : "Create Listing"}
        </button>
      </div>
    </main>
  );
}