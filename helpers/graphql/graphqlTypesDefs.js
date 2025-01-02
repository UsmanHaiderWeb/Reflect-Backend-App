const graphqlTypesDefs = `
    type Query {
        getUserData(token: String!): User
        getCollectionData(collectionId: ID!): Collection
        getJournalEntryData(journalEntryId: ID!): JournalEntry
        getBlackListedTokenData(blackListedTokenId: ID!): BlackListedToken
    }

    type Mutation{
        deleteJournal(token: String!, collectionId: String!, journalEntryId: String!): String
        deleteCollection(token: String!, collectionId: String!): String
    }

    type BlackListedToken {
        _id: ID
        token: String
        userId: ID
        createdAt: String
        updatedAt: String
    }

    type JournalEntry {
        _id: ID
        title: String
        content: String
        mood: String
        createdBy: ID
        collection: Collection
        createdAt: String
        updatedAt: String
    }

    type User {
        _id: ID
        clerkId: String
        email: String
        collections: [Collection]
        journalEntries: [JournalEntry]
        blackListedTokens: [BlackListedToken]
        createdAt: String
        updatedAt: String
    }

    type Collection {
        _id: ID
        title: String
        description: String
        user: ID
        journalEntries: [JournalEntry]
        createdAt: String
        updatedAt: String
    }
`

export default graphqlTypesDefs;