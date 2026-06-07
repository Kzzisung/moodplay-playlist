import React from "react";

const NEGATIVE_MOODS = ["sad", "melancholic", "anxious", "tired", "angry", "lonely", "depressed", "worried", "exhausted"];

function isNegativeMood(mood) {
  return NEGATIVE_MOODS.some((m) => mood?.toLowerCase().includes(m));
}

export default function MoodChoice({ analysis, onChoice }) {
  if (!analysis) return null;

  const negative = isNegativeMood(analysis.mood);

  const options = negative
    ? [
        { mode: "keep", icon: "🌙", title: "이 감정과 함께", desc: "지금 기분에 공감하는 음악" },
        { mode: "change", icon: "⚡", title: "기분 전환하기", desc: "밝고 신나는 음악으로 전환" },
      ]
    : [
        { mode: "keep", icon: "⚡", title: "이 에너지 유지", desc: "지금 기분을 더 끌어올리는 음악" },
        { mode: "change", icon: "🌙", title: "잔잔하게", desc: "차분하고 편안한 음악으로" },
      ];

  return (
    <div className="mood-choice">
      <div className="choice-question">
        <span className="choice-mood-label">{analysis.koreanMood}</span>
        <span className="choice-text"> 한 기분이구나. 어떻게 할까?</span>
      </div>
      <div className="choice-buttons">
        {options.map((opt) => (
          <button
            key={opt.mode}
            className={`choice-btn ${opt.mode}`}
            onClick={() => onChoice(opt.mode)}
          >
            <span className="choice-icon">{opt.icon}</span>
            <span className="choice-title">{opt.title}</span>
            <span className="choice-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
