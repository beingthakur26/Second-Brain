const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;