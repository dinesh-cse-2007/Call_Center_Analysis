import { useMemo } from 'react';
import {
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  Clock,
  Smile,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';

type KpiData = {
  totalCalls: number;
  avgDuration: number;
  avgSatisfaction: number;
  resolvedRate: number;
  inbound: number;
  outbound: number;
};

function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
  return `${seconds}s`;
}

function KpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight">
        {value}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      <div className="text-xs text-gray-400 mt-2">{sublabel}</div>
    </div>
  );
}

export function KpiCards({ kpis }: { kpis: KpiData }) {
  const inboundPct = kpis.totalCalls > 0
    ? Math.round((kpis.inbound / kpis.totalCalls) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Calls"
        value={kpis.totalCalls.toLocaleString()}
        sublabel={`${inboundPct}% inbound · ${100 - inboundPct}% outbound`}
        icon={Phone}
        accent="#2563eb"
      />
      <KpiCard
        label="Avg. Call Duration"
        value={formatTime(kpis.avgDuration)}
        sublabel="Across all calls"
        icon={Clock}
        accent="#06b6d4"
      />
      <KpiCard
        label="Avg. Satisfaction"
        value={`${kpis.avgSatisfaction} / 5`}
        sublabel="Customer rating"
        icon={Smile}
        accent="#10b981"
      />
      <KpiCard
        label="Resolution Rate"
        value={`${kpis.resolvedRate}%`}
        sublabel="Calls resolved on first contact"
        icon={CheckCircle2}
        accent="#f59e0b"
      />
    </div>
  );
}
