"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "qiraamine@gmail.com";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { router.push("/login"); return; }
    const parsed = JSON.parse(user);
    if (parsed.email !== ADMIN_EMAIL) { router.push("/"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const [uRes, lRes] = await Promise.all([
      fetch("https://web-production-19eab.up.railway.app/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch("https://web-production-19eab.up.railway.app/api/admin/listings", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);
    if (uRes.ok) setUsers(await uRes.json());
    if (lRes.ok) setListings(await lRes.json());
    setLoading(false);
  };

  const fmt = (n: number) => n ? "$" + n.toLocaleString() : "N/A";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading admin dashboard...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">buywithsba.com</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              const csv = ["Email,Name,Role,Joined"].concat(
                users.map(u => `${u.email},${u.full_name},${u.role},${new Date(u.created_at).toLocaleDateString()}`)
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "users.csv"; a.click();
            }} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Export Users CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-600" },
            { label: "Total Listings", value: listings.length, color: "bg-green-50 text-green-600" },
            { label: "Buyers", value: users.filter(u => u.role === "buyer").length, color: "bg-purple-50 text-purple-600" },
            { label: "Sellers", value: users.filter(u => u.role === "seller").length, color: "bg-orange-50 text-orange-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color.split(" ")[1]}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["overview", "users", "listings"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 shadow"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Name", "Email", "Role", "Joined"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "seller" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-gray-400 py-8">No users yet</p>}
          </div>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Title", "Price", "Industry", "Seller", "Email", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{fmt(l.asking_price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{l.industry}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{l.seller_name}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{l.seller_email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listings.length === 0 && <p className="text-center text-gray-400 py-8">No listings yet</p>}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
              {users.slice(-5).reverse().map(u => (
                <div key={u.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.full_name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.role === "seller" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>{u.role}</span>
                </div>
              ))}
              {users.length === 0 && <p className="text-gray-400 text-sm">No users yet</p>}
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Listings</h2>
              {listings.slice(-5).reverse().map(l => (
                <div key={l.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{l.title}</p>
                    <p className="text-xs text-gray-500">{l.seller_email}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{fmt(l.asking_price)}</span>
                </div>
              ))}
              {listings.length === 0 && <p className="text-gray-400 text-sm">No listings yet</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
