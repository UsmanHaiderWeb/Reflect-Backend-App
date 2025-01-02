import { clerkClient } from "@clerk/express";
import verifyToken from "../helpers/verifyToken.js";
import User from "../models/user.model.js";

const authenticateUser = async (req, res, next) => {
    let token = req.headers?.authorization?.split(' ')[1] || req.cookies.token;
    let tokenData = await verifyToken(token);

    if (!tokenData) return res.status(401).json({ message: 'Unauthorized' });

    let clerkDataOfUser;
    try {
        console.log("working");
        clerkDataOfUser = await clerkClient.users.getUser(tokenData.clerkId);
        console.log("clerkDataOfUser: ", clerkDataOfUser);
    } catch (error) {
        clerkDataOfUser = null;
        console.log('User or clerkUser does not Exist.');
    }

    if (!clerkDataOfUser) return res.status(401).json({ message: 'Unauthorized' });

    try {
        let user = await User.findOne({ clerkId: tokenData.clerkId, email: clerkDataOfUser.emailAddresses[0].emailAddress });
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export default authenticateUser;