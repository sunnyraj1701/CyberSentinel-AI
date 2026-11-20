"use client";

import { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  ChartNoAxesCombined,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Severity = "Critical" | "High" | "Medium" | "Low";

type Alert = {
  id: string;
  threat: string;
  source: string;
  severity: Severity;
  time: string;
};

/* =========================
   DEMO DATA
========================= */

const alerts: Alert[] = [
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
  {
    label: "Events monitored",
    value: "24,891",
    change: "+12.8%",
    icon: "◈",
  },
  {
    label: "Active threats",
    value: "18",
    change: "+3 today",
    icon: "⚠",
  },
  {
    label: "Threats blocked",
    value: "1,284",
    change: "+8.2%",
    icon: "⬡",
  },
  {
    label: "Security score",
    value: "94/100",
    change: "Excellent",
    icon: "◉",
  },
];

const activityData = [35, 55, 40, 75, 45, 90, 60, 38, 68, 50, 82, 42];

const severityData = [
  { label: "Critical", count: 4, width: "20%", color: "bg-red-500" },
  { label: "High", count: 7, width: "45%", color: "bg-orange-500" },
  { label: "Medium", count: 5, width: "35%", color: "bg-yellow-500" },
  { label: "Low", count: 2, width: "15%", color: "bg-blue-500" },
];

/* =========================
   NAVIGATION
========================= */

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Threat Detection",
    icon: ShieldAlert,
  },
  {
    name: "Security Events",
    icon: Activity,
  },
  {
    name: "Analytics",
    icon: ChartNoAxesCombined,
  },
];

/* =========================
   HELPER FUNCTIONS
========================= */

