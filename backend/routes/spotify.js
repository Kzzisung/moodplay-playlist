const express = require("express");
const axios = require("axios");
const router = express.Router();

let tokenCache = { token: null, expiresAt: 0 };

async function getSpotifyToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials not configured");
  }

  const resp = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  tokenCache = {
    token: resp.data.access_token,
    expiresAt: Date.now() + resp.data.expires_in * 1000 - 60000,
  };
  return tokenCache.token;
}

router.post("/search", async (req, res) => {
  const { keywords, genres, mood, energy } = req.body;
  if (!keywords || !keywords.length) {
    return res.status(400).json({ error: "검색 키워드가 필요합니다." });
  }

  try {
    const token = await getSpotifyToken();

    // Build search query: combine mood + genre + keywords
    const genreStr = genres && genres.length ? genres[0] : "";
    const query = [mood, genreStr, ...keywords.slice(0, 2)]
      .filter(Boolean)
      .join(" ");

    const resp = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: "track",
        limit: 10,
        market: "KR",
      },
    });

    const tracks = resp.data.tracks.items.map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      albumCover: t.album.images[0]?.url || null,
      previewUrl: t.preview_url,
      spotifyUrl: t.external_urls.spotify,
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        t.name + " " + t.artists[0]?.name
      )}`,
    }));

    res.json({ tracks, query });
  } catch (err) {
    console.error("Spotify API error:", err.response?.data || err.message);
    res.status(500).json({ error: "음악 검색에 실패했습니다." });
  }
});

module.exports = router;
