import React from "react";

export default function MoodChoice({ analysis, onChoice }) {
  if (!analysis) return null;

  return (
    <div className="mood-choice">
      <div className="choice-question">
        <span className="choice-mood-label">{analysis.koreanMood}</span>
        <span className="choice-text"> 한 기분이구나. 어떻게 할까?</span>
      </div>
      <div className="choice-buttons">
        <button
          className="choice-btn keep"
          onClick={() => onChoice("keep")}
        >
          <span className="choice-icon">🌙</span>
          <span className="choice-title">이 감정과 함께</span>
          <span className="choice-desc">지금 기분에 공감하는 음악</span>
        </button>
        <button
          className="choice-btn change"
          onClick={() => onChoice("change")}
        >
          <span className="choice-icon">⚡</span>
          <span className="choice-title">기분 전환하기</span>
          <span className="choice-desc">밝고 신나는 음악으로 전환</span>
        </button>
      </div>
    </div>
  );
}
