const itemModel = require("../models/item.model");
const collectionModel = require("../models/collection.model");

const saveItem = async (req, res) => {
    try {
        const { title, url, description, type } = req.body;
        const userId = req.user.id;

        if (!url) {
            return res.status(400).json({
                message: "URL is required"
            });
        }

        const item = await itemModel.create({
            userId,
            url,
            type: type || "other",
            title: title || "",
            description: description || "",
            status: "processing",
        });

        res.status(201).json({
            success: true,
            message: "Item saved successfully",
            item,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const items = await itemModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate("collectionId", "name color");

        res.status(200).json({
            success: true,
            message: "Items fetched successfully",
            count: items.length,
            items,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getSingleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await itemModel.findById(id)
            .populate("collectionId", "name color")
            .populate("relatedItems", "title url type thumbnail");

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item fetched successfully",
            item,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const item = await itemModel.findById(id);

    if (!item) {
      return res.status(404).json({ 
        message: "Item not found" 
    });
    }

    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized" 
    });
    }

    await itemModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await itemModel.findById(id);

    if (!item) {
      return res.status(404).json({ 
        message: "Item not found" 
    });
    }

    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized" 
    });
    }

    // only these fields are allowed to be updated by the user
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
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
    saveItem,
    getAllItems,
    getSingleItem,
    deleteItem,
    updateItem,
}