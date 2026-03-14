import { QdrantClient } from "@qdrant/js-client-rest";

// create qdrant client using cloud credentials
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// collection name — all item vectors stored here
export const COLLECTION_NAME = "items";

// vector size must match the embedding model output
// sentence-transformers/all-MiniLM-L6-v2 outputs 384 dimensions
// export const VECTOR_SIZE = 384;
export const VECTOR_SIZE = 768; // changed from 384 to 768 for Jina

export const initQdrant = async () => {
  try {
    // check if collection already exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (exists) {
      console.log(`Qdrant collection '${COLLECTION_NAME}' already exists ✅`);
      return;
    }

    // create collection if it doesn't exist
    // this runs once when server starts
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine", // cosine similarity — best for text embeddings
      },
    });

    console.log(`Qdrant collection '${COLLECTION_NAME}' created ✅`);
  } catch (error) {
    console.error("Qdrant init failed ❌", error.message);
    throw error;
  }
};

export default qdrant;