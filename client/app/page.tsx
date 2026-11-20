"use client";
import StatCard from "./components/StatCard";
import { useEffect, useState } from "react";
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
  occurredAt: string;
  status: "Open" | "Investigating" | "Resolved";
  blocked: boolean;
  description: string;
};

/* =========================
   DEMO DATA
========================= */

const mockNow = Date.now();

const mockAlerts: Alert[] = [
  {
    id: "ALT-2048",
    threat: "Multiple failed login attempts",
    source: "192.168.1.105",
    severity: "Critical",
    occurredAt: new Date(mockNow - 2 * 60_000).toISOString(),
    status: "Open",
    blocked: false,
    description:
      "A burst of failed sign-in attempts was detected against an administrative account.",
  },
  {
    id: "ALT-2047",
    threat: "Suspicious network activity",
    source: "10.0.0.24",
    severity: "High",
    occurredAt: new Date(mockNow - 8 * 60_000).toISOString(),
    status: "Investigating",
    blocked: false,
    description:
      "Outbound connections to an unusual destination were flagged for analyst review.",
  },
  {
    id: "ALT-2046",
    threat: "Unusual outbound traffic",
    source: "172.16.0.18",
    severity: "Medium",
    occurredAt: new Date(mockNow - 15 * 60_000).toISOString(),
    status: "Open",
    blocked: false,
    description:
      "Traffic volume from this host exceeded its normal baseline.",
  },
  {
    id: "ALT-2045",
    threat: "Repeated access attempt",
    source: "192.168.1.44",
    severity: "Low",
    occurredAt: new Date(mockNow - 32 * 60_000).toISOString(),
    status: "Resolved",
    blocked: true,
    description:
      "Repeated access to a restricted endpoint was denied and the event was contained.",
  },
  {
    id: "ALT-2044",
    threat: "Malware signature detected",
    source: "10.0.0.61",
    severity: "Critical",
    occurredAt: new Date(mockNow - 3 * 60 * 60_000).toISOString(),
    status: "Investigating",
    blocked: false,
    description:
      "An endpoint scan matched a known malware signature. The device is being investigated.",
  },
  {
    id: "ALT-2043",
    threat: "Potential data exfiltration",
    source: "172.16.0.52",
    severity: "High",
    occurredAt: new Date(mockNow - 9 * 60 * 60_000).toISOString(),
    status: "Open",
    blocked: false,
    description:
      "A large data transfer to an external host was detected outside normal business hours.",
  },
  {
    id: "ALT-2042",
    threat: "Unrecognized device on network",
    source: "192.168.1.209",
    severity: "Medium",
    occurredAt: new Date(mockNow - 2 * 24 * 60 * 60_000).toISOString(),
    status: "Resolved",
    blocked: true,
    description:
      "A device not previously seen on the network was isolated pending verification.",
  },
  {
    id: "ALT-2041",
    threat: "Outdated endpoint protection",
    source: "10.0.0.88",
    severity: "Low",
    occurredAt: new Date(mockNow - 5 * 24 * 60 * 60_000).toISOString(),
    status: "Resolved",
    blocked: false,
    description:
      "Endpoint protection definitions are out of date and need to be refreshed.",
  },
];

const activityData = [35, 55, 40, 75, 45, 90, 60, 38, 68, 50, 82, 42];

const severityOptions: { label: Severity; color: string }[] = [
  { label: "Critical", color: "bg-red-500" },
  { label: "High", color: "bg-orange-500" },
  { label: "Medium", color: "bg-yellow-500" },
  { label: "Low", color: "bg-blue-500" },
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

function formatTime(occurredAt: string) {
  const minutesAgo = Math.max(
    0,
    Math.floor(    (mockNow - new Date(occurredAt).getTime()) / 60_000)
  );

  if (minutesAgo < 1) return "Just now";
  if (minutesAgo < 60) return `${minutesAgo} min ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hr ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
}

/* =========================
   REUSABLE COMPONENTS
========================= */

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

function StatusBadge({ status }: { status: Alert["status"] }) {
  const style =
    status === "Open"
      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      : status === "Investigating"
        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
        : "bg-green-500/10 text-green-400 border-green-500/20";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${style}`}>
      {status}
    </span>
  );
}

