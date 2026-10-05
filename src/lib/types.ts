export type Agent = {
  id: string;
  name: string;
  team: string;
  role: string;
  status: string;
  avatar_color: string;
  hired_at: string;
};

export type CallRecord = {
  id: string;
  agent_id: string;
  caller_name: string | null;
  category: string;
  duration_seconds: number;
  satisfaction_score: number;
  resolved: boolean;
  call_direction: 'inbound' | 'outbound';
  created_at: string;
};

export type AgentStats = {
  agent: Agent;
  totalCalls: number;
  avgDuration: number;
  avgSatisfaction: number;
  resolvedRate: number;
  inbound: number;
  outbound: number;
};

export type CategoryStats = {
  category: string;
  count: number;
  avgSatisfaction: number;
  resolvedRate: number;
  totalDuration: number;
};

export type TimeBucket = {
  label: string;
  date: string;
  count: number;
  avgSatisfaction: number;
};
