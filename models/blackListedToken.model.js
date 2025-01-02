import mongoose from 'mongoose';

const blackListedTokenSchema = mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    expires: '24h'
});

const BlackListedToken = mongoose.model('BlackListedToken', blackListedTokenSchema);
export default BlackListedToken;