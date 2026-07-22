"use client";
import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    userId: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (userId: string) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps{ children: ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if(storedUserId) {
            setUserId(storedUserId);
        }
        setIsLoading(false);

    }, []);
    const login = (userId: string) =>{
        localStorage.setItem("userId", userId);
        setUserId(userId);
    }
    const logout =() => {
        setUserId(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        router.push("/login");
    };

return(
        <AuthContext.Provider 
        value={{ 
            userId, 
            isLoggedIn: !!userId, 
            isLoading,
            login, 
            logout}}
            >
                {children}
            </AuthContext.Provider>
    );
};

    export function useAuth(){
        const context = useContext(AuthContext);
        if(context === undefined){
            throw new Error("useAuth must be used within an AuthProvider");
        }
        return context;
    }
