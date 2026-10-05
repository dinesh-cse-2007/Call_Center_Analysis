import { Agent, CallRecord } from './types';

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function formatTime(seconds: number): string {
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

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function computeAgentStats(
  agents: Agent[],
  calls: CallRecord[]
) {
  return agents
    .map((agent) => {
      const agentCalls = calls.filter((c) => c.agent_id === agent.id);
      const totalCalls = agentCalls.length;
      const avgDuration =
        totalCalls > 0
          ? Math.round(
              agentCalls.reduce((sum, c) => sum + c.duration_seconds, 0) /
                totalCalls
            )
          : 0;
      const avgSatisfaction =
        totalCalls > 0
          ? +(agentCalls.reduce((sum, c) => sum + c.satisfaction_score, 0) /
              totalCalls).toFixed(2)
          : 0;
      const resolvedRate =
        totalCalls > 0
          ? Math.round(
              (agentCalls.filter((c) => c.resolved).length / totalCalls) * 100
            )
          : 0;
      const inbound = agentCalls.filter((c) => c.call_direction === 'inbound')
        .length;
      const outbound = agentCalls.filter(
        (c) => c.call_direction === 'outbound'
      ).length;

      return {
        agent,
        totalCalls,
        avgDuration,
        avgSatisfaction,
        resolvedRate,
        inbound,
        outbound,
      };
    })
    .sort((a, b) => b.totalCalls - a.totalCalls);
}

export function computeCategoryStats(calls: CallRecord[]) {
  const categories = [...new Set(calls.map((c) => c.category))];
  return categories
    .map((category) => {
      const catCalls = calls.filter((c) => c.category === category);
      const count = catCalls.length;
      const avgSatisfaction = +(
        catCalls.reduce((s, c) => s + c.satisfaction_score, 0) / count
      ).toFixed(2);
      const resolvedRate = Math.round(
        (catCalls.filter((c) => c.resolved).length / count) * 100
      );
      const totalDuration = catCalls.reduce(
        (s, c) => s + c.duration_seconds,
        0
      );
      return { category, count, avgSatisfaction, resolvedRate, totalDuration };
    })
    .sort((a, b) => b.count - a.count);
}

export function computeTimeBuckets(calls: CallRecord[], days: number = 30) {
  const now = new Date();
  const buckets: { label: string; date: string; count: number; totalSat: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().split('T')[0];
    buckets.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: key,
      count: 0,
      totalSat: 0,
    });
  }

  const bucketMap = new Map(buckets.map((b) => [b.date, b]));

  for (const call of calls) {
    const key = new Date(call.created_at).toISOString().split('T')[0];
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket.count++;
      bucket.totalSat += call.satisfaction_score;
    }
  }

  return buckets.map((b) => ({
    label: b.label,
    date: b.date,
    count: b.count,
    avgSatisfaction: b.count > 0 ? +(b.totalSat / b.count).toFixed(2) : 0,
  }));
}

export function computeKpis(calls: CallRecord[]) {
  const totalCalls = calls.length;
  const avgDuration =
    totalCalls > 0
      ? Math.round(
          calls.reduce((s, c) => s + c.duration_seconds, 0) / totalCalls
        )
      : 0;
  const avgSatisfaction =
    totalCalls > 0
      ? +(
          calls.reduce((s, c) => s + c.satisfaction_score, 0) / totalCalls
        ).toFixed(2)
      : 0;
  const resolvedRate =
    totalCalls > 0
      ? Math.round((calls.filter((c) => c.resolved).length / totalCalls) * 100)
      : 0;
  const inbound = calls.filter((c) => c.call_direction === 'inbound').length;
  const outbound = calls.filter((c) => c.call_direction === 'outbound').length;

  return {
    totalCalls,
    avgDuration,
    avgSatisfaction,
    resolvedRate,
    inbound,
    outbound,
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
