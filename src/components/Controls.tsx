import React from "react";

export default function Controls({onHealAll,onScenario,}: { onHealAll: () => void;
  onScenario?: (s: "ONE_ZONE" | "TWO_ZONES") => void;
}) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>Controls</div>
          <div style={{ fontSize: 13, color: "#666" }}>Toggle nodes/zones to simulate failures.</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button onClick={onHealAll} style={btn()}>
            Heal all
        </button>
        <button onClick={() => onScenario?.("ONE_ZONE")} style={btn()}>
            1-zone outage
        </button>
        <button onClick={() => onScenario?.("TWO_ZONES")} style={btn()}>
            2-zone outage
        </button>
</div>

      </div>
    </div>
  );
}

function btn(): React.CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  };
}
