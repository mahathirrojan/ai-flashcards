'use client';
import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, CardActionArea, CardContent } from '@mui/material';

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuizData(data.quiz);
        setQuestionIndex(0);
        setNextQuestion(data.quiz, 0);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('An error occurred while generating the quiz');
    } finally {
      setLoading(false);
    }
  };

  const setNextQuestion = (data, index) => {
    if (!Array.isArray(data) || data.length === 0 || index >= data.length) return;
    const next = data[index];
    setCurrentAnswer(next.answer);
    setOptions(next.questions);
    setQuestionIndex(index + 1);
    setSelectedOption(null); // Reset selected option
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.text);
    if (option.isCorrect) {
      setScore(score + 1);
    }

    // Delay the next question to allow the user to see the color feedback
    setTimeout(() => setNextQuestion(quizData, questionIndex), 1000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate a Quiz
        </Typography>

        {/* Topic Input Field */}
        <TextField
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          label="Enter quiz topic"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading || !topic}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </Button>

        {/* Error Display */}
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      {currentAnswer && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5">Answer: {currentAnswer.text}</Typography>
        </Box>
      )}

      {quizData.length > 0 && questionIndex <= 10 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Quiz (Question {questionIndex} of 10)</Typography>
          <Grid container spacing={3}>
            {options.map((option, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                    onClick={() => handleOptionClick(option)}
                    sx={{
                      backgroundColor:
                        selectedOption === option.text
                          ? option.isCorrect
                            ? 'lightgreen'
                            : 'lightcoral'
                          : 'white',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="p">
                        {option.text}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">
              Current Score: {score}
            </Typography>
          </Box>
        </Box>
      )}

      {questionIndex > 10 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6">
            Quiz Complete! Final Score: {score} out of 10
          </Typography>
        </Box>
      )}
    </Container>
  );
}
