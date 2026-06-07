const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "감정 텍스트를 입력해주세요." });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `다음 감정 텍스트를 분석하여 음악 추천에 적합한 키워드를 추출해줘.
반드시 아래 JSON 형식만 반환하고, 다른 텍스트는 절대 포함하지 마.

감정 텍스트: "${text}"

반환 형식:
{
  "mood": "감정 상태 (예: happy, sad, energetic, calm, melancholic, romantic, anxious, hopeful)",
  "energy": "low | medium | high",
  "genres": ["장르1", "장르2"],
  "searchKeywords": ["검색 키워드1", "검색 키워드2", "검색 키워드3"],
  "koreanMood": "한국어로 감정 요약 (10자 이내)"
}`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    res.json(analysis);
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({ error: "감정 분석에 실패했습니다." });
  }
});

module.exports = router;
