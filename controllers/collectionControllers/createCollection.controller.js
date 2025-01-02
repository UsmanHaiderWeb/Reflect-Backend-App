import Collection from "../../models/collection.model.js";

const createCollection = async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingCollection = await Collection.findOne({ title, user: req.user._id });
        if(existingCollection) return res.status(400).json({ message: 'Collection Name must be unique.' });

        const newCollection = await Collection.create({
            title,
            description,
            user: req.user._id
        });

        req.user.collections.unshift(newCollection._id);
        await req.user.save();

        res.status(201).json({
            message: 'The collection has been created successfully.',
            collection: newCollection
        });
    } catch (error) {
        console.log('Error in createCollection: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default createCollection;