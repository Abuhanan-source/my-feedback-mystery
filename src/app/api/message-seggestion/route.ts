export async function POST() {

   const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000", // or your deployed URL
      "X-Title": "Next.js Chatbot",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      prompt,
      stream: true,
    }),
  });

  // Stream response directly to client
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
