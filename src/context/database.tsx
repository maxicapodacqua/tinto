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
    getStats: (wine_id: string, type: string) => Promise<Models.Document | null>,
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

    const getStats = async (wine_id: string, type: string) :Promise<Models.Document | null> => {
        try {
            setLoading(true);
            const resp = await appwriteDatabase.listDocuments('tinto', 'stats', [
                Query.equal('wine_id', wine_id),
                Query.equal('type', type),
            ]);
            return resp.total > 0 ? resp.documents[0] : null
        } finally {
            setLoading(false);
        }
    };

    return <DatabaseContext.Provider value={{
        database: appwriteDatabase,
        loading,
        likes,
        addLike,
        deleteLike,
        getStats
    }}>
        {children}
    </DatabaseContext.Provider>;
}


