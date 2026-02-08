// src/core/simulator.ts

import { canRead, canWrite, validateQuorum, type QuorumConfig } from "./quorum";
import { placeKey, type PlacementConfig, type Placement } from "./mapper";

export type NodeState = "UP" | "DOWN";

export type OperationResult = {
  ok: boolean;
  op: "READ" | "WRITE";
  key: string;
  groupRow: number;
  zonesTried: number;
  replicasAliveInRow: number;
  quorumNeeded: number;
  explanation: string;
  placement: Placement;
};

export type SimulatorConfig = {
  zones: number; // N columns
  groups: number; // G rows
  quorum: QuorumConfig;
  placement: PlacementConfig;
};

type StoredValue = {
  value: string;
  // MVP: single-version store. Later you can add version/timestamp and conflicts.
};

export class ZoneGridSimulator {
  private cfg: SimulatorConfig;

  // Grid: [groupRow][zone] => node state
  private nodes: NodeState[][];

  // Storage: map row -> (key -> value)
  private data: Map<number, Map<string, StoredValue>>;

  constructor(cfg: SimulatorConfig) {
    this.assertCfg(cfg);
    this.cfg = cfg;

    this.nodes = Array.from({ length: cfg.groups }, () =>
      Array.from({ length: cfg.zones }, () => "UP" as NodeState),
    );

    this.data = new Map();
    for (let r = 0; r < cfg.groups; r++) this.data.set(r, new Map());
  }

  /** Snapshot for UI/debug */
  public getNodeGrid(): NodeState[][] {
    // return deep copy
    return this.nodes.map((row) => row.slice());
  }

  public getConfig(): SimulatorConfig {
    return JSON.parse(JSON.stringify(this.cfg)) as SimulatorConfig;
  }

  /** Bring a single node up/down */
  public setNode(groupRow: number, zone: number, state: NodeState): void {
    this.assertInRange(groupRow, 0, this.cfg.groups - 1, "groupRow");
    this.assertInRange(zone, 0, this.cfg.zones - 1, "zone");
    this.nodes[groupRow][zone] = state;
  }

  /** Toggle a node quickly */
  public toggleNode(groupRow: number, zone: number): void {
    const cur = this.nodes[groupRow][zone];
    this.setNode(groupRow, zone, cur === "UP" ? "DOWN" : "UP");
  }

  /** Take an entire zone up/down (column failure) */
  public setZone(zone: number, state: NodeState): void {
    this.assertInRange(zone, 0, this.cfg.zones - 1, "zone");
    for (let r = 0; r < this.cfg.groups; r++) this.nodes[r][zone] = state;
  }

  /** Reset everything to UP */
  public healAll(): void {
    for (let r = 0; r < this.cfg.groups; r++) {
      for (let z = 0; z < this.cfg.zones; z++) this.nodes[r][z] = "UP";
    }
  }

  /** Count alive replicas in a storage-group row */
  public aliveReplicasInRow(groupRow: number): number {
    this.assertInRange(groupRow, 0, this.cfg.groups - 1, "groupRow");
    return this.nodes[groupRow].filter((s) => s === "UP").length;
  }

  /** WRITE(key, value) under current failures/quorum */
  public write(key: string, value: string): OperationResult {
    const placement = placeKey(key, this.cfg.placement);
    const row = placement.groupRow;

    const alive = this.aliveReplicasInRow(row);
    const ok = canWrite(alive, this.cfg.quorum);

    if (ok) {
      const rowMap = this.data.get(row)!;
      rowMap.set(key, { value });
    }

    return {
      ok,
      op: "WRITE",
      key,
      groupRow: row,
      zonesTried: this.cfg.zones,
      replicasAliveInRow: alive,
      quorumNeeded: this.cfg.quorum.w,
      placement,
      explanation: ok
        ? `WRITE succeeded: ${alive} replicas are UP in group ${row}, meeting W=${this.cfg.quorum.w}.`
        : `WRITE failed: only ${alive} replicas are UP in group ${row}, but W=${this.cfg.quorum.w} is required.`,
    };
  }

  /** READ(key) under current failures/quorum */

public read(key: string): OperationResult & { value?: string } {
  const placement = placeKey(key, this.cfg.placement);
  const row = placement.groupRow;

  const alive = this.aliveReplicasInRow(row);
  const ok = canRead(alive, this.cfg.quorum);

  let value: string | undefined = undefined;
  if (ok) {
    const rowMap = this.data.get(row)!;
    value = rowMap.get(key)?.value;
  }

  const extra =
    ok && value === undefined
      ? " Read quorum met, but key was not found (no prior successful write)."
      : "";

  const base: OperationResult = {
    ok,
    op: "READ",
    key,
    groupRow: row,
    zonesTried: this.cfg.zones,
    replicasAliveInRow: alive,
    quorumNeeded: this.cfg.quorum.r,
    placement,
    explanation: ok
      ? `READ succeeded: ${alive} replicas are UP in group ${row}, meeting R=${this.cfg.quorum.r}.${extra}`
      : `READ failed: only ${alive} replicas are UP in group ${row}, but R=${this.cfg.quorum.r} is required.`,
  };

  // attach `value` if string
  return value === undefined ? base : { ...base, value };
}








  /** Validates config (useful for UI warnings) */
  public validate(): ReturnType<typeof validateQuorum> {
    return validateQuorum(this.cfg.quorum);
  }

  // ---------------------------
  // Internal helpers
  // ---------------------------

  private assertCfg(cfg: SimulatorConfig): void {
    if (!Number.isInteger(cfg.zones) || cfg.zones <= 0) throw new Error("zones must be a positive integer.");
    if (!Number.isInteger(cfg.groups) || cfg.groups <= 0) throw new Error("groups must be a positive integer.");

    // Ensure quorum N matches zones in this simplified model
    if (cfg.quorum.n !== cfg.zones) {
      throw new Error(`quorum.n (${cfg.quorum.n}) must equal zones (${cfg.zones}) in this model.`);
    }

    // Validate quorum constraints early
    const v = validateQuorum(cfg.quorum);
    if (!v.ok) {
      throw new Error(`Invalid quorum config: ${v.issues.join(" ")}`);
    }

    if (!Number.isInteger(cfg.placement.numGroups) || cfg.placement.numGroups !== cfg.groups) {
      throw new Error("placement.numGroups must match groups.");
    }
    if (!Number.isInteger(cfg.placement.numShards) || cfg.placement.numShards <= 0) {
      throw new Error("placement.numShards must be a positive integer.");
    }
  }

  private assertInRange(v: number, lo: number, hi: number, name: string): void {
    if (!Number.isInteger(v) || v < lo || v > hi) throw new Error(`${name} must be an integer in range [${lo}, ${hi}].`);
  }
}
