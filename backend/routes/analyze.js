const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req, res) => {
  const { text, mode } = req.body; // mode: 'keep' | 'change' | null
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "감정 텍스트를 입력해주세요." });
  }

  const modeInstruction = mode === "keep"
    ? "사용자는 지금 이 감정을 그대로 유지하고 싶어해. 현재 감정에 공감하고 함께하는 음악을 추천해줘. 같은 감정대의 음악으로 searchKeywords를 구성해."
    : mode === "change"
    ? "사용자는 지금 기분을 전환하고 싶어해. 현재 감정과 반대되는 밝고 긍정적인 음악을 추천해줘. energy를 high로 올리고 searchKeywords를 밝고 신나는 방향으로 구성해."
    : "";

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `다음 감정 텍스트를 분석하여 음악 추천에 적합한 키워드를 추출해줘.
반드시 아래 JSON 형식만 반환하고, 다른 텍스트는 절대 포함하지 마.
${modeInstruction}

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