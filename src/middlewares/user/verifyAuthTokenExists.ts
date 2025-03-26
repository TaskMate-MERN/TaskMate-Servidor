import { Request, Response, NextFunction } from "express"
import { IToken, Token } from "../../models/Token.model";
import { IUser, User } from "../../models/User.model";

declare global{
    namespace Express{
        interface Request{
            authToken: IToken;
            user: IUser;
        }
    }
}
 
export const verifyAuthTokenExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token }: Pick<IToken, 'token'> = req.body;
        const authToken = await Token.findOne({ token });

        if (!authToken) {
            res.status(409).send('El token no es válido');
            return;
        }

        const user = await User.findById(authToken.user);

        if (!user) {
            res.status(409).send('El token no es válido');
            return;
        }

        req.authToken = authToken;
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send('Hubo un error!');
    }
}