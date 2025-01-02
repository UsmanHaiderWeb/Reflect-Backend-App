import Collection from "../../models/collection.model.js";

const updateCollection = async (req, res) => {
    const { collectionId, title, description } = req.body;
    if (!collectionId || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        if (collection.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

        collection.title = title;
        collection.description = description;
        const updatedCollection = await collection.save();

        res.status(200).json({
            message: 'The collection has been updated successfully.',
            collection: updatedCollection
        });
    } catch (error) {
        console.log('Error in updateCollection: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default updateCollection;