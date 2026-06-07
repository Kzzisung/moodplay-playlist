import React, { useState, useRef } from "react";

export default function TrackCard({ track, index }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!track.previewUrl) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      // Stop all other audios
      document.querySelectorAll("audio").forEach((a) => a.pause());
      audioRef.current?.play();
      setPlaying(true);
    }
  };

  const handleEnded = () => setPlaying(false);

  return (
    <div className="track-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="track-index">{String(index + 1).padStart(2, "0")}</div>

      {track.albumCover && (
        <img src={track.albumCover} alt={track.album} className="album-cover" />
      )}

      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
        <div className="track-album">{track.album}</div>
      </div>

      <div className="track-actions">
        {track.previewUrl ? (
          <button
            className={`play-btn ${playing ? "playing" : ""}`}
            onClick={togglePlay}
            title={playing ? "일시정지" : "미리듣기"}
          >
            {playing ? "⏸" : "▶"}
          </button>
        ) : (
          <span className="no-preview" title="미리듣기 없음">—</span>
        )}

        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="link-btn spotify"
          title="Spotify에서 열기"
        >
          ♪
        </a>
        <a
          href={track.youtubeSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="link-btn yt"
          title="YouTube에서 검색"
        >
          ▷
        </a>
      </div>

      {track.previewUrl && (
        <audio ref={audioRef} src={track.previewUrl} onEnded={handleEnded} />
      )}
    </div>
  );
}
