import { CorsOptions } from "cors"

const whitelist = [process.env.SWAGGER_URL, process.env.FRONTEND_URL, process.env.BACKEND_URL];

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            console.log(origin);
            callback(new Error('Not allowed by CORS'))
        }
    }
}