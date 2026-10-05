import { useEffect, useState, useCallback } from 'react';
import {
  Phone,
  Headphones,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Agent,
  CallRecord,
} from '@/lib/types';
import {
  computeKpis,
  computeAgentStats,
  computeCategoryStats,
  computeTimeBuckets,
} from '@/lib/analytics';
import { KpiCards } from '@/components/KpiCards';
import { CallVolumeChart } from '@/components/CallVolumeChart';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { AgentLeaderboard } from '@/components/AgentLeaderboard';
import { RecentCallsTable } from '@/components/RecentCallsTable';
import { SatisfactionChart } from '@/components/SatisfactionChart';

type TeamFilter = 'all' | string;

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [agentsRes, callsRes] = await Promise.all([
        supabase.from('agents').select('*').order('name'),
        supabase
          .from('calls')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000),
      ]);

      if (agentsRes.error) throw agentsRes.error;
      if (callsRes.error) throw callsRes.error;

      setAgents(agentsRes.data || []);
      setCalls(callsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const teams = [...new Set(agents.map((a) => a.team))].sort();

  const filteredAgents =
    teamFilter === 'all'
      ? agents
      : agents.filter((a) => a.team === teamFilter);

  const filteredAgentIds = new Set(filteredAgents.map((a) => a.id));
  const filteredCalls = calls.filter((c) => filteredAgentIds.has(c.agent_id));

  const kpis = computeKpis(filteredCalls);
  const agentStats = computeAgentStats(filteredAgents, filteredCalls);
  const categoryStats = computeCategoryStats(filteredCalls);
  const timeBuckets = computeTimeBuckets(filteredCalls, 30);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading call center data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Couldn't load data
          </h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Headphones size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 tracking-tight">
                  Call Center Analytics
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Real-time performance dashboard
                </p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Team filter */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Overview
            </h2>
            <p className="text-sm text-gray-400">
              {kpis.totalCalls} calls · {filteredAgents.length} agents
              {teamFilter !== 'all' && ` · ${teamFilter} team`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">
              Filter by team
            </span>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setTeamFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  teamFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              {teams.map((team) => (
                <button
                  key={team}
                  onClick={() => setTeamFilter(team)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    teamFilter === team
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards kpis={kpis} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CallVolumeChart buckets={timeBuckets} />
          </div>
          <div>
            <CategoryBreakdown categories={categoryStats} />
          </div>
        </div>

        {/* Agent leaderboard */}
        <AgentLeaderboard stats={agentStats} />

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentCallsTable calls={filteredCalls} agents={filteredAgents} />
          </div>
          <div>
            <SatisfactionChart stats={agentStats} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-gray-400">
          Call Center Analytics · Data updates on refresh
        </div>
      </main>
    </div>
  );
}
