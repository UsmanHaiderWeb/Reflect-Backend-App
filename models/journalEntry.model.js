import mongoose from 'mongoose';

const journalEntrySchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
},{ timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
export default JournalEntry;