import { AuthContext } from "@/context/auth";
import { LinearProgress, Fade } from "@mui/material";
import { useContext } from "react";
import { DatabaseContext } from "@/context/database";

export default function Header() {

    const { loading: authLoading } = useContext(AuthContext);
    const {loading: dbLoading} = useContext(DatabaseContext);
    const loading = authLoading || dbLoading;
    return <>
        <Fade
            in={loading}
            style={{
                transitionDelay: loading ? '800ms' : '0ms',
            }}
            unmountOnExit
        >
            <LinearProgress />
        </Fade>
    </>;
}