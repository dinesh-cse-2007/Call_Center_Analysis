import { CallRecord, Agent } from '@/lib/types';
import { formatDateTime, formatTime } from '@/lib/analytics';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, XCircle } from 'lucide-react';

export function RecentCallsTable({
  calls,
  agents,
}: {
  calls: CallRecord[];
  agents: Agent[];
}) {
  const agentMap = new Map(agents.map((a) => [a.id, a]));
  const sorted = [...calls]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Calls</h3>
        <p className="text-sm text-gray-400 mt-0.5">Latest call activity</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="text-left font-semibold text-gray-400 px-6 py-3 text-xs uppercase tracking-wider">
                Caller
              </th>
              <th className="text-left font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider hidden sm:table-cell">
                Agent
              </th>
              <th className="text-left font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider">
                Duration
              </th>
              <th className="text-center font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">
                Direction
              </th>
              <th className="text-right font-semibold text-gray-400 px-3 py-3 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-right font-semibold text-gray-400 px-6 py-3 text-xs uppercase tracking-wider hidden xl:table-cell">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((call) => {
              const agent = agentMap.get(call.agent_id);
              return (
                <tr
                  key={call.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {call.caller_name || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400 sm:hidden">
                      {call.category}
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      {agent && (
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: agent.avatar_color }}
                        >
                          {agent.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      )}
                      <span className="text-gray-600 truncate max-w-[120px]">
                        {agent?.name || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <span className="text-gray-600">{call.category}</span>
                  </td>
                  <td className="px-3 py-4 text-right text-gray-600 tabular-nums">
                    {formatTime(call.duration_seconds)}
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1.5 text-gray-500">
                      {call.call_direction === 'inbound' ? (
                        <>
                          <ArrowDownLeft size={14} className="text-blue-500" />
                          <span className="text-xs">Inbound</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight size={14} className="text-cyan-500" />
                          <span className="text-xs">Outbound</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    {call.resolved ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle2 size={14} />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <XCircle size={14} />
                        Unresolved
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-xs tabular-nums hidden xl:table-cell">
                    {formatDateTime(call.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
