import { USER_TOKEN_EXPIRY_IN_SECONDS } from "src/constants/settings";

export const cookieConfig = {
    name: 'Auth',
    info: {
        httpOnly: true, // prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // use HTTPS in prod
        sameSite: 'strict' as const,
        maxAge: USER_TOKEN_EXPIRY_IN_SECONDS * 1000, 
    }
}
