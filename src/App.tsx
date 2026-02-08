import React, { useRef, useState } from "react";
import { ZoneGridSimulator } from "./core/Simulator";
import type { NodeState } from "./core/Simulator";

import Grid from "./components/Grid";
import Controls from "./components/Controls";
import OperationPanel from "./components/OperationPanel";
import ResultPanel from "./components/ResultPanel";

export default function App() {
  const simRef = useRef(
    new ZoneGridSimulator({
      zones: 5,
      groups: 3,
      quorum: { n: 5, r: 3, w: 3 },
      placement: { numGroups: 3, numShards: 64 },
    })
  );

  const sim = simRef.current;

  const [grid, setGrid] = useState<NodeState[][]>(() => sim.getNodeGrid());
  const [result, setResult] = useState<any>(null);

  const zones = grid[0]?.length ?? 0;
  const groups = grid.length;

  const onToggleNode = (r: number, z: number) => {
    sim.toggleNode(r, z);
    setGrid(sim.getNodeGrid());
  };

  const onToggleZone = (z: number) => {
    const anyUp = grid.some((row) => row[z] === "UP");
    sim.setZone(z, anyUp ? "DOWN" : "UP");
    setGrid(sim.getNodeGrid());
  };

  const onHealAll = () => {
    sim.healAll();
    setGrid(sim.getNodeGrid());
  };

  const onWrite = (key: string, value: string) => {
    const res = sim.write(key, value);
    setResult(res);
    setGrid(sim.getNodeGrid());
  };

  const onRead = (key: string) => {
    const res = sim.read(key);
    setResult(res);
    setGrid(sim.getNodeGrid());
  };

  const onScenario = (s: "ONE_ZONE" | "TWO_ZONES") => {
  sim.healAll();
  if (s === "ONE_ZONE") sim.setZone(2, "DOWN");
  if (s === "TWO_ZONES") {
    sim.setZone(2, "DOWN");
    sim.setZone(3, "DOWN");
  }
  setGrid(sim.getNodeGrid());
};

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>ZoneGrid Lab</h1>
      <div style={{ color: "#555", marginBottom: 16 }}>
        Zones (columns): <b>{zones}</b> · Storage groups (rows): <b>{groups}</b> · Quorum: <b>N=5, R=3, W=3</b>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "start" }}>
        <div>
          <Controls onHealAll={onHealAll} onScenario={onScenario} />
          <div style={{ height: 12 }} />
          <Grid grid={grid} onToggleNode={onToggleNode} onToggleZone={onToggleZone} />
        </div>

        <div>
          <OperationPanel onWrite={onWrite} onRead={onRead} />
          <div style={{ height: 12 }} />
          <ResultPanel result={result} />
        </div>
      </div>
    </div>
  );
}
