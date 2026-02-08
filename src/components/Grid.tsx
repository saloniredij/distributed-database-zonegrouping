import React from "react";
import type { NodeState } from "../core/Simulator";

export default function Grid({
  grid,
  onToggleNode,
  onToggleZone,
}: {
  grid: NodeState[][];
  onToggleNode: (groupRow: number, zone: number) => void;
  onToggleZone: (zone: number) => void;
}) {
  const groups = grid.length;
  const zones = grid[0]?.length ?? 0;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Zone × Storage Group Grid</div>

      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 6 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", fontSize: 12, color: "#666" }}>Group</th>
            {Array.from({ length: zones }, (_, z) => (
              <th key={z} style={{ textAlign: "center" }}>
                <button
                  onClick={() => onToggleZone(z)}
                  title="Click to toggle entire zone"
                  style={{
                    ...chip(),
                    fontWeight: 800,
                  }}
                >
                  Zone {z}
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: groups }, (_, r) => (
            <tr key={r}>
              <td style={{ fontSize: 12, color: "#666" }}>G{r}</td>
              {Array.from({ length: zones }, (_, z) => {
                const state = grid[r][z];
                return (
                  <td key={z} style={{ textAlign: "center" }}>
                    <button
                      onClick={() => onToggleNode(r, z)}
                      title="Click to toggle node"
                      style={{
                        ...cell(state),
                      }}
                    >
                      {state}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontSize: 12, color: "#666", marginTop: 10 }}>
        Tip: click a <b>Zone</b> header to toggle the whole column.
      </div>
    </div>
  );
}

function chip(): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  };
}

function cell(state: "UP" | "DOWN"): React.CSSProperties {
  const isUp = state === "UP";
  return {
    width: 70,
    padding: "10px 8px",
    borderRadius: 12,
    border: `1px solid ${isUp ? "#b7e3c2" : "#f2b8b5"}`,
    background: isUp ? "#eefbf1" : "#fff1f0",
    cursor: "pointer",
    fontWeight: 800,
    color: isUp ? "#1b7f3a" : "#b42318",
  };
}

