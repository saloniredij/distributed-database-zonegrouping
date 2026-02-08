// src/core/mapper.ts

export type PlacementConfig = {
  numGroups: number; // G: rows
  numShards: number; // #virtual shards for better distribution
};

export type Placement = {
  key: string;
  shardId: number;
  groupRow: number; // 0..G-1
};

/**
 * Deterministic 32-bit hash (FNV-1a). Great for stable demos.
 */
export function fnv1a32(input: string): number {
  let h = 0x811c9dc5; // offset basis
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    // multiply by FNV prime (via shifts)
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h >>> 0;
}

export function placeKey(key: string, cfg: PlacementConfig): Placement {
  if (!Number.isInteger(cfg.numGroups) || cfg.numGroups <= 0) {
    throw new Error("numGroups must be a positive integer.");
  }
  if (!Number.isInteger(cfg.numShards) || cfg.numShards <= 0) {
    throw new Error("numShards must be a positive integer.");
  }

  const hash = fnv1a32(key);
  const shardId = hash % cfg.numShards;
  const groupRow = shardId % cfg.numGroups;

  return { key, shardId, groupRow };
}
