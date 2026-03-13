const collectionModel = require("../models/collection.model.js");
const itemModel = require("../models/item.model.js");

const createCollection = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 
        "Collection name is required" 
      });
    }

    const collection = await collectionModel.create({
      userId,
      name,
      description: description || "",
      color: color || "#6366f1",
    });

    res.status(201).json({
      success: true,
      collection,
    });

  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

const getAllCollections = async (req, res) => {
  try {
    const userId = req.user.id;

    const collections = await collectionModel.find({ 
        userId 
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: collections.length,
      collections,
    });

  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

const getSingleCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({ 
        message: "Collection not found" 
    });
    }

    if (collection.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized" 
    });
    }

    // fetch all items belonging to this collection
    const items = await itemModel.find({
      collectionId: id,
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      collection,
      items,
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({ 
        message: "Collection not found" 
    });
    }

    if (collection.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized" 
    });
    }

    const allowedUpdates = ["name", "description", "color"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedCollection = await collectionModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      success: true,
      collection: updatedCollection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({ 
        message: "Collection not found" 
    });
    }

    if (collection.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized" 
    });
    }

    // remove collectionId from all items that belonged to this collection
    await itemModel.updateMany(
      { collectionId: id },
      { $set: { collectionId: null } }
    );

    const deletedCollection = await collectionModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Collection deleted and items unlinked successfully",
        deletedCollection
    });
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};

module.exports = {
    createCollection,
    getAllCollections,
    getSingleCollection,
    updateCollection,
    deleteCollection,
};