function severityStyle(severity: Severity) {
  switch (severity) {
    case "Critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    case "High":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";

    case "Medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    case "Low":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function StatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101827] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <span className="text-cyan-400">{icon}</span>
      </div>

      <h3 className="mt-4 text-2xl font-semibold">{value}</h3>

      <p className="mt-2 text-xs text-cyan-400">{change}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${severityStyle(
        severity
      )}`}
    >
      {severity}
    </span>
  );
}

function AlertTable({ data }: { data: Alert[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/[0.02] text-gray-500">
          <tr>
            <th className="px-5 py-4 font-medium">Alert ID</th>
            <th className="px-5 py-4 font-medium">Threat</th>
            <th className="px-5 py-4 font-medium">Source IP</th>
            <th className="px-5 py-4 font-medium">Severity</th>
            <th className="px-5 py-4 font-medium">Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map((alert) => (
            <tr
              key={alert.id}
              className="border-t border-white/5 transition hover:bg-white/[0.02]"
            >
              <td className="px-5 py-4 text-gray-500">{alert.id}</td>

              <td className="px-5 py-4 text-gray-200">{alert.threat}</td>

              <td className="px-5 py-4 font-mono text-gray-400">
                {alert.source}
              </td>

              <td className="px-5 py-4">
                <SeverityBadge severity={alert.severity} />
              </td>

              <td className="px-5 py-4 text-gray-500">{alert.time}</td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                No alerts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   DASHBOARD PAGE
========================= */

function DashboardContent({ filteredAlerts }: { filteredAlerts: Alert[] }) {
  return (
    <>
      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Activity chart */}
        <div className="rounded-xl border border-white/10 bg-[#101827] p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Threat Activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Security events monitored
              </p>
            </div>

            <span className="text-xs text-gray-500">Last 24 hours</span>
          </div>

          <div className="flex h-48 items-end gap-3">
            {activityData.map((height, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  style={{ height: `${height}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 transition hover:opacity-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Severity chart */}
        <div className="rounded-xl border border-white/10 bg-[#101827] p-6">
          <h3 className="font-semibold">Threat Severity</h3>

          <p className="mt-1 text-sm text-gray-500">Current distribution</p>

          <div className="mt-8 space-y-5">
            {severityData.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">{item.label}</span>
                  <span>{item.count}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
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

      {/* Alerts */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
        <div className="border-b border-white/10 p-5">
          <h3 className="font-semibold">Recent Security Alerts</h3>

          <p className="mt-1 text-sm text-gray-500">
            Latest detected security events
          </p>
        </div>

        <AlertTable data={filteredAlerts} />
      </div>
    </>
  );
}

/* =========================
   OTHER PAGES
========================= */

function ThreatDetectionContent({ filteredAlerts }: { filteredAlerts: Alert[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-400" size={24} />

          <div>
            <h3 className="font-semibold">Threat Detection Center</h3>

            <p className="mt-1 text-sm text-gray-400">
              Monitor and investigate detected threats.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Critical threats"
          value="4"
          change="Immediate attention"
          icon="⚠"
        />

        <StatCard
          label="High-risk threats"
          value="7"
          change="Investigation recommended"
          icon="◈"
        />

        <StatCard
          label="Threats detected"
          value="18"
          change="Today"
          icon="⬡"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
        <div className="border-b border-white/10 p-5">
          <h3 className="font-semibold">Detected Threats</h3>
          <p className="mt-1 text-sm text-gray-500">
            Threats requiring investigation
          </p>
        </div>

        <AlertTable data={filteredAlerts} />
      </div>
    </div>
  );
}

function SecurityEventsContent({ filteredAlerts }: { filteredAlerts: Alert[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
      <div className="border-b border-white/10 p-5">
        <h3 className="font-semibold">Security Events</h3>

        <p className="mt-1 text-sm text-gray-500">
          Search and review recorded security events.
        </p>
      </div>

      <AlertTable data={filteredAlerts} />
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#101827] p-6">
        <h3 className="font-semibold">Security Analytics</h3>

        <p className="mt-2 text-sm text-gray-500">
          Overview of security activity and threat distribution.
        </p>

        <div className="mt-8 flex h-56 items-end gap-3">
          {activityData.map((height, index) => (
            <div
              key={index}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div
                style={{ height: `${height}%` }}
                className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN APPLICATION
========================= */

export default function Home() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    const query = searchQuery.toLowerCase();

    return (
      alert.threat.toLowerCase().includes(query) ||
      alert.source.toLowerCase().includes(query) ||
      alert.severity.toLowerCase().includes(query) ||
      alert.id.toLowerCase().includes(query)
    );
  });

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <DashboardContent filteredAlerts={filteredAlerts} />;

      case "Threat Detection":
        return <ThreatDetectionContent filteredAlerts={filteredAlerts} />;

      case "Security Events":
        return <SecurityEventsContent filteredAlerts={filteredAlerts} />;

      case "Analytics":
        return <AnalyticsContent />;

      default:
        return <DashboardContent filteredAlerts={filteredAlerts} />;
    }
  }

  return (
    <main className="flex min-h-screen bg-[#080d16] text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0b111c] p-6 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-black">
            <Shield size={22} />
          </div>

          <div>
            <h1 className="text-lg font-semibold">CyberSentinel</h1>

            <p className="text-xs text-gray-500">AI Security Platform</p>
          </div>

          <button
            className="ml-auto text-gray-400 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
          Workspace
        </p>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* AI Engine status */}
        <div className="mt-auto rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-sm font-medium text-cyan-400">AI Engine</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />

            <span className="text-xs text-gray-400">System operational</span>
          </div>
        </div>
      </aside>

      {/* Main section */}
      <section className="min-w-0 flex-1 p-5 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-white/10 bg-[#111827] p-2 text-gray-400 md:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-sm text-gray-500">
                Security Operations Center
              </p>

              <h2 className="mt-1 text-2xl font-semibold md:text-3xl">
                {activePage === "Dashboard"
                  ? "Dashboard Overview"
                  : activePage}
              </h2>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-gray-800 bg-[#111827] px-3 py-2 md:flex">
              <Search size={16} className="text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threats..."
                className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {/* Notification */}
            <button className="relative rounded-xl border border-gray-800 bg-[#111827] p-3 text-gray-400 transition hover:text-white">
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
            </button>

            {/* Monitoring status */}
            <div className="hidden items-center rounded-xl border border-gray-800 bg-[#111827] px-4 py-2 text-sm text-gray-400 sm:flex">
              <span className="mr-2 text-cyan-400">◉</span>
              Live Monitoring
            </div>

            {/* Profile */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 font-semibold text-cyan-400">
              SR
            </div>
          </div>
        </header>

        {/* Page content */}
        {renderPage()}

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-600">
          CyberSentinel AI · Security monitoring platform · Demo data
        </p>
      </section>
    </main>
  );
}