import React from "react";

export default function ResultPanel({ result }: { result: any }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Latest Result</div>

      {!result ? (
        <div style={{ fontSize: 13, color: "#666" }}>
          Run a READ or WRITE to see output here.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 8, fontWeight: 800 }}>
            {result.op} → {result.ok ? "SUCCESS" : "FAIL"}
          </div>
          <div style={{ fontSize: 13, marginBottom: 10 }}>{result.explanation}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            Target group: <b>G{result.groupRow}</b> · Alive replicas in row:{" "}
            <b>{result.replicasAliveInRow}/{result.zonesTried}</b> · Needed:{" "}
            <b>{result.op === "READ" ? `R=${result.quorumNeeded}` : `W=${result.quorumNeeded}`}</b>
          </div>

          <pre style={{ background: "#fafafa", padding: 10, fontSize: 12 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
