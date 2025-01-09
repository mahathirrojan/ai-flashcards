import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. Extract the most important and relevant information for the flashcards.
8. Aim to create a balanced set of flashcards that covers the topic comprehensively.

Return the data in JSON format:
{
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}
`;

function cleanAndParseJSON(rawText) {
  try {
    // Remove unexpected backticks, "JSON" marker, and surrounding text
    const cleanedText = rawText
      .trim()
      .replace(/```[a-zA-Z\s]*\n?/g, "") // Remove code block markers like ```JSON
      .replace(/```/g, "") // Remove remaining backticks
      .replace(/\\n/g, "") // Remove escaped newlines
      .replace(/[\u0000-\u001F]+/g, ""); // Remove control characters

    console.log("Cleaned Text:", cleanedText); // Debugging output

    // Attempt to parse the cleaned text as JSON
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse cleaned JSON:", error, rawText);
    throw new Error("The API response could not be parsed as JSON.");
  }
}

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic || !topic.trim()) {
      throw new Error("Invalid input: No text provided.");
    }

    const prompt = `${systemPrompt}\nThe chosen topic is "${topic}".`;
    console.log("Prompt Sent:", prompt);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);

    const rawText =
      result.response.text?.() || result.response?.text || "No response";
    console.log("Raw Response:", rawText);

    const flashcards = cleanAndParseJSON(rawText);
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error.message);
    return NextResponse.json(
      { error: { message: error.message || "An error occurred." } },
      { status: 500 }
    );
  }
}
