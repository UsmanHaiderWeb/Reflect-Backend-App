import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import { ApolloServer } from '@apollo/server';
import userRouter from './routes/userRoutes.js';
import resolvers from './helpers/graphql/resolvers/graphqlResolvers.js';
import graphqlTypesDefs from './helpers/graphql/graphqlTypesDefs.js';
import cookieParser from 'cookie-parser';
import collectionRouter from './routes/collectionRoutes.js';
import connectToDb from './config/db-connection.js';
import journalRouter from './routes/journal.routes.js';

const app = express();

const createServer = async () => {
    try {
        console.log("SERVER STARTED");
        config();
        await connectToDb()
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        }))
        app.use(cookieParser());
        app.use(morgan('dev'));
        app.use(helmet());
        
        app.get('/', (req, res) => res.status(200).json({message: 'We got you. If you want to see our API, go to docs.'}));

        const graphqlServer = new ApolloServer({
            typeDefs: graphqlTypesDefs,
            resolvers,
        });
        await graphqlServer.start();

        app.use('/graphql', expressMiddleware(graphqlServer));
        app.use('/api/user', userRouter);
        app.use('/api/journal', journalRouter);
        app.use('/api/collection', collectionRouter);

        app.use((err, req, res, next) => {
            console.log(err.message);
            res.json({message: "Sorry for inconvinience. Server is down."});
        });

    } catch (error) {
        console.log("SERVER STOPPED: ", error.message);
        process.exit(1);
    }
};

await createServer();
export default app;




/*
old package.json file

{
  "name": "reflect-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "A backend service build for Pinterest (personal project)",
  "main": "app.js",
  "scripts": {
    "build": "npm install --legacy-peer-deps",
    "dev": "node ./app.js"
  },
  "author": "Usman Haider",
  "license": "ISC",
  "dependencies": {
    "@apollo/server": "^4.11.2",
    "@clerk/express": "^1.3.23",
    "bcrypt": "^5.1.1",
    "cloudinary": "^2.5.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "graphql": "^16.9.0",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.8.4",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "streamifier": "^0.1.1",
    "validator": "^13.12.0"
  }
}

*/