type AlertTableProps = {
  data: Alert[];
  selectedSeverities: Severity[];
  onToggleSeverity: (severity: Severity) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onSelectAlert: (alert: Alert) => void;
};

function AlertTable({
  data,
  selectedSeverities,
  onToggleSeverity,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  onSelectAlert,
}: AlertTableProps) {
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-white/5 p-5">
        <div className="flex flex-wrap gap-2">
          {severityOptions.map(({ label }) => {
            const isSelected = selectedSeverities.includes(label);

            return (
              <button
                key={label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleSeverity(label)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? severityStyle(label)
                    : "border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-500">
            Date
            <select
              value={dateRange}
              onChange={(event) => onDateRangeChange(event.target.value)}
              className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-gray-300 outline-none focus:border-cyan-500/50"
            >
              <option value="all">All time</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-500">
            Status
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-gray-300 outline-none focus:border-cyan-500/50"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-gray-500">
            <tr>
              <th className="px-5 py-4 font-medium">Alert ID</th>
              <th className="px-5 py-4 font-medium">Threat</th>
              <th className="px-5 py-4 font-medium">Source IP</th>
              <th className="px-5 py-4 font-medium">Severity</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Time</th>
            </tr>
          </thead>

          <tbody>
            {data.map((alert) => (
              <tr
                key={alert.id}
                tabIndex={0}
                aria-label={`View details for ${alert.threat}`}
                onClick={() => onSelectAlert(alert)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectAlert(alert);
                  }
                }}
                className="cursor-pointer border-t border-white/5 transition hover:bg-white/[0.02] focus:bg-white/[0.04] focus:outline-none"
              >
                <td className="px-5 py-4 text-gray-500">{alert.id}</td>
                <td className="px-5 py-4 text-gray-200">{alert.threat}</td>
                <td className="px-5 py-4 font-mono text-gray-400">
                  {alert.source}
                </td>
                <td className="px-5 py-4">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={alert.status} />
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {formatTime(alert.occurredAt)}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                  No alerts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AlertDetailsDialog({
  alert,
  onClose,
}: {
  alert: Alert | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!alert) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-details-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-[#101827] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{alert.id}</p>
            <h2 id="alert-details-title" className="mt-1 text-xl font-semibold">
              {alert.threat}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close alert details"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <SeverityBadge severity={alert.severity} />
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-300">
            {alert.status}
          </span>
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-300">
          {alert.description}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
          <div>
            <dt className="text-gray-500">Source IP</dt>
            <dd className="mt-1 font-mono text-gray-200">{alert.source}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Detected</dt>
            <dd className="mt-1 text-gray-200">
              {new Date(alert.occurredAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Response</dt>
            <dd className="mt-1 text-gray-200">
              {alert.blocked ? "Blocked" : "No automated action"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/* =========================
   DASHBOARD PAGE
========================= */

type AlertTableControls = Omit<AlertTableProps, "data">;

function DashboardContent({
  filteredAlerts,
  tableControls,
  stats,
  severityData,
}: {
  filteredAlerts: Alert[];
  tableControls: AlertTableControls;
  stats: { label: string; value: string; change: string; icon: string }[];
  severityData: { label: Severity; count: number; width: string; color: string }[];
}) {
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

        <AlertTable data={filteredAlerts} {...tableControls} />
      </div>
    </>
  );
}

/* =========================
   OTHER PAGES
========================= */

function ThreatDetectionContent({
  filteredAlerts,
  tableControls,
}: {
  filteredAlerts: Alert[];
  tableControls: AlertTableControls;
}) {
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
          value={String(
            filteredAlerts.filter((alert) => alert.severity === "Critical").length
          )}
          change="Immediate attention"
          icon="⚠"
        />

        <StatCard
          label="High-risk threats"
          value={String(
            filteredAlerts.filter((alert) => alert.severity === "High").length
          )}
          change="Investigation recommended"
          icon="◈"
        />

        <StatCard
          label="Threats detected"
          value={String(filteredAlerts.length)}
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

        <AlertTable data={filteredAlerts} {...tableControls} />
      </div>
    </div>
  );
}

function SecurityEventsContent({
  filteredAlerts,
  tableControls,
}: {
  filteredAlerts: Alert[];
  tableControls: AlertTableControls;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
      <div className="border-b border-white/10 p-5">
        <h3 className="font-semibold">Security Events</h3>

        <p className="mt-1 text-sm text-gray-500">
          Search and review recorded security events.
        </p>
      </div>

      <AlertTable data={filteredAlerts} {...tableControls} />
    </div>
  );
}

function AnalyticsContent({
  stats,
}: {
  stats: { label: string; value: string; change: string; icon: string }[];
}) {
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
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>(
    severityOptions.map(({ label }) => label)
  );
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const rangeInDays =
    dateRange === "24h" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : null;

  const filteredAlerts = mockAlerts.filter((alert) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      alert.threat.toLowerCase().includes(query) ||
      alert.source.toLowerCase().includes(query) ||
      alert.severity.toLowerCase().includes(query) ||
      alert.status.toLowerCase().includes(query) ||
      alert.id.toLowerCase().includes(query) ||
      alert.description.toLowerCase().includes(query);
    const isInDateRange =
      rangeInDays === null ||
      new Date(alert.occurredAt).getTime() >=
        mockNow - rangeInDays * 24 * 60 * 60_000;

    return (
      matchesSearch &&
      selectedSeverities.includes(alert.severity) &&
      isInDateRange &&
      (statusFilter === "All" || alert.status === statusFilter)
    );
  });

  const activeThreats = filteredAlerts.filter(
    (alert) => alert.status !== "Resolved"
  );
  const blockedThreats = filteredAlerts.filter((alert) => alert.blocked);
  const severityPenalty = activeThreats.reduce((penalty, alert) => {
    const severityWeight: Record<Severity, number> = {
      Critical: 15,
      High: 8,
      Medium: 3,
      Low: 1,
    };
    return penalty + severityWeight[alert.severity];
  }, 0);
  const securityScore = Math.max(0, 100 - severityPenalty);
  const stats = [
    {
      label: "Events monitored",
      value: filteredAlerts.length.toLocaleString(),
      change: "Matching current filters",
      icon: "◈",
    },
    {
      label: "Active threats",
      value: activeThreats.length.toLocaleString(),
      change: "Open or investigating",
      icon: "⚠",
    },
    {
      label: "Threats blocked",
      value: blockedThreats.length.toLocaleString(),
      change: "Contained demo alerts",
      icon: "⬡",
    },
    {
      label: "Security score",
      value: `${securityScore}/100`,
      change: "Based on active severity",
      icon: "◉",
    },
  ];
  const severityData = severityOptions.map(({ label, color }) => {
    const count = filteredAlerts.filter(
      (alert) => alert.severity === label
    ).length;
    const width =
      filteredAlerts.length === 0
        ? "0%"
        : `${(count / filteredAlerts.length) * 100}%`;
    return { label, count, width, color };
  });

  const tableControls: AlertTableControls = {
    selectedSeverities,
    onToggleSeverity: (severity) => {
      setSelectedSeverities((current) =>
        current.includes(severity)
          ? current.filter((item) => item !== severity)
          : [...current, severity]
      );
    },
    dateRange,
    onDateRangeChange: setDateRange,
    statusFilter,
    onStatusFilterChange: setStatusFilter,
    onSelectAlert: setSelectedAlert,
  };

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return (
          <DashboardContent
            filteredAlerts={filteredAlerts}
            tableControls={tableControls}
            stats={stats}
            severityData={severityData}
          />
        );

      case "Threat Detection":
        return (
          <ThreatDetectionContent
            filteredAlerts={filteredAlerts}
            tableControls={tableControls}
          />
        );

      case "Security Events":
        return (
          <SecurityEventsContent
            filteredAlerts={filteredAlerts}
            tableControls={tableControls}
          />
        );

      case "Analytics":
        return <AnalyticsContent stats={stats} />;

      default:
        return (
          <DashboardContent
            filteredAlerts={filteredAlerts}
            tableControls={tableControls}
            stats={stats}
            severityData={severityData}
          />
        );
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
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-800 bg-[#111827] px-3 py-2 sm:flex-none">
              <Search size={16} className="text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threats..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 sm:w-40"
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
      <AlertDetailsDialog
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </main>
  );
}