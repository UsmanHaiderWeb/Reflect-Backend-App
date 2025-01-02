import Collection from "../../models/collection.model.js";
import JournalEntry from "../../models/journalEntry.model.js";

const createJournalEntry = async (req, res) => {
    const { title, content, collectionId, mood } = req.body;

    if (!title || !content || !collectionId || !mood) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const existingJournalEntry = await JournalEntry.findOne({ title, collection: collectionId });
        if(existingJournalEntry) return res.status(400).json({ message: 'Journal Entry title must be unique.' });

        const newJournalEntry = await JournalEntry.create({
            title,
            content,
            mood,
            createdBy: req.user._id,
            collection: collectionId
        });

        collection.journalEntries.unshift(newJournalEntry._id);
        await collection.save();

        req.user.journalEntries.unshift(newJournalEntry._id);
        await req.user.save();

        res.status(201).json({
            message: 'The journal entry has been created successfully.',
            journalEntry: newJournalEntry
        });
    } catch (error) {
        console.log('Error in createJournalEntry: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default createJournalEntry;