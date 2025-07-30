export class GPTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GPTError";
  }
}

export async function askGPT(prompt: string, stream: boolean = false) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        stream,
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new GPTError(`OpenAI API Error: ${errorData.error.message}`);
    }

    if (stream) {
    return res.body;
  }

  const data = await res.json();
  return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof GPTError) {
      throw error;
    }
    throw new GPTError("An unexpected error occurred while communicating with the OpenAI API.");
  }
}
