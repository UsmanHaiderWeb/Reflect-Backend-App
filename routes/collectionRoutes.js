import express from 'express';
import createCollection from '../controllers/collectionControllers/createCollection.controller.js';
import authenticateUser from '../middlewares/authenticateUser.js';
import updateCollection from '../controllers/collectionControllers/updateCollection.js';

const collectionRouter = express.Router();

collectionRouter.post('/create', authenticateUser, createCollection);
collectionRouter.post('/update', authenticateUser, updateCollection);

export default collectionRouter;