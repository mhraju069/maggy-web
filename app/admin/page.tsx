import Link from "next/link";

const stats = [
  { label: "Today's Total", value: "0", sub: "Reservations", color: "text-[#CFB9A3]" },
  { label: "Upcoming", value: "2", sub: "Confirmed bookings", color: "text-green-500" },
  { label: "Active Codes", value: "1", sub: "Sauna access codes", color: "text-blue-500" },
  { label: "Pending", value: "1", sub: "Pay-on-site", color: "text-yellow-500" },
];

const schedule = [
  { time: "3:00 PM", dur: "38 min", title: "Lunchroom Reservation", guest: "Sophie Anderson • 3 guests", status: "On-site", statusColor: "text-yellow-600 bg-yellow-50" },
  { time: "3:00 PM", dur: "58 min", title: "Yoga Class", guest: "Michael Lee • 8 guests", status: "Paid", statusColor: "text-green-600 bg-green-50" },
  { time: "3:00 PM", dur: "15 min", title: "Shared Sauna", guest: "Emily Chen • 6 guests", status: "Paid", statusColor: "text-green-600 bg-green-50" },
  { time: "3:00 PM", dur: "38 min", title: "Wellness Arrangement", guest: "Ben Davis • 2 guests", status: "Paid", statusColor: "text-green-600 bg-green-50" },
  { time: "3:00 PM", dur: "15 min", title: "Private Sauna", guest: "Jordan Smith • 2 guests", status: "On-site", statusColor: "text-yellow-600 bg-yellow-50" },
  { time: "3:00 PM", dur: "15 min", title: "Private Sauna", guest: "Oliver James • 1 guests", status: "Paid", statusColor: "text-green-600 bg-green-50" },
];

const services = ["Private Sauna", "Shared Sauna", "Lunchroom Reservation", "Yoga Class"];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Dashboard</h1>
      </div>
      <p className="text-xs text-gray-400 mb-5">Your operational overview</p>

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

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Link href="/admin/reservations" className="rounded-xl p-4 bg-gradient-to-br from-[#CFB9A3] to-[#8b7355] text-white text-sm font-semibold flex items-center gap-2">
          📋 View All Reservations
        </Link>
        <Link href="/admin/availability" className="rounded-xl p-4 bg-gradient-to-br from-green-400 to-green-600 text-white text-sm font-semibold flex items-center gap-2">
          📅 Manage Availability
        </Link>
        <Link href="/admin/access-codes" className="rounded-xl p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-semibold flex items-center gap-2">
          🔑 View Access Codes
        </Link>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 gap-4">
        {/* Schedule */}
        <div className="bg-white rounded-xl border border-[#E8E2DC] overflow-hidden">
          <p className="px-5 py-3 text-sm font-semibold text-[#1d1a17] border-b border-[#E8E2DC]">Today&apos;s Schedule</p>
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center px-5 py-2.5 border-b border-[#F5F0EB] last:border-0">
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-bold text-[#1d1a17]">{s.time}</p>
                <p className="text-[10px] text-gray-400">{s.dur}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#1d1a17]">{s.title}</p>
                <p className="text-[10px] text-gray-400">{s.guest}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.statusColor}`}>{s.status}</span>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl border border-[#E8E2DC] overflow-hidden">
          <p className="px-5 py-3 text-sm font-semibold text-[#1d1a17] border-b border-[#E8E2DC]">Services Active Today</p>
          {services.map((s) => (
            <div key={s} className="flex items-center justify-between px-5 py-2.5 border-b border-[#F5F0EB] last:border-0">
              <p className="text-xs text-[#1d1a17]">{s}</p>
              <p className="text-[10px] text-gray-400">0 bookings</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
