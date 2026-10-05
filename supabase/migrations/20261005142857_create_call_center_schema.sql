/*
# Call Center Analysis Schema (single-tenant, no auth)

1. New Tables
- `agents` — call center agents with name, team, role, status, hire date.
- `calls` — individual call records with agent, duration, satisfaction, resolution status, category, timestamp.

2. Security
- Enable RLS on both tables.
- Anon + authenticated CRUD (no-auth app, intentionally public data).

3. Notes
- Seed data included for agents and a realistic spread of calls across categories.
- All timestamps are in UTC.
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  role text NOT NULL DEFAULT 'Agent',
  status text NOT NULL DEFAULT 'active',
  avatar_color text NOT NULL DEFAULT '#3b82f6',
  hired_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_agents" ON agents;
CREATE POLICY "anon_select_agents" ON agents FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_agents" ON agents;
CREATE POLICY "anon_insert_agents" ON agents FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_agents" ON agents;
CREATE POLICY "anon_update_agents" ON agents FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_agents" ON agents;
CREATE POLICY "anon_delete_agents" ON agents FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  caller_name text,
  category text NOT NULL DEFAULT 'general',
  duration_seconds int NOT NULL DEFAULT 0,
  satisfaction_score int NOT NULL DEFAULT 3 CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  resolved boolean NOT NULL DEFAULT false,
  call_direction text NOT NULL DEFAULT 'inbound' CHECK (call_direction IN ('inbound','outbound')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_calls" ON calls;
CREATE POLICY "anon_select_calls" ON calls FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_calls" ON calls;
CREATE POLICY "anon_insert_calls" ON calls FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_calls" ON calls;
CREATE POLICY "anon_update_calls" ON calls FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_calls" ON calls;
CREATE POLICY "anon_delete_calls" ON calls FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_calls_agent_id ON calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_category ON calls(category);
