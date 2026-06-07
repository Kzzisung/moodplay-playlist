import React, { useState } from "react";

export default function HistoryPanel({ history, onSelect, onClear }) {
  const [open, setOpen] = useState(false);

  if (!history.length) return null;

  return (
    <div className={`history-panel ${open ? "open" : ""}`}>
      <button className="history-toggle" onClick={() => setOpen((v) => !v)}>
        <span>최근 기록</span>
        <span className="history-count">{history.length}</span>
        <span className="toggle-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="history-list">
          {history.map((item, i) => (
            <button
              key={item.savedAt}
              className="history-item"
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              <span className="history-mood">{item.analysis?.koreanMood || "—"}</span>
              <span className="history-text">{item.moodText}</span>
              <span className="history-time">
                {new Date(item.savedAt).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </button>
          ))}
          <button className="history-clear" onClick={onClear}>
            기록 삭제
          </button>
        </div>
      )}
    </div>
  );
}
