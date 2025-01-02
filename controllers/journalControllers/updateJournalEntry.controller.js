import JournalEntry from "../../models/journalEntry.model.js";

const updateJournalEntry = async (req, res) => {

    const { title, content, mood, journalEntryId } = req.body;
    if (!title || !content || !mood || !journalEntryId) return res.status(400).json({ message: 'Missing required fields' });

    try {
        const journalEntry = await JournalEntry.findById(journalEntryId);
        if (!journalEntry) return res.status(404).json({ message: 'Journal Entry not found' });

        if (journalEntry.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

        const updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
            journalEntryId,
            { title, content, mood },
            { new: true }
        );

        res.status(200).json({
            message: 'The journal entry has been updated successfully.',
            journalEntry: updatedJournalEntry
        });
    } catch (error) {
        console.log('Error in updateJournalEntry: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default updateJournalEntry;