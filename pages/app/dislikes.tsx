import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@mui/material";
import { useContext } from "react";
import { DatabaseContext } from "@/context/database";
import WineList from "@/components/WineList";


export default function Dislikes() {
    const { dislikes, addDislike, deleteDislike } = useContext(DatabaseContext);
    return <>
        <Header />
        <Container maxWidth="lg">
            <WineList
                title="Wines you disliked :("
                wines={dislikes}
                addWine={addDislike}
                deleteWine={deleteDislike}
            />
            <Footer />
        </Container>
    </>
}