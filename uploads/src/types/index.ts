export interface User{
id: string;
name: string;
email:string;
role: string;
isVerified?:boolean;
createdAt?:boolean
}

export interface AuthContextType{
    token: string |null;
    user: string |null;
    role:"user" | "vendor" |"null";
    login: (token: string, user:User, role: "user" | "vedor")=>void;
    logOut: ()=> void;
}