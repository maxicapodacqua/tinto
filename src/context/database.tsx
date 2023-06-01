import { Databases } from "appwrite";
import { createContext } from "react";
import { appwriteDatabase } from "../../appwrite";


export const DatabaseContext = createContext<DatabaseContextValue>({} as DatabaseContextValue);

// type AppwriteUser = Awaited<ReturnType<typeof appwriteAccount['get']>>;

type DatabaseContextValue = {
    database: Databases,
    // user: AppwriteUser | null,
    // login: (email: string, password: string) => Promise<void>,
    // logout: () => Promise<void>,
    // signup: (email: string, password: string, name?: string) => Promise<void>,
    // loading: boolean,
};




export function DatabaseContextProvider({ children }: React.PropsWithChildren): JSX.Element {
    return <DatabaseContext.Provider value={{
        database: appwriteDatabase
    }}>
        {children}
    </DatabaseContext.Provider>;
}


