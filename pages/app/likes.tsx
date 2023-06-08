import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@mui/material";
import { useContext } from "react";
import { DatabaseContext } from "@/context/database";
import WineList from "@/components/WineList";


export default function Likes() {
    const { likes, addLike, deleteLike } = useContext(DatabaseContext);
    return <>
        <Header />
        <Container maxWidth="lg">
            <WineList
                title="Wines you liked"
                wines={likes}
                addWine={addLike}
                deleteWine={deleteLike}
            />
            <Footer />
        </Container>
    </>
}