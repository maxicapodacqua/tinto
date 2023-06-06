import { Databases, ID, Models, Permission, Query, Role } from "appwrite";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { appwriteDatabase } from "../../appwrite";
import { AuthContext } from "./auth";


export const DatabaseContext = createContext<DatabaseContextValue>({} as DatabaseContextValue);

type DatabaseContextValue = {
    database: Databases,
    refresh: () => Promise<void>,
    loading: boolean,
    likes: WineModel[],
    addLike: (user: Models.User<{}>, wine: WineInputModel) => Promise<void>,
    deleteLike: (id: string) => Promise<void>,
    getStats: (wine_id: string, type: string) => Promise<Models.Document | null>,
};


type WineInputModel = { wine_id: string, type: string, name: string };
export type WineModel = WineInputModel & Models.Document;

export function DatabaseContextProvider({ children }: React.PropsWithChildren): JSX.Element {

    const [likes, setLikes] = useState<Models.Document[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading && user) {
            refresh();
            // setLoading(true);
            // appwriteDatabase.listDocuments('tinto', 'likes', [
            //     Query.orderDesc('$createdAt'),
            // ])
            //     .then((resp) => {
            //         setLikes(resp.documents);
            //     })
            //     .catch((reason) => {
            //         console.error(reason);
            //     }).finally(() => {
            //         setLoading(false);
            //     });
        }
    }, [user, authLoading]);

    const refresh = async () => {
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



    const addWineToCollection = async (user: Models.User<{}>, wine: WineInputModel, collection: 'likes' | 'dislikes') => {
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
    const addLike = async (user: Models.User<{}>, wine: WineInputModel) => {
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
        // TODO: make this a bulk delete
        await deleteWineFromCollection(id, 'likes');
        const likedWineUpdated = likes.filter((w) => w.$id !== id);
        setLikes(likedWineUpdated);
    };

    const getStats = async (wine_id: string, type: string): Promise<Models.Document | null> => {
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
        refresh,
        loading,
        likes,
        addLike,
        deleteLike,
        getStats
    }}>
        {children}
    </DatabaseContext.Provider>;
}


