import React, { useState } from "react";
import axios from "axios";
import MoodInput from "./components/MoodInput";
import MoodChoice from "./components/MoodChoice";
import PlaylistResult from "./components/PlaylistResult";
import HistoryPanel from "./components/HistoryPanel";
import { useHistory } from "./hooks/useHistory";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [pendingText, setPendingText] = useState(null); // 선택 대기 중인 텍스트
  const [showChoice, setShowChoice] = useState(false);  // 선택지 표시 여부
  const { history, saveToHistory, clearHistory } = useHistory();

  // Step 1: 감정 분석만 먼저
  const handleSubmit = async (moodText) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setTracks(null);
    setShowChoice(false);

    try {
      const { data: analysisData } = await axios.post(`${API_BASE}/api/analyze`, { text: moodText });
      setPendingText(moodText);
      setAnalysis(analysisData);
      setShowChoice(true); // 선택지 표시
    } catch (err) {
      setError(err.response?.data?.error || "오류가 발생했어. 잠시 후 다시 시도해줘.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 선택 후 음악 검색
  const handleChoice = async (mode) => {
    setShowChoice(false);
    setLoading(true);

    try {
      // mode에 따라 재분석
      const { data: analysisData } = await axios.post(`${API_BASE}/api/analyze`, {
        text: pendingText,
        mode,
      });
      setAnalysis(analysisData);

      const { data: spotifyData } = await axios.post(`${API_BASE}/api/spotify/search`, {
        keywords: analysisData.searchKeywords,
        genres: analysisData.genres,
        mood: analysisData.mood,
        energy: analysisData.energy,
      });

      setTracks(spotifyData.tracks);
      saveToHistory({ moodText: pendingText, analysis: analysisData, tracks: spotifyData.tracks });
    } catch (err) {
      setError(err.response?.data?.error || "오류가 발생했어. 잠시 후 다시 시도해줘.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setAnalysis(item.analysis);
    setTracks(item.tracks);
    setShowChoice(false);
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

        {error && <div className="error-box">⚠ {error}</div>}

        {/* 선택지 UI */}
        {showChoice && (
          <MoodChoice analysis={analysis} onChoice={handleChoice} />
        )}

        <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={clearHistory} />

        {/* 선택 완료 후 결과 */}
        {!showChoice && <PlaylistResult analysis={analysis} tracks={tracks} />}
      </main>

      <footer className="app-footer">
        <span>Powered by Claude API & Spotify</span>
      </footer>
    </div>
  );
}
