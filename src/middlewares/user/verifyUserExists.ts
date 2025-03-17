import { Request, Response, NextFunction } from "express"
import { User, IUser } from '../../models/User.model';

declare global{
    namespace Express{
        interface Request{
            user: IUser;
        }
    }
}

export const verifyUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email }: Pick<IUser, 'email'> = req.body;
        const user = await User.findOne({ email });
     

        if (!user) {
            res.status(404).send('No se encontró al usuario con el email registrado!');
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send('Hubo un error de verificacion usuario!');
    }
}