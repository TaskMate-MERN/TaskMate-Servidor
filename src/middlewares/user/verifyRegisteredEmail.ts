import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../../models/User.model";

export const verifyRegisteredEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } : Pick<IUser, 'email'> = req.body;
        const registeredEmail = await User.findOne({email});

        if (registeredEmail) {
            res.status(409).send('El email ya está registrado! Utiliza otro.');
            return;
        }

        next();
    } catch (error) {
        res.status(500).send('Hubo un error!');
    }
}