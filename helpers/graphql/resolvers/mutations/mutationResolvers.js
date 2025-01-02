import Collection from "../../../../models/collection.model.js";
import JournalEntry from "../../../../models/journalEntry.model.js";
import User from "../../../../models/user.model.js";
import verifyToken from "../../../verifyToken.js";

const mutations = {
    deleteJournal: async (_, { token, collectionId, journalEntryId }) => {
        const tokenData = verifyToken(token);
        if (!tokenData) return null;

        // Find the user based on clerkId and _id
        const userPromise = User.findOne({ clerkId: tokenData.clerkId, _id: tokenData._id });
        const collectionPromise = Collection.findById(collectionId);
        const journalEntryPromise = JournalEntry.findById(journalEntryId);

        const [user, existedCollection, deletedJournal] = await Promise.all([userPromise, collectionPromise, journalEntryPromise]);
        if (!user || !existedCollection || !deletedJournal) return null;

        // Remove journal entry from the collection's journalEntries
        const inCollectionExistIndex = existedCollection.journalEntries.findIndex((id) => id.toString() === journalEntryId);
        if (inCollectionExistIndex === -1) return null;
        existedCollection.journalEntries.splice(inCollectionExistIndex, 1);

        // Remove journal entry from the user's journalEntries
        const inUserExistIndex = user.journalEntries.findIndex((id) => id.toString() === journalEntryId);
        if (inUserExistIndex === -1) return null;
        user.journalEntries.splice(inUserExistIndex, 1);

        // Prepare promises for saving updated documents and deleting the journal entry
        const saveCollectionPromise = existedCollection.save();
        const saveUserPromise = user.save();
        const deleteJournalPromise = JournalEntry.findByIdAndDelete(journalEntryId);

        // Execute all operations in parallel
        await Promise.all([saveCollectionPromise, saveUserPromise, deleteJournalPromise]);

        return 'The journal has been deleted successfully.';  // Return a success response
    },
    deleteCollection: async (_, { token, collectionId }) => {
        const tokenData = verifyToken(token);
        if (!tokenData) return null;

        // Find the user based on clerkId and _id
        const userPromise = User.findOne({ clerkId: tokenData.clerkId, _id: tokenData._id });
        const collectionPromise = Collection.findById(collectionId);

        const [user, existedCollection] = await Promise.all([userPromise, collectionPromise]);
        if (!user || !existedCollection) return null;

        // Remove collection from the user's collections
        const inUserExistIndex = user.collections.findIndex((id) => id.toString() === collectionId);
        if (inUserExistIndex === -1) return null;
        user.collections.splice(inUserExistIndex, 1);

        // Remove journal entries from the user's journalEntries
        existedCollection.journalEntries.forEach((journalEntryId) => {
            const inUserJournalIndex = user.journalEntries.findIndex((id) => id.toString() === journalEntryId.toString());
            if (inUserJournalIndex !== -1) {
                user.journalEntries.splice(inUserJournalIndex, 1);
            }
        });

        // Prepare promises for saving updated documents and deleting the journal entries and the collection
        const saveUserPromise = user.save();
        const deleteJournalEntryPromises = existedCollection.journalEntries.map((id) => JournalEntry.findByIdAndDelete(id));
        const deleteCollectionPromise = Collection.findByIdAndDelete(collectionId);

        // Execute all operations in parallel
        await Promise.all([...deleteJournalEntryPromises, saveUserPromise, deleteCollectionPromise]);

        return 'The collection has been deleted successfully.';  // Return a success response
    }
}

export default mutations;