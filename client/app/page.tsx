import {
  Shield,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Lock,
} from "lucide-react";

const alerts = [
  {
    id: "ALT-2048",
    threat: "Multiple failed login attempts",
    source: "192.168.1.105",
    severity: "Critical",
    time: "2 min ago",
  },
  {
    id: "ALT-2047",
    threat: "Suspicious network activity",
    source: "10.0.0.24",
    severity: "High",
    time: "8 min ago",
  },
  {
    id: "ALT-2046",
    threat: "Unusual outbound traffic",
    source: "172.16.0.18",
    severity: "Medium",
    time: "15 min ago",
  },
  {
    id: "ALT-2045",
    threat: "Repeated access attempt",
    source: "192.168.1.44",
    severity: "Low",
    time: "32 min ago",
  },
];

const stats = [
  { label: "Events monitored", value: "24,891", change: "+12.8%", icon: "◈" },
  { label: "Active threats", value: "18", change: "+3 today", icon: "⚠" },
  { label: "Threats blocked", value: "1,284", change: "+8.2%", icon: "⬡" },
  { label: "Security score", value: "94/100", change: "Excellent", icon: "◉" },
];

function severityStyle(severity: string) {
  switch (severity) {
    case "Critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "High":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080d16] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#0b111c] p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-black">
           <Shield size={22} />
          </div>
          <div>
            <h1 className="font-semibold text-lg">CyberSentinel</h1>
            <p className="text-xs text-gray-500">AI Security Platform</p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
          Workspace
        </p>
        <nav className="space-y-2">
          <div className="rounded-lg bg-cyan-500/10 text-cyan-400 px-4 py-3 flex items-center gap-3">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          <div className="px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg flex items-center gap-3 cursor-pointer transition">
            <ShieldAlert size={18} />
            <span>Threat Detection</span>
          </div>

          <div className="px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg flex items-center gap-3 cursor-pointer transition">
            <Activity size={18} />
            <span>Security Events</span>
          </div>

          <div className="px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg flex items-center gap-3 cursor-pointer transition">
            <ChartNoAxesCombined size={18} />
            <span>Analytics</span>
          </div>
        </nav>

        <div className="mt-auto rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-sm font-medium text-cyan-400">AI Engine</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">System operational</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-5 md:p-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">Security Operations Center</p>
            <h2 className="text-2xl md:text-3xl font-semibold mt-1">
              Dashboard Overview
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-800 bg-[#111827] px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search threats..."
              className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
          <button className="relative rounded-xl border border-gray-800 bg-[#111827] p-3 text-gray-400 hover:text-white transition">
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-[#101827] px-4 py-2 text-sm text-gray-400">
              ◉ Live Monitoring
            </div>
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-semibold">
              SR
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#101827] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{stat.label}</p>
                <span className="text-cyan-400">{stat.icon}</span>
              </div>

              <h3 className="text-2xl font-semibold mt-4">{stat.value}</h3>
              <p className="text-xs text-cyan-400 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Threat overview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-[#101827] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Threat Activity</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Security events monitored
                </p>
              </div>
              <span className="text-xs text-gray-500">Last 24 hours</span>
            </div>

            <div className="flex h-48 items-end gap-3">
              {[35, 55, 40, 75, 45, 90, 60, 38, 68, 50, 82, 42].map(
                (height, index) => (
                  <div key={index} className="flex flex-1 flex-col justify-end h-full">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                )
              )}
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-3">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Threat severity */}
          <div className="rounded-xl border border-white/10 bg-[#101827] p-6">
            <h3 className="font-semibold">Threat Severity</h3>
            <p className="text-sm text-gray-500 mt-1">Current distribution</p>

            <div className="space-y-5 mt-8">
              {[
                { label: "Critical", count: 4, width: "20%", color: "bg-red-500" },
                { label: "High", count: 7, width: "45%", color: "bg-orange-500" },
                { label: "Medium", count: 5, width: "35%", color: "bg-yellow-500" },
                { label: "Low", count: 2, width: "15%", color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent alerts */}
        <div className="rounded-xl border border-white/10 bg-[#101827] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div>
              <h3 className="font-semibold">Recent Security Alerts</h3>
              <p className="text-sm text-gray-500 mt-1">
                Latest detected security events
              </p>
            </div>
            <button className="text-sm text-cyan-400 hover:text-cyan-300">
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-4 font-medium">Alert ID</th>
                  <th className="px-5 py-4 font-medium">Threat</th>
                  <th className="px-5 py-4 font-medium">Source IP</th>
                  <th className="px-5 py-4 font-medium">Severity</th>
                  <th className="px-5 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-gray-500">{alert.id}</td>
                    <td className="px-5 py-4 text-gray-200">{alert.threat}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono">{alert.source}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${severityStyle(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{alert.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          CyberSentinel AI · Security monitoring dashboard · Demo data
        </p>
      </section>
    </main>
  );
}
