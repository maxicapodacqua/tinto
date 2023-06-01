import { ID } from "appwrite";
import { createContext, useEffect, useState } from "react";
import { appwriteAccount } from "../../appwrite";


export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

type AppwriteUser = Awaited<ReturnType<typeof appwriteAccount['get']>>;

type AuthContextValue = {
    user: AppwriteUser | null,
    login: (email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    signup: (email: string, password: string, name?: string) => Promise<void>,
    loading: boolean,
};




export function AuthContextProvider({ children }: React.PropsWithChildren): JSX.Element {

    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        setLoading(true);
        appwriteAccount.get()
            .then((resp) => {
                setUser(resp);
            })
            .catch((reason) => {
                console.log(reason);
                setUser(null);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            await appwriteAccount.createEmailSession(email, password)
            setUser(await appwriteAccount.get());

        } finally {
            setLoading(false);
        }

    }

    const logout = async () => {
        try {
            setLoading(true);
            await appwriteAccount.deleteSessions();
            setUser(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const signup = async (email: string, password: string, name?: string) => {
        try {
            setLoading(true);
            await appwriteAccount.create(ID.unique(), email, password, name);
            await login(email, password);
        } finally {
            setLoading(false);
        }
    }

    // if (!user) {
    //     return <></>;
    // }



    return <AuthContext.Provider value={{
        user,
        login,
        logout,
        signup,
        loading,
    }}>
        {children}
    </AuthContext.Provider>;
}


