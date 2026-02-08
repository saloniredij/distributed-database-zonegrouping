import React, { useState } from "react";

export default function OperationPanel({
  onWrite,
  onRead,
}: {
  onWrite: (key: string, value: string) => void;
  onRead: (key: string) => void;
}) {
  const [key, setKey] = useState("user:123");
  const [value, setValue] = useState("hello");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Operations</div>

      <label style={{ fontSize: 12, color: "#666" }}>Key</label>
      <input value={key} onChange={(e) => setKey(e.target.value)} style={{ width: "100%", padding: 8 }} />

      <div style={{ height: 10 }} />

      <label style={{ fontSize: 12, color: "#666" }}>Value (for write)</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} style={{ width: "100%", padding: 8 }} />

      <div style={{ height: 12 }} />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onWrite(key.trim(), value)}>WRITE</button>
        <button onClick={() => onRead(key.trim())}>READ</button>
      </div>
    </div>
  );
}
