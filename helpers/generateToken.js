import jsonwebtoken from "jsonwebtoken";

const generateToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
}

export default generateToken;