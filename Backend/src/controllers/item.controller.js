import { itemModel } from "../models/item.model.js";
import { addItemToQueue } from "../workers/queue.js";

const saveItem = async (req, res) => {
  try {
    console.log("saveItem hit ✅", req.body);

    const { url } = req.body;
    const userId = req.user.id;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // save immediately — status is 'processing'
    const item = await itemModel.create({
      userId,
      url,
      status: "processing",
    });

    // add to queue — extraction + AI tags happen in background
    // controller does NOT wait for this — responds immediately
    // await addItemToQueue(item._id, url);
    await addItemToQueue(item._id, url, userId);

    res.status(201).json({
      success: true,
      message: "Item saved, processing in background",
      item,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await itemModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate("collectionId", "name color");

    res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await itemModel
      .findById(id)
      .populate("collectionId", "name color")
      .populate("relatedItems", "title url type thumbnail");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Item fetched successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await itemModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await itemModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await itemModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowedUpdates = ["manualTags", "collectionId", "highlights", "title"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedItem = await itemModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { saveItem, getAllItems, getSingleItem, deleteItem, updateItem };