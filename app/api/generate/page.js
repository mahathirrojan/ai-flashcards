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