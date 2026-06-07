import React, { useState } from "react";

const EXAMPLES = [
  "오늘 너무 지쳐서 위로받고 싶어",
  "기분이 신나서 춤추고 싶어",
  "비 오는 날 혼자 조용히 있고 싶어",
  "운동할 때 들을 강렬한 음악",
  "설레는 첫사랑 같은 느낌",
];

export default function MoodInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onSubmit(text.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div className="mood-input-section">
      <div className="input-label">지금 어떤 기분이야?</div>
      <div className="textarea-wrapper">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="감정이나 상황을 자유롭게 입력해봐..."
          rows={3}
          maxLength={200}
          disabled={loading}
        />
        <div className="char-count">{text.length}/200</div>
      </div>

      <div className="examples">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className="example-chip"
            onClick={() => setText(ex)}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>

      <button
        className={`submit-btn ${loading ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <span className="spinner-text">
            <span className="dot-pulse">AI가 분석 중</span>
          </span>
        ) : (
          "플레이리스트 만들기 →"
        )}
      </button>
    </div>
  );
}
