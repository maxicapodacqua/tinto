import { AuthContext } from "@/context/auth";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function () :JSX.Element {
    const {logout, user, loading} = useContext(AuthContext);


    const router = useRouter();


    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router])

    
    return <Button onClick={async() => {
        await logout();
    }}>Logout</Button>
}