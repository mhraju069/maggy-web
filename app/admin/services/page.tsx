const SERVICES = [
  { name: "Private Sauna", type: "Sauna", desc: "Exclusive private sauna experience with essential oils and premium amenities", features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"], duration: "120 min", price: "€75", capacity: "1 guests", status: "Active" },
  { name: "Shared Sauna", type: "Sauna", desc: "Traditional Finnish sauna experience in a shared, peaceful environment", features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"], duration: "60 min", price: "€15", capacity: "1 guests", status: "Active" },
  { name: "Lunchroom", type: "Sauna", desc: "Farm-to-table dining experience with locally sourced organic ingredients", features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"], duration: "90 min", price: "€45", capacity: "10 guests", status: "Active" },
  { name: "Activity", type: "Sauna", desc: "Guided yoga sessions for all levels in our tranquil studio", features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"], duration: "60 min", price: "€25", capacity: "15 guests", status: "Active" },
  { name: "Arrangement", type: "Sauna", desc: "Complete wellness journey combining sauna, massage, and mindfulness", features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"], duration: "180 min", price: "€120", capacity: "4 guests", status: "Active" },
];

const stats = [
  { label: "Total Services", value: "5", sub: "5 active", color: "text-blue-500" },
  { label: "Total Capacity", value: "31", sub: "Guests per session", color: "text-green-500" },
  { label: "Avg Price", value: "€65", sub: "Per service", color: "text-purple-500" },
  { label: "Avg Duration", value: "102", sub: "Minutes", color: "text-orange-500" },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Services Management</h1>
          <p className="text-xs text-gray-400">Manage your wellness services, pricing, and availability</p>
        </div>
        <button className="px-4 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-xs font-semibold rounded-lg transition-colors">+ Add Services</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#E8E2DC]">
            <p className={`text-xs font-semibold mb-1 ${s.color}`}>{s.label}</p>
            <p className="text-2xl font-bold text-[#1d1a17]">{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl border border-[#E8E2DC] p-5">
        <p className="text-sm font-semibold text-[#1d1a17] mb-4">All Services</p>
        <div className="flex flex-col gap-4">
          {SERVICES.map((s) => (
            <div key={s.name} className="border border-[#F1EDE8] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1d1a17] font-displayPlayFair">{s.name}</span>
                  <span className="px-2 py-0.5 text-[10px] bg-[#F3EDE6] text-[#8b7355] rounded-full">{s.type}</span>
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-[10px] border border-[#E8E2DC] rounded-lg text-[#8b7355] hover:bg-[#FAF7F4] transition-colors">✏ Edit</button>
                  <button className="px-3 py-1 text-[10px] border border-[#E8E2DC] rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">🔒 Disable</button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">{s.desc}</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {s.features.map((f) => <span key={f} className="px-2 py-0.5 text-[10px] bg-[#F5F0EB] text-gray-500 rounded-full">{f}</span>)}
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[["Duration", s.duration], ["Price", s.price], ["Capacity", s.capacity], ["Status", s.status]].map(([k, v]) => (
                  <div key={k}><p className="text-gray-400 text-[10px]">{k}</p><p className="font-semibold text-[#1d1a17]">{v}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
