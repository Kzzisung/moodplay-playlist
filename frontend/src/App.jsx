import React, { useState } from "react";
import axios from "axios";
import MoodInput from "./components/MoodInput";
import PlaylistResult from "./components/PlaylistResult";
import HistoryPanel from "./components/HistoryPanel";
import { useHistory } from "./hooks/useHistory";
import "./App.css";

export default function App() {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tracks, setTracks] = useState(null);
  const { history, saveToHistory, clearHistory } = useHistory();

  const handleSubmit = async (moodText) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setTracks(null);

    try {
      // Step 1: Analyze emotion
      const { data: analysisData } = await axios.post(`${API_BASE}/api/analyze`, { text: moodText });
      setAnalysis(analysisData);

      // Step 2: Search Spotify
      const { data: spotifyData } = await axios.post(`${API_BASE}/api/spotify/search`, {
        keywords: analysisData.searchKeywords,
        genres: analysisData.genres,
        mood: analysisData.mood,
        energy: analysisData.energy,
      });

      setTracks(spotifyData.tracks);

      // Step 3: Save to localStorage
      saveToHistory({
        moodText,
        analysis: analysisData,
        tracks: spotifyData.tracks,
      });
    } catch (err) {
      const msg =
        err.response?.data?.error || "오류가 발생했어. 잠시 후 다시 시도해줘.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setAnalysis(item.analysis);
    setTracks(item.tracks);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-main">MOOD</span>
          <span className="logo-sub">PLAY</span>
        </div>
        <p className="tagline">감정을 말해줘, 음악을 찾아줄게</p>
      </header>

      <main className="app-main">
        <MoodInput onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="error-box">
            ⚠ {error}
          </div>
        )}

        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
        />

        <PlaylistResult analysis={analysis} tracks={tracks} />
      </main>

      <footer className="app-footer">
        <span>Powered by Claude API & Spotify</span>
      </footer>
    </div>
  );
}
