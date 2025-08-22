import Express from "express"

const Router = Express.Router()

Router.get("/api/test-token", async (req, res) => {
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

export default Router