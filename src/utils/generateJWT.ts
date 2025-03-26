import jwt from 'jsonwebtoken';

type PayloadUser = {
    id: string;
}





export const generateJWT = (payload: object): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está definido en el entorno.");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};
