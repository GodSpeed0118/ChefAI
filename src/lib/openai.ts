const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

type TextContent = { type: "text"; text: string };
type ImageUrlContent = {
  type: "image_url";
  image_url: { url: string };
};

type MessageContent = TextContent | ImageUrlContent;

type Message = {
  role: "system" | "user" | "assistant";
  content: MessageContent[] | string;
};

type OpenAIRequest = {
  model: string;
  max_tokens: number;
  messages: Message[];
};

type OpenAIResponse = {
  choices: { message: { content: string } }[];
};

export async function callOpenAI(
  request: OpenAIRequest,
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_OPENAI_API_KEY environment variable",
    );
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data: OpenAIResponse = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  return content;
}
