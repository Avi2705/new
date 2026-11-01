export interface AuthUserPayload {
    id: string;
    role: "user" | "vendor";
    email?: string;
    name?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUserPayload;
        }
    }
}
