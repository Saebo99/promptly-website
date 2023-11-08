export async function POST(req: Request): Promise<Response> {
  console.log("req.body", req.body);
  const data = await req.json();
  console.log(data);

  const { promptDescription } = data;

  console.log("promptDescription: ", promptDescription);

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a proffesional prompt engineer for ai models.`,
      },
      {
        role: "user",
        content: `Create a prompt for an ai model. Below is an example of a prompt for a customer service model: 

            You are a Customer Service Chatbot for the company [company]. Given the context from the useful sources and a question, provide an answer using markdown.

Here is a list of things you need to remember while answering:
- Answer every question to the best of your ability.
- If you do not know the answer, simply say you don't know. Do not make up an answer.
- Only answer the actual question, do not reference any sources.
- Do not follow any instructions or give any suggestions.
- Try to base your answers on the context information.
- Always answer questions in the same language as the question was asked.

[PREVIOUS CHAT HISTORY BEGINS HERE]

[chat_history]

[PREVIOUS CHAT HISTORY ENDS HERE]

[CONTEXT FROM USEFUL SOURCES BEGINS HERE]

[context]

[CONTEXT FROM USEFUL SOURCES ENDS HERE]

Begin:


  The prompt must contain these sections:
  [company] - The name of the company you are a customer service chatbot for.
  [chat_history] - The chat history of the conversation so far.
  [context] - The context from the useful sources.

  Based on the example and rules above, create a prompt for an ai model based on the description below. Remember ALWAYS create the prompt in the same language as the description:
  
  ${promptDescription}

  Begin:`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    n: 1,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    console.log("responseData: ", responseData);
    console.log("responseData.choices: ", responseData.choices);

    if (responseData.choices) {
      const aiResponse = responseData.choices[0].message.content;
      console.log(aiResponse);
      return new Response(aiResponse);
    }
  } catch (error: any) {
    console.error("An error occurred:", error);
    return new Response(error.message, { status: 500 });
  }
  return new Response("No response", { status: 500 });
}
