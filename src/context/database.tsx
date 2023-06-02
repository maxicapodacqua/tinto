import { Databases, ID, Models, Permission, Query, Role } from "appwrite";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { appwriteDatabase } from "../../appwrite";
import { AuthContext } from "./auth";


export const DatabaseContext = createContext<DatabaseContextValue>({} as DatabaseContextValue);

type DatabaseContextValue = {
    database: Databases,
    loading: boolean,
    likes: Models.Document[],
    addLike: (user: Models.User<{}>, wine: WineModel) => Promise<void>,
    deleteLike: (id: string) => Promise<void>,
};


type WineModel = { wine_id: string, type: string, name: string };

export function DatabaseContextProvider({ children }: React.PropsWithChildren): JSX.Element {

    const [likes, setLikes] = useState<Models.Document[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading && user) {
            setLoading(true);
            appwriteDatabase.listDocuments('tinto', 'likes', [
                Query.orderDesc('$createdAt'),
            ])
                .then((resp) => {
                    setLikes(resp.documents);
                })
                .catch((reason) => {
                    console.error(reason);
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [user, authLoading]);


    const addWineToCollection = async (user: Models.User<{}>, wine: WineModel, collection: 'likes' | 'dislikes') => {
        try {
            setLoading(true);
            const role = Role.user(user.$id);
            const resp = await appwriteDatabase.createDocument('tinto', collection, ID.unique(), wine,
                [
                    Permission.read(role),
                    Permission.delete(role),
                    Permission.update(role),
                    Permission.write(role),
                ]);
            return resp;
        } finally {
            setLoading(false);
        }
    }
    const addLike = async (user: Models.User<{}>, wine: WineModel) => {
        const resp = await addWineToCollection(user, wine, 'likes');
        setLikes([resp, ...likes]);
    }

    const deleteWineFromCollection = async (id: string, collection: 'likes' | 'dislikes') => {
        try {
            setLoading(true);
            await appwriteDatabase.deleteDocument('tinto', collection, id);
        } finally {
            setLoading(false);
        }
    };

    const deleteLike = async (id: string) => {
        await deleteWineFromCollection(id, 'likes');
        const likedWineUpdated = likes.filter((w) => w.$id !== id);
        setLikes(likedWineUpdated);
    };

    return <DatabaseContext.Provider value={{
        database: appwriteDatabase,
        loading,
        likes,
        addLike,
        deleteLike,
    }}>
        {children}
    </DatabaseContext.Provider>;
}


