type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: string;
};

export default function StatCard({
  label,
  value,
  change,
  icon,
}: StatCardProps) {
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