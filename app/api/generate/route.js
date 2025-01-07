import { NextResponse } from "next/server";
import { google } from "googleapis";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines: 

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. Extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.

Return the result in JSON format:
{
    "flashcards": [
        {
            "front": "string",
            "back": "string"
        }
    ]
}
`;

export async function POST(req) {
  try {
    const data = await req.text();

    const response = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GEMINI_PROJECT_ID}/locations/${process.env.GEMINI_LOCATION}/publishers/google/models/gemini:predict`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ content: `${systemPrompt}\n${data}` }],
          parameters: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Gemini API error: ${errorResponse.error?.message || "Unknown error"}`
      );
    }

    const result = await response.json();
    const flashcards = JSON.parse(result.predictions[0]?.text);

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
