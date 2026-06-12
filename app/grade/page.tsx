"use client";
import { useState } from "react";

const INDUSTRY_MULTIPLES: Record<string, number> = {
  restaurant: 1.5, retail: 2.0, service: 2.5, healthcare: 3.0,
  technology: 4.0, manufacturing: 3.5, construction: 2.5,
  transportation: 2.0, other: 2.5
};

export default function GradePage() {
  const [form, setForm] = useState({
    asking_price: "", annual_revenue: "", sde: "",
    ebitda: "", monthly_expenses: "", monthly_rent: "",
    year_established: "", industry: "other",
    real_estate_included: false
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handle = (e: any) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const grade = async () => {
    setLoading(true);
    const price = +form.asking_price;
    const revenue = +form.annual_revenue;
    const sde = +form.sde;
    const ebitda = +form.ebitda;
    const monthlyExpenses = +form.monthly_expenses;
    const monthlyRent = +form.monthly_rent;
    const industry = form.industry;
    const benchmarkMultiple = INDUSTRY_MULTIPLES[industry] || 2.5;
    const actualMultiple = sde > 0 ? price / sde : 0;
    const revenueMultiple = revenue > 0 ? price / revenue : 0;
    const annualExpenses = (monthlyExpenses + monthlyRent) * 12;
    const annualNetIncome = sde > 0 ? sde : (ebitda > 0 ? ebitda : revenue * 0.2);
    const monthlyLoanPayment = price * 0.9 * (0.115 / 12) / (1 - Math.pow(1 + 0.115/12, -120));
    const annualDebtService = monthlyLoanPayment * 12;
    const dscr = annualDebtService > 0 ? annualNetIncome / annualDebtService : 0;
    let priceScore = 10;
    if (actualMultiple > 0) {
      const priceDiff = (actualMultiple - benchmarkMultiple) / benchmarkMultiple;
      if (priceDiff > 0.5) priceScore = 2;
      else if (priceDiff > 0.3) priceScore = 4;
      else if (priceDiff > 0.1) priceScore = 6;
      else if (priceDiff > -0.1) priceScore = 8;
      else priceScore = 10;
    }
    let dscrScore = 5;
    if (dscr >= 2.0) dscrScore = 10;
    else if (dscr >= 1.5) dscrScore = 8;
    else if (dscr >= 1.25) dscrScore = 6;
    else if (dscr >= 1.0) dscrScore = 4;
    else dscrScore = 2;
    const age = new Date().getFullYear() - (+form.year_established || new Date().getFullYear() - 3);
    let ageScore = 5;
    if (age >= 10) ageScore = 10;
    else if (age >= 5) ageScore = 8;
    else if (age >= 3) ageScore = 6;
    else ageScore = 4;
    const finalGrade = Math.round((priceScore * 0.4 + dscrScore * 0.4 + ageScore * 0.2) * 10) / 10;
    const fairValue = sde * benchmarkMultiple;
    const lowValue = sde * (benchmarkMultiple - 0.5);
    const highValue = sde * (benchmarkMultiple + 0.5);
    let priceRating = "Fair";
    let priceColor = "text-yellow-600 bg-yellow-50";
    if (actualMultiple > benchmarkMultiple * 1.3) { priceRating = "Overpriced"; priceColor = "text-red-600 bg-red-50"; }
    else if (actualMultiple < benchmarkMultiple * 0.8) { priceRating = "Great Deal"; priceColor = "text-green-600 bg-green-50"; }
    else if (actualMultiple > benchmarkMultiple * 1.1) { priceRating = "Slightly High"; priceColor = "text-orange-600 bg-orange-50"; }
    else if (actualMultiple < benchmarkMultiple * 0.9) { priceRating = "Good Value"; priceColor = "text-blue-600 bg-blue-50"; }

    const gradeData = {
      finalGrade, priceScore, dscrScore, ageScore,
      actualMultiple: Math.round(actualMultiple * 100) / 100,
      benchmarkMultiple, revenueMultiple: Math.round(revenueMultiple * 100) / 100,
      dscr: Math.round(dscr * 100) / 100,
      fairValue: Math.round(fairValue), lowValue: Math.round(lowValue), highValue: Math.round(highValue),
      priceRating, priceColor, monthlyLoanPayment: Math.round(monthlyLoanPayment),
      industry, price, revenue, sde, annualNetIncome
    };

    try {
      const aiRes = await fetch("/api/grade-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gradeData)
      });
      const aiData = await aiRes.json();
      setResult({ ...gradeData, summary: aiData.summary });
    } catch {
      setResult({ ...gradeData, summary: "Unable to generate AI summary at this time." });
    }
    setLoading(false);
  };

  const fmt = (n: number) => n ? "$" + Math.round(n).toLocaleString() : "N/A";
  const gradeColor = (g: number) => g >= 8 ? "text-green-600" : g >= 6 ? "text-blue-600" : g >= 4 ? "text-yellow-600" : "text-red-600";
  const gradeLabel = (g: number) => g >= 8 ? "Excellent Buy" : g >= 6 ? "Good Deal" : g >= 4 ? "Proceed with Caution" : "Avoid";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Deal Analyzer</h1>
          <p className="text-gray-500 text-lg">Enter any business numbers and get an instant grade, valuation range, and AI-powered analysis</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Asking Price", name: "asking_price", placeholder: "500000" },
              { label: "Annual Revenue", name: "annual_revenue", placeholder: "300000" },
              { label: "SDE / Owner Earnings", name: "sde", placeholder: "120000" },
              { label: "EBITDA", name: "ebitda", placeholder: "100000" },
              { label: "Monthly Expenses", name: "monthly_expenses", placeholder: "15000" },
              { label: "Monthly Rent", name: "monthly_rent", placeholder: "3000" },
              { label: "Year Established", name: "year_established", placeholder: "2015" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
                <input type="number" name={f.name} value={(form as any)[f.name]}
                  onChange={handle} placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Industry</label>
              <select name="industry" value={form.industry} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                {["restaurant","retail","service","healthcare","technology","manufacturing","construction","transportation","other"]
                  .map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="real_estate_included" id="re"
              checked={form.real_estate_included} onChange={handle} className="w-4 h-4" />
            <label htmlFor="re" className="text-sm text-gray-700">Real estate included in asking price</label>
          </div>
        </div>

        <button onClick={grade} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-lg mb-8">
          {loading ? "Analyzing Deal..." : "Analyze This Deal"}
        </button>

        {result && (
          <div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white text-center" id="share-card">
              <p className="text-blue-200 text-sm mb-1">buywithsba.com — Deal Analyzer</p>
              <p className="text-4xl font-black mb-1">{result.finalGrade}/10</p>
              <p className="text-xl font-bold mb-3">{gradeLabel(result.finalGrade)}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <p className="text-xs text-blue-200">Price Rating</p>
                  <p className="font-bold text-sm">{result.priceRating}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <p className="text-xs text-blue-200">SDE Multiple</p>
                  <p className="font-bold text-sm">{result.actualMultiple}x</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <p className="text-xs text-blue-200">DSCR</p>
                  <p className="font-bold text-sm">{result.dscr}</p>
                </div>
              </div>
              {result.summary && <p className="text-blue-100 text-sm italic">"{result.summary}"</p>}
            </div>
            {showShare && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Share This Analysis</h3>
                  <p className="text-sm text-gray-500 mb-5">Choose where to share</p>
                  {[
                    { name: "WhatsApp", color: "bg-green-500 hover:bg-green-600", icon: "💬", url: `https://wa.me/?text=${encodeURIComponent(`Business Deal Analysis\nGrade: ${result.finalGrade}/10 — ${gradeLabel(result.finalGrade)}\nPrice Rating: ${result.priceRating}\nSDE Multiple: ${result.actualMultiple}x\nDSCR: ${result.dscr}\nFair Value: ${fmt(result.fairValue)}\n\n"${result.summary}"\n\nAnalyze any business free at buywithsba.com/grade`)}` },
                    { name: "Facebook", color: "bg-blue-600 hover:bg-blue-700", icon: "👥", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://buywithsba.com/grade")}&quote=${encodeURIComponent(`Business Grade: ${result.finalGrade}/10 — ${result.priceRating}. ${result.summary}`)}` },
                    { name: "Twitter / X", color: "bg-black hover:bg-gray-800", icon: "🐦", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just analyzed a business on @buywithsba\n\nGrade: ${result.finalGrade}/10 — ${gradeLabel(result.finalGrade)}\n${result.priceRating} at ${result.actualMultiple}x SDE\n\n"${result.summary}"\n\nAnalyze yours free:`)} &url=${encodeURIComponent("https://buywithsba.com/grade")}` },
                    { name: "Email", color: "bg-gray-600 hover:bg-gray-700", icon: "✉️", url: `mailto:?subject=${encodeURIComponent(`Business Deal Analysis — Grade ${result.finalGrade}/10`)}&body=${encodeURIComponent(`Here is a business deal analysis from buywithsba.com\n\nGrade: ${result.finalGrade}/10 — ${gradeLabel(result.finalGrade)}\nPrice Rating: ${result.priceRating}\nSDE Multiple: ${result.actualMultiple}x (industry avg ${result.benchmarkMultiple}x)\nDSCR: ${result.dscr}\nFair Value: ${fmt(result.fairValue)}\n\nAI Analysis: "${result.summary}"\n\nAnalyze any business free at https://buywithsba.com/grade`)}` },
                  ].map(s => (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                      onClick={() => setShowShare(false)}
                      className={`flex items-center gap-3 w-full text-white font-semibold py-3 px-4 rounded-xl mb-3 transition ${s.color}`}>
                      <span className="text-xl">{s.icon}</span>
                      <span>Share on {s.name}</span>
                    </a>
                  ))}
                  <button onClick={() => setShowShare(false)}
                    className="w-full text-gray-500 text-sm py-2 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button onClick={() => setShowShare(true)}
              className="w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition">
              Share This Analysis
            </button>
            <div className="bg-white rounded-xl shadow p-8 mb-6 text-center">
              <p className="text-gray-500 mb-2">Overall Grade</p>
              <p className={`text-8xl font-black mb-2 ${gradeColor(result.finalGrade)}`}>{result.finalGrade}</p>
              <p className="text-2xl font-bold text-gray-400 mb-4">/ 10</p>
              <p className={`text-xl font-bold px-6 py-2 rounded-full inline-block ${gradeColor(result.finalGrade)} bg-opacity-10`}>
                {gradeLabel(result.finalGrade)}
              </p>
              {result.summary && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-800 mb-1">AI Analysis</p>
                  <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">Price Rating</p>
                <p className={`text-xl font-bold px-4 py-1 rounded-full inline-block ${result.priceColor}`}>{result.priceRating}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">SDE Multiple</p>
                <p className="text-xl font-bold text-gray-900">{result.actualMultiple}x <span className="text-sm text-gray-400">vs {result.benchmarkMultiple}x avg</span></p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-sm text-gray-500 mb-1">DSCR</p>
                <p className={`text-xl font-bold ${result.dscr >= 1.25 ? "text-green-600" : "text-red-600"}`}>{result.dscr} <span className="text-sm text-gray-400">(min 1.25)</span></p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Valuation Range</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Low End</p>
                  <p className="text-2xl font-bold text-red-600">{fmt(result.lowValue)}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Fair Value</p>
                  <p className="text-2xl font-bold text-green-600">{fmt(result.fairValue)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">High End</p>
                  <p className="text-2xl font-bold text-blue-600">{fmt(result.highValue)}</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-3">Asking price: {fmt(result.price)} · Monthly SBA payment: {fmt(result.monthlyLoanPayment)}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h2>
              {[
                { label: "Price vs Market", score: result.priceScore, desc: `${result.actualMultiple}x vs ${result.benchmarkMultiple}x industry average` },
                { label: "Cash Flow (DSCR)", score: result.dscrScore, desc: `DSCR of ${result.dscr} — ${result.dscr >= 1.25 ? "meets" : "below"} SBA minimum` },
                { label: "Business Maturity", score: result.ageScore, desc: `Established ${form.year_established || "recently"}` },
              ].map(s => (
                <div key={s.label} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{s.label}</span>
                    <span className="text-sm font-bold text-gray-900">{s.score}/10</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${s.score >= 7 ? "bg-green-500" : s.score >= 5 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${s.score * 10}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
