'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, Typography, Container, AppBar, Toolbar, Button, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async () =>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth="lg">
      <Head>
        <title>AI Flashcards</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>AI Flashcards</Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color="inherit">SignUp</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign: 'center', my:4
      }}>
        <Typography variant="h2" gutterBottom>Welcome to AI Flashcards!</Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          Create flashcards from your text and learn at your own pace.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2}}> Get Started </Button>

        </Box>
        <Box sx={{my:6, textAlign: 'center'}}>
          <Typography variant="h4" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom> Easy Text Input</Typography>
              <Typography>
                {' '}
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
              <Typography>
                {' '}
                Our AI intelligently breaks down your text into concise flashcards, perfect for studyingr.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                {' '}
                Access your flashcards from any device, at any time. Study on the go with ease.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{my: 6, textAlign: 'center'}}>
          <Typography variant="h4" gutterBottom>Pricing</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box 
                sx = {{
                  p: 3,
                  border: '1px.solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                }}
              >

              <Typography variant="h5" gutterBottom> Basic</Typography>
              <Typography variant="h6" gutterBottom> $5 / Month</Typography>
              <Typography>
                {' '}
               Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}> Choose Basic </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
            <Box 
                sx = {{
                  p: 3,
                  border: '1px.solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                }}
              >
              <Typography variant="h5" gutterBottom> Pro</Typography>
              <Typography variant="h6" gutterBottom>$10/ Month</Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}> Choose Pro </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      
    </Container>
    
  );
}
