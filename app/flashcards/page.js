'use client'
import { useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { Grid, Card, Container, CardActionArea, CardContent, Typography } from "@mui/material"
import { collection, getDoc, setDoc, doc } from "firebase/firestore"
import db from "@/firebase"
import { useRouter } from "next/router"

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collection = docSnap.data().flashcards || []
                setFlashcards(collection)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()

    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
