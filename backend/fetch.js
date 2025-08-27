import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const FetchData = express.Router();

const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

FetchData.get("/api/posts", async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    console.log("📡 Fetching latest posts from Facebook...");

    // 1️⃣ Fetch page info
    const pageUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,picture.type(large)&access_token=${PAGE_ACCESS_TOKEN}`;
    const pageResp = await fetch(pageUrl);
    const pageData = await pageResp.json();
    if (pageData.error) throw new Error(pageData.error.message);

    const pageName = pageData.name;
    const pageLogo = pageData.picture?.data?.url || null;

    // 2️⃣ Fetch latest posts
    const postsUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed?fields=message,permalink_url,created_time,attachments{media,subattachments}&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
    const postsResp = await fetch(postsUrl);
    const postsData = await postsResp.json();
    if (postsData.error) throw new Error(postsData.error.message);

    console.log(`✅ ${postsData.data?.length || 0} posts fetched`);

    // 3️⃣ Map posts and collect all images
    const posts = (postsData.data || []).map(post => {
      const images = [];

      if (post.attachments?.data) {
        post.attachments.data.forEach(att => {
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
        title: post.message?.slice(0, 50) || "Untitled",
        content: post.message || "",
        images, // send all images
        post_url: post.permalink_url,
        created_at: post.created_time,
      };
    });

    // 4️⃣ Send response
    res.json({
      page: {
        name: pageName,
        logo: pageLogo,
      },
      posts,
      paging: postsData.paging?.cursors || null,
    });

  } catch (err) {
    console.error("💥 Error fetching Facebook posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});
