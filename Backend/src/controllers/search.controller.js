// src/controllers/search.controller.js

import { itemModel } from "../models/item.model.js";
import { generateEmbedding } from "../services/embedding.service.js";
import qdrant, { COLLECTION_NAME } from "../config/qdrant.js";

// GET /api/search?q=your+query
export const semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log(`Semantic search for: "${q}" 🔍`);

    // step 1 — convert search query to embedding
    // same model as used during save — vectors must be comparable
    const queryEmbedding = await generateEmbedding(q);

    if (!queryEmbedding) {
      return res.status(500).json({ message: "Failed to process search query" });
    }

    // step 2 — search Qdrant for similar vectors
    const searchResults = await qdrant.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      limit: 10,
      score_threshold: 0.3, // lower threshold for search — cast wider net
      with_payload: true,
    });

    if (searchResults.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No results found",
        results: [],
      });
    }

    // step 3 — extract MongoDB item IDs from Qdrant results
    const itemIds = searchResults.map((r) => r.payload.itemId);

    // step 4 — fetch full item details from MongoDB
    // filter by userId so users only see their own items
    const items = await itemModel
      .find({
        _id: { $in: itemIds },
        userId: userId, // security — never return other users' items
      })
      .populate("collectionId", "name color");

    // step 5 — sort items by Qdrant score (most relevant first)
    // MongoDB find doesn't preserve order — re-sort manually
    const itemMap = {};
    items.forEach((item) => {
      itemMap[item._id.toString()] = item;
    });

    const sortedItems = itemIds
      .map((id) => itemMap[id])
      .filter(Boolean); // remove any undefined (deleted items)

    console.log(`Search complete — found ${sortedItems.length} results ✅`);

    res.status(200).json({
      success: true,
      query: q,
      count: sortedItems.length,
      results: sortedItems,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/search/tags?tag=javascript
// simple MongoDB tag search — no AI needed
export const searchByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    const userId = req.user.id;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    // search in both AI tags and manual tags
    const items = await itemModel
      .find({
        userId,
        $or: [
          { tags: { $in: [tag] } },
          { manualTags: { $in: [tag] } },
        ],
      })
      .sort({ createdAt: -1 })
      .populate("collectionId", "name color");

    res.status(200).json({
      success: true,
      tag,
      count: items.length,
      results: items,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};