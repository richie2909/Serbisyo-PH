import express from "express";
import { FetchData} from "./fetch.js";
import Router from "./testToken.js";

import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import searchPosts from "./searchPost.js"; // adjust path



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use(searchPosts);
// ------------------------
// Test Page Access Token
// ------------------------

app.use(Router)


// ------------------------
// Fetch paginated posts + page info + all images
// ------------------------

app.use(FetchData)
// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
