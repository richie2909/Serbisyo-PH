import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(cors());
app.use(express.json());

// ------------------------
// Facebook Webhook Verification
// ------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(400);
  }
});

// ------------------------
// Test Page Access Token
// ------------------------
app.get("/api/test-token", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v23.0/${PAGE_ID}?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    res.json({ success: true, page: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------
// Fetch ALL Page Feed Posts
// ------------------------
app.get("/api/posts", async (req, res) => {
  try {
    let url = `https://graph.facebook.com/v23.0/${PAGE_ID}/feed?fields=message,full_picture,permalink_url,created_time,privacy&limit=50&access_token=${PAGE_ACCESS_TOKEN}`;
    let allPosts = [];

    while (url) {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const posts = (data.data || []).map(post => ({
        caption: post.message || "",
        imageUrl: post.full_picture || "",
        permalink: post.permalink_url,
        timestamp: post.created_time,
        privacy: post.privacy?.description || "Unknown"
      }));

      allPosts = allPosts.concat(posts);

      url = data.paging?.next || null;
    }

    res.json(allPosts);
  } catch (err) {
    console.error("Error fetching page feed posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
