export async function askGPT(prompt: string, stream: boolean = false) {
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

  if (stream) {
    return res.body;
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
