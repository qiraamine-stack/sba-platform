"use client";
import { useState } from "react";

export default function CalculatorPage() {
  const [form, setForm] = useState({
    revenue: "", cogs: "", operating_expenses: "",
    owners_salary: "", owners_benefits: "", one_time_expenses: "",
    industry: "other", business_price: "", down_payment_pct: "10",
    annual_net_income: ""
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const calculate = async () => {
    setLoading(true);
    const [valRes, loanRes] = await Promise.all([
      fetch("https://web-production-19eab.up.railway.app/api/calculator/valuate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenue: +form.revenue, cogs: +form.cogs,
          operating_expenses: +form.operating_expenses,
          owners_salary: +form.owners_salary,
          owners_benefits: +form.owners_benefits,
          one_time_expenses: +form.one_time_expenses,
          industry: form.industry
        })
      }),
      fetch("https://web-production-19eab.up.railway.app/api/calculator/loan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_price: +form.business_price,
          down_payment_pct: +form.down_payment_pct / 100,
          annual_net_income: +form.annual_net_income
        })
      })
    ]);
    const val = await valRes.json();
    const loan = await loanRes.json();
    setResults({ val, loan });
    setLoading(false);
  };

  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SBA Business Valuation Calculator</h1>
        <p className="text-gray-500 mb-8">Enter business financials to get a valuation and SBA loan estimate</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Business Financials</h2>
            {[
              { label: "Annual Revenue", name: "revenue" },
              { label: "Cost of Goods Sold (COGS)", name: "cogs" },
              { label: "Operating Expenses", name: "operating_expenses" },
              { label: "Owner's Salary", name: "owners_salary" },
              { label: "Owner's Benefits", name: "owners_benefits" },
              { label: "One-Time Expenses", name: "one_time_expenses" },
            ].map(f => (
              <div key={f.name} className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
                <input type="number" name={f.name} value={(form as any)[f.name]}
                  onChange={handle} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Industry</label>
              <select name="industry" value={form.industry} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["restaurant","retail","service","healthcare","technology","manufacturing","construction","transportation","other"]
                  .map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">SBA Loan Details</h2>
            {[
              { label: "Business Asking Price", name: "business_price" },
              { label: "Annual Net Income", name: "annual_net_income" },
            ].map(f => (
              <div key={f.name} className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
                <input type="number" name={f.name} value={(form as any)[f.name]}
                  onChange={handle} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Down Payment %</label>
              <input type="number" name="down_payment_pct" value={form.down_payment_pct}
                onChange={handle} min="10" max="30"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <button onClick={calculate} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition mb-8">
          {loading ? "Calculating..." : "Calculate Valuation & SBA Loan"}
        </button>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Business Valuation</h2>
              <p className="text-sm text-gray-500 mb-1">Seller's Discretionary Earnings (SDE)</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">{fmt(results.val.sde)}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["low","mid","high"].map(k => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase">{k}</p>
                    <p className="font-bold text-gray-800">{fmt(results.val.valuation[k])}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Industry multiple: {results.val.valuation.multiple_used}x</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">SBA 7(a) Loan</h2>
              {[
                { label: "Down Payment", val: results.loan.loan.down_payment },
                { label: "Loan Amount", val: results.loan.loan.loan_amount },
                { label: "Monthly Payment", val: results.loan.loan.monthly_payment },
                { label: "Total Interest", val: results.loan.loan.total_interest },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{r.label}</span>
                  <span className="font-semibold text-gray-900">{fmt(r.val)}</span>
                </div>
              ))}
              <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${results.loan.eligibility.eligible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {results.loan.eligibility.eligible ? "✅ SBA Eligible" : "❌ " + results.loan.eligibility.issues[0]}
              </div>
              {results.loan.dscr && (
                <p className="text-xs text-gray-400 mt-2">DSCR: {results.loan.dscr.dscr} — {results.loan.dscr.message}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}