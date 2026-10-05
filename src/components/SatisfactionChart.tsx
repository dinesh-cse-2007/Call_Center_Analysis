import { AgentStats } from '@/lib/types';
import { formatTime } from '@/lib/analytics';
import { Star, Clock, CheckCircle2 } from 'lucide-react';

export function SatisfactionChart({ stats }: { stats: AgentStats[] }) {
  const filtered = stats.filter((s) => s.totalCalls > 0);
  const maxSat = 5;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900">
        Satisfaction by Agent
      </h3>
      <p className="text-sm text-gray-400 mt-0.5 mb-5">
        Average customer satisfaction score (1–5)
      </p>
      <div className="space-y-3">
        {filtered.slice(0, 6).map((s) => (
          <div key={s.agent.id} className="group">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-700 font-medium truncate pr-2">
                {s.agent.name}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Star
                  size={13}
                  className={
                    s.avgSatisfaction >= 4
                      ? 'fill-amber-400 text-amber-400'
                      : s.avgSatisfaction >= 3
                      ? 'fill-amber-300 text-amber-300'
                      : 'fill-gray-300 text-gray-300'
                  }
                />
                <span className="font-semibold text-gray-900 tabular-nums">
                  {s.avgSatisfaction}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                style={{
                  width: `${(s.avgSatisfaction / maxSat) * 100}%`,
                  backgroundColor: s.agent.avatar_color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
