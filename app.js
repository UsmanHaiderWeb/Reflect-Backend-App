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
        config();
        await connectToDb()
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors({
            origin: '*',
            credentials: true
        }))
        app.use(cookieParser());
        app.use(morgan('dev'));
        app.use(helmet());

        const graphqlServer = new ApolloServer({
            typeDefs: graphqlTypesDefs,
            resolvers,
        });
        await graphqlServer.start();

        app.use('/graphql', expressMiddleware(graphqlServer));
        app.get('/', (req, res) => res.status(200).json({message: 'We got you. If you want to see our API, go to docs.'}));
        app.use('/api/user', userRouter);
        app.use('/api/journal', journalRouter);
        app.use('/api/collection', collectionRouter);

        app.use((err, req, res, next) => {
            console.log(err.message);
            res.json({message: "Sorry for inconvinience. Server is down."});
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.log("SERVER STOPPED: ", error.message);
        process.exit(1);
    }
};

createServer();
export default app;