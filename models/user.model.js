import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection', default: [] }],
    journalEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry', default: [] }],
    blackListedTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlackListedToken', default: [] }],
},{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;