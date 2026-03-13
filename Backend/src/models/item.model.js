const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["article", "tweet", "image", "video", "pdf", "other"],
      default: "other",
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
      },
    ],
    manualTags: [
      {
        type: String,
      },
    ],
    highlights: [
      {
        type: String,
      },
    ],
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },
    relatedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    embeddingId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    lastSurfacedAt: {
      type: Date,
      default: null,
    },
    surfaceCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const itemModel = mongoose.model("Item", itemSchema);

module.exports = itemModel;