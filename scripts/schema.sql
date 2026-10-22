CREATE TABLE IF NOT EXISTS households(id uuid PRIMARY KEY,name text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS members(user_id text PRIMARY KEY,household_id uuid NOT NULL REFERENCES households(id),name text NOT NULL,role text NOT NULL CHECK(role IN ('owner','member')));
CREATE TABLE IF NOT EXISTS invites(token_hash text PRIMARY KEY,household_id uuid NOT NULL REFERENCES households(id),expires_at timestamptz NOT NULL,used_at timestamptz);
CREATE TABLE IF NOT EXISTS records(id uuid PRIMARY KEY,household_id uuid NOT NULL REFERENCES households(id),kind text NOT NULL CHECK(kind IN ('transaction','account','goal','budget','loan')),data jsonb NOT NULL,version integer NOT NULL DEFAULT 1,updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS records_household ON records(household_id,kind);

CREATE UNIQUE INDEX IF NOT EXISTS one_loan_per_household ON records(household_id) WHERE kind='loan';
CREATE UNIQUE INDEX IF NOT EXISTS one_budget_per_category ON records(household_id,(data->>'month'),(data->>'category')) WHERE kind='budget';
