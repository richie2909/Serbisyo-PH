import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.use(cors());
app.use(express.json());

// ------------------------
// Test Page Access Token
// ------------------------
app.get("/api/test-token", async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    res.json({ success: true, page: data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ------------------------
// Fetch paginated posts + page info
// ------------------------
app.get("/api/posts", async (req, res) => {
  try {
    const limit = req.query.limit || 10; // default 10 posts per request
    const after = req.query.after || ""; // cursor for pagination

    // 1️⃣ Fetch page info (name + profile picture)
    const pageUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,picture.type(large)&access_token=${PAGE_ACCESS_TOKEN}`;
    const pageResp = await fetch(pageUrl);
    const pageData = await pageResp.json();
    if (pageData.error) throw new Error(pageData.error.message);

    // 2️⃣ Fetch posts
    let postsUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed?fields=message,full_picture,permalink_url,created_time&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
    if (after) postsUrl += `&after=${after}`;
    const postsResp = await fetch(postsUrl);
    const postsData = await postsResp.json();
    if (postsData.error) throw new Error(postsData.error.message);

    const posts = (postsData.data || []).map(post => ({
      caption: post.message || "",
      imageUrl: post.full_picture || "",
      permalink: post.permalink_url,
      timestamp: post.created_time
    }));

    res.json({
      page: {
        name: pageData.name,
        logo: pageData.picture?.data?.url || null
      },
      posts,
      paging: postsData.paging?.cursors || null // return cursor for frontend
    });

  } catch (err) {
    console.error("Error fetching page posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
