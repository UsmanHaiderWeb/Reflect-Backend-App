import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.js';
import createJournalEntry from '../controllers/journalControllers/createJournal.controller.js';
import updateJournalEntry from '../controllers/journalControllers/updateJournalEntry.controller.js';

const journalRouter = express.Router();

journalRouter.post('/create', authenticateUser, createJournalEntry);
journalRouter.post('/update', authenticateUser, updateJournalEntry);

export default journalRouter;