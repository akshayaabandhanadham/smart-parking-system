export async function POST(req: Request) {
  const start = Date.now();

  try {
    const { message, slots } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ reply: "Please enter a valid message." }, { status: 400 });
    }

    const text = message.toLowerCase().trim();

    const available = (slots || []).filter((s: any) => s.status === "available");

    let bestSlot = null;
    if (available.length > 0) {
      bestSlot = [...available].sort((a: any, b: any) => a.price - b.price)[0];
    }

    const tokens = text.split(/\s+/);

    const hasWord = (word: string) => tokens.includes(word);

    const isGreeting =
      hasWord("hi") ||
      hasWord("hello") ||
      text === "hey" ||
      text.startsWith("hey ");

    const isBestQuery =
      text.includes("best") ||
      text.includes("cheap") ||
      text.includes("lowest") ||
      text.includes("which slot") ||
      text.includes("recommend");

    const isAvailability =
      text.includes("available") ||
      text.includes("free slots");

    const isPrice =
      text.includes("price") ||
      text.includes("cost");

    if (isGreeting) {
      return Response.json({
        reply: "Hello! I can help you find the best parking slot or answer any question.",
      });
    }

    if (text.includes("how are you")) {
      return Response.json({
        reply: "I'm doing great and ready to assist you.",
      });
    }

    if (isBestQuery) {
      if (!bestSlot) {
        return Response.json({
          reply: "Currently no slots are available.",
        });
      }

      return Response.json({
        reply: `Best option right now is Slot ${bestSlot.slotNumber} at ${bestSlot.level} for ₹${bestSlot.price}/hour.`,
      });
    }

    if (isAvailability) {
      return Response.json({
        reply: `${available.length} slots are currently available.`,
      });
    }

    if (isPrice) {
      if (!bestSlot) {
        return Response.json({
          reply: "Pricing varies by slot. No slots are available right now.",
        });
      }

      return Response.json({
        reply: `Prices start from ₹${bestSlot.price}/hour depending on the slot.`,
      });
    }

    let fallback = "I can help with parking or general questions.";

    if (bestSlot) {
      fallback = `You can park at Slot ${bestSlot.slotNumber} on ${bestSlot.level} for ₹${bestSlot.price}/hour.`;
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ reply: fallback });
    }

    const prompt = `
You are a professional AI assistant.

User question:
${message}

Parking slots:
${JSON.stringify(available)}

Rules:
If parking related → suggest best slot clearly
If general → answer professionally
Keep response concise
`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!res.ok) {
        return Response.json({ reply: fallback });
      }

      const data = await res.json();

      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      return Response.json({
        reply: aiReply || fallback,
      });
    } catch {
      return Response.json({ reply: fallback });
    }
  } catch {
    return Response.json({
      reply: "Something went wrong. Please try again.",
    });
  } finally {
    console.log("AI response time:", Date.now() - start, "ms");
  }
}