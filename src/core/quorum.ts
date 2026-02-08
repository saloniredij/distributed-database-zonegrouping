// src/core/quorum.ts

export type QuorumConfig = {
  /** N: number of replicas (in our model: number of zones/columns) */
  n: number;
  /** R: read quorum */
  r: number;
  /** W: write quorum */
  w: number;
};

export type QuorumValidation = {
  ok: boolean;
  issues: string[];
  notes: string[];
};

export function validateQuorum(cfg: QuorumConfig): QuorumValidation {
  const issues: string[] = [];
  const notes: string[] = [];

  if (!Number.isInteger(cfg.n) || cfg.n <= 0) issues.push("N must be a positive integer.");
  if (!Number.isInteger(cfg.r) || cfg.r <= 0) issues.push("R must be a positive integer.");
  if (!Number.isInteger(cfg.w) || cfg.w <= 0) issues.push("W must be a positive integer.");

  if (issues.length) return { ok: false, issues, notes };

  if (cfg.r > cfg.n) issues.push("R cannot be greater than N.");
  if (cfg.w > cfg.n) issues.push("W cannot be greater than N.");

  // Quorum safety constraints (typical for strong consistency):
  // 1) W + R > N ensures read/write intersection
  // 2) W > N/2 ensures no two writes can both succeed on disjoint quorums
  if (cfg.w + cfg.r <= cfg.n) issues.push("Invalid quorum: W + R must be > N to guarantee read/write overlap.");
  if (cfg.w <= Math.floor(cfg.n / 2)) issues.push("Invalid quorum: W must be > N/2 to avoid split-brain writes.");

  if (!issues.length) {
    notes.push("Quorum configuration looks safe for strong consistency (read/write overlap + majority writes).");
  }

  return { ok: issues.length === 0, issues, notes };
}

export function canWrite(aliveReplicas: number, cfg: QuorumConfig): boolean {
  return aliveReplicas >= cfg.w;
}

export function canRead(aliveReplicas: number, cfg: QuorumConfig): boolean {
  return aliveReplicas >= cfg.r;
}
