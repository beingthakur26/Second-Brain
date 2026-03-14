import axios from "axios";
import * as cheerio from "cheerio";

const extractFromUrl = async (url) => {
  try {
    // fetch the raw HTML of the page
    // headers are set to mimic a real browser request
    // some websites block requests without a proper User-Agent
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 10000, // 10 seconds — if site doesn't respond, give up
    });

    const html = response.data;

    // load the HTML into cheerio
    // $ works exactly like jQuery — $('title'), $('meta') etc
    const $ = cheerio.load(html);

    // ── TITLE ──────────────────────────────────────────────
    // first try og:title (open graph) — more accurate on most modern sites
    // if not found, fall back to the plain <title> tag
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      "";

    // ── DESCRIPTION ────────────────────────────────────────
    // og:description is usually cleaner than the plain meta description
    // try og first, then standard meta, then empty string
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // ── THUMBNAIL ──────────────────────────────────────────
    // og:image is the preview image most sites define
    // this is what shows up when you share a link on WhatsApp/Twitter
    const thumbnail =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // ── CONTENT ────────────────────────────────────────────
    // grab all <p> tags and join their text
    // this gives us the main body text of the article
    // used later for AI tag generation and embeddings
    const paragraphs = [];
    $("p").each((i, el) => {
      const text = $(el).text().trim();
      // skip very short paragraphs — they're usually nav links or captions
      if (text.length > 40) {
        paragraphs.push(text);
      }
    });

    // join all paragraphs into one big string
    // slice to first 5000 chars — enough for AI, not too much to store
    const content = paragraphs.join(" ").slice(0, 5000);

    // ── TYPE DETECTION ─────────────────────────────────────
    // auto detect what kind of content this URL is
    // this saves user from manually selecting the type every time
    const detectType = (url) => {
      if (url.includes("youtube.com") || url.includes("youtu.be"))
        return "video";
      if (url.includes("twitter.com") || url.includes("x.com"))
        return "tweet";
      if (url.endsWith(".pdf")) return "pdf";
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
      return "article"; // default — most URLs are articles
    };

    return {
      title,
      description,
      thumbnail,
      content,
      type: detectType(url),
    };
  } catch (error) {
    // if extraction fails — don't crash the whole save
    // return empty strings so item still gets saved
    console.error("Extraction failed for URL:", url, error.message);
    return {
      title: "",
      description: "",
      thumbnail: "",
      content: "",
      type: "other",
    };
  }
};

export { extractFromUrl };