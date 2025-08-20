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

    console.log(PAGE_ACCESS_TOKEN)
    console.log(PAGE_ID)
    console.log(VERIFY_TOKEN)
  // Log what Facebook sent

  console.log("Webhook GET called with query:", req.query);
  console.log("Expected VERIFY_TOKEN:", VERIFY_TOKEN);

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      console.log("Webhook verification failed: token mismatch.");
      return res.sendStatus(403);
    }
  } else {
    console.log("Webhook verification failed: missing mode or token.");
    return res.sendStatus(400);
  }
});

// ------------------------
// Test Page Access Token
// ------------------------
app.get("/api/test-token", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    res.json({
      success: true,
      page: data,
      message: "Page Access Token is working!"
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

// ------------------------
// Fetch Latest Page Posts
// ------------------------
app.get("/api/posts", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=message,full_picture,permalink_url,created_time&limit=50&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const posts = data.data.map(post => ({
      caption: post.message || "",
      imageUrl: post.full_picture || "",
      permalink: post.permalink_url,
      timestamp: post.created_time
    }));

    res.json(posts);
  } catch (err) {
    console.error("Error fetching page posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
