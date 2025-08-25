import supabase from "../lib/supabase.js";

export async function syncFacebookPosts(fbPosts) {
  for (const fbPost of fbPosts) {
    const { error } = await supabase
      .from("posts")
      .upsert({
        // If you want to use Facebook's post ID instead of UUID:
        // id: fbPost.id,
        title: fbPost.message?.slice(0, 50) || "Untitled",
        content: fbPost.message || "",
        image_url: fbPost.full_picture || null,
        created_at: fbPost.created_time,
      });

    if (error) {
      console.error("Error syncing post:", error);
    }
  }
}
