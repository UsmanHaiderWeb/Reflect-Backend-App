import { clerkClient } from "@clerk/express";
import User from "../../models/user.model.js";
import verifyToken from "../../helpers/verifyToken.js";
import generateToken from "../../helpers/generateToken.js";

const registerUser = async (req, res) => {
    let token = req.headers?.authorization?.split(' ')[1] || req.cookies.token;
    let tokenData = await verifyToken(token);

    let { clerkId, email } = req.body;

    try {
        let clerkDataOfUser;
        try {
            clerkDataOfUser = await clerkClient.users.getUser(clerkId);
            let user = clerkDataOfUser && await User.findOne({ clerkId, email });

            if(clerkDataOfUser && user) {
                if(user.email != clerkDataOfUser.primaryEmailAddress.emailAddress) {
                    user.email != clerkDataOfUser.primaryEmailAddress.emailAddress;
                    user.save();
                }

                if(tokenData && tokenData.clerkId == clerkId) {
                    return res.status(200).json({message: 'User already exists'});
                } else {
                    let generatedToken = generateToken({ clerkId, email, _id: user._id });
                    return res.status(200).json({message: 'User already exists', token: generatedToken});
                }
            }
        } catch (error) {
            clerkDataOfUser = null;
        }

        if(!clerkDataOfUser) return res.status(400).json({message: 'Unable to register user.'});
        if(!clerkId || !email) return res.status(400).json({message: 'Missing required fields'});
        
        const newUser = await User.create({
            clerkId,
            email,
        });

        let generatedToken = generateToken({ clerkId: newUser.clerkId, email: clerkDataOfUser.email, _id: newUser._id });
        res.status(201).json({message: 'The user has been registered Successfully.', token: generatedToken});
    } catch (error) {
        console.log("Error in registerUser: ", error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export default registerUser;