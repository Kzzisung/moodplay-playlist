import React from "react";
import TrackCard from "./TrackCard";

const ENERGY_LABEL = { low: "잔잔함", medium: "보통", high: "강렬함" };

export default function PlaylistResult({ analysis, tracks }) {
  if (!analysis || !tracks) return null;

  return (
    <div className="result-section">
      <div className="analysis-badge">
        <div className="badge-item">
          <span className="badge-label">감정</span>
          <span className="badge-value accent">{analysis.koreanMood}</span>
        </div>
        <div className="badge-divider" />
        <div className="badge-item">
          <span className="badge-label">에너지</span>
          <span className="badge-value">{ENERGY_LABEL[analysis.energy] || analysis.energy}</span>
        </div>
        <div className="badge-divider" />
        <div className="badge-item">
          <span className="badge-label">장르</span>
          <span className="badge-value">{analysis.genres?.slice(0, 2).join(" · ")}</span>
        </div>
      </div>

      <div className="tracks-header">
        <span className="tracks-count">{tracks.length}곡</span> 추천됨
      </div>

      <div className="tracks-list">
        {tracks.map((track, i) => (
          <TrackCard key={track.id} track={track} index={i} />
        ))}
      </div>
    </div>
  );
}
