require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRouter = require("./routes/analyze");
const spotifyRouter = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/analyze", analyzeRouter);
app.use("/api/spotify", spotifyRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
