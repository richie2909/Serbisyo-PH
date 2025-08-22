import express from "express"
import fetch from "node-fetch";
import dotenv from "dotenv"
dotenv.config()

export const FetchData = express.Router()

const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
FetchData.get("/api/posts", async (req, res) => {
  try {
    const limit = req.query.limit || 10; // default 10 posts per request
    const after = req.query.after || ""; // cursor for pagination

    // 1️⃣ Fetch page info (name + profile picture)
    const pageUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,picture.type(large)&access_token=${PAGE_ACCESS_TOKEN}`;
    const pageResp = await fetch(pageUrl);
    const pageData = await pageResp.json();
    if (pageData.error) throw new Error(pageData.error.message);

    // 2️⃣ Fetch posts with attachments (to get multiple images)
    let postsUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed?fields=message,permalink_url,created_time,attachments{media,subattachments}&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
    if (after) postsUrl += `&after=${after}`;
    const postsResp = await fetch(postsUrl);
    const postsData = await postsResp.json();
    if (postsData.error) throw new Error(postsData.error.message);

    // 3️⃣ Map posts and collect all images
    const posts = (postsData.data || []).map(post => {
      const images = [];

      // Attachments
      if (post.attachments?.data) {
        post.attachments.data.forEach(att => {
          // Subattachments (for multi-photo posts)
          if (att.subattachments?.data) {
            att.subattachments.data.forEach(sub => {
              if (sub.media?.image?.src) images.push(sub.media.image.src);
            });
          } else if (att.media?.image?.src) {
            images.push(att.media.image.src);
          }
        });
      }

      return {
        caption: post.message || "",
        images, // array of all image URLs
        permalink: post.permalink_url,
        timestamp: post.created_time
      };
    });

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
