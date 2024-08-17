"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
    }
    const handleSubmit = async () => {
        return('api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }), // Assuming `text` is defined in your state
        })
          .then((res) => res.json())
          .then((data) => setFlashcards(data)); // Assuming `setFlashcards` is a state setter
      };
    
      const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };
    
      // Ensure you don't redeclare `handleOpen` and `handleClose`
      const handleOpen = () => {
        setOpen(true); // Assuming `setOpen` is a state setter
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const saveFlashcards = async () => {
        if (!name) {
          alert('Please enter a name');
          return;
        }
      
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
      
        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
      
          if (collections.find((m) => m.name === name)) {
            alert('Flashcard collection with the same name already exists.');
            return;
          }
      
          collections.push({ name });
          batch.set(userDocRef, { flashcards: collections }, { merge: true });
        } else {
          batch.set(userDocRef, { flashcards: [{ name }] });
        }
      
        await batch.commit();
        handleClose()
        router.push('/flashcards')
      }
      return (
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Generate Flashcards
            </Button>
          </Box>
      
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">Flashcards Preview</Typography>
              <Grid container spacing={3}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardActionArea onClick={() => handleCardClick(index)}>
                        <CardContent>
                          <Box
                            sx={{
                              perspective: '1000px',
                              '& > div': {
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                position: 'relative',
                                width: '100%',
                                height: '200px',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                              },
                            }}
                          >
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h5" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      );
    }