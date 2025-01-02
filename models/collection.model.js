import mongoose from 'mongoose';

const collectionSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    journalEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry', default: [] }],
}, {
    timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;