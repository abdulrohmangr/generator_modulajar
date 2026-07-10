export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
    });
  }

  const body = req.body;

  const providers = [
    {
      name: "Gemini",
      key: process.env.GEMINI_API_KEY,
      call: async () => {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text:
                        (body.system || "") +
                        "\n\n" +
                        body.messages
                          .map((m) => m.content)
                          .join("\n"),
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text:
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Tidak ada respon",
            },
          ],
        };
      },
    },

    {
      name: "DeepSeek",
      key: process.env.DEEPSEEK_API_KEY,
      call: async () => {
        const response = await fetch(
          "https://api.deepseek.com/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "system",
                  content: body.system || "",
                },
                ...body.messages,
              ],
            }),
          }
        );

        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: data.choices[0].message.content,
            },
          ],
        };
      },
    },

    {
      name: "Groq",
      key: process.env.GROQ_API_KEY,
      call: async () => {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: body.system || "",
                },
                ...body.messages,
              ],
            }),
          }
        );

        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: data.choices[0].message.content,
            },
          ],
        };
      },
    },

    {
      name: "Claude",
      key: process.env.ANTHROPIC_API_KEY,
      call: async () => {
        const response = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(body),
          }
        );

        return await response.json();
      },
    },
  ];

  let lastError = "";

  for (const provider of providers) {
    if (!provider.key) continue;

    try {
      console.log("Menggunakan :", provider.name);

      const result = await provider.call();

      return res.status(200).json(result);
    } catch (e) {
      console.log(provider.name, e.message);
      lastError = e.message;
    }
  }

  return res.status(500).json({
    error: "Semua AI gagal.",
    detail: lastError,
  });
}
