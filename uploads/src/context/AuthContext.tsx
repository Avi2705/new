import { createContext, useCallback, useState, type ReactNode } from "react";
import { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthContext({children}:{children: ReactNode}){
    const [token, setToken] = useState<string |null>(()=> localStorage.getItem("token"))
    const [user, setUser] = useState<User |null>(()=>{
      const raw =  localStorage.getItem("user");
    return  raw ? (JSON.parse(raw) as User): null;
    });
    const [role, setRole] = useState<"user" | "vendor" | null>(()=>{
        const raw = localStorage.getItem("role")
        return raw === "user" || raw === "vendor" ? raw : null;
    })
    const [isloading , setIsLoading] = useState<boolean>(()=>{
        return Boolean(localStorage.getItem("token"))
    })
    const [networkError, setNetworkError] = useState<string | null>(null);
    const verifySession = useCallback(async () =>{
        const storedToken = localStorage.getItem("token")
        const storedRole = localStorage.getItem("role")

        if(!storedToken ||  !storedRole){
            const res = await 
        }
    })
}