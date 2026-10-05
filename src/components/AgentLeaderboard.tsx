import { AgentStats } from '@/lib/types';
import { formatTime, getInitials } from '@/lib/analytics';
import { Star } from 'lucide-react';

export function AgentLeaderboard({ stats }: { stats: AgentStats[] }) {
  const maxCalls = Math.max(...stats.map((s) => s.totalCalls), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Agent Performance
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Ranked by total call volume
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="text-left font-semibold text-gray-400 px-6 py-3 text-xs uppercase tracking-wider">
                Agent
              </th>
              <th className="text-left font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider">
                Team
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider">
                Calls
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider hidden md:table-cell">
                Avg Duration
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider hidden sm:table-cell">
                CSAT
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider">
                Resolved
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr
                key={s.agent.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: s.agent.avatar_color }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: s.agent.avatar_color }}
                    >
                      {getInitials(s.agent.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {s.agent.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {s.agent.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {s.agent.team}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden hidden lg:block">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(s.totalCalls / maxCalls) * 100}%`,
                          backgroundColor: s.agent.avatar_color,
                        }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {s.totalCalls}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-right text-gray-600 tabular-nums hidden md:table-cell">
                  {formatTime(s.avgDuration)}
                </td>
                <td className="px-3 py-4 hidden sm:table-cell">
                  <div className="flex items-center justify-end gap-1.5">
                    <Star
                      size={14}
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
                </td>
                <td className="px-3 py-4 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium tabular-nums ${
                      s.resolvedRate >= 70
                        ? 'bg-green-50 text-green-700'
                        : s.resolvedRate >= 50
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {s.resolvedRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
