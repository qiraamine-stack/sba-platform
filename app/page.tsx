import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Buy a Business with an SBA Loan
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Value any small business, calculate your SBA loan payments, and browse
            SBA-eligible businesses for sale — all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/listings"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition">
              Browse Businesses
            </Link>
            <Link href="/calculator"
              className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
              Try the Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to buy a business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Business Valuation",
                desc: "Get an instant valuation using SDE, EBITDA, and industry multiples. Know what a business is really worth."
              },
              {
                icon: "🏦",
                title: "SBA Loan Calculator",
                desc: "Calculate your monthly payments, down payment, and check SBA 7(a) eligibility in seconds."
              },
              {
                icon: "🏪",
                title: "Listings Marketplace",
                desc: "Browse SBA-eligible businesses for sale. Filter by industry, price, and location."
              }
            ].map(f => (
              <div key={f.title} className="bg-white rounded-xl shadow p-8 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to find your next business?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            Join buyers and sellers using SBA Platform to make smarter acquisition decisions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/listings/new"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
              List Your Business
            </Link>
            <Link href="/listings"
              className="border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}