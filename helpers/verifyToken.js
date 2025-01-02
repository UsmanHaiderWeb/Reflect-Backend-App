import jsonwebtoken from "jsonwebtoken";

const verifyToken = (token) => {
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
        return data
    } catch (error) {
        console.log("verifyToken error: ", error.message)
        return null;
    }
}

export default verifyToken;