'use client'

import {useUser} from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import{collection,doc,getDoc,detDocs, getDocs} from 'firebase/firestore'
import db from '@/firebase'
import { Grid, Card, Container, CardActionArea, CardContent, Typography, Box, Button } from "@mui/material"

import { useSearchParams} from 'next/navigation'

export default function FlashCard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []


            docs.forEach((doc) => {
                flashcards.push({id:doc.id,...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()

    }, [user, search])

    const handleCardClick = (index) => {
        setFlipped((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      };

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return(
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{mt: 4}}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <Box
                      sx={{
                        perspective: '1000px',
                        height: '200px',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                          }}
                        >
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            </Grid>
               
        </Container>
    )
}
