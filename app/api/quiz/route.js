import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a quiz generator for a Jeopardy-style game. Your task is to generate questions and answers where the user is presented with an answer first and must select the correct question. Follow these guidelines:

1. Create concise and relevant answers for the chosen topic.
2. Provide 10 sets of questions, ensuring that only one question is correct for each answer.
3. Each quiz question should have one correct question and five incorrect ones, so in total 6 options, 5 incorrect and 1 correct in "questions" determined by the isCorrect boolean. 
4. Ensure the questions are clear and distinct.
5. Make sure that there are 6 options for the user 
6. Return only valid JSON. Do not include any extra text, explanations, or formatting outside of the JSON object.

Return the data in JSON format:
{
  "quiz": [
    {
      "answer": { "text": "string"},
      "questions": [
        { "text": "string", "isCorrect": boolean }
      ]
    }
  ]
}
`;

function cleanAndParseJSON(rawText) {
  try {
    const cleanedText = rawText
      .trim() // Remove leading/trailing whitespace
      .replace(/```json\n?/gi, "") // Remove backticks and "json" markers
      .replace(/```/g, "") // Remove remaining backticks
      .replace(/\\n/g, "") // Remove escaped newlines
      .replace(/\\\"/g, '"') // Replace escaped quotes
      .replace(/[\u0000-\u001F]+/g, ""); // Remove control characters

    console.log("Cleaned Text:", cleanedText); // Debugging output

    const parsedData = JSON.parse(cleanedText);

    // Ensure the correct question is included in the options and shuffle them
    parsedData.quiz.forEach((item) => {
      const correctQuestion = {
        text: item.answer.text,
        isCorrect: true,
      };

      // Check if the correct question is already in the list to avoid duplication
      // if (!item.questions.some((q) => q.text === correctQuestion.text)) {
      //   item.questions.push(correctQuestion);
      // }

      // Shuffle the questions to randomize the order
      item.questions = item.questions.sort(() => Math.random() - 0.5);
    });

    return parsedData;
  } catch (error) {
    console.error("Failed to parse cleaned JSON:", error, rawText);
    throw new Error("The API response could not be parsed as JSON.");
  }
}

export async function POST(req) {
  try {
    const { topic } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${systemPrompt}\nThe chosen topic is "${topic}".`;
    console.log("Prompt Sent:", prompt);

    const result = await model.generateContent(prompt);

    // Log the full result and raw response
    console.log("Full Result Object:", JSON.stringify(result, null, 2));

    const rawText =
      result.response.text?.() || result.response?.text || "No response";
    console.log("Raw Response:", rawText);

    // Clean and parse the raw response
    const quizData = cleanAndParseJSON(rawText);

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      {
        error: {
          message:
            error.message || "An error occurred while generating the quiz.",
        },
      },
      { status: 500 }
    );
  }
}
