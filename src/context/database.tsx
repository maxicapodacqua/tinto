import { Databases, ID, Models, Permission, Query, Role } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { appwriteDatabase } from "../../appwrite";
import { AuthContext } from "./auth";


export const DatabaseContext = createContext<DatabaseContextValue>({} as DatabaseContextValue);

type DatabaseContextValue = {
    database: Databases,
    refresh: () => Promise<void>,
    loading: boolean,
    likes: WineModel[],
    addLike: (user: Models.User<{}>, wine: WineInputModel) => Promise<void>,
    deleteLike: (id: string | string[]) => Promise<void>,
    getStats: (wine_id: string, type: string) => Promise<Models.Document | null>,
};


type WineInputModel = { wine_id: string, type: string, name: string };
export type WineModel = WineInputModel & Models.Document;

export function DatabaseContextProvider({ children }: React.PropsWithChildren): JSX.Element {

    const [likes, setLikes] = useState<WineModel[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading && user) {
            refresh();
        }
    }, [user, authLoading]);

    const refresh = async () => {
        setLoading(true);
        appwriteDatabase.listDocuments('tinto', 'likes', [
            Query.orderDesc('$createdAt'),
        ])
            .then((resp) => {
                setLikes(resp.documents as WineModel[]);
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
        setLikes([resp as WineModel, ...likes]);
    }

    const deleteWinesFromCollection = async (ids: string[], collection: 'likes' | 'dislikes') => {
        setLoading(true);

        const delayInc = 500;
        const proms: Promise<void>[] = [];

        // Adding a delay on each delete to avoid server bottleneck on appwrite
        ids.forEach((id, i) => {
            proms.push(
                new Promise(
                    (resolve) => setTimeout(resolve, delayInc * (i + 1))
                )
                    .then(() => {
                        appwriteDatabase.deleteDocument('tinto', collection, id)
                    })
            );
        });
        try {
            await Promise.all(proms);
        } finally {
            setLoading(false);
        }
    };

    const deleteLike = async (id: string | string[]) => {
        let ids: string[];
        if (!Array.isArray(id)) {
            ids = [id];
        } else {
            ids = id;
        }
        await deleteWinesFromCollection(ids, 'likes');
        const likedWineUpdated = likes.filter((w) => !ids.includes(w.$id));
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


