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
// Helper: fetch posts from Facebook Graph API
async function fetchPagePosts(limit = 50) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=message,full_picture,permalink_url,created_time&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Filter out posts without messages or pictures
    const posts = data.data.map(post => ({
      caption: post.message || "",
      imageUrl: post.full_picture || "",
      permalink: post.permalink_url,
      timestamp: post.created_time
    }));

    return posts;
  } catch (err) {
    console.error("Error fetching page posts:", err.message);
    return [];
  }
}

// API endpoint for React Native app
app.get("/api/posts", async (req, res) => {
  const posts = await fetchPagePosts(50); // fetch latest 50 posts
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
