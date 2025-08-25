import express from "express"
import fetch from "node-fetch";
import dotenv from "dotenv"
import supabase from "./lib/supabase.js"; // 👈 supabase client (with service role)

dotenv.config()

export const FetchData = express.Router()

const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

FetchData.get("/api/posts", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const after = req.query.after || "";

    console.log("📡 Fetching posts from Facebook...");

    // 1️⃣ Fetch page info
    const pageUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,picture.type(large)&access_token=${PAGE_ACCESS_TOKEN}`;
    console.log("➡️ Fetching page info:", pageUrl);
    const pageResp = await fetch(pageUrl);
    const pageData = await pageResp.json();
    if (pageData.error) throw new Error(pageData.error.message);
    console.log("✅ Page info fetched:", pageData.name);

    // 2️⃣ Fetch posts
    let postsUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed?fields=message,permalink_url,created_time,attachments{media,subattachments}&limit=${limit}&access_token=${PAGE_ACCESS_TOKEN}`;
    if (after) postsUrl += `&after=${after}`;
    console.log("➡️ Fetching posts from:", postsUrl);
    const postsResp = await fetch(postsUrl);
    const postsData = await postsResp.json();
    if (postsData.error) throw new Error(postsData.error.message);

    console.log(`✅ ${postsData.data?.length || 0} posts fetched from Facebook`);

    // 3️⃣ Map posts and collect images
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
        caption: post.message || "",
        images,
        permalink: post.permalink_url,
        timestamp: post.created_time
      };
    });

    console.log("📝 Parsed posts:", posts.length);

    // 4️⃣ Sync into Supabase
    for (const post of posts) {
      console.log("⬆️ Syncing post to Supabase:", post.caption.slice(0, 30), "...");
      const { error } = await supabase.from("posts").upsert({
        title: post.caption?.slice(0, 50) || "Untitled",
        content: post.caption,
        image_url: post.images.length > 0 ? post.images[0] : null,
        created_at: post.timestamp,
      });

      if (error) {
        console.error("❌ Supabase sync error:", error.message);
      } else {
        console.log("✅ Post synced successfully");
      }
    }

    // 5️⃣ Send back response
    res.json({
      page: {
        name: pageData.name,
        logo: pageData.picture?.data?.url || null
      },
      posts,
      paging: postsData.paging?.cursors || null
    });

  } catch (err) {
    console.error("💥 Error fetching page posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});
