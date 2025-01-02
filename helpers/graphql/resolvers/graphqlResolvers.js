import BlackListedToken from "../../../models/blackListedToken.model.js";
import Collection from "../../../models/collection.model.js";
import JournalEntry from "../../../models/journalEntry.model.js";
import User from "../../../models/user.model.js";
import verifyToken from "../../verifyToken.js";
import mutations from "./mutations/mutationResolvers.js";

const resolvers = {
    Query: {
        getUserData: async (_, { token }) => {
            let tokenData = await verifyToken(token);
            const user = await User.findById(tokenData._id);
            return user;
        },

        getCollectionData: async (_, { collectionId }) => {
            const collection = await Collection.findById(collectionId).populate('journalEntries');
            return collection;
        },

        getJournalEntryData: async (_, { journalEntryId }) => {
            const journalEntry = await JournalEntry.findById(journalEntryId);
            return journalEntry;
        },

        getBlackListedTokenData: async (_, { blackListedTokenId }) => {
            const blackListedToken = await BlackListedToken.findById(blackListedTokenId);
            return blackListedToken;
        },
    },

    Mutation: mutations,

    User: {
        collections: async (user) => {
            let userPopulated = await User.populate(user, { path: 'collections' });
            return userPopulated.collections;
        },
        
        journalEntries: async (user) => {
            let userPopulated = await User.populate(user, { path: 'journalEntries' });
            return userPopulated.journalEntries;
        },
        
        blackListedTokens: async (user) => {
            let userPopulated = await User.populate(user, { path: 'blackListedTokens' });
            return userPopulated.blackListedTokens;
        },
    },
    
    JournalEntry: {
        createdBy: async (journalEntry) => {
            let journalPopulated = await JournalEntry.populate(journalEntry, { path: 'createdBy' });
            return journalPopulated.createdBy;
        },
        collection: async (journalEntry) => {
            let journalPopulated = await JournalEntry.populate(journalEntry, { path: 'collection' });
            return journalPopulated.collection;
        },
    },

    Collection: {
        journalEntries: async (collection) => {
            let collectionPopulated = await Collection.populate(collection, { path: 'journalEntries' });
            return collectionPopulated.journalEntries;
        },
    },
};

export default resolvers;