import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../../models/User.model";

export const verifyRegisteredEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email }: Pick<IUser, 'email'> = req.body;

        // Buscar el usuario por correo electrónico
        const registeredUser = await User.findOne({ email });

        if (registeredUser) {
            // Si el usuario está registrado pero no confirmado
            if (!registeredUser.verified) {
                res.status(404).json({
                    success: false,
                    message: "El correo ya está registrado pero no confirmado.Seras redirigido al login para la confirmacion ",
                    code: "USER_NOT_CONFIRMED", // Código para el frontend
                });
                return;
            }

            // Si el usuario ya está registrado y confirmado
            res.status(409).json({
                success: false,
                message: "El correo ya está registrado y confirmado. Utiliza otro.",
                code: "EMAIL_ALREADY_IN_USE", // Código para el frontend
            });
            return;
        }

        // Si el correo no está registrado, continuar con el flujo normal
        next();
    } catch (error) {
        console.error("Error en verifyRegisteredEmail:", error);
        res.status(500).json({
            success: false,
            message: "Hubo un error en el servidor.",
        });
    }
};