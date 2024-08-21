import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a quiz generator for a Jeopardy-style game. Your task is to generate questions and answers where the user is presented with an answer first and must select the correct question. Follow these guidelines:

1. Create concise and relevant answers for the chosen topic.
2. Provide 10 sets of questions, ensuring that only one question is correct for each answer.
3. Each quiz question should have one correct question and five incorrect ones (so in total 6 options) .
4. Ensure the questions are clear and distinct.
5. Escape all double quotes within strings in the JSON output by adding a backslash before them.
6. Avoid using any characters or formatting that may lead to parsing errors, such as unescaped double quotes or unsupported characters.
7. Return the data in the following JSON format:
{
  "quiz": [
    {
      "answer": { "text": "string", "correctQuestion": "string" },
      "questions": [
        { "text": "string", "isCorrect": boolean }
      ]
    }
  ]
}`;

function cleanAndParseJSON(jsonString) {
  let cleanedString = jsonString;

  try {
    cleanedString = cleanedString
      .replace(/\\n/g, '') 
      .replace(/\\"/g, '"') 
      .replace(/\\'/g, "'") 
      .replace(/\\\\/g, '\\') 
      .replace(/"\s*{/, '{') 
      .replace(/}\s*"/, '}') 
      .replace(/\\\"/g, '"') 
      .replace(/"{/g, '{').replace(/}"/g, '}') 
      .replace(/\"\[/g, '[').replace(/\]\"/g, ']'); 

    return JSON.parse(cleanedString);
  } catch (error) {
    console.error('Failed to parse cleaned JSON:', error, cleanedString);
    return null; 
  }
}

export async function POST(req) {
  const openai = new OpenAI();

  try {
    const { topic } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `The chosen topic is "${topic}".` },
      ],
      model: "gpt-4",
    });

    let responseContent = completion.choices[0].message.content;

    const quiz = cleanAndParseJSON(responseContent);

    if (quiz) {
      return NextResponse.json(quiz);
    } else {
      return NextResponse.json({ error: "Failed to generate a quiz. Please try again." }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
