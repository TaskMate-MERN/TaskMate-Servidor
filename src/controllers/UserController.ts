import { Request, Response } from "express";
import { IUser, User } from '../models/User.model';
import { encryptPassword } from "../utils/encryptPassword";
import { Token, TokenType } from "../models/Token.model";
import { generarAuthToken } from '../utils/generateAuthToken';
import { comparePassword } from "../utils/comparePassword";
import AuthEmail from "../emails/AuthEmail";
import { generateJWT } from "../utils/generateJWT";

export default class UserController {
    static createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { password, email }: IUser = req.body;

            const user = new User(req.body);
            const { id } = user;

            user.password = await encryptPassword(password);

            const authToken = new Token({
                token: generarAuthToken(),
                type: TokenType['CONFIRM_ACCOUNT'],
                user: id,
            })

            const { token } = authToken;

            await Promise.allSettled([user.save(), authToken.save(), AuthEmail.sendAuthToken(email, token)]);
            res.status(201).send('Usuario creado exitosamente! Te hemos enviado un email para confirmar tu cuenta!');
        } catch (error) {
            res.status(500).send('Hubo un error!');
        }
    }

    static login = async (req: Request, res: Response): Promise<void> => {
        try {
           
            const { user: { id, verified, email, password: userPassword } } = req;
            const { password }: IUser = req.body;
            console.log("Contenido de req.user antes de login:", req.user);
            console.log("Email recibido en el middleware verifyUserExists:", email);
            //Verifies that the user is verified

            if (!verified) {
                const authToken = new Token({
                    token: generarAuthToken(),
                    type: TokenType['CONFIRM_ACCOUNT'],
                    user: id,
                });

                const { token } = authToken;
                await Promise.allSettled([authToken.save(), AuthEmail.sendAuthToken(email, token)]);
                res.status(409).send('Tu cuenta no está confirmada! Te hemos enviado un email para confirmar tu cuenta!');
                return;
            }

            //Verifies that the password is correct

            const compareResult = await comparePassword(password, userPassword);

            if (!compareResult) {
                res.status(401).send('El password es incorrecto!');
                return;
            }

            const jwt = generateJWT({
                id 
            });
            res.send(jwt);

        } catch (error) {
            
            console.error("Error en login:", error);
            res.status(500).send('Hubo un error del login!');
        }
    
    }

    
    static requestAuthToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user: { id, verified, email } } = req;

            if (verified) {
                res.status(409).send('La cuenta ya está confirmada!');
                return;
            }

            const authToken = new Token({
                token: generarAuthToken(),
                type: TokenType['CONFIRM_ACCOUNT'],
                user: id,
            })

            const { token } = authToken;
            await Promise.allSettled([authToken.save(), AuthEmail.sendAuthToken(email, token)]);
            res.send('Te hemos enviado un email para confirmar tu cuenta!');

        } catch (error) {
            res.send('Tu cuenta ha sido confirmada!');
        }
    }

    static requestPasswordChange = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user: { id, email } } = req;

            const authToken = new Token({
                token: generarAuthToken(),
                type: TokenType['PASSWORD_CHANGE'],
                user: id,
            })

            const { token } = authToken;
            await Promise.allSettled([authToken.save(), AuthEmail.sendPasswordToken(email, token)]);
            res.send('Te hemos enviado un email para confirmar el cambio de password!');

        } catch (error) {
            res.send('Tu cuenta ha sido confirmada!');
        }
    }

    static confirmUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { authToken } = req;
            const { type } = authToken;

            if (type !== TokenType['CONFIRM_ACCOUNT']) {
                res.status(409).send('El token no es válido');
                return;
            }
 
            const { user } = req;
            user.verified = true;
            await Promise.allSettled([user.save(), authToken.deleteOne()]);

            res.send('Tu cuenta ha sido confirmada!');
        } catch (error) {
            res.status(500).send('Hubo un error!');
        }
    }

    static confirmPasswordToken = (req: Request, res: Response): void => {
        const { authToken: { type } } = req;
        
        if (type !== TokenType['PASSWORD_CHANGE']) {
            res.status(409).send('El token no es válido');
            return;
        }

        res.send('Introduce los siguientes datos para cambiar tu password!');
    }

    static changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user, authToken } = req;
            const { type } = authToken;
            const { password } = req.body;

            if (type !== TokenType['PASSWORD_CHANGE']) {
                res.status(409).send('El token no es válido');
                return;
            }

            user.password = await encryptPassword(password);
            await Promise.allSettled([user.save(), authToken.deleteOne()]);

            res.send('El password fue modificado exitosamente!');
        } catch (error) {
            res.status(500).send('Hubo un error!');
        }
    }